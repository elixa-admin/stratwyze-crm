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
  /** Full narrative as a single string — used for export / copy. */
  combinedNarrative: string;
  /** Narrative broken into discrete, readable plays — used for on-screen display. */
  narrativePoints: string[];
  stakeholderAngles: StakeholderAngle[];
  winStatement: string;
  watchOuts: string[];
}
