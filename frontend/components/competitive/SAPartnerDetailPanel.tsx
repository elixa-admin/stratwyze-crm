'use client';

import { SAPartner, ThreatLevel } from '@/lib/types/sa-partners';

// Threat is signalled by a coloured dot on the badge (matching the cards),
// not by tinting the whole header — keeps the panel on the site's dark chrome.
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

interface Props {
  partner: SAPartner | null;
}

export default function SAPartnerDetailPanel({ partner }: Props) {
  if (!partner) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 flex flex-col items-center justify-center min-h-[420px]">
        <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <p className="text-slate-700 font-semibold text-sm">Select a competitor</p>
        <p className="text-slate-400 text-xs mt-1 text-center">Click any card to view their profile and flanking strategy</p>
      </div>
    );
  }

  const accentColor = PLATFORM_ACCENT[partner.platformAlignment] ?? 'bg-slate-600';

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* Header — neutral dark chrome, matches site theme */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white">
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-lg ${accentColor} flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
            {partner.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base leading-tight">{partner.name}</h3>
            <p className="text-white/75 text-xs mt-0.5 leading-snug">{partner.tagline}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-[10px] font-semibold text-white/90 bg-white/20 px-2 py-0.5 rounded-full">
            {partner.category}
          </span>
          <span className="text-[10px] font-semibold text-white/90 bg-white/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${THREAT_DOT[partner.threatLevel]}`} />
            {partner.threatLevel} Threat
          </span>
          <span className="text-[10px] font-semibold text-white/90 bg-white/20 px-2 py-0.5 rounded-full">
            {partner.platformAlignment}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Company meta */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-0.5">Location</p>
            <p className="text-sm font-semibold text-slate-800">{partner.headquarters}</p>
            <p className="text-[11px] text-slate-500">{partner.province}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-0.5">Platform</p>
            <p className="text-sm font-semibold text-slate-800">{partner.platformAlignment}</p>
            {partner.employees && <p className="text-[11px] text-slate-500">{partner.employees} employees</p>}
          </div>
          {partner.typicalDealSize && (
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-0.5">Deal Size</p>
              <p className="text-sm font-semibold text-slate-800">{partner.typicalDealSize}</p>
            </div>
          )}
          {partner.salesCycle && (
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-0.5">Sales Cycle</p>
              <p className="text-sm font-semibold text-slate-800">{partner.salesCycle}</p>
            </div>
          )}
        </div>

        {/* Their weaknesses */}
        <div>
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Their Weaknesses</h4>
          <div className="space-y-1.5">
            {partner.weaknesses.map((w, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[11px] font-bold text-red-500 flex-shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-[12px] text-slate-700 leading-snug">{w}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Flanking Strategy */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wide">Flanking Strategy</h4>
          </div>

          <div className="mb-3">
            <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-1">Situation</p>
            <p className="text-[12px] text-blue-900 leading-snug">{partner.flankingStrategy.situation}</p>
          </div>

          <div className="mb-3">
            <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-1">Key Message</p>
            <p className="text-[12px] text-blue-900 font-medium leading-snug italic">"{partner.flankingStrategy.keyMessage}"</p>
          </div>

          <div className="mb-3">
            <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-1.5">Talking Points</p>
            <div className="space-y-1.5">
              {partner.flankingStrategy.talkingPoints.map((tp, i) => (
                <div key={i} className="flex items-start gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-500 flex-shrink-0 mt-0.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  <p className="text-[12px] text-blue-900 leading-snug">{tp}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mt-2">
            <div className="flex items-start gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600 flex-shrink-0 mt-0.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <p className="text-[11px] text-amber-800 leading-snug"><span className="font-semibold">Watch out:</span> {partner.flankingStrategy.watchOut}</p>
            </div>
          </div>
        </div>

        {/* Stratwyze advantages */}
        <div>
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Stratwyze Advantages</h4>
          <div className="space-y-1.5">
            {partner.stratwyzeAdvantages.map((adv, i) => (
              <div key={i} className="flex items-start gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-500 flex-shrink-0 mt-0.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p className="text-[12px] text-slate-700 leading-snug">{adv}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Data confidence */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
          <span>Verified: {partner.lastVerified}</span>
          <span>Confidence: {partner.dataConfidence}</span>
        </div>
      </div>
    </div>
  );
}
