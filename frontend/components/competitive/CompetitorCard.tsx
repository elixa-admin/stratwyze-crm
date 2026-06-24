'use client';

import { Competitor, RiskLevel } from '@/lib/types/competitive';

const RISK_LEFT_BORDER: Record<RiskLevel, string> = {
  Critical: 'border-l-red-500',
  High:     'border-l-amber-400',
  Medium:   'border-l-indigo-400',
  Low:      'border-l-emerald-400',
};

const RISK_BADGE_COLORS: Record<RiskLevel, string> = {
  Critical: 'bg-red-50 text-red-700 border border-red-200',
  High:     'bg-amber-50 text-amber-700 border border-amber-200',
  Medium:   'bg-indigo-50 text-indigo-700 border border-indigo-200',
  Low:      'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

const AVATAR_COLORS: Record<RiskLevel, string> = {
  Critical: 'bg-red-600',
  High:     'bg-amber-500',
  Medium:   'bg-indigo-500',
  Low:      'bg-emerald-500',
};

const TCO_BAR_COMPETITOR: Record<RiskLevel, string> = {
  Critical: 'bg-red-400',
  High:     'bg-amber-400',
  Medium:   'bg-slate-400',
  Low:      'bg-slate-300',
};

interface CompetitorCardProps {
  competitor: Competitor;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function CompetitorCard({
  competitor,
  isSelected = false,
  onClick,
}: CompetitorCardProps) {
  const leftBorder = RISK_LEFT_BORDER[competitor.riskLevel];
  const avatarColor = AVATAR_COLORS[competitor.riskLevel];
  const badgeColor = RISK_BADGE_COLORS[competitor.riskLevel];
  const tcoBarColor = TCO_BAR_COMPETITOR[competitor.riskLevel];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white border border-slate-200 border-l-4 ${leftBorder} rounded-xl p-5 transition-all hover:shadow-md hover:border-slate-300 ${
        isSelected ? 'shadow-md ring-2 ring-blue-500/20 border-slate-300' : ''
      }`}
    >
      {/* Header: Avatar + Name + Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl ${avatarColor} flex items-center justify-center text-white font-bold text-sm`}
          >
            {competitor.avatar}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900">{competitor.name}</h3>
            <p className="text-xs text-slate-600">{competitor.ownership}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-600 ${badgeColor} flex-shrink-0`}>
          {competitor.riskLevel} Risk
        </span>
      </div>

      {/* Deployment + ARR */}
      <div className="flex gap-4 mb-3 text-xs text-slate-600">
        <span className="flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <path d="M2 17h20" />
          </svg>
          {competitor.deployment}
        </span>
        <span className="flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <path d="M4.93 4.93a24 24 0 0 1 14.14 0M2.83 11.83a24 24 0 0 1 18.34 0M2 12a10 10 0 0 1 20 0" />
          </svg>
          {competitor.revenue}
        </span>
      </div>

      {/* Key Weaknesses */}
      <div className="mb-4">
        <p className="text-xs font-600 text-slate-700 mb-2">Key Weaknesses</p>
        <div className="space-y-1">
          {competitor.keyWeaknesses.slice(0, 3).map((weakness, i) => (
            <div
              key={i}
              className="flex gap-2 text-xs text-slate-700 leading-snug"
            >
              <span className="text-sm flex-shrink-0">•</span>
              <span>{weakness.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TCO Comparison */}
      <div className="border-t border-slate-200 pt-3 mb-3">
        <p className="text-xs font-600 text-slate-700 mb-2 uppercase">3YR TCO Comparison</p>
        <div className="space-y-1.5">
          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span className="uppercase font-500">Their TCO</span>
              <span className="font-600 text-slate-900">
                R{competitor.tco3Year.competitor.min / 1000}
                {competitor.tco3Year.competitor.max ? `-${competitor.tco3Year.competitor.max / 1000}M` : 'K'}
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${tcoBarColor}`} style={{ width: '75%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span className="uppercase font-500">HaloITSM TCO</span>
              <span className="font-600 text-slate-900">
                R{competitor.tco3Year.haloITSM.min / 1000}
                {competitor.tco3Year.haloITSM.max ? `-${competitor.tco3Year.haloITSM.max / 1000}M` : 'K'}
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-blue-600" style={{ width: '35%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* View Battle Card Link */}
      <button className="text-sm font-600 text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
        View battle card
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </button>
  );
}
