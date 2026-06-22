'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/format';

const STAGE_COLORS: Record<string, string> = {
  Prospecting:   'bg-slate-100 text-slate-600',
  Qualification: 'bg-blue-50 text-blue-700',
  Proposal:      'bg-amber-50 text-amber-700',
  Negotiation:   'bg-orange-50 text-orange-700',
  'Closed Won':  'bg-emerald-50 text-emerald-700',
};

const STAGE_BAR_COLORS: Record<string, string> = {
  Prospecting:   'bg-slate-400',
  Qualification: 'bg-blue-400',
  Proposal:      'bg-amber-400',
  Negotiation:   'bg-orange-400',
  'Closed Won':  'bg-emerald-500',
};

const STAGE_PROBABILITY: Record<string, number> = {
  Prospecting: 0.10,
  Qualification: 0.25,
  Proposal: 0.50,
  Negotiation: 0.75,
  'Closed Won': 1.00,
};

const STAGES = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'] as const;

const fmt = formatCurrency;

const IconTrend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);
const IconTarget = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
const IconForecast = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);
const IconDeals = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex justify-between mb-3">
              <div className="h-3 bg-slate-200 rounded w-24" />
              <div className="w-8 h-8 rounded-lg bg-slate-100" />
            </div>
            <div className="h-8 bg-slate-200 rounded w-28 mb-2" />
            <div className="h-3 bg-slate-100 rounded w-20" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <div className="h-4 bg-slate-200 rounded w-32 mb-5" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="mb-4">
              <div className="h-3 bg-slate-100 rounded w-24 mb-2" />
              <div className="h-2 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="h-4 bg-slate-200 rounded w-24" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-6 py-3.5 border-b border-slate-100">
              <div className="w-7 h-7 rounded-full bg-slate-200 flex-shrink-0" />
              <div className="flex-1">
                <div className="h-3 bg-slate-200 rounded w-40 mb-1.5" />
                <div className="h-2.5 bg-slate-100 rounded w-24" />
              </div>
              <div className="h-5 bg-slate-100 rounded w-20" />
              <div className="h-3 bg-slate-200 rounded w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
        <IconDeals />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">Your pipeline is empty</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-xs">Create your first deal to start tracking revenue and get pipeline insights.</p>
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('openNewDealModal'))}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all"
      >
        <IconPlus /> Create your first deal
      </button>
    </div>
  );
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [deals, setDeals] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/deals')
      .then(r => r.json())
      .then(data => {
        setDeals(data.deals || []);
        setStats(data.stats || {});
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const monthLabel = now.toLocaleString('default', { month: 'long' });

  const dealsThisMonth = useMemo(() =>
    deals.filter(d => {
      const created = new Date(d.createdAt);
      return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth();
    }), [deals]);

  const totalPipeline = stats?.totalPipeline ?? 0;
  const closedWonValue = deals
    .filter(d => d.stage === 'Closed Won')
    .reduce((sum: number, d: any) => sum + d.value, 0);
  const closedWonCount = stats?.byStage?.['Closed Won'] ?? 0;
  const winRate = deals.length > 0 ? Math.round((closedWonCount / deals.length) * 100) : 0;
  const weightedForecast = deals.reduce((sum: number, d: any) =>
    sum + d.value * (STAGE_PROBABILITY[d.stage] ?? 0), 0);
  const avgDeal = deals.length > 0 ? totalPipeline / deals.length : 0;

  const filteredDeals = useMemo(() =>
    deals.filter(d =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.account?.name ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    ), [deals, searchQuery]);

  if (loading) return <DashboardSkeleton />;
  if (deals.length === 0) return <EmptyDashboard />;

  const kpis = [
    {
      label: 'Total Pipeline',
      value: fmt(totalPipeline),
      sub: `${deals.length} open deal${deals.length !== 1 ? 's' : ''}`,
      Icon: IconTrend,
      accent: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Win Rate',
      value: `${winRate}%`,
      sub: `${closedWonCount} deal${closedWonCount !== 1 ? 's' : ''} closed won`,
      Icon: IconTarget,
      accent: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Weighted Forecast',
      value: fmt(weightedForecast),
      sub: 'Probability-weighted value',
      Icon: IconForecast,
      accent: 'text-amber-600 bg-amber-50',
    },
    {
      label: `Deals in ${monthLabel}`,
      value: `${dealsThisMonth.length}`,
      sub: `Avg size ${fmt(avgDeal)}`,
      Icon: IconDeals,
      accent: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map(({ label, value, sub, Icon, accent }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent}`}>
                <Icon />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight mb-1">{value}</p>
            <p className="text-xs text-slate-500">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Pipeline by Stage */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-sm font-semibold text-slate-900 mb-5">Pipeline by Stage</h2>
          <div className="space-y-4">
            {STAGES.map((stageName) => {
              const count = stats?.byStage?.[stageName] ?? 0;
              const value = deals
                .filter(d => d.stage === stageName)
                .reduce((sum: number, d: any) => sum + d.value, 0);
              const pct = totalPipeline > 0 ? (value / totalPipeline) * 100 : 0;

              return (
                <div key={stageName}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-slate-700">{stageName}</span>
                    <span className="text-xs text-slate-500">{count} deal{count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${STAGE_BAR_COLORS[stageName]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-slate-500">{fmt(value)}</span>
                    {pct > 0 && <span className="text-xs text-slate-400">{pct.toFixed(0)}%</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-500 mb-0.5">Total pipeline</p>
              <p className="font-semibold text-slate-900 text-sm">{fmt(totalPipeline)}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-0.5">Avg deal size</p>
              <p className="font-semibold text-slate-900 text-sm">{fmt(avgDeal)}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-0.5">Closed won</p>
              <p className="font-semibold text-emerald-600 text-sm">{fmt(closedWonValue)}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-0.5">Weighted forecast</p>
              <p className="font-semibold text-amber-600 text-sm">{fmt(weightedForecast)}</p>
            </div>
          </div>
        </div>

        {/* Recent Deals */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Recent Deals</h2>
            <Link href="/pipeline" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View all <IconArrow />
            </Link>
          </div>

          {/* Search */}
          <div className="px-6 py-3 border-b border-slate-100 bg-slate-50">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 pointer-events-none">
                <IconSearch />
              </span>
              <input
                type="text"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Deals List */}
          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
            {filteredDeals.length > 0 ? (
              filteredDeals.slice(0, 6).map((deal) => {
                const initials = (deal.account?.name || deal.title || 'XX')
                  .split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
                const age = Math.floor((Date.now() - new Date(deal.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                const ageLabel = age === 0 ? 'Today' : age === 1 ? 'Yesterday' : `${age}d ago`;
                return (
                  <Link
                    key={deal.id}
                    href={`/deals/${deal.id}`}
                    className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">{deal.title}</p>
                      <p className="text-xs text-slate-500 truncate">{deal.account?.name || 'No account'}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${STAGE_COLORS[deal.stage] ?? 'bg-slate-100 text-slate-600'}`}>
                      {deal.stage}
                    </span>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-slate-900">{fmt(deal.value)}</p>
                      <p className="text-xs text-slate-400">{ageLabel}</p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-center px-6">
                <p className="text-sm text-slate-500">No deals match your search</p>
                <button onClick={() => setSearchQuery('')} className="text-xs text-blue-600 mt-1 hover:underline">Clear search</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('openNewDealModal'))}
          className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
            <IconPlus />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">New Deal</p>
            <p className="text-xs text-slate-500">Add an opportunity to your pipeline</p>
          </div>
          <span className="ml-auto text-slate-300 group-hover:text-blue-400 transition-colors"><IconArrow /></span>
        </button>
        <Link
          href="/accounts"
          className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600">
              <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Manage Accounts</p>
            <p className="text-xs text-slate-500">View and add business accounts</p>
          </div>
          <span className="ml-auto text-slate-300 group-hover:text-blue-400 transition-colors"><IconArrow /></span>
        </Link>
      </div>
    </div>
  );
}
