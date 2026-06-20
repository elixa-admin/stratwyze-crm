-- Users (Sales agents, executives)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) NOT NULL DEFAULT 'agent', -- 'agent', 'manager', 'executive'
  organization_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organizations (Customer companies we're selling to)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  website VARCHAR(255),
  employees INT,
  revenue VARCHAR(50),
  country VARCHAR(100),
  state VARCHAR(100),
  city VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leads (Initial contact entries)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  title VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'new', -- 'new', 'qualified', 'unqualified', 'converted'
  assigned_to UUID REFERENCES users(id),
  source VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prospects (Leads with research data)
CREATE TABLE prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  company_name VARCHAR(255),
  company_website VARCHAR(255),
  industry VARCHAR(100),
  employees INT,
  annual_revenue VARCHAR(50),
  technology_stack JSONB, -- { "platforms": [...], "tools": [...] }
  strategic_intent TEXT,
  budget VARCHAR(50),
  contact_data JSONB, -- Phone, LinkedIn, email, etc.
  research_notes TEXT,
  executive_brief TEXT, -- Generated AI brief
  brief_generated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales Stages (Configurable pipeline stages)
CREATE TABLE stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL, -- 'Discovery', 'Proposal', 'Negotiation', 'Closed'
  order_index INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Opportunities (Lead advanced to opportunity)
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  prospect_id UUID REFERENCES prospects(id),
  name VARCHAR(255) NOT NULL,
  value DECIMAL(12, 2),
  stage_id UUID NOT NULL REFERENCES stages(id),
  probability INT DEFAULT 0, -- 0-100%
  expected_close_date DATE,
  assigned_to UUID REFERENCES users(id),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deals (Opportunities with formal tracking)
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id),
  deal_value DECIMAL(12, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  stage_id UUID NOT NULL REFERENCES stages(id),
  probability INT DEFAULT 0,
  expected_close_date DATE,
  actual_close_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activities (Stage changes, notes, interactions)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES deals(id),
  opportunity_id UUID REFERENCES opportunities(id),
  type VARCHAR(50) NOT NULL, -- 'stage_change', 'note', 'call', 'email', 'meeting'
  description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Proposals (Generated documents)
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id),
  title VARCHAR(255),
  content TEXT, -- Markdown or HTML
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'sent', 'accepted', 'rejected'
  version INT DEFAULT 1,
  created_by UUID REFERENCES users(id),
  generated_at TIMESTAMP,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_leads_organization ON leads(organization_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_prospects_lead ON prospects(lead_id);
CREATE INDEX idx_opportunities_lead ON opportunities(lead_id);
CREATE INDEX idx_opportunities_stage ON opportunities(stage_id);
CREATE INDEX idx_deals_opportunity ON deals(opportunity_id);
CREATE INDEX idx_deals_stage ON deals(stage_id);
CREATE INDEX idx_activities_deal ON activities(deal_id);
CREATE INDEX idx_proposals_deal ON proposals(deal_id);
CREATE INDEX idx_prospects_tech_stack ON prospects USING GIN(technology_stack);
