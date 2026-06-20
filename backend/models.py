from sqlalchemy import Column, String, Integer, DateTime, Text, JSON, ForeignKey, Numeric, Date, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    role = Column(String(50), default='agent')  # 'agent', 'manager', 'executive'
    organization_id = Column(UUID(as_uuid=True), ForeignKey('organizations.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    organization = relationship("Organization", back_populates="users")
    leads = relationship("Lead", back_populates="assigned_agent")
    opportunities = relationship("Opportunity", back_populates="assigned_agent")

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    industry = Column(String(100))
    website = Column(String(255))
    employees = Column(Integer)
    revenue = Column(String(50))
    country = Column(String(100))
    state = Column(String(100))
    city = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    users = relationship("User", back_populates="organization")
    leads = relationship("Lead", back_populates="organization")

class Lead(Base):
    __tablename__ = "leads"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey('organizations.id'), nullable=False, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20))
    title = Column(String(100))
    status = Column(String(50), default='new', index=True)  # 'new', 'qualified', 'unqualified', 'converted'
    assigned_to = Column(UUID(as_uuid=True), ForeignKey('users.id'), index=True)
    source = Column(String(100))
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    organization = relationship("Organization", back_populates="leads")
    assigned_agent = relationship("User", back_populates="leads")
    prospect = relationship("Prospect", uselist=False, back_populates="lead")
    opportunities = relationship("Opportunity", back_populates="lead")

class Prospect(Base):
    __tablename__ = "prospects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id = Column(UUID(as_uuid=True), ForeignKey('leads.id'), nullable=False, index=True)
    company_name = Column(String(255))
    company_website = Column(String(255))
    industry = Column(String(100))
    employees = Column(Integer)
    annual_revenue = Column(String(50))
    technology_stack = Column(JSON)  # { "platforms": [...], "tools": [...] }
    strategic_intent = Column(Text)
    budget = Column(String(50))
    contact_data = Column(JSON)  # Phone, LinkedIn, email, etc.
    research_notes = Column(Text)
    executive_brief = Column(Text)  # Generated AI brief
    brief_generated_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    lead = relationship("Lead", back_populates="prospect")

class Stage(Base):
    __tablename__ = "stages"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)  # 'Discovery', 'Proposal', 'Negotiation', 'Closed'
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    opportunities = relationship("Opportunity", back_populates="stage")
    deals = relationship("Deal", back_populates="stage")

class Opportunity(Base):
    __tablename__ = "opportunities"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id = Column(UUID(as_uuid=True), ForeignKey('leads.id'), nullable=False, index=True)
    prospect_id = Column(UUID(as_uuid=True), ForeignKey('prospects.id'), index=True)
    name = Column(String(255), nullable=False)
    value = Column(Numeric(12, 2))
    stage_id = Column(UUID(as_uuid=True), ForeignKey('stages.id'), nullable=False, index=True)
    probability = Column(Integer, default=0)  # 0-100%
    expected_close_date = Column(Date)
    assigned_to = Column(UUID(as_uuid=True), ForeignKey('users.id'), index=True)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    lead = relationship("Lead", back_populates="opportunities")
    stage = relationship("Stage", back_populates="opportunities")
    assigned_agent = relationship("User", back_populates="opportunities")
    deals = relationship("Deal", back_populates="opportunity")
    activities = relationship("Activity", back_populates="opportunity")

class Deal(Base):
    __tablename__ = "deals"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    opportunity_id = Column(UUID(as_uuid=True), ForeignKey('opportunities.id'), nullable=False, index=True)
    deal_value = Column(Numeric(12, 2))
    currency = Column(String(10), default='USD')
    stage_id = Column(UUID(as_uuid=True), ForeignKey('stages.id'), nullable=False, index=True)
    probability = Column(Integer, default=0)
    expected_close_date = Column(Date)
    actual_close_date = Column(Date)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    opportunity = relationship("Opportunity", back_populates="deals")
    stage = relationship("Stage", back_populates="deals")
    activities = relationship("Activity", back_populates="deal")
    proposals = relationship("Proposal", back_populates="deal")

class Activity(Base):
    __tablename__ = "activities"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    deal_id = Column(UUID(as_uuid=True), ForeignKey('deals.id'), index=True)
    opportunity_id = Column(UUID(as_uuid=True), ForeignKey('opportunities.id'), index=True)
    type = Column(String(50), nullable=False)  # 'stage_change', 'note', 'call', 'email', 'meeting'
    description = Column(Text)
    created_by = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    created_at = Column(DateTime, default=datetime.utcnow)

    deal = relationship("Deal", back_populates="activities")
    opportunity = relationship("Opportunity", back_populates="activities")

class Proposal(Base):
    __tablename__ = "proposals"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    deal_id = Column(UUID(as_uuid=True), ForeignKey('deals.id'), nullable=False, index=True)
    title = Column(String(255))
    content = Column(Text)  # Markdown or HTML
    status = Column(String(50), default='draft')  # 'draft', 'sent', 'accepted', 'rejected'
    version = Column(Integer, default=1)
    created_by = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    generated_at = Column(DateTime)
    sent_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    deal = relationship("Deal", back_populates="proposals")
