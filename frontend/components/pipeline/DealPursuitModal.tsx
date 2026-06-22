'use client';

import { useState, useEffect } from 'react';
import { COMPETITORS } from '@/lib/data/competitors';
import { SA_PARTNERS } from '@/lib/data/sa-partners';
import { computeBattleCard } from '@/lib/utils/battle-card';
import { PursuitBattleCard } from '@/lib/types/pursuit';
import BattleCardExport from '@/components/competitive/BattleCardExport';

export interface DealContext {
  id: string;
  title: string;
  value: number;
  stage: string;
  owner: string;
  competitorId?: string;
  saPartnerId?: string;
  competitiveNotes?: string;
}

interface Props {
  deal: DealContext;
  onClose: () => void;
  onSave?: (updated: Partial<DealContext>) => void;
}

const PERSONA_COLORS: Record<string, string> = {
  CIO:          'bg-purple-50 border-purple-200 text-purple-700',
  'IT Manager': 'bg-blue-50 border-blue-200 text-blue-700',
  Procurement:  'bg-green-50 border-green-200 text-green-700',
  CISO:         'bg-red-50 border-red-200 text-red-700',
};
const PERSONA_LABEL: Record<string, string> = {
  CIO:          'bg-purple-100 text-purple-700',
  'IT Manager': 'bg-blue-100 text-blue-700',
  Procurement:  'bg-green-100 text-green-700',
  CISO:         'bg-red-100 text-red-700',
};

const CHANNEL_PARTNERS = SA_PARTNERS.filter(p => p.category === 'HaloITSM Channel Partner');
const PLATFORM_PARTNERS = SA_PARTNERS.filter(p => p.category === 'Competing Platform Partner');

function formatZAR(val: number): string {
  return `R${(val / 1000).toFixed(0)}K`;
}

export default function DealPursuitModal({ deal, onClose, onSave }: Props) {
  const [competitorId, setCompetitorId] = useState(deal.competitorId ?? '');
  const [saPartnerId, setSaPartnerId] = useState(deal.saPartnerId ?? '');
  const [notes, setNotes] = useState(deal.competitiveNotes ?? '');
  const [battleCard, setBattleCard] = useState<PursuitBattleCard | null>(null);

  useEffect(() => {
    const competitor = COMPETITORS.find(c => c.id === competitorId) ?? null;
    const partner = SA_PARTNERS.find(p => p.id === saPartnerId) ?? null;
    if (competitor || partner) {
      setBattleCard(computeBattleCard(competitor, partner));
    } else {
      setBattleCard(null);
    }
  }, [competitorId, saPartnerId]);

  const handleSave = () => {
    onSave?.({ competitorId: competitorId || undefined, saPartnerId: saPartnerId || undefined, competitiveNotes: notes });
    onClose();
  };

  const competitor = COMPETITORS.find(c => c.id === competitorId);
  const partner = SA_PARTNERS.find(p => p.id === saPartnerId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.6)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{deal.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {formatZAR(deal.value)} · {deal.stage} · {deal.owner}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* Left: Competitive Context Selectors */}
          <div className="w-64 flex-shrink-0 border-r border-slate-100 p-5 overflow-y-auto space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Incumbent Platform</label>
              <select
                value={competitorId}
                onChange={e => setCompetitorId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Not identified</option>
                {COMPETITORS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {competitor && (
                <p className="text-[10px] text-slate-400 mt-1">{competitor.riskLevel} risk · {competitor.deployment}</p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Incumbent SI</label>
              <select
                value={saPartnerId}
                onChange={e => setSaPartnerId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Not identified</option>
                <optgroup label="HaloITSM Channel Partners">
                  {CHANNEL_PARTNERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </optgroup>
                <optgroup label="Competing Platform Partners">
                  {PLATFORM_PARTNERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </optgroup>
              </select>
              {partner && (
                <p className="text-[10px] text-slate-400 mt-1">{partner.threatLevel} threat · {partner.headquarters}</p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Field Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={4}
                placeholder="What did you learn? Incumbent feedback, contract status, stakeholder hints..."
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white transition-all"
            >
              Save to deal
            </button>
          </div>

          {/* Right: Battle Card */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {!battleCard ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-700">Select an incumbent platform or SI</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">A battle card will generate automatically as you make selections on the left.</p>
              </div>
            ) : (
              <>
                {/* Export bar */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Pursuit brief — {deal.title}</p>
                  <BattleCardExport battleCard={battleCard} preparedBy={deal.owner} />
                </div>

                {/* Header banner */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-white">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {battleCard.platformName && (
                      <span className="text-xs font-bold bg-red-500/30 text-red-200 border border-red-500/30 px-2 py-0.5 rounded-lg">{battleCard.platformName}</span>
                    )}
                    {battleCard.platformName && battleCard.siName && <span className="text-slate-400 text-sm">+</span>}
                    {battleCard.siName && (
                      <span className="text-xs font-bold bg-orange-500/30 text-orange-200 border border-orange-500/30 px-2 py-0.5 rounded-lg">{battleCard.siName}</span>
                    )}
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed italic">{battleCard.openingStatement}</p>
                </div>

                {/* Weaknesses side by side */}
                {(battleCard.platformWeaknesses.length > 0 || battleCard.siWeaknesses.length > 0) && (
                  <div className={`grid gap-3 ${battleCard.platformWeaknesses.length > 0 && battleCard.siWeaknesses.length > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {battleCard.platformWeaknesses.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-red-700 mb-2">Platform Risk — {battleCard.platformName}</p>
                        {battleCard.platformWeaknesses.slice(0, 4).map((w, i) => (
                          <div key={i} className="flex items-start gap-1.5 mb-1">
                            <span className="text-[10px] font-bold text-red-400 flex-shrink-0">{i + 1}</span>
                            <p className="text-[11px] text-red-800 leading-snug">{w}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {battleCard.siWeaknesses.length > 0 && (
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-orange-700 mb-2">SI Risk — {battleCard.siName}</p>
                        {battleCard.siWeaknesses.slice(0, 4).map((w, i) => (
                          <div key={i} className="flex items-start gap-1.5 mb-1">
                            <span className="text-[10px] font-bold text-orange-400 flex-shrink-0">{i + 1}</span>
                            <p className="text-[11px] text-orange-800 leading-snug">{w}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Winning Play */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-700 mb-2">The Winning Play</p>
                  <p className="text-xs text-slate-800 leading-relaxed">{battleCard.combinedNarrative}</p>
                  {battleCard.winStatement && (
                    <p className="text-xs font-semibold text-blue-900 border-l-4 border-blue-500 pl-3 mt-3 leading-snug">{battleCard.winStatement}</p>
                  )}
                </div>

                {/* Stakeholder Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {battleCard.stakeholderAngles.map(angle => (
                    <div key={angle.persona} className={`border rounded-xl p-3 ${PERSONA_COLORS[angle.persona]}`}>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block mb-1.5 ${PERSONA_LABEL[angle.persona]}`}>{angle.persona}</span>
                      <p className="text-[11px] font-semibold text-slate-800 mb-1.5 leading-snug">{angle.headline}</p>
                      {angle.talkingPoints.slice(0, 3).map((tp, i) => (
                        <div key={i} className="flex items-start gap-1 mb-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0 mt-0.5 opacity-60"><polyline points="9 18 15 12 9 6" /></svg>
                          <p className="text-[10px] text-slate-700 leading-snug">{tp}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Watch Outs */}
                {battleCard.watchOuts.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700 mb-2">Watch Outs</p>
                    {battleCard.watchOuts.map((w, i) => (
                      <div key={i} className="flex items-start gap-1.5 mb-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500 flex-shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        <p className="text-[11px] text-amber-900 leading-snug">{w}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
