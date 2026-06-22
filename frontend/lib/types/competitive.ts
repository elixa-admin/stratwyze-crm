export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface PricingModel {
  type: 'Per-Agent' | 'Per-Incident' | 'Per-User' | 'Flat-Fee' | 'Hybrid';
  basePrice: string;
  additionalCosts: string[];
}

export interface TCOComparison {
  competitor: {
    min: number;
    max: number;
    currency: 'ZAR' | 'USD';
  };
  haloITSM: {
    min: number;
    max: number;
    currency: 'ZAR';
  };
}

export interface Complexity {
  implementation: 'Quick (1-4w)' | 'Quick (4-8w)' | 'Moderate (8-12w)' | 'Extended (12-18m)';
  adminComplexity: 'Simple' | 'Moderate' | 'Complex' | 'Very Complex';
  customization: 'Native' | 'Limited' | 'SI-Dependent';
  supportQuality: 'Premium' | 'Standard' | 'Limited' | 'Expensive';
}

export interface FunctionalityGap {
  category: string;
  gap: string;
  severity: 'Critical' | 'High' | 'Medium';
  halITSMAdvantage: string;
}

export interface SalesRebuttal {
  title: string;
  keyMessage: string;
  weaknesses: string[];
  winningPoints: string[];
}

export interface Competitor {
  id: string;
  name: string;
  tagline: string;
  logo?: string;
  avatar: string;
  riskLevel: RiskLevel;
  ownership: string; // e.g., "PE-owned (Clearlake)", "Public (NASDAQ)"

  // Corporate Info
  founded: number;
  headquarters: string;
  employees: string;
  revenue: string; // ARR estimate
  website: string;

  // Technical
  deployment: string; // e.g., "Cloud only", "Cloud / Legacy OP"
  architecture: 'Modern' | 'Hybrid' | 'Legacy';
  securityCertifications: string[];

  // Pricing & TCO
  pricing: PricingModel;
  tco3Year: TCOComparison;
  implementationCost: string;

  // Complexity
  complexity: Complexity;

  // Positioning
  functionality: FunctionalityGap[];
  marketPosition: {
    gartnerQuadrant?: string;
    marketShare?: string;
    targetSegment: string;
  };

  // Sales Intelligence
  salesRebuttal: SalesRebuttal;
  keyWeaknesses: {
    title: string;
    description: string;
  }[];

  // Recent News
  recentNews: {
    title: string;
    source: string;
    date: string;
    url?: string;
  }[];

  // M&A Activity
  maActivity?: {
    type: 'Acquisition' | 'Funding' | 'Partnership' | 'IPO';
    description: string;
    date: string;
  }[];

  // Metadata
  lastUpdated: string;
  dataQuality: 'High' | 'Medium' | 'Low';
}

export interface CompetitorProfile extends Competitor {
  customerTestimonials?: {
    quote: string;
    source: string;
    context: string;
  }[];
  competitiveWins?: {
    deal: string;
    customer: string;
    keyFactor: string;
    date: string;
  }[];
}
