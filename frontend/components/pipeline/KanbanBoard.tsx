'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DealPursuitModal, { DealContext } from '@/components/pipeline/DealPursuitModal';
import { formatCurrency } from '@/lib/format';

interface Opportunity {
  id: string;
  title: string;
  value: number;
  closeDate: string;
  probability: number;
  owner: string;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won';
  incumbentPlatform?: string;
  incumbentSI?: string;
  competitorId?: string;
  saPartnerId?: string;
  competitiveNotes?: string;
}

const STAGES = [
  { id: 'prospecting',   label: 'Prospecting' },
  { id: 'qualification', label: 'Qualification' },
  { id: 'proposal',      label: 'Proposal' },
  { id: 'negotiation',   label: 'Negotiation' },
  { id: 'closed-won',    label: 'Closed Won' },
];

function stageToLocal(stage: string): Opportunity['stage'] {
  const map: Record<string, Opportunity['stage']> = {
    'Prospecting': 'prospecting',
    'Qualification': 'qualification',
    'Proposal': 'proposal',
    'Negotiation': 'negotiation',
    'Closed Won': 'closed-won',
  };
  return map[stage] ?? 'prospecting';
}

function getProbabilityColor(probability: number): string {
  if (probability >= 80) return 'bg-green-100 text-green-700';
  if (probability >= 50) return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
}

function KanbanSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 pb-4 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex flex-col bg-slate-50 rounded-xl border border-slate-200 p-3">
          <div className="mb-3 pb-3 border-b border-slate-200">
            <div className="h-3.5 bg-slate-200 rounded w-24 mb-1.5" />
            <div className="h-2.5 bg-slate-100 rounded w-16" />
          </div>
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: i === 0 ? 3 : i === 1 ? 2 : 1 }).map((_, j) => (
              <div key={j} className="bg-white rounded-lg border border-slate-200 p-3">
                <div className="h-3 bg-slate-200 rounded w-full mb-3" />
                <div className="flex justify-between">
                  <div className="h-3 bg-slate-200 rounded w-14" />
                  <div className="h-3 bg-slate-100 rounded w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function KanbanBoard() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<DealContext | null>(null);

  useEffect(() => {
    fetch('/api/deals')
      .then(r => r.json())
      .then(data => {
        if (data.deals) {
          setOpportunities(data.deals.map((d: any): Opportunity => ({
            id: d.id,
            title: d.title,
            value: d.value,
            closeDate: d.createdAt
              ? new Date(new Date(d.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            probability: 50,
            owner: 'You',
            stage: stageToLocal(d.stage),
            incumbentPlatform: d.incumbentPlatform,
            incumbentSI: d.incumbentProvider,
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleDealCreated = (event: Event) => {
      const customEvent = event as CustomEvent;
      const data = customEvent.detail as { title: string; value: number; accountId: string; stageName: string; dealId?: string };
      const newDeal: Opportunity = {
        id: data.dealId ?? Date.now().toString(),
        title: data.title,
        value: data.value,
        closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        probability: 50,
        owner: 'You',
        stage: data.stageName.toLowerCase().replace(' ', '-') as Opportunity['stage'],
      };
      setOpportunities(prev => [newDeal, ...prev]);
    };

    window.addEventListener('dealCreated', handleDealCreated);
    return () => window.removeEventListener('dealCreated', handleDealCreated);
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    if (!draggedId) return;
    setOpportunities(prev => prev.map(opp => opp.id === draggedId ? { ...opp, stage: stage as Opportunity['stage'] } : opp));
    setDraggedId(null);
  };

  const openPursuitModal = (opp: Opportunity) => {
    setActiveModal({
      id: opp.id,
      title: opp.title,
      value: opp.value,
      stage: opp.stage,
      owner: opp.owner,
      competitorId: opp.competitorId,
      saPartnerId: opp.saPartnerId,
      competitiveNotes: opp.competitiveNotes,
    });
  };

  const handleModalSave = (updated: Partial<DealContext>) => {
    if (!activeModal) return;
    const { competitorId, saPartnerId, competitiveNotes } = updated;
    setOpportunities(prev => prev.map(opp =>
      opp.id === activeModal.id ? { ...opp, competitorId, saPartnerId, competitiveNotes } : opp
    ));
  };

  const hasCompetitiveContext = (opp: Opportunity) => !!(opp.competitorId || opp.saPartnerId);

  if (loading) return <KanbanSkeleton />;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 pb-4">
        {STAGES.map((stage) => {
          const stageOpps = opportunities.filter((opp) => opp.stage === stage.id);
          const stageValue = stageOpps.reduce((sum, opp) => sum + opp.value, 0);

          return (
            <div
              key={stage.id}
              className="flex flex-col bg-slate-50 rounded-xl border border-slate-200 p-3"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="mb-3 pb-3 border-b border-slate-200">
                <h2 className="text-sm font-semibold text-slate-900">{stage.label}</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {stageOpps.length} deal{stageOpps.length !== 1 ? 's' : ''} · {formatCurrency(stageValue)}
                </p>
              </div>

              <div className="flex flex-col gap-2.5 flex-1 min-h-80">
                {stageOpps.map((opp) => (
                  <div
                    key={opp.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, opp.id)}
                    className="bg-white rounded-lg border border-slate-200 p-3 shadow-xs hover:shadow-sm transition-all cursor-grab active:cursor-grabbing group"
                  >
                    <Link href={`/deals/${opp.id}`} className="block" onClick={e => e.stopPropagation()}>
                      <p className="text-sm font-medium text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">{opp.title}</p>
                    </Link>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-900">{formatCurrency(opp.value)}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${getProbabilityColor(opp.probability)}`}>
                          {opp.probability}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-slate-500">
                        <span className="flex items-center gap-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {formatDate(opp.closeDate)}
                        </span>
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[9px] font-bold text-white">
                          {opp.owner.slice(0, 2).toUpperCase()}
                        </div>
                      </div>

                      {(opp.incumbentPlatform || opp.incumbentSI) && (
                        <div className="pt-1.5 border-t border-slate-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 flex-shrink-0">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                              </svg>
                              <span className="text-[10px] text-slate-500 truncate max-w-[100px]">
                                {[opp.incumbentPlatform, opp.incumbentSI].filter(Boolean).join(' / ')}
                              </span>
                            </div>
                            {hasCompetitiveContext(opp) && (
                              <button
                                onClick={(e) => { e.stopPropagation(); openPursuitModal(opp); }}
                                className="text-[9px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded transition-all flex-shrink-0"
                              >
                                Brief
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {stageOpps.length === 0 && (
                  <div className="flex flex-col items-center justify-center flex-1 gap-2 text-slate-400">
                    <p className="text-xs">No deals in this stage</p>
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('openNewDealModal'))}
                      className="text-[10px] font-medium text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-all"
                    >
                      + Add deal
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-wide mb-2">Total Pipeline</p>
          <div className="text-2xl font-bold text-slate-900">
            {formatCurrency(opportunities.reduce((sum, opp) => sum + opp.value, 0))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-wide mb-2">Weighted Forecast</p>
          <div className="text-2xl font-bold text-slate-900">
            {formatCurrency(opportunities.reduce((sum, opp) => sum + opp.value * (opp.probability / 100), 0))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-wide mb-2">Closed Won</p>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(opportunities.filter(o => o.stage === 'closed-won').reduce((sum, opp) => sum + opp.value, 0))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-wide mb-2">Competitive Deals</p>
          <div className="text-2xl font-bold text-slate-900">
            {opportunities.filter(hasCompetitiveContext).length}
            <span className="text-sm font-normal text-slate-500 ml-1">/ {opportunities.length}</span>
          </div>
        </div>
      </div>

      {activeModal && (
        <DealPursuitModal
          deal={activeModal}
          onClose={() => setActiveModal(null)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}
