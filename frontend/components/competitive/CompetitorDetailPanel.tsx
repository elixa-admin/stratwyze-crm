'use client';

import { Competitor, RiskLevel } from '@/lib/types/competitive';

const RISK_BADGE_COLORS: Record<RiskLevel, string> = {
  Critical: 'bg-red-100 text-red-700 border border-red-300',
  High: 'bg-orange-100 text-orange-700 border border-orange-300',
  Medium: 'bg-blue-100 text-blue-700 border border-blue-300',
  Low: 'bg-green-100 text-green-700 border border-green-300',
};

const AVATAR_COLORS: Record<RiskLevel, string> = {
  Critical: 'bg-red-500',
  High: 'bg-orange-500',
  Medium: 'bg-blue-500',
  Low: 'bg-green-500',
};

interface CompetitorDetailPanelProps {
  competitor: Competitor | null;
}

export default function CompetitorDetailPanel({ competitor }: CompetitorDetailPanelProps) {
  if (!competitor) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
              <circle cx="12" cy="12" r="1" />
              <path d="M4 12a8 8 0 0 1 16 0M2 12a10 10 0 0 1 20 0" />
            </svg>
          </div>
          <p className="text-slate-600 text-sm font-500">Select a competitor</p>
          <p className="text-slate-500 text-xs mt-1">Click any card to open the full sales battle card & rebuttals</p>
        </div>
      </div>
    );
  }

  const badgeColor = RISK_BADGE_COLORS[competitor.riskLevel];
  const avatarColor = AVATAR_COLORS[competitor.riskLevel];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className={`p-6 bg-gradient-to-r ${
        competitor.riskLevel === 'Critical' ? 'from-red-50 to-red-100' :
        competitor.riskLevel === 'High' ? 'from-orange-50 to-orange-100' :
        competitor.riskLevel === 'Medium' ? 'from-blue-50 to-blue-100' :
        'from-green-50 to-green-100'
      }`}>
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-lg ${avatarColor} flex items-center justify-center text-white font-bold`}>
            {competitor.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900">{competitor.name}</h3>
            <p className="text-sm text-slate-600">{competitor.ownership}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-600 ${badgeColor} flex-shrink-0`}>
            {competitor.riskLevel} Risk
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 p-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-600 uppercase text-slate-500 mb-1">Revenue</p>
          <p className="text-base font-bold text-slate-900">{competitor.revenue}</p>
        </div>
        <div>
          <p className="text-xs font-600 uppercase text-slate-500 mb-1">Deployment</p>
          <p className="text-base font-bold text-slate-900">{competitor.deployment}</p>
        </div>
        <div>
          <p className="text-xs font-600 uppercase text-slate-500 mb-1">Their 3YR TCO</p>
          <p className="text-sm font-bold text-slate-900">
            R{competitor.tco3Year.competitor.min / 1000}
            {competitor.tco3Year.competitor.max ? `-${competitor.tco3Year.competitor.max / 1000}M` : 'K'}
          </p>
        </div>
        <div>
          <p className="text-xs font-600 uppercase text-slate-500 mb-1">HaloITSM TCO</p>
          <p className="text-sm font-bold text-blue-600">
            R{competitor.tco3Year.haloITSM.min / 1000}
            {competitor.tco3Year.haloITSM.max ? `-${competitor.tco3Year.haloITSM.max / 1000}M` : 'K'}
          </p>
        </div>
      </div>

      {/* Key Weaknesses to Exploit */}
      <div className="p-6 border-b border-slate-200">
        <h4 className="text-sm font-bold text-slate-900 mb-4">Key Weaknesses to Exploit</h4>
        <div className="space-y-3">
          {competitor.keyWeaknesses.map((weakness, i) => (
            <div key={i} className="flex gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold ${
                competitor.riskLevel === 'Critical' ? 'bg-red-500' :
                competitor.riskLevel === 'High' ? 'bg-orange-500' :
                'bg-blue-500'
              }`}>
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-600 text-slate-900">{weakness.title}</p>
                <p className="text-xs text-slate-600 mt-0.5">{weakness.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Rebuttal & Pitch */}
      <div className="p-6 bg-blue-50 border-b border-blue-200">
        <div className="flex items-start gap-2 mb-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600 mt-0.5 flex-shrink-0">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <h4 className="text-sm font-bold text-blue-900">Sales Rebuttal & Pitch</h4>
        </div>
        <p className="text-sm text-blue-800 leading-snug">{competitor.salesRebuttal.keyMessage}</p>
      </div>

      {/* Action Buttons */}
      <div className="p-6 flex gap-3">
        <button className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-600 transition-all shadow-sm flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          Full Battle Card
        </button>
        <button className="flex-1 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-600 transition-all border border-slate-300">
          Inject to Proposal
        </button>
      </div>
    </div>
  );
}
