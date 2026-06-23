'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DealPursuitModal, { DealContext } from '@/components/pipeline/DealPursuitModal';
import DealQuickActions from '@/components/shared/DealQuickActions';
import { formatCurrency } from '@/lib/format';

interface Opportunity {
  id: string;
  title: string;
  value: number;
  createdAt: string;
  probability: number;
  owner: string;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won';
  incumbentPlatform?: string;
  incumbentSI?: string;
  competitorId?: string;
  saPartnerId?: string;
  competitiveNotes?: string;
  accountId?: string;
}

const STAGES = [
  { id: 'prospecting',   label: 'Prospecting' },
  { id: 'qualification', label: 'Qualification' },
  { id: 'proposal',      label: 'Proposal' },
  { id: 'negotiation',   label: 'Negotiation' },
  { id: 'closed-won',    label: 'Closed Won' },
];

const STAGE_PROBABILITY: Record<string, number> = {
  'prospecting':   10,
  'qualification': 25,
  'proposal':      50,
  'negotiation':   75,
  'closed-won':    100,
};

function stageToLocal(stage: string): Opportunity['stage'] {
  const map: Record<string, Opportunity['stage']> = {
    'Prospecting':   'prospecting',
    'Qualification': 'qualification',
    'Proposal':      'proposal',
    'Negotiation':   'negotiation',
    'Closed Won':    'closed-won',
  };
  return map[stage] ?? 'prospecting';
}

function getProbabilityColor(p: number): string {
  if (p >= 75) return 'bg-emerald-50 text-emerald-700';
  if (p >= 50) return 'bg-amber-50 text-amber-700';
  if (p >= 25) return 'bg-blue-50 text-blue-700';
  return 'bg-slate-100 text-slate-500';
}

function dealAgeLabel(createdAt: string): string {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1d';
  if (days < 30) return `${days}d`;
  return `${Math.floor(days / 30)}mo`;
}

function dealAgeColor(createdAt: string): string {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000);
  if (days > 60) return 'bg-red-50 text-red-600';
  if (days > 30) return 'bg-amber-50 text-amber-600';
  return 'bg-slate-100 text-slate-500';
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
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<DealContext | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editValue, setEditValue] = useState('');
  const [filterStage, setFilterStage] = useState<string>('');
  const [filterMinValue, setFilterMinValue] = useState('');
  const [filterMaxValue, setFilterMaxValue] = useState('');

  useEffect(() => {
    fetch('/api/deals')
      .then(r => r.json())
      .then(data => {
        if (data.deals) {
          setOpportunities(data.deals.map((d: any): Opportunity => ({
            id:              d.id,
            title:           d.title,
            value:           d.value,
            createdAt:       d.createdAt,
            probability:     STAGE_PROBABILITY[stageToLocal(d.stage)] ?? 50,
            owner:           'You',
            stage:           stageToLocal(d.stage),
            incumbentPlatform: d.incumbentPlatform,
            incumbentSI:     d.incumbentProvider,
            accountId:       d.accountId,
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleDealCreated = (event: Event) => {
      const data = (event as CustomEvent).detail as { title: string; value: number; accountId: string; stageName: string; dealId?: string };
      const stageKey = stageToLocal(data.stageName);
      const newDeal: Opportunity = {
        id:          data.dealId ?? Date.now().toString(),
        title:       data.title,
        value:       data.value,
        createdAt:   new Date().toISOString(),
        probability: STAGE_PROBABILITY[stageKey] ?? 50,
        owner:       'You',
        stage:       stageKey,
      };
      setOpportunities(prev => [newDeal, ...prev]);
    };
    window.addEventListener('dealCreated', handleDealCreated);
    return () => window.removeEventListener('dealCreated', handleDealCreated);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (!draggedId) return;
    const newStage = stageId as Opportunity['stage'];
    setOpportunities(prev => prev.map(opp => opp.id === draggedId
      ? { ...opp, stage: newStage, probability: STAGE_PROBABILITY[newStage] ?? opp.probability }
      : opp
    ));
    // Persist stage change to DB
    fetch(`/api/deals/${draggedId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: STAGES.find(s => s.id === stageId)?.label ?? stageId }),
    }).catch(() => {});
    setDraggedId(null);
  };

  const openPursuitModal = (opp: Opportunity) => {
    setActiveModal({
      id: opp.id, title: opp.title, value: opp.value, stage: opp.stage,
      owner: opp.owner, competitorId: opp.competitorId, saPartnerId: opp.saPartnerId, competitiveNotes: opp.competitiveNotes,
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

  const handleStartEdit = (opp: Opportunity) => {
    setEditingId(opp.id);
    setEditTitle(opp.title);
    setEditValue(String(opp.value));
  };

  const handleSaveEdit = async (oppId: string) => {
    const opp = opportunities.find(o => o.id === oppId);
    if (!opp) return;

    const newValue = parseFloat(editValue);
    if (isNaN(newValue)) {
      setEditingId(null);
      return;
    }

    setOpportunities(prev => prev.map(o => o.id === oppId
      ? { ...o, title: editTitle, value: newValue }
      : o
    ));

    await fetch(`/api/deals/${oppId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, value: newValue }),
    }).catch(() => {});

    setEditingId(null);
  };

  const filteredOpps = opportunities.filter(opp => {
    if (filterStage && opp.stage !== filterStage) return false;
    if (filterMinValue && opp.value < parseFloat(filterMinValue)) return false;
    if (filterMaxValue && opp.value > parseFloat(filterMaxValue)) return false;
    return true;
  });

  if (loading) return <KanbanSkeleton />;

  return (
    <div className="w-full">
      {/* Filter controls */}
      <div className="mb-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Stage</label>
          <select
            value={filterStage}
            onChange={e => setFilterStage(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All stages</option>
            {STAGES.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Min value</label>
          <input
            type="number"
            value={filterMinValue}
            onChange={e => setFilterMinValue(e.target.value)}
            placeholder="R 0"
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Max value</label>
          <input
            type="number"
            value={filterMaxValue}
            onChange={e => setFilterMaxValue(e.target.value)}
            placeholder="R ∞"
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {(filterStage || filterMinValue || filterMaxValue) && (
          <button
            onClick={() => { setFilterStage(''); setFilterMinValue(''); setFilterMaxValue(''); }}
            className="text-xs text-slate-500 hover:text-slate-700 font-medium underline"
          >
            Clear filters
          </button>
        )}
        <div className="ml-auto text-xs text-slate-400">
          {filteredOpps.length} of {opportunities.length} deals
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 pb-4">
        {STAGES.map((stage) => {
          const stageOpps = filteredOpps.filter(opp => opp.stage === stage.id);
          const stageValue = stageOpps.reduce((sum, opp) => sum + opp.value, 0);

          return (
            <div
              key={stage.id}
              className="flex flex-col bg-slate-50 rounded-xl border border-slate-200 p-3"
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, stage.id)}
            >
              <div className="mb-3 pb-3 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">{stage.label}</h2>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded-full">
                    {stageOpps.length}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{formatCurrency(stageValue)}</p>
              </div>

              <div className="flex flex-col gap-2.5 flex-1 min-h-80">
                {stageOpps.map(opp => (
                  <div
                    key={opp.id}
                    className={`bg-white rounded-lg border border-slate-200 p-3 shadow-xs hover:shadow-sm transition-all group ${draggedId === opp.id ? 'opacity-50 ring-2 ring-blue-300' : ''}`}
                  >
                    {/* Title + Quick Actions */}
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <div className="flex-1 min-w-0">
                        {editingId === opp.id ? (
                          <input
                            autoFocus
                            type="text"
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            onBlur={() => handleSaveEdit(opp.id)}
                            onKeyDown={e => e.key === 'Enter' && handleSaveEdit(opp.id)}
                            className="w-full text-sm font-medium text-slate-900 border border-blue-400 rounded px-2 py-1"
                          />
                        ) : (
                          <div
                            onClick={() => router.push(`/deals/${opp.id}`)}
                            onDoubleClick={e => { e.stopPropagation(); handleStartEdit(opp); }}
                            className="block text-sm font-medium text-slate-900 leading-snug hover:text-blue-600 cursor-pointer transition-colors truncate"
                            title="Click to view • Double-click to edit"
                          >
                            {opp.title}
                          </div>
                        )}
                      </div>
                      <DealQuickActions
                        dealId={opp.id}
                        dealTitle={opp.title}
                        onArchived={() => setOpportunities(prev => prev.filter(o => o.id !== opp.id))}
                        onDeleted={() => setOpportunities(prev => prev.filter(o => o.id !== opp.id))}
                      />
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        {editingId === opp.id ? (
                          <input
                            type="number"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onBlur={() => handleSaveEdit(opp.id)}
                            onKeyDown={e => e.key === 'Enter' && handleSaveEdit(opp.id)}
                            className="text-sm font-semibold text-slate-900 border border-blue-400 rounded px-2 py-1 w-28"
                          />
                        ) : (
                          <span
                            onClick={() => handleStartEdit(opp)}
                            className="font-semibold text-slate-900 cursor-pointer hover:text-blue-600 transition-colors"
                            title="Click to edit"
                          >
                            {formatCurrency(opp.value)}
                          </span>
                        )}
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${dealAgeColor(opp.createdAt)}`}>
                            {dealAgeLabel(opp.createdAt)}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${getProbabilityColor(opp.probability)}`}>
                            {opp.probability}%
                          </span>
                        </div>
                      </div>

                      {/* Drag handle (only this element is draggable) + owner */}
                      <div className="flex justify-between items-center text-slate-400">
                        <div
                          draggable
                          onDragStart={e => { e.stopPropagation(); setDraggedId(opp.id); e.dataTransfer.effectAllowed = 'move'; }}
                          onDragEnd={() => setDraggedId(null)}
                          className="flex items-center gap-1 cursor-grab active:cursor-grabbing select-none hover:text-slate-600 transition-colors"
                          title="Drag to move stage"
                        >
                          <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
                            <circle cx="7" cy="4" r="1.5"/><circle cx="13" cy="4" r="1.5"/>
                            <circle cx="7" cy="10" r="1.5"/><circle cx="13" cy="10" r="1.5"/>
                            <circle cx="7" cy="16" r="1.5"/><circle cx="13" cy="16" r="1.5"/>
                          </svg>
                          <span className="text-[10px]">drag</span>
                        </div>
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
                                onClick={e => { e.stopPropagation(); openPursuitModal(opp); }}
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

      {/* Summary stats */}
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
          <div className="text-2xl font-bold text-emerald-600">
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
        <DealPursuitModal deal={activeModal} onClose={() => setActiveModal(null)} onSave={handleModalSave} />
      )}
    </div>
  );
}
