'use client';

import { SAPartner, ThreatLevel } from '@/lib/types/sa-partners';

const THREAT_COLORS: Record<ThreatLevel, string> = {
  Primary: 'text-red-700 bg-red-50 border-red-200',
  Secondary: 'text-orange-700 bg-orange-50 border-orange-200',
  Emerging: 'text-slate-600 bg-slate-100 border-slate-200',
};

const THREAT_DOT: Record<ThreatLevel, string> = {
  Primary: 'bg-red-500',
  Secondary: 'bg-orange-500',
  Emerging: 'bg-slate-400',
};

const PLATFORM_ACCENT: Record<string, string> = {
  HaloITSM: 'bg-blue-600',
  Ivanti: 'bg-orange-600',
  ServiceNow: 'bg-purple-600',
  ManageEngine: 'bg-green-600',
  Freshservice: 'bg-teal-600',
  Mixed: 'bg-slate-600',
};

const CONFIDENCE_STYLE: Record<string, string> = {
  Confirmed: 'text-green-700',
  High: 'text-blue-700',
  Medium: 'text-amber-700',
  Unverified: 'text-slate-500',
};

interface Props {
  partner: SAPartner;
  isSelected: boolean;
  onClick: () => void;
}

export default function SAPartnerCard({ partner, isSelected, onClick }: Props) {
  const accentColor = PLATFORM_ACCENT[partner.platformAlignment] ?? 'bg-slate-600';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border bg-white transition-all duration-150 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        isSelected
          ? 'border-blue-400 shadow-md border-l-4 border-l-blue-500 pl-0'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-lg ${accentColor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
            {partner.avatar}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-slate-900 truncate">{partner.name}</span>
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${THREAT_COLORS[partner.threatLevel]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${THREAT_DOT[partner.threatLevel]}`} />
                {partner.threatLevel}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug truncate">{partner.tagline}</p>
          </div>
        </div>

        {/* Category + Platform */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {partner.category}
          </span>
          <span className="text-[10px] font-medium text-slate-500">
            {partner.province !== 'Unknown' ? partner.province : 'SA'}
          </span>
        </div>

        {/* Top 3 weaknesses */}
        <div className="space-y-1 mb-3">
          {partner.weaknesses.slice(0, 3).map((w, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-red-400 flex-shrink-0 mt-0.5">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-[11px] text-slate-600 leading-tight">{w}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className={`text-[10px] font-medium ${CONFIDENCE_STYLE[partner.dataConfidence]}`}>
            {partner.dataConfidence} data
          </span>
          <span className="text-[11px] text-blue-600 font-medium">
            View flanking strategy
          </span>
        </div>
      </div>
    </button>
  );
}
