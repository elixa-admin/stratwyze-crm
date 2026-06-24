'use client';

import DashboardV2 from '@/components/DashboardV2';
import KanbanBoard from '@/components/pipeline/KanbanBoard';
import { useState } from 'react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import PageHeader from '@/components/shared/PageHeader';

export default function DashboardPage() {
  const [view, setView] = useState<'metrics' | 'pipeline'>('metrics');

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          subtitle="Your sales pipeline at a glance — metrics, deals, and quick actions."
          action={
            <div className="flex items-center gap-1 bg-white/20 rounded-lg p-1 border border-white/20">
              <button
                onClick={() => setView('metrics')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  view === 'metrics' ? 'bg-white text-blue-700 shadow-sm' : 'text-white/80 hover:text-white'
                }`}
              >
                Metrics
              </button>
              <button
                onClick={() => setView('pipeline')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  view === 'pipeline' ? 'bg-white text-blue-700 shadow-sm' : 'text-white/80 hover:text-white'
                }`}
              >
                Pipeline
              </button>
            </div>
          }
        />

        {view === 'metrics' && <DashboardV2 />}
        {view === 'pipeline' && <KanbanBoard />}
      </div>
    </div>
  );
}
