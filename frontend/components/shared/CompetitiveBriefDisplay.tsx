'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';

interface Brief {
  openingStatement?: string;
  winStatement?: string;
  platformRisks?: string[];
  siRisks?: string[];
  cioAngle?: string;
  itManagerAngle?: string;
}

interface CompetitiveBriefDisplayProps {
  dealId: string;
  dealTitle?: string;
  accountInfo?: { name?: string; industry?: string; annualRevenue?: number };
  incumbentPlatform?: string;
  incumbentProvider?: string;
  brief?: Brief;
  onBriefUpdated?: (brief: Brief) => void;
}

export default function CompetitiveBriefDisplay({
  dealId,
  dealTitle,
  accountInfo,
  incumbentPlatform,
  incumbentProvider,
  brief,
  onBriefUpdated,
}: CompetitiveBriefDisplayProps) {
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await fetch('/api/deals/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: dealTitle ?? 'HaloITSM Opportunity',
          incumbentPlatform,
          saPartner: incumbentProvider,
          accountInfo: accountInfo ?? undefined,
        }),
      });

      if (!res.ok) throw new Error('Failed to regenerate brief');

      const data = await res.json();

      // Save brief to deal
      await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitiveBrief: data.brief }),
      });

      onBriefUpdated?.(data.brief);
      toast('Brief regenerated', 'success');
    } catch (err) {
      toast('Failed to regenerate brief', 'error');
    } finally {
      setRegenerating(false);
    }
  };

  if (!brief) {
    return (
      <div className="space-y-3">
        {!incumbentPlatform && !incumbentProvider && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-start gap-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600 flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
            <div className="flex-1">
              <p className="text-xs font-semibold text-blue-800 mb-1">Generate AI Brief</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                {incumbentProvider ? `AI will analyze how HaloITSM compares to ${incumbentProvider}'s implementation`
                : incumbentPlatform ? `AI will analyze how HaloITSM positions against ${incumbentPlatform}`
                : 'AI will generate competitive positioning, key risks, and win strategy'}
              </p>
            </div>
          </div>
        )}
        <button
          id="competitive-brief-generate-btn"
          onClick={handleRegenerate}
          disabled={regenerating}
          className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {regenerating && <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
          {regenerating ? 'Generating brief…' : '✨ Generate Brief'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Competitive Brief</h3>
        <button
          id="competitive-brief-generate-btn"
          onClick={handleRegenerate}
          disabled={regenerating}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all disabled:opacity-50"
          title="Regenerate brief with latest context"
        >
          {regenerating ? (
            <>
              <span className="w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Generating
            </>
          ) : (
            <>
              ✨ Regenerate
            </>
          )}
        </button>
      </div>

      {brief.openingStatement && (
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-1">Opening Statement</p>
          <p className="text-sm text-slate-900">{brief.openingStatement}</p>
        </div>
      )}

      {brief.winStatement && (
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-1">Win Statement</p>
          <p className="text-sm text-slate-900 text-emerald-700">{brief.winStatement}</p>
        </div>
      )}

      {brief.platformRisks && brief.platformRisks.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-2">Platform Risks</p>
          <ul className="space-y-1">
            {brief.platformRisks.map((risk, i) => (
              <li key={i} className="text-sm text-slate-700 flex gap-2">
                <span className="text-red-500">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {brief.siRisks && brief.siRisks.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-2">SI Risks</p>
          <ul className="space-y-1">
            {brief.siRisks.map((risk, i) => (
              <li key={i} className="text-sm text-slate-700 flex gap-2">
                <span className="text-orange-500">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-slate-100 pt-3 space-y-3">
        {brief.cioAngle && (
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-1">CIO Angle</p>
            <p className="text-sm text-slate-900">{brief.cioAngle}</p>
          </div>
        )}

        {brief.itManagerAngle && (
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-1">IT Manager Angle</p>
            <p className="text-sm text-slate-900">{brief.itManagerAngle}</p>
          </div>
        )}
      </div>
    </div>
  );
}
