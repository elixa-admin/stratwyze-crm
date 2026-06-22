'use client';

import { useState } from 'react';
import { COMPETITORS } from '@/lib/data/competitors';
import { SA_PARTNERS } from '@/lib/data/sa-partners';
import { PursuitBattleCard } from '@/lib/types/pursuit';
import BattleCardExport from '@/components/competitive/BattleCardExport';
import AIBriefPanel from '@/components/competitive/AIBriefPanel';
import IntelVerificationPanel from '@/components/competitive/IntelVerificationPanel';
import { computeBattleCard } from '@/lib/utils/battle-card';

// ─── Icons ──────────────────────────────────────────────────────────────────

const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconLightning = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const IconChevron = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

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

type BriefMode = 'static' | 'ai';

interface AIBriefInterface {
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

interface VerificationReportInterface {
  freshnessScore: string;
  freshnessRationale: string;
  newIntelligence: string[];
  recommendation: string;
  safeToPropose: boolean;
}

interface Props {
  onNavigateToProposal?: (competitorId: string, siId: string, verificationReport?: VerificationReportInterface) => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function PursuitEngine({ onNavigateToProposal }: Props) {
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string>('');
  const [selectedSAPartnerId, setSelectedSAPartnerId] = useState<string>('');
  const [battleCard, setBattleCard] = useState<PursuitBattleCard | null>(null);
  const [briefMode, setBriefMode] = useState<BriefMode>('static');
  const [showVerify, setShowVerify] = useState(false);
  const [verificationReport, setVerificationReport] = useState<VerificationReportInterface | null>(null);

  const selectedCompetitor = COMPETITORS.find(c => c.id === selectedCompetitorId) ?? null;
  const selectedPartner = SA_PARTNERS.find(p => p.id === selectedSAPartnerId) ?? null;
  const canGenerate = selectedCompetitorId !== '' || selectedSAPartnerId !== '';

  const handleGenerate = () => {
    setBattleCard(computeBattleCard(selectedCompetitor, selectedPartner));
  };

  const handleSelectorChange = (type: 'competitor' | 'si', value: string) => {
    if (type === 'competitor') setSelectedCompetitorId(value);
    else setSelectedSAPartnerId(value);
    setBattleCard(null);
    setShowVerify(false);
    setVerificationReport(null);
  };

  const handleRequestProposal = (_brief: AIBriefInterface) => {
    if (onNavigateToProposal) {
      onNavigateToProposal(selectedCompetitorId, selectedSAPartnerId, verificationReport ?? undefined);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

      {/* ── Selector Panel ── */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Configure Your Pursuit</h3>
          <p className="text-xs text-slate-500 mb-5">
            Select the incumbent platform and/or consultancy. Either or both.
          </p>

          {/* Platform selector */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
              Incumbent Platform / Tool
            </label>
            <select
              value={selectedCompetitorId}
              onChange={e => handleSelectorChange('competitor', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="">No incumbent platform known</option>
              {COMPETITORS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {selectedCompetitor && (
              <p className="text-[11px] text-slate-500 mt-1 pl-1">
                {selectedCompetitor.riskLevel} Risk · {selectedCompetitor.deployment} · {selectedCompetitor.ownership}
              </p>
            )}
          </div>

          {/* SI selector */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
              Incumbent SI / Consultancy
            </label>
            <select
              value={selectedSAPartnerId}
              onChange={e => handleSelectorChange('si', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="">No SI / consultancy identified</option>
              <optgroup label="HaloITSM Channel Partners">
                {CHANNEL_PARTNERS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </optgroup>
              <optgroup label="Competing Platform Partners">
                {PLATFORM_PARTNERS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </optgroup>
            </select>
            {selectedPartner && (
              <p className="text-[11px] text-slate-500 mt-1 pl-1">
                {selectedPartner.threatLevel} Threat · {selectedPartner.platformAlignment} · {selectedPartner.headquarters}
              </p>
            )}
          </div>

          {/* Mode toggle */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden mb-4">
            <button
              onClick={() => setBriefMode('static')}
              className={`flex-1 py-2 text-xs font-semibold transition-all ${
                briefMode === 'static'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Static Brief
            </button>
            <button
              onClick={() => setBriefMode('ai')}
              className={`flex-1 py-2 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                briefMode === 'ai'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
              AI Brief
            </button>
          </div>

          {!canGenerate && (
            <p className="text-xs text-slate-400 text-center mb-4">
              Select at least one competitor
            </p>
          )}

          {briefMode === 'static' && (
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Generate Battle Card
            </button>
          )}

          {briefMode === 'ai' && canGenerate && (
            <button
              onClick={() => setShowVerify(v => !v)}
              className={`w-full py-2 text-xs rounded-lg border transition-all ${
                showVerify
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-amber-200 hover:text-amber-700'
              }`}
            >
              {showVerify ? 'Hide verify panel' : 'Show intel verification panel'}
            </button>
          )}
        </div>

        {/* Known pairings */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-2">Known SA Market Pairings</p>
          <div className="space-y-1.5">
            {[
              { si: 'Nexio', platform: 'ServiceNow', note: 'OEM Reseller — Gauteng enterprise' },
              { si: 'Think Tank', platform: 'Ivanti', note: 'Ivanti Premier Partner SA' },
              { si: 'ITR Technology', platform: 'ManageEngine', note: 'Exclusive SA distributor' },
              { si: 'S Con', platform: 'Freshservice', note: 'Freshworks SA partner' },
              { si: 'Mediro', platform: 'ServiceNow', note: 'ServiceNow BSM specialist' },
            ].map(({ si, platform, note }) => (
              <div key={si} className="flex items-start gap-1.5">
                <span className="text-[10px] font-medium text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded flex-shrink-0">{si}</span>
                <span className="text-[10px] text-slate-400 mt-0.5">+</span>
                <span className="text-[10px] font-medium text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded flex-shrink-0">{platform}</span>
                <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Verification panel (inline, below selector) */}
        {briefMode === 'ai' && canGenerate && showVerify && (
          <IntelVerificationPanel
            competitorId={selectedCompetitorId}
            saPartnerId={selectedSAPartnerId}
            onComplete={report => setVerificationReport(report)}
          />
        )}
      </div>

      {/* ── Right Panel: Brief Output ── */}
      <div className="lg:col-span-3">

        {/* AI Brief mode */}
        {briefMode === 'ai' && (
          <div className="space-y-4">
            {!canGenerate ? (
              <div className="border border-slate-200 rounded-xl bg-white flex flex-col items-center justify-center min-h-[360px] p-8">
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-4 text-blue-400">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                  </svg>
                </div>
                <p className="text-slate-700 font-semibold text-sm">Select a competitor to generate an AI brief</p>
                <p className="text-slate-400 text-xs mt-1 text-center max-w-xs">Choose an incumbent platform, SI, or both — then generate a live AI brief using Stratwyze's competitive knowledge base.</p>
              </div>
            ) : (
              <AIBriefPanel
                competitorId={selectedCompetitorId}
                saPartnerId={selectedSAPartnerId}
                competitorName={selectedCompetitor?.name ?? null}
                siName={selectedPartner?.name ?? null}
                onRequestVerify={() => setShowVerify(true)}
                onRequestProposal={handleRequestProposal}
              />
            )}
          </div>
        )}

        {/* Static brief mode */}
        {briefMode === 'static' && (
          <>
            {!battleCard ? (
              <div className="border border-slate-200 rounded-xl bg-white flex flex-col items-center justify-center min-h-[480px] p-8">
                <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                  <IconShield />
                </div>
                <p className="text-slate-700 font-semibold text-sm">Configure and generate your pursuit battle card</p>
                <p className="text-slate-400 text-xs mt-1 text-center max-w-xs">
                  Select an incumbent platform, an incumbent SI, or both — then generate a unified battle card with stakeholder talking points.
                </p>
              </div>
            ) : (
              <div className="space-y-4">

                {/* Export bar */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Static pursuit brief</p>
                  <div className="flex items-center gap-2">
                    {onNavigateToProposal && (
                      <button
                        onClick={() => onNavigateToProposal(selectedCompetitorId, selectedSAPartnerId)}
                        className="text-xs text-slate-700 border border-slate-200 bg-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-slate-50 transition-all"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        Generate Proposal
                      </button>
                    )}
                    <BattleCardExport battleCard={battleCard} preparedBy="Stratwyze Solutions" />
                  </div>
                </div>

                {/* Header */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {battleCard.platformName && (
                      <span className="text-sm font-bold bg-red-500/30 text-red-200 border border-red-500/30 px-2.5 py-1 rounded-lg">
                        {battleCard.platformName}
                      </span>
                    )}
                    {battleCard.platformName && battleCard.siName && (
                      <span className="text-slate-400 text-sm font-medium">+</span>
                    )}
                    {battleCard.siName && (
                      <span className="text-sm font-bold bg-orange-500/30 text-orange-200 border border-orange-500/30 px-2.5 py-1 rounded-lg">
                        {battleCard.siName}
                      </span>
                    )}
                    <span className="text-slate-500 text-xs ml-auto">Stratwyze Pursuit Battle Card</span>
                  </div>
                  <p className="text-white/75 text-xs leading-relaxed italic">{battleCard.openingStatement}</p>
                </div>

                {/* Platform + SI weaknesses */}
                {(battleCard.platformWeaknesses.length > 0 || battleCard.siWeaknesses.length > 0) && (
                  <div className={`grid gap-4 ${battleCard.platformWeaknesses.length > 0 && battleCard.siWeaknesses.length > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {battleCard.platformWeaknesses.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center gap-1.5 mb-3 text-red-700">
                          <IconAlert />
                          <span className="text-xs font-bold uppercase tracking-wide">Platform Risk — {battleCard.platformName}</span>
                        </div>
                        <div className="space-y-1.5">
                          {battleCard.platformWeaknesses.slice(0, 5).map((w, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                              <span className="text-[11px] font-bold text-red-400 flex-shrink-0 mt-0.5">{i + 1}</span>
                              <p className="text-[11px] text-red-800 leading-snug">{w}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {battleCard.siWeaknesses.length > 0 && (
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                        <div className="flex items-center gap-1.5 mb-3 text-orange-700">
                          <IconAlert />
                          <span className="text-xs font-bold uppercase tracking-wide">SI Risk — {battleCard.siName}</span>
                        </div>
                        <div className="space-y-1.5">
                          {battleCard.siWeaknesses.slice(0, 5).map((w, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                              <span className="text-[11px] font-bold text-orange-400 flex-shrink-0 mt-0.5">{i + 1}</span>
                              <p className="text-[11px] text-orange-800 leading-snug">{w}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Combined Narrative */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-3 text-blue-700">
                    <IconLightning />
                    <span className="text-xs font-bold uppercase tracking-wide">The Winning Play</span>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed">{battleCard.combinedNarrative}</p>
                  {battleCard.winStatement && (
                    <p className="text-sm font-semibold text-blue-900 border-l-4 border-blue-500 pl-3 mt-3 leading-snug">
                      {battleCard.winStatement}
                    </p>
                  )}
                </div>

                {/* Stakeholder Matrix */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Stakeholder Talking Points</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {battleCard.stakeholderAngles.map(angle => (
                      <div key={angle.persona} className={`border rounded-xl p-3 ${PERSONA_COLORS[angle.persona]}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${PERSONA_LABEL[angle.persona]}`}>
                            {angle.persona}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 mb-2 leading-snug">{angle.headline}</p>
                        <div className="space-y-1">
                          {angle.talkingPoints.map((tp, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                              <span className="text-current opacity-60 flex-shrink-0 mt-0.5"><IconChevron /></span>
                              <p className="text-[11px] text-slate-700 leading-snug">{tp}</p>
                            </div>
                          ))}
                        </div>
                        {angle.watchOut && (
                          <p className="text-[10px] text-amber-700 bg-amber-50 rounded p-1.5 mt-2 leading-snug">
                            Watch: {angle.watchOut}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Watch Outs */}
                {battleCard.watchOuts.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-1.5 mb-3 text-amber-700">
                      <IconAlert />
                      <span className="text-xs font-bold uppercase tracking-wide">Watch Outs</span>
                    </div>
                    <div className="space-y-1.5">
                      {battleCard.watchOuts.map((w, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-amber-500 flex-shrink-0 mt-0.5"><IconChevron /></span>
                          <p className="text-[12px] text-amber-900 leading-snug">{w}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stratwyze advantages */}
                {selectedPartner && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-1.5 mb-3 text-green-700">
                      <IconShield />
                      <span className="text-xs font-bold uppercase tracking-wide">Stratwyze vs {selectedPartner.name}</span>
                    </div>
                    <div className="space-y-1.5">
                      {selectedPartner.stratwyzeAdvantages.slice(0, 5).map((adv, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-green-500 flex-shrink-0 mt-0.5"><IconCheck /></span>
                          <p className="text-[12px] text-green-900 leading-snug">{adv}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
