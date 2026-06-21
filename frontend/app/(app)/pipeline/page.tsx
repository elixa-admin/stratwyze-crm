'use client';

import KanbanBoard from '@/components/pipeline/KanbanBoard';

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Pipeline</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and track your active deals.</p>
        </div>
        <button className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm">
          Add Deal
        </button>
      </div>
      <KanbanBoard />
    </div>
  );
}
