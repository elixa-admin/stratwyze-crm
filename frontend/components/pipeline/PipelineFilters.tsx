'use client';

import { useState } from 'react';

interface FilterState {
  account?: string;
  contact?: string;
  stage?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface PipelineFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  accounts?: any[];
}

const STAGES = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

export default function PipelineFilters({ onFilterChange, accounts = [] }: PipelineFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({});
  const [open, setOpen] = useState(false);

  const activeFilterCount = Object.values(filters).filter(v => v).length;

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearAll = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors flex items-center gap-2 ${
          activeFilterCount > 0
            ? 'bg-blue-50 border-blue-200 text-blue-700'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
      >
        🔍 Filters
        {activeFilterCount > 0 && (
          <span className="ml-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-600 text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 bg-white rounded-lg border border-slate-200 shadow-lg z-50 w-80 p-4 space-y-4">
          {/* Account Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Account</label>
            <select
              value={filters.account || ''}
              onChange={e => handleFilterChange('account', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            >
              <option value="">All accounts</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stage Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Stage</label>
            <select
              value={filters.stage || ''}
              onChange={e => handleFilterChange('stage', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            >
              <option value="">All stages</option>
              {STAGES.map(stage => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">From</label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={e => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">To</label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={e => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          {activeFilterCount > 0 && (
            <button
              onClick={handleClearAll}
              className="w-full px-3 py-2 text-sm font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
