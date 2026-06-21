'use client';

import { useState } from 'react';

interface Opportunity {
  id: string;
  title: string;
  value: number;
  closeDate: string;
  probability: number;
  owner: string;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won';
}

const MOCK_OPPORTUNITIES: Opportunity[] = [
  { id: '1', title: 'Acme Enterprise Deal', value: 250000, closeDate: '2026-07-15', probability: 85, owner: 'AB', stage: 'prospecting' },
  { id: '2', title: 'Global Corp Renewal', value: 180000, closeDate: '2026-06-30', probability: 92, owner: 'MR', stage: 'qualification' },
  { id: '3', title: 'TechStart Initial', value: 45000, closeDate: '2026-08-20', probability: 60, owner: 'JD', stage: 'proposal' },
  { id: '4', title: 'Fortune 500 Discussion', value: 500000, closeDate: '2026-09-10', probability: 35, owner: 'SJ', stage: 'prospecting' },
  { id: '5', title: 'Mid-Market Close', value: 120000, closeDate: '2026-06-15', probability: 78, owner: 'AB', stage: 'negotiation' },
  { id: '6', title: 'SMB Quick Close', value: 35000, closeDate: '2026-05-30', probability: 100, owner: 'MR', stage: 'closed-won' },
  { id: '7', title: 'Enterprise Pilot', value: 85000, closeDate: '2026-07-01', probability: 55, owner: 'JD', stage: 'proposal' },
  { id: '8', title: 'Channel Partner Deal', value: 95000, closeDate: '2026-07-20', probability: 72, owner: 'SJ', stage: 'qualification' },
];

const STAGES = [
  { id: 'prospecting', label: 'Prospecting', color: 'bg-red-50' },
  { id: 'qualification', label: 'Qualification', color: 'bg-amber-50' },
  { id: 'proposal', label: 'Proposal', color: 'bg-blue-50' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-purple-50' },
  { id: 'closed-won', label: 'Closed Won', color: 'bg-green-50' },
];

function getProbabilityColor(probability: number): string {
  if (probability >= 80) return 'bg-green-100 text-green-700';
  if (probability >= 50) return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

function formatCurrency(value: number): string {
  return `$${(value / 1000).toFixed(0)}K`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function KanbanBoard() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [draggedId, setDraggedId] = useState<string | null>(null);

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

    setOpportunities((prev) =>
      prev.map((opp) =>
        opp.id === draggedId ? { ...opp, stage: stage as Opportunity['stage'] } : opp
      )
    );
    setDraggedId(null);
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pipeline</h1>
          <p className="text-slate-600 mt-1">Manage your sales opportunities</p>
        </div>
        <button className="px-4 py-2.5 rounded-lg text-sm font-600 bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-sm">
          + Add Opportunity
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageOpps = opportunities.filter((opp) => opp.stage === stage.id);
          const stageValue = stageOpps.reduce((sum, opp) => sum + opp.value, 0);

          return (
            <div
              key={stage.id}
              className="flex flex-col bg-slate-50 rounded-lg border border-slate-200 p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Stage Header */}
              <div className="mb-4 pb-3 border-b border-slate-200">
                <h2 className="font-600 text-slate-900">{stage.label}</h2>
                <p className="text-xs text-slate-600 mt-1">
                  {stageOpps.length} deals · {formatCurrency(stageValue)}
                </p>
              </div>

              {/* Cards Container */}
              <div className="flex flex-col gap-3 flex-1 min-h-96">
                {stageOpps.map((opp) => (
                  <div
                    key={opp.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, opp.id)}
                    className="bg-white rounded-lg border border-slate-200 p-3 shadow-xs hover:shadow-sm transition-all cursor-grab active:cursor-grabbing"
                  >
                    <p className="font-500 text-sm text-slate-900 mb-2">{opp.title}</p>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-600 text-slate-900">{formatCurrency(opp.value)}</span>
                        <span className={`px-2 py-0.5 rounded font-600 ${getProbabilityColor(opp.probability)}`}>
                          {opp.probability}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-slate-600">
                        <span>📅 {formatDate(opp.closeDate)}</span>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                          {opp.owner}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {stageOpps.length === 0 && (
                  <div className="flex items-center justify-center flex-1 text-slate-400 text-sm">
                    Drop cards here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
          <div className="text-xs font-700 uppercase text-slate-500 mb-2">Total Pipeline</div>
          <div className="text-2xl font-bold text-slate-900">
            {formatCurrency(opportunities.reduce((sum, opp) => sum + opp.value, 0))}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
          <div className="text-xs font-700 uppercase text-slate-500 mb-2">Weighted Forecast</div>
          <div className="text-2xl font-bold text-slate-900">
            {formatCurrency(
              opportunities.reduce((sum, opp) => sum + opp.value * (opp.probability / 100), 0)
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
          <div className="text-xs font-700 uppercase text-slate-500 mb-2">Closed Won</div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(opportunities.filter((o) => o.stage === 'closed-won').reduce((sum, opp) => sum + opp.value, 0))}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
          <div className="text-xs font-700 uppercase text-slate-500 mb-2">Average Deal</div>
          <div className="text-2xl font-bold text-slate-900">
            {opportunities.length > 0
              ? formatCurrency(opportunities.reduce((sum, opp) => sum + opp.value, 0) / opportunities.length)
              : '$0'}
          </div>
        </div>
      </div>
    </div>
  );
}
