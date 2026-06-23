'use client';

import MarketHealthCard from '@/components/accounts/MarketHealthCard';
import BuyerIntentCard from './BuyerIntentCard';
import { TYPOGRAPHY, SPACING_TYPOGRAPHY } from '@/lib/typography';

interface OpportunityProfileSidebarProps {
  profile?: any;
  deal?: any;
}

export default function OpportunityProfileSidebar({ profile, deal }: OpportunityProfileSidebarProps) {
  const companyIntel = profile?.companyIntel || {};
  const discoveryData = profile?.discoveryData || {};
  const qualificationData = profile?.qualificationData || {};
  const proposalData = profile?.proposalData || {};

  return (
    <div className="space-y-4 sticky top-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4">
        <h2 className={TYPOGRAPHY.SUBSECTION_TITLE}>Opportunity Profile</h2>
        <p className={`${TYPOGRAPHY.BODY_SM} mt-1`}>All deal intel aggregated in one view</p>
      </div>

      {/* Company Intel */}
      {companyIntel.companySnapshot || !profile ? (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className={TYPOGRAPHY.CARD_TITLE + ' mb-2'}>Company Intel</h3>
          {companyIntel.companySnapshot ? (
            <div className={SPACING_TYPOGRAPHY.ITEM}>
              <p className={TYPOGRAPHY.BODY_SM}>{companyIntel.companySnapshot.description}</p>
              <div className="grid grid-cols-2 gap-2">
                {companyIntel.companySnapshot.revenue && (
                  <div className="bg-slate-50 rounded p-2">
                    <p className={TYPOGRAPHY.LABEL}>Revenue</p>
                    <p className={TYPOGRAPHY.HIGHLIGHT}>{companyIntel.companySnapshot.revenue}</p>
                  </div>
                )}
                {companyIntel.companySnapshot.employees && (
                  <div className="bg-slate-50 rounded p-2">
                    <p className={TYPOGRAPHY.LABEL}>Employees</p>
                    <p className={TYPOGRAPHY.HIGHLIGHT}>{companyIntel.companySnapshot.employees}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className={`${TYPOGRAPHY.BODY_SM} italic`}>Generate pre-meeting brief to populate company intel</p>
          )}
        </div>
      ) : null}

      {/* Discovery Insights */}
      {discoveryData && Object.keys(discoveryData).length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Discovery Insights</h3>
          <div className="space-y-2">
            {discoveryData.incumbent && (
              <div className="bg-red-50 rounded p-2 border border-red-100">
                <p className="text-[10px] text-red-600 font-semibold">Incumbent</p>
                <p className="text-xs text-red-700">{discoveryData.incumbent}</p>
              </div>
            )}
            {discoveryData.budgetRange && (
              <div className="bg-green-50 rounded p-2 border border-green-100">
                <p className="text-[10px] text-green-600 font-semibold">Budget</p>
                <p className="text-xs text-green-700">{discoveryData.budgetRange}</p>
              </div>
            )}
            {discoveryData.timeline && (
              <div className="bg-amber-50 rounded p-2 border border-amber-100">
                <p className="text-[10px] text-amber-600 font-semibold">Timeline</p>
                <p className="text-xs text-amber-700">{discoveryData.timeline}</p>
              </div>
            )}
            {discoveryData.painPoints && discoveryData.painPoints.length > 0 && (
              <div className="bg-purple-50 rounded p-2 border border-purple-100">
                <p className="text-[10px] text-purple-600 font-semibold">Pain Points</p>
                <ul className="text-xs text-purple-700 mt-1 space-y-0.5">
                  {discoveryData.painPoints.slice(0, 3).map((pain: string, i: number) => (
                    <li key={i} className="flex gap-1">
                      <span>•</span> {pain}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Qualification Score */}
      {qualificationData?.fitScore !== undefined ? (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Qualification</h3>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    qualificationData.fitScore >= 70
                      ? 'bg-emerald-500'
                      : qualificationData.fitScore >= 50
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${qualificationData.fitScore}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-bold text-slate-900">{qualificationData.fitScore}</span>
          </div>
          {qualificationData.goNoGo && (
            <p className="text-xs mt-2">
              <span
                className={`font-semibold ${
                  qualificationData.goNoGo === 'GO'
                    ? 'text-emerald-700'
                    : qualificationData.goNoGo === 'NO-GO'
                    ? 'text-red-700'
                    : 'text-amber-700'
                }`}
              >
                {qualificationData.goNoGo}
              </span>
            </p>
          )}
        </div>
      ) : null}

      {/* Proposal Summary */}
      {proposalData?.generated ? (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Proposal</h3>
          <div className="space-y-2">
            {proposalData.generated.proposedSolution?.headline && (
              <p className="text-xs font-semibold text-blue-800 bg-blue-50 rounded p-2 border border-blue-100">
                {proposalData.generated.proposedSolution.headline}
              </p>
            )}
            {proposalData.generated.roiSummary?.headline && (
              <p className="text-xs text-emerald-700 font-semibold">{proposalData.generated.roiSummary.headline}</p>
            )}
            {proposalData.solutionDesign?.positioningAngle && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">Angle:</span>
                <span className="text-xs text-indigo-700 font-bold">{proposalData.solutionDesign.positioningAngle}</span>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Buyer Intent Signals */}
      {profile?.buyerIntentBreakdown && (
        <BuyerIntentCard
          breakdown={profile.buyerIntentBreakdown}
          suggestedStakeholders={(profile?.companyIntel as any)?.suggestedStakeholders}
          technologyClues={(profile?.companyIntel as any)?.technologyClues}
        />
      )}

      {/* Market Health — shown if account is JSE-listed or ticker was detected */}
      {deal?.account && (deal.account.isListed || deal.account.jseTickerSymbol || (profile?.companyIntel as any)?.detectedTicker) && (
        <MarketHealthCard
          accountId={deal.account.id}
          accountName={deal.account.name}
          initialData={deal.account.marketData ?? null}
          ticker={deal.account.jseTickerSymbol ?? (profile?.companyIntel as any)?.detectedTicker ?? null}
          isListed={deal.account.isListed ?? false}
        />
      )}

      {/* When empty */}
      {!profile || (Object.keys(profile).length === 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-600 italic">Profile builds as you progress through stages</p>
        </div>
      ))}
    </div>
  );
}
