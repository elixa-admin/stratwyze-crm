'use client';

import { SIGNAL_LABEL_COLORS } from '@/lib/buyer-signals';

const SIGNAL_ICONS: Record<string, string> = {
  Burning: '🔥',
  Hot: '🌡️',
  Warm: '⚡',
  Cold: '❄️',
};

const SIGNAL_DESCRIPTIONS: Record<string, string> = {
  Burning: 'Critical buying signals — high priority for outreach',
  Hot: 'Strong buying signals — prioritize this deal',
  Warm: 'Moderate signals — good opportunity',
  Cold: 'Minimal signals — long-term nurture',
};

interface Props {
  breakdown: any;
  suggestedStakeholders?: any[];
  technologyClues?: string[];
}

export default function BuyerIntentCard({ breakdown, suggestedStakeholders, technologyClues }: Props) {
  if (!breakdown) return null;

  const { label, totalScore, maScore, hiringScore, newsScore, techScore, budgetScore } = breakdown;
  const bgClass = SIGNAL_LABEL_COLORS[label] || SIGNAL_LABEL_COLORS.Cold;

  return (
    <div className={`rounded-xl border border-slate-200 overflow-hidden`}>
      {/* Header */}
      <div className={`px-5 py-4 ${bgClass} border-b border-slate-200`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{SIGNAL_ICONS[label]}</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide">Buyer Intent</p>
              <p className="text-sm font-bold">{label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{totalScore}</p>
            <p className="text-[10px] text-slate-600">/ 100</p>
          </div>
        </div>
        <p className="text-xs text-slate-700">{SIGNAL_DESCRIPTIONS[label]}</p>
      </div>

      {/* Score breakdown */}
      <div className="px-5 py-4 space-y-2 border-b border-slate-100">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">M&A Activity</span>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-400" style={{ width: `${(maScore / 25) * 100}%` }} />
            </div>
            <span className="font-semibold text-slate-700 w-6 text-right">{maScore}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Hiring Signals</span>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-400" style={{ width: `${(hiringScore / 15) * 100}%` }} />
            </div>
            <span className="font-semibold text-slate-700 w-6 text-right">{hiringScore}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">News Momentum</span>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400" style={{ width: `${(newsScore / 10) * 100}%` }} />
            </div>
            <span className="font-semibold text-slate-700 w-6 text-right">{newsScore}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Tech Clues</span>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400" style={{ width: `${(techScore / 10) * 100}%` }} />
            </div>
            <span className="font-semibold text-slate-700 w-6 text-right">{techScore}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Budget Signals</span>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400" style={{ width: `${(budgetScore / 5) * 100}%` }} />
            </div>
            <span className="font-semibold text-slate-700 w-6 text-right">{budgetScore}</span>
          </div>
        </div>
      </div>

      {/* Suggested stakeholders */}
      {(suggestedStakeholders?.length ?? 0) > 0 && suggestedStakeholders && (
        <div className="px-5 py-4 border-b border-slate-100">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600 mb-2.5">Key Contacts to Target</p>
          <div className="space-y-2">
            {suggestedStakeholders.slice(0, 3).map((s: any, i: number) => (
              <div key={i} className="bg-slate-50 rounded-lg p-2.5">
                <p className="text-xs font-semibold text-slate-900">{s.title}</p>
                <p className="text-[11px] text-slate-600 mt-0.5">{s.relevance}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tech clues */}
      {(technologyClues?.length ?? 0) > 0 && technologyClues && (
        <div className="px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600 mb-2.5">Technology Signals</p>
          <ul className="space-y-1.5">
            {technologyClues.slice(0, 3).map((clue: string, i: number) => (
              <li key={i} className="text-xs text-slate-700 flex gap-2">
                <span className="text-blue-400 shrink-0">•</span>{clue}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
