export interface StakeholderAngle {
  persona: 'CIO' | 'IT Manager' | 'Procurement' | 'CISO';
  headline: string;
  talkingPoints: string[];
  watchOut?: string;
}

export interface PursuitBattleCard {
  platformName: string | null;
  siName: string | null;
  openingStatement: string;
  platformWeaknesses: string[];
  siWeaknesses: string[];
  combinedNarrative: string;
  stakeholderAngles: StakeholderAngle[];
  winStatement: string;
  watchOuts: string[];
}
