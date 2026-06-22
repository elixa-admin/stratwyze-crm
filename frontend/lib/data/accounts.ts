export interface TechnologyStack {
  platform?: string;
  siPartner?: string;
  contractExpiry?: string;
  competitorId?: string;
  saPartnerId?: string;
  notes?: string;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

export interface Account {
  id: string;
  name: string;
  industry: string;
  arr: string;
  employees: number;
  status: 'Active' | 'Prospect' | 'Inactive';
  location: string;
  website: string;
  technologyStack?: TechnologyStack;
}

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    industry: 'Technology',
    arr: '$850K',
    employees: 450,
    status: 'Active',
    location: 'Johannesburg, Gauteng',
    website: 'www.acme.co.za',
    technologyStack: {
      platform: 'ServiceNow',
      siPartner: 'Nexio',
      contractExpiry: '2026-12-31',
      competitorId: 'servicenow',
      saPartnerId: 'nexio-sa',
      lastUpdatedBy: 'BD',
      lastUpdatedAt: '2026-06-10',
    },
  },
  {
    id: '2',
    name: 'Global Industries Inc',
    industry: 'Manufacturing',
    arr: '$1.2M',
    employees: 1200,
    status: 'Active',
    location: 'Centurion, Pretoria',
    website: 'www.globalindustries.co.za',
    technologyStack: {
      platform: 'Ivanti Neurons',
      siPartner: 'Think Tank Software',
      contractExpiry: '2026-09-30',
      competitorId: 'ivanti-neurons',
      saPartnerId: 'think-tank-software',
      lastUpdatedBy: 'MR',
      lastUpdatedAt: '2026-05-22',
    },
  },
  {
    id: '3',
    name: 'TechStart Ventures',
    industry: 'SaaS',
    arr: '$280K',
    employees: 65,
    status: 'Active',
    location: 'Cape Town, Western Cape',
    website: 'www.techstart.co.za',
  },
  {
    id: '4',
    name: 'Fortune 500 Corp',
    industry: 'Finance',
    arr: '$2.5M',
    employees: 5000,
    status: 'Prospect',
    location: 'Sandton, Gauteng',
    website: 'www.fortune500.co.za',
    technologyStack: {
      platform: 'ServiceNow',
      siPartner: 'Mediro BSM',
      contractExpiry: '2027-03-31',
      competitorId: 'servicenow',
      saPartnerId: 'mediro-bsm',
      notes: 'Renewal under review — dissatisfied with ServiceNow pricing increase Q1 2026',
      lastUpdatedBy: 'SJ',
      lastUpdatedAt: '2026-06-15',
    },
  },
  {
    id: '5',
    name: 'Rand Merchant Holdings',
    industry: 'Financial Services',
    arr: '$1.8M',
    employees: 3200,
    status: 'Prospect',
    location: 'Sandton, Gauteng',
    website: 'www.rmh.co.za',
    technologyStack: {
      platform: 'ManageEngine ServiceDesk Plus',
      siPartner: 'ITR Technology',
      contractExpiry: '2026-08-31',
      competitorId: 'manageengine-servicedesk',
      saPartnerId: 'itr-technology',
      notes: 'Evaluating alternatives — ManageEngine struggling with scale at 3000+ users',
      lastUpdatedBy: 'AB',
      lastUpdatedAt: '2026-06-18',
    },
  },
  {
    id: '6',
    name: 'Potchefstroom Municipality',
    industry: 'Government',
    arr: '$420K',
    employees: 800,
    status: 'Prospect',
    location: 'Potchefstroom, North West',
    website: 'www.potch.gov.za',
    technologyStack: {
      platform: 'Freshservice',
      siPartner: 'S Con System Consultants',
      contractExpiry: '2026-10-15',
      competitorId: 'freshservice',
      saPartnerId: 'scon-consultants',
      lastUpdatedBy: 'BD',
      lastUpdatedAt: '2026-06-01',
    },
  },
  {
    id: '7',
    name: 'Absa Group Technology',
    industry: 'Banking',
    arr: '$3.1M',
    employees: 8500,
    status: 'Prospect',
    location: 'Johannesburg, Gauteng',
    website: 'www.absa.co.za',
    technologyStack: {
      platform: 'BMC Helix ITSM',
      contractExpiry: '2027-06-30',
      competitorId: 'bmc-helix',
      notes: 'Legacy BMC on-prem deployment — upgrade cycle imminent. No active SI.',
      lastUpdatedBy: 'MR',
      lastUpdatedAt: '2026-05-30',
    },
  },
  {
    id: '8',
    name: 'Nedbank IT Division',
    industry: 'Banking',
    arr: '$2.2M',
    employees: 6200,
    status: 'Prospect',
    location: 'Sandton, Gauteng',
    website: 'www.nedbank.co.za',
    technologyStack: {
      platform: 'Jira Service Management',
      siPartner: 'Pink Elephant SA',
      contractExpiry: '2026-11-30',
      competitorId: 'jira-sm',
      saPartnerId: 'pink-elephant-sa',
      notes: 'ITIL maturity programme underway — Pink Elephant driving ITIL 4 adoption.',
      lastUpdatedBy: 'JD',
      lastUpdatedAt: '2026-06-05',
    },
  },
];
