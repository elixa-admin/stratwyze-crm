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
  incumbentPlatform?: string;
  incumbentProvider?: string;
  brief?: Brief;
  onBriefUpdated?: (brief: Brief) => void;
}

export default function CompetitiveBriefDisplay({
  dealId,
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
          title: '', // Would need to pass from parent
          incumbentPlatform,
          saPartner: incumbentProvider,
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
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Competitive Context</h3>
        <p className="text-sm text-slate-500">No brief generated yet</p>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          🔄 Generate Brief
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Competitive Brief</h3>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
          title="Regenerate brief"
        >
          🔄
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
