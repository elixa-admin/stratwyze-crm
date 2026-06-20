from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID

# Auth Schemas
class UserSignupRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    organization_id: UUID

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class UserResponse(BaseModel):
    id: UUID
    email: str
    first_name: str
    last_name: str
    role: str
    organization_id: UUID

    class Config:
        from_attributes = True

# Lead Schemas
class LeadCreateRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    title: Optional[str] = None
    organization_id: UUID
    source: Optional[str] = None
    notes: Optional[str] = None

class LeadUpdateRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    title: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[UUID] = None
    notes: Optional[str] = None

class LeadResponse(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    email: str
    phone: Optional[str]
    title: Optional[str]
    status: str
    organization_id: UUID
    assigned_to: Optional[UUID]
    source: Optional[str]
    notes: Optional[str]
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

# Prospect Schemas
class ProspectCreateRequest(BaseModel):
    lead_id: UUID
    company_name: Optional[str] = None
    company_website: Optional[str] = None
    industry: Optional[str] = None
    employees: Optional[int] = None
    annual_revenue: Optional[str] = None
    strategic_intent: Optional[str] = None
    budget: Optional[str] = None
    research_notes: Optional[str] = None

class ProspectUpdateRequest(BaseModel):
    company_name: Optional[str] = None
    company_website: Optional[str] = None
    industry: Optional[str] = None
    employees: Optional[int] = None
    annual_revenue: Optional[str] = None
    technology_stack: Optional[dict] = None
    strategic_intent: Optional[str] = None
    budget: Optional[str] = None
    contact_data: Optional[dict] = None
    research_notes: Optional[str] = None

class ProspectResponse(BaseModel):
    id: UUID
    lead_id: UUID
    company_name: Optional[str]
    company_website: Optional[str]
    industry: Optional[str]
    employees: Optional[int]
    annual_revenue: Optional[str]
    technology_stack: Optional[dict]
    strategic_intent: Optional[str]
    budget: Optional[str]
    contact_data: Optional[dict]
    research_notes: Optional[str]
    executive_brief: Optional[str]
    brief_generated_at: Optional[str]
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True
