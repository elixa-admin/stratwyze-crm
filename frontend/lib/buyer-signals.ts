export interface BuyerSignals {
  maActivity?: string;
  hiringSignals?: string;
  newsMonths?: number;
  technologyClues?: string[];
  budgetSignals?: string;
}

export interface BuyerIntentBreakdown {
  maScore: number;
  hiringScore: number;
  newsScore: number;
  techScore: number;
  budgetScore: number;
  totalScore: number;
  label: 'Cold' | 'Warm' | 'Hot' | 'Burning';
}

export function calculateBuyerIntent(signals: BuyerSignals): BuyerIntentBreakdown {
  let maScore = 0;
  let hiringScore = 0;
  let newsScore = 0;
  let techScore = 0;
  let budgetScore = 0;

  // M&A Activity: +25 if any acquisition, funding, or merger detected
  if (signals.maActivity && signals.maActivity.toLowerCase().includes('acquisition|funding|ipo|merger|investment')) {
    maScore = 25;
  }

  // Hiring Signals: +15 if tech/IT hiring mentioned
  if (signals.hiringSignals && (
    signals.hiringSignals.toLowerCase().includes('hiring') ||
    signals.hiringSignals.toLowerCase().includes('cto') ||
    signals.hiringSignals.toLowerCase().includes('it positions')
  )) {
    hiringScore = 15;
  }

  // News Momentum: +10 if 3+ mentions in last 6 months
  if (signals.newsMonths && signals.newsMonths >= 3) {
    newsScore = 10;
  }

  // Tech Stack Clues: +10 if modernization or integration pain mentioned
  if (signals.technologyClues && signals.technologyClues.length > 0) {
    const hasModernization = signals.technologyClues.some(c =>
      c.toLowerCase().includes('moving') ||
      c.toLowerCase().includes('cloud-first') ||
      c.toLowerCase().includes('legacy')
    );
    const hasPain = signals.technologyClues.some(c =>
      c.toLowerCase().includes('siloed') ||
      c.toLowerCase().includes('manual') ||
      c.toLowerCase().includes('integration')
    );
    if (hasModernization || hasPain) {
      techScore = 10;
    }
  }

  // Budget Signals: +5 if budget approval or capex mentioned
  if (signals.budgetSignals && (
    signals.budgetSignals.toLowerCase().includes('budget') ||
    signals.budgetSignals.toLowerCase().includes('capex') ||
    signals.budgetSignals.toLowerCase().includes('approval')
  )) {
    budgetScore = 5;
  }

  const totalScore = Math.min(100, maScore + hiringScore + newsScore + techScore + budgetScore);

  let label: 'Cold' | 'Warm' | 'Hot' | 'Burning';
  if (totalScore >= 70) label = 'Burning';
  else if (totalScore >= 50) label = 'Hot';
  else if (totalScore >= 25) label = 'Warm';
  else label = 'Cold';

  return {
    maScore,
    hiringScore,
    newsScore,
    techScore,
    budgetScore,
    totalScore,
    label,
  };
}

export const SIGNAL_COLORS: Record<string, string> = {
  Burning: 'bg-red-50 border-red-200 text-red-700',
  Hot: 'bg-orange-50 border-orange-200 text-orange-700',
  Warm: 'bg-amber-50 border-amber-200 text-amber-700',
  Cold: 'bg-slate-50 border-slate-200 text-slate-600',
};

export const SIGNAL_LABEL_COLORS: Record<string, string> = {
  Burning: 'bg-red-100 text-red-700',
  Hot: 'bg-orange-100 text-orange-700',
  Warm: 'bg-amber-100 text-amber-700',
  Cold: 'bg-slate-100 text-slate-600',
};
