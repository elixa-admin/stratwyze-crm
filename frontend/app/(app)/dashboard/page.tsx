'use client';

import DashboardV2 from '@/components/DashboardV2';
import KanbanBoard from '@/components/pipeline/KanbanBoard';
import { useState } from 'react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

export default function DashboardPage() {
  const [view, setView] = useState<'metrics' | 'pipeline'>('metrics');

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Your sales pipeline at a glance — metrics, deals, and quick actions.</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setView('metrics')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === 'metrics' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Metrics
            </button>
            <button
              onClick={() => setView('pipeline')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === 'pipeline' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Pipeline
            </button>
          </div>
        </div>

        {view === 'metrics' && <DashboardV2 />}
        {view === 'pipeline' && <KanbanBoard />}
      </div>
    </div>
  );
}
