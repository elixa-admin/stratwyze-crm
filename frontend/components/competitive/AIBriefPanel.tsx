'use client';

import { useState } from 'react';
import BattleCardExport from '@/components/competitive/BattleCardExport';
import NarrativeBlocks from '@/components/competitive/NarrativeBlocks';
import { PursuitBattleCard } from '@/lib/types/pursuit';

interface AIBrief {
  openingStatement: string;
  platformRisks: string[];
  siRisks: string[];
  combinedNarrative: string;
  winStatement: string;
  stakeholderAngles: Array<{
    persona: 'CIO' | 'IT Manager' | 'Procurement' | 'CISO';
    headline: string;
    talkingPoints: string[];
    watchOut?: string;
  }>;
  watchOuts: string[];
  flaggedAssumptions: string[];
  dataConfidence: 'High' | 'Medium' | 'Low';
}

interface Props {
  competitorId: string;
  saPartnerId: string;
  competitorName: string | null;
  siName: string | null;
  dealContext?: { accountName?: string; industry?: string; location?: string; dealValue?: number; notes?: string };
  onRequestVerify: () => void;
  onRequestProposal: (brief: AIBrief) => void;
}

const PERSONA_COLORS: Record<string, string> = {
  CIO:          'bg-purple-50 border-purple-200',
  'IT Manager': 'bg-blue-50 border-blue-200',
  Procurement:  'bg-green-50 border-green-200',
  CISO:         'bg-red-50 border-red-200',
};
const PERSONA_LABEL: Record<string, string> = {
  CIO:          'bg-purple-100 text-purple-700',
  'IT Manager': 'bg-blue-100 text-blue-700',
  Procurement:  'bg-green-100 text-green-700',
  CISO:         'bg-red-100 text-red-700',
};
const CONFIDENCE_COLORS: Record<string, string> = {
  High:   'bg-green-100 text-green-700 border-green-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  Low:    'bg-red-100 text-red-700 border-red-200',
};

function briefToBattleCard(brief: AIBrief, competitorName: string | null, siName: string | null): PursuitBattleCard {
  return {
    platformName: competitorName,
    siName,
    openingStatement: brief.openingStatement,
    platformWeaknesses: brief.platformRisks,
    siWeaknesses: brief.siRisks,
    combinedNarrative: brief.combinedNarrative,
    narrativePoints: brief.combinedNarrative ? [brief.combinedNarrative] : [],
    winStatement: brief.winStatement,
    stakeholderAngles: brief.stakeholderAngles,
    watchOuts: brief.watchOuts,
  };
}

export default function AIBriefPanel({
  competitorId, saPartnerId, competitorName, siName, dealContext,
  onRequestVerify, onRequestProposal,
}: Props) {
  const [brief, setBrief] = useState<AIBrief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setBrief(null);
    const start = Date.now();
    const timer = setInterval(() => setElapsed(Math.round((Date.now() - start) / 100) / 10), 100);

    try {
      const res = await fetch('/api/competitive/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorId, saPartnerId, dealContext }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Brief generation failed');
      setBrief(data.brief);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  };

  if (!brief && !loading && !error) {
    return (
      <div className="border border-slate-200 rounded-xl bg-white flex flex-col items-center justify-center min-h-[360px] p-8">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
          </svg>
        </div>
        <p className="text-slate-700 font-semibold text-sm mb-1">AI Pursuit Brief</p>
        <p className="text-slate-400 text-xs text-center max-w-xs mb-5">
          Generates fresh, AI-written talking points from Stratwyze's competitive knowledge base. Takes ~3 seconds.
        </p>
        <button
          onClick={generate}
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-sm"
        >
          Generate AI Brief
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border border-slate-200 rounded-xl bg-white flex flex-col items-center justify-center min-h-[360px] p-8">
        <div className="w-10 h-10 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mb-5" />
        <p className="text-sm font-semibold text-slate-700 mb-1">Generating pursuit brief...</p>
        <p className="text-xs text-slate-400">{elapsed}s — analysing competitive intelligence</p>
        <div className="mt-5 space-y-2 w-full max-w-sm">
          {['Opening statement', 'Platform risks', 'Stakeholder angles', 'Watch outs'].map((l, i) => (
            <div key={l} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${elapsed > i * 0.7 ? 'bg-blue-500' : 'bg-slate-200'} transition-colors`} />
              <div className={`h-2 rounded flex-1 ${elapsed > i * 0.7 ? 'bg-blue-100' : 'bg-slate-100'} transition-colors`} />
              <span className="text-[10px] text-slate-400 w-28 text-right">{l}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 rounded-xl bg-red-50 p-6 text-center">
        <p className="text-sm font-semibold text-red-700 mb-2">Brief generation failed</p>
        <p className="text-xs text-red-600 mb-4">{error}</p>
        <button onClick={generate} className="text-xs font-semibold text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-all">
          Retry
        </button>
      </div>
    );
  }

  if (!brief) return null;

  const battleCard = briefToBattleCard(brief, competitorName, siName);

  return (
    <div className="space-y-4">

      {/* Action bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${CONFIDENCE_COLORS[brief.dataConfidence]}`}>
            {brief.dataConfidence} confidence
          </span>
          <span className="text-[10px] text-slate-400">AI brief · {new Date().toLocaleDateString('en-ZA')}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={generate} className="text-xs text-slate-500 hover:text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Regenerate
          </button>
          <button onClick={onRequestVerify} className="text-xs text-amber-700 border border-amber-200 bg-amber-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:bg-amber-100 transition-all">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Verify intel
          </button>
          <BattleCardExport battleCard={battleCard} preparedBy="Stratwyze Solutions" />
        </div>
      </div>

      {/* Flagged assumptions warning */}
      {brief.flaggedAssumptions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700 mb-1.5">Flagged for verification before proposal</p>
          {brief.flaggedAssumptions.map((a, i) => (
            <div key={i} className="flex items-start gap-1.5 mb-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500 flex-shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <p className="text-[11px] text-amber-800 leading-snug">{a}</p>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-white">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {competitorName && <span className="text-xs font-bold bg-red-500/30 text-red-200 border border-red-500/30 px-2 py-0.5 rounded-lg">{competitorName}</span>}
          {competitorName && siName && <span className="text-slate-500">+</span>}
          {siName && <span className="text-xs font-bold bg-orange-500/30 text-orange-200 border border-orange-500/30 px-2 py-0.5 rounded-lg">{siName}</span>}
          <span className="text-slate-500 text-[10px] ml-auto">AI-generated</span>
        </div>
        <p className="text-white/80 text-xs leading-relaxed italic">{brief.openingStatement}</p>
      </div>

      {/* Risks side by side */}
      {(brief.platformRisks.length > 0 || brief.siRisks.length > 0) && (
        <div className={`grid gap-3 ${brief.platformRisks.length > 0 && brief.siRisks.length > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {brief.platformRisks.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-red-700 mb-2">Platform Risk — {competitorName}</p>
              {brief.platformRisks.map((r, i) => (
                <div key={i} className="flex items-start gap-1.5 mb-1.5">
                  <span className="text-[10px] font-bold text-red-400 flex-shrink-0">{i + 1}</span>
                  <p className="text-[11px] text-red-900 leading-snug">{r}</p>
                </div>
              ))}
            </div>
          )}
          {brief.siRisks.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-orange-700 mb-2">SI Risk — {siName}</p>
              {brief.siRisks.map((r, i) => (
                <div key={i} className="flex items-start gap-1.5 mb-1.5">
                  <span className="text-[10px] font-bold text-orange-400 flex-shrink-0">{i + 1}</span>
                  <p className="text-[11px] text-orange-900 leading-snug">{r}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Winning play */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-[10px] font-bold uppercase tracking-wide text-blue-700 mb-2">The Winning Play</p>
        <NarrativeBlocks text={brief.combinedNarrative} compact />
        {brief.winStatement && (
          <p className="text-xs font-semibold text-blue-900 border-l-4 border-blue-500 pl-3 mt-3 leading-snug">{brief.winStatement}</p>
        )}
      </div>

      {/* Stakeholder grid */}
      <div className="grid grid-cols-2 gap-3">
        {brief.stakeholderAngles.map(angle => (
          <div key={angle.persona} className={`border rounded-xl p-3 ${PERSONA_COLORS[angle.persona]}`}>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block mb-1.5 ${PERSONA_LABEL[angle.persona]}`}>
              {angle.persona}
            </span>
            <p className="text-[11px] font-semibold text-slate-800 mb-1.5 leading-snug">{angle.headline}</p>
            {angle.talkingPoints.map((tp, i) => (
              <div key={i} className="flex items-start gap-1 mb-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0 mt-0.5 opacity-50"><polyline points="9 18 15 12 9 6"/></svg>
                <p className="text-[10px] text-slate-700 leading-snug">{tp}</p>
              </div>
            ))}
            {angle.watchOut && (
              <p className="text-[10px] text-amber-700 bg-amber-50 rounded p-1.5 mt-2 leading-snug">Watch: {angle.watchOut}</p>
            )}
          </div>
        ))}
      </div>

      {/* Watch outs */}
      {brief.watchOuts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700 mb-1.5">Watch Outs</p>
          {brief.watchOuts.map((w, i) => (
            <div key={i} className="flex items-start gap-1.5 mb-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500 flex-shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <p className="text-[11px] text-amber-900 leading-snug">{w}</p>
            </div>
          ))}
        </div>
      )}

      {/* Generate proposal CTA */}
      <button
        onClick={() => onRequestProposal(brief)}
        className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        Generate Proposal
      </button>

    </div>
  );
}
