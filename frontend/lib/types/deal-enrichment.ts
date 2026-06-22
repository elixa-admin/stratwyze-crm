export interface DealEnrichmentData {
  companyName?: string;
  website?: string;
  annualRevenue?: {
    value: number;
    currency: string;
    year: number;
  };
  legalEntity?: string;
  registrationNumber?: string;
  employees?: number;
  industry?: string;
  contactInfo?: ContactInfo[];
  cxoDetails?: CxODetail[];
  headquarters?: {
    city: string;
    province?: string;
    country: string;
  };
  marketPosition?: string;
  operationalDetails?: Record<string, any>;
  lastUpdated?: string;
  dataConfidence?: 'High' | 'Medium' | 'Low';
}

export interface ContactInfo {
  type: 'email' | 'phone' | 'website' | 'linkedin';
  value: string;
  person?: string;
  title?: string;
  notes?: string;
}

export interface CxODetail {
  name: string;
  title: string; // e.g., "CIO", "CFO", "VP Operations"
  email?: string;
  phone?: string;
  linkedin?: string;
  background?: string;
  reportingLine?: string;
  responsibility?: string;
}

export interface BriefEnrichmentExtraction {
  briefId?: string;
  extractedData: DealEnrichmentData;
  extractionTime: string;
  extractionConfidence: {
    overall: number; // 0-100
    byField: Record<string, number>;
  };
  extractedFields: string[];
  missingFields: string[];
  notes?: string;
}

export interface EnrichedDeal {
  dealId: string;
  dealTitle: string;
  dealValue: number;
  incumbentPlatform: string;
  incumbentProvider: string;
  enrichmentData: DealEnrichmentData;
  enrichmentStatus: 'pending' | 'enriched' | 'partial' | 'failed';
  enrichmentSource: 'ai_brief' | 'manual' | 'api' | 'crm';
  lastEnrichedAt: string;
}
