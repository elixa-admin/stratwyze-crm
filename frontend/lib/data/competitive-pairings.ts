export interface CompetitivePairing {
  saPartnerId: string;
  competitorId: string;
  label: string;
  prevalence: 'Common' | 'Occasional';
}

export const COMPETITIVE_PAIRINGS: CompetitivePairing[] = [
  { saPartnerId: 'nexio-sa',            competitorId: 'servicenow',             label: 'Nexio + ServiceNow',        prevalence: 'Common' },
  { saPartnerId: 'mediro-bsm',          competitorId: 'servicenow',             label: 'Mediro + ServiceNow',       prevalence: 'Common' },
  { saPartnerId: 'think-tank-software', competitorId: 'ivanti-neurons',         label: 'Think Tank + Ivanti',       prevalence: 'Common' },
  { saPartnerId: 'itr-technology',      competitorId: 'manageengine-servicedesk', label: 'ITR + ManageEngine',      prevalence: 'Common' },
  { saPartnerId: 'scon-consultants',    competitorId: 'freshservice',           label: 'S Con + Freshservice',      prevalence: 'Common' },
  { saPartnerId: 'ipt-managed-services', competitorId: 'manageengine-servicedesk', label: 'IPT + ManageEngine',    prevalence: 'Occasional' },
  { saPartnerId: 'ipt-managed-services', competitorId: 'zendesk',              label: 'IPT + Zendesk',             prevalence: 'Occasional' },
  { saPartnerId: 'pink-elephant-sa',    competitorId: 'servicenow',             label: 'Pink Elephant + ServiceNow', prevalence: 'Occasional' },
];
