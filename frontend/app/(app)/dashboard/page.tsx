'use client';

import Dashboard from '@/components/Dashboard';
import KanbanBoard from '@/components/pipeline/KanbanBoard';
import { useState } from 'react';

export default function DashboardPage() {
  const [view, setView] = useState<'metrics' | 'pipeline'>('metrics');

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Welcome back — here&apos;s your pipeline at a glance.</p>
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

      {view === 'metrics' && <Dashboard />}
      {view === 'pipeline' && <KanbanBoard />}
    </div>
  );
}
