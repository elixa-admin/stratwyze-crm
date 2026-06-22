'use client';

import KanbanBoard from '@/components/pipeline/KanbanBoard';

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Pipeline</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage and track your active deals.</p>
      </div>
      <KanbanBoard />
    </div>
  );
}
