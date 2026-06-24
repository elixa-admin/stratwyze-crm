'use client';

import { useState, useEffect } from 'react';
import KanbanBoard from '@/components/pipeline/KanbanBoard';
import PipelineFilters from '@/components/pipeline/PipelineFilters';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import PageHeader from '@/components/shared/PageHeader';

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
    <div>
      <Breadcrumbs items={[{ label: 'Pipeline' }]} />
      <div className="space-y-6">
        <PageHeader
          title="Pipeline"
          subtitle="Manage and track your active deals."
          action={<PipelineFilters onFilterChange={setFilters} accounts={accounts} />}
        />
        <KanbanBoard filters={filters} />
      </div>
    </div>
  );
}
