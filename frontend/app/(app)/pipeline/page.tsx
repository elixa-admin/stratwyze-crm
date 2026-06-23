'use client';

import { useState, useEffect } from 'react';
import KanbanBoard from '@/components/pipeline/KanbanBoard';
import PipelineFilters from '@/components/pipeline/PipelineFilters';

interface FilterState {
  account?: string;
  contact?: string;
  stage?: string;
  dateFrom?: string;
  dateTo?: string;
}

export default function PipelinePage() {
  const [filters, setFilters] = useState<FilterState>({});
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/accounts')
      .then(r => r.json())
      .then(data => {
        if (data.accounts) setAccounts(data.accounts);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Pipeline</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and track your active deals.</p>
        </div>
        <PipelineFilters onFilterChange={setFilters} accounts={accounts} />
      </div>
      <KanbanBoard filters={filters} />
    </div>
  );
}
