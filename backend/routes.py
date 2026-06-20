from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import asyncio

from database import get_db
from models import Lead, Prospect, Organization, Opportunity, Stage, Deal, Activity
from schemas import LeadCreateRequest, LeadUpdateRequest, LeadResponse
from research import research_company, get_job_status
from datetime import datetime, timedelta
from sqlalchemy import func

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


# Opportunity endpoints
@router.post("/api/opportunities")
async def create_opportunity(name: str, lead_id: UUID, value: float = 0, probability: int = 0, close_date: str = None, db: Session = Depends(get_db)):
    """Create an opportunity from a lead."""
    lead = db.query(Lead).filter_by(id=lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    # Get or create discovery stage
    stage = db.query(Stage).filter_by(name="Discovery").first()
    if not stage:
        stage = Stage(name="Discovery", order_index=0)
        db.add(stage)
        db.flush()

    opportunity = Opportunity(
        lead_id=lead_id,
        name=name,
        value=value,
        stage_id=stage.id,
        probability=probability,
        expected_close_date=close_date
    )
    db.add(opportunity)
    db.commit()
    db.refresh(opportunity)

    return {
        "id": str(opportunity.id),
        "name": opportunity.name,
        "value": opportunity.value,
        "stage_id": str(opportunity.stage_id),
        "probability": opportunity.probability
    }


@router.get("/api/opportunities")
async def list_opportunities(db: Session = Depends(get_db)):
    """List all opportunities grouped by stage."""
    stages = db.query(Stage).order_by(Stage.order_index).all()
    result = {}

    for stage in stages:
        opportunities = db.query(Opportunity).filter_by(stage_id=stage.id).all()
        result[stage.name] = [
            {
                "id": str(opp.id),
                "name": opp.name,
                "value": float(opp.value) if opp.value else 0,
                "probability": opp.probability,
                "stage_id": str(opp.stage_id),
                "lead_id": str(opp.lead_id),
                "close_date": opp.expected_close_date.isoformat() if opp.expected_close_date else None
            }
            for opp in opportunities
        ]

    return result


@router.patch("/api/opportunities/{opp_id}")
async def update_opportunity(opp_id: UUID, stage_id: UUID = None, probability: int = None, value: float = None, db: Session = Depends(get_db)):
    """Update opportunity (move between stages, update probability/value)."""
    opp = db.query(Opportunity).filter_by(id=opp_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    if stage_id:
        opp.stage_id = stage_id
    if probability is not None:
        opp.probability = probability
    if value is not None:
        opp.value = value

    db.commit()
    db.refresh(opp)

    return {
        "id": str(opp.id),
        "name": opp.name,
        "stage_id": str(opp.stage_id),
        "probability": opp.probability,
        "value": float(opp.value) if opp.value else 0
    }


# Dashboard metrics
@router.get("/api/dashboard/metrics")
async def get_dashboard_metrics(db: Session = Depends(get_db)):
    """Get CEO dashboard metrics."""
    opportunities = db.query(Opportunity).all()

    # Total pipeline value (weighted by probability)
    total_pipeline = sum(
        (float(opp.value) * opp.probability / 100) if opp.value else 0
        for opp in opportunities
    )

    # Win rate (closed won / closed won + closed lost)
    # For now, using simple counts as stand-in
    won_count = len([o for o in opportunities if o.stage_id and db.query(Stage).filter_by(id=o.stage_id).first().name == "Closed Won"])
    lost_count = len([o for o in opportunities if o.stage_id and db.query(Stage).filter_by(id=o.stage_id).first().name == "Closed Lost"])
    win_rate = (won_count / (won_count + lost_count) * 100) if (won_count + lost_count) > 0 else 0

    # Deals this month
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    deals_this_month = len([o for o in opportunities if o.created_at >= thirty_days_ago])

    # Forecast (sum of all open opportunities)
    open_stages = ["Discovery", "Proposal", "Negotiation"]
    forecast = sum(
        float(opp.value) if opp.value else 0
        for opp in opportunities
        if opp.stage_id and db.query(Stage).filter_by(id=opp.stage_id).first().name in open_stages
    )

    # Pipeline by stage
    stages = db.query(Stage).order_by(Stage.order_index).all()
    pipeline_by_stage = {}
    for stage in stages:
        stage_opps = [o for o in opportunities if o.stage_id == stage.id]
        pipeline_by_stage[stage.name] = {
            "count": len(stage_opps),
            "value": sum(float(o.value) if o.value else 0 for o in stage_opps)
        }

    return {
        "total_pipeline_value": total_pipeline,
        "win_rate_percent": win_rate,
        "forecast_value": forecast,
        "deals_this_month": deals_this_month,
        "pipeline_by_stage": pipeline_by_stage,
        "total_opportunities": len(opportunities)
    }
