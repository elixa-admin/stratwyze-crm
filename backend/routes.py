from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import asyncio

from database import get_db
from models import Lead, Prospect, Organization
from schemas import LeadCreateRequest, LeadUpdateRequest, LeadResponse
from research import research_company, get_job_status

router = APIRouter()

# Lead endpoints
@router.get("/api/leads", response_model=List[LeadResponse])
async def list_leads(db: Session = Depends(get_db), skip: int = 0, limit: int = 50):
    """List all leads with pagination."""
    leads = db.query(Lead).offset(skip).limit(limit).all()
    return leads

@router.get("/api/leads/{lead_id}", response_model=LeadResponse)
async def get_lead(lead_id: UUID, db: Session = Depends(get_db)):
    """Get a specific lead."""
    lead = db.query(Lead).filter_by(id=lead_id).first()
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    return lead

@router.post("/api/leads", response_model=LeadResponse)
async def create_lead(request: LeadCreateRequest, db: Session = Depends(get_db)):
    """Create a new lead."""
    # Verify organization exists
    org = db.query(Organization).filter_by(id=request.organization_id).first()
    if not org:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organization not found"
        )

    lead = Lead(
        first_name=request.first_name,
        last_name=request.last_name,
        email=request.email,
        phone=request.phone,
        title=request.title,
        organization_id=request.organization_id,
        source=request.source,
        notes=request.notes,
        status="new"
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead

@router.patch("/api/leads/{lead_id}", response_model=LeadResponse)
async def update_lead(lead_id: UUID, request: LeadUpdateRequest, db: Session = Depends(get_db)):
    """Update an existing lead."""
    lead = db.query(Lead).filter_by(id=lead_id).first()
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )

    # Update fields
    if request.first_name is not None:
        lead.first_name = request.first_name
    if request.last_name is not None:
        lead.last_name = request.last_name
    if request.email is not None:
        lead.email = request.email
    if request.phone is not None:
        lead.phone = request.phone
    if request.title is not None:
        lead.title = request.title
    if request.status is not None:
        lead.status = request.status
    if request.assigned_to is not None:
        lead.assigned_to = request.assigned_to
    if request.notes is not None:
        lead.notes = request.notes

    db.commit()
    db.refresh(lead)
    return lead

@router.delete("/api/leads/{lead_id}")
async def delete_lead(lead_id: UUID, db: Session = Depends(get_db)):
    """Delete a lead."""
    lead = db.query(Lead).filter_by(id=lead_id).first()
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )

    db.delete(lead)
    db.commit()
    return {"message": "Lead deleted"}

@router.get("/api/leads/status/{status}")
async def list_leads_by_status(status: str, db: Session = Depends(get_db)):
    """List leads filtered by status."""
    leads = db.query(Lead).filter_by(status=status).all()
    return leads

@router.get("/api/leads/organization/{org_id}")
async def list_leads_by_organization(org_id: UUID, db: Session = Depends(get_db)):
    """List leads for a specific organization."""
    leads = db.query(Lead).filter_by(organization_id=org_id).all()
    return leads


# Research endpoints
@router.post("/api/leads/{lead_id}/research")
async def start_research(lead_id: UUID, db: Session = Depends(get_db)):
    """Start AI research for a lead."""
    lead = db.query(Lead).filter_by(id=lead_id).first()
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )

    prospect = db.query(Prospect).filter_by(lead_id=lead_id).first()
    if not prospect:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prospect profile not found"
        )

    # Start research in background
    asyncio.create_task(research_company(db, str(lead_id), str(prospect.id)))

    return {
        "message": "Research started",
        "lead_id": str(lead_id),
        "prospect_id": str(prospect.id)
    }


@router.get("/api/leads/{lead_id}/research-status")
async def get_research_status(lead_id: UUID, db: Session = Depends(get_db)):
    """Get research status for a lead."""
    prospect = db.query(Prospect).filter_by(lead_id=lead_id).first()
    if not prospect:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prospect not found"
        )

    return {
        "prospect_id": str(prospect.id),
        "status": prospect.research_status,
        "last_researched_at": prospect.last_researched_at,
        "brief": prospect.executive_brief if prospect.research_status == "complete" else None
    }


@router.get("/api/leads/{lead_id}/brief")
async def get_brief(lead_id: UUID, db: Session = Depends(get_db)):
    """Get the executive brief for a lead."""
    prospect = db.query(Prospect).filter_by(lead_id=lead_id).first()
    if not prospect:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prospect not found"
        )

    if not prospect.executive_brief:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brief not yet generated"
        )

    return {
        "prospect_id": str(prospect.id),
        "brief": prospect.executive_brief,
        "tech_stack": prospect.technology_stack,
        "generated_at": prospect.brief_generated_at
    }
