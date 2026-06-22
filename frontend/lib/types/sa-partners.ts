export type PartnerCategory = 'HaloITSM Channel Partner' | 'Competing Platform Partner';
export type ThreatLevel = 'Primary' | 'Secondary' | 'Emerging';
export type PlatformAlignment = 'HaloITSM' | 'Ivanti' | 'ServiceNow' | 'ManageEngine' | 'Freshservice' | 'Mixed';

export interface FlankingStrategy {
  situation: string;
  approach: string;
  keyMessage: string;
  talkingPoints: string[];
  watchOut: string;
}

export interface SAPartner {
  id: string;
  name: string;
  avatar: string;
  category: PartnerCategory;
  platformAlignment: PlatformAlignment;
  threatLevel: ThreatLevel;

  // Company Profile
  headquarters: string;
  province: string;
  founded?: number;
  employees?: string;
  website: string;
  linkedin?: string;

  // What they do
  tagline: string;
  serviceDescription: string;
  keyServices: string[];
  targetSegment: string;

  // Their strengths (know your enemy)
  strengths: string[];

  // Their weaknesses (your opportunity)
  weaknesses: string[];

  // Stratwyze differentiation
  stratwyzeAdvantages: string[];

  // Flanking strategy for active pursuits
  flankingStrategy: FlankingStrategy;

  // Sales intelligence
  typicalDealSize?: string;
  salesCycle?: string;
  decisionMakers?: string[];
  partnerSince?: string;

  // Evidence
  evidenceSources: string[];
  lastVerified: string;
  dataConfidence: 'Confirmed' | 'High' | 'Medium' | 'Unverified';
}
