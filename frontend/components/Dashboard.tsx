'use client';

import { useState, useMemo, useEffect } from 'react';

const MOCK = {
  totalPipeline: 2340000,
  winRate: 34,
  forecast: 890000,
  dealsThisMonth: 7,
  pipelineChange: 12.5,
  winRateChange: 2.3,
  forecastChange: -5.2,
  stages: [
    { label: 'Prospecting', count: 12, value: 880000 },
    { label: 'Qualification', count: 8, value: 620000 },
    { label: 'Proposal', count: 5, value: 430000 },
    { label: 'Negotiation', count: 3, value: 310000 },
    { label: 'Closed Won', count: 6, value: 100000 },
  ],
  recentDeals: [
    { id: 1, name: 'Acme Enterprise Deal', company: 'Acme Corp', value: 250000, stage: 'Negotiation', owner: 'AB', delta: '+12%', probability: 75 },
    { id: 2, name: 'Global Corp Renewal', company: 'Global Inc', value: 180000, stage: 'Proposal', owner: 'MR', delta: '+8%', probability: 60 },
    { id: 3, name: 'TechStart Initial', company: 'TechStart', value: 45000, stage: 'Qualification', owner: 'JD', delta: 'New', probability: 30 },
    { id: 4, name: 'Fortune 500 Discussion', company: 'Fortune500', value: 500000, stage: 'Prospecting', owner: 'SJ', delta: 'New', probability: 15 },
    { id: 5, name: 'Mid-Market Close', company: 'MidCo', value: 120000, stage: 'Negotiation', owner: 'AB', delta: '+5%', probability: 70 },
  ],
};

const STAGE_COLORS: Record<string, string> = {
  Prospecting: 'bg-slate-100 text-slate-600',
  Qualification: 'bg-blue-50 text-blue-700',
  Proposal: 'bg-amber-50 text-amber-700',
  Negotiation: 'bg-orange-50 text-orange-700',
  'Closed Won': 'bg-emerald-50 text-emerald-700',
};

const IconTrend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);
const IconTrendDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
  </svg>
);
const IconTarget = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
const IconForecast = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);
const IconDeals = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

const fmt = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${Math.round(n / 1000)}K`;

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [deals, setDeals] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch('/api/deals');
        const data = await response.json();
        setDeals(data.deals || []);
        setStats(data.stats || {});
      } catch (err) {
        console.error('Failed to fetch deals:', err);
        // Fallback to mock data if API fails
        setDeals(MOCK.recentDeals);
        setStats({
          totalPipeline: MOCK.totalPipeline,
          winRate: MOCK.winRate,
          byStage: MOCK.stages.reduce((acc: any, s) => {
            acc[s.label] = s.count;
            return acc;
          }, {}),
        });
      }
    };

    fetchDeals();
  }, []);

  const total = stats?.totalPipeline || MOCK.totalPipeline;

  const filteredDeals = useMemo(() => {
    return deals.filter(deal =>
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.account?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, deals]);

  const closedWon = deals.filter(d => d.stage === 'Closed Won').reduce((sum: number, d: any) => sum + d.value, 0);
  const winRate = deals.length > 0 ? ((stats?.byStage?.['Closed Won'] || 0) / deals.length) * 100 : 0;

  const kpis = [
    {
      label: 'Total Pipeline',
      value: fmt(stats?.totalPipeline || MOCK.totalPipeline),
      change: MOCK.pipelineChange,
      Icon: IconTrend,
      accent: 'text-blue-600 bg-blue-50',
      changeIcon: MOCK.pipelineChange >= 0 ? IconTrend : IconTrendDown,
      changeColor: MOCK.pipelineChange >= 0 ? 'text-emerald-600' : 'text-red-600',
    },
    {
      label: 'Win Rate',
      value: `${winRate.toFixed(0)}%`,
      change: MOCK.winRateChange,
      Icon: IconTarget,
      accent: 'text-emerald-600 bg-emerald-50',
      changeIcon: MOCK.winRateChange >= 0 ? IconTrend : IconTrendDown,
      changeColor: MOCK.winRateChange >= 0 ? 'text-emerald-600' : 'text-red-600',
    },
    {
      label: 'Forecast',
      value: fmt(closedWon || MOCK.forecast),
      change: MOCK.forecastChange,
      Icon: IconForecast,
      accent: 'text-amber-600 bg-amber-50',
      changeIcon: MOCK.forecastChange >= 0 ? IconTrend : IconTrendDown,
      changeColor: MOCK.forecastChange >= 0 ? 'text-emerald-600' : 'text-red-600',
    },
    {
      label: 'Deals This Month',
      value: `${deals.length}`,
      change: null,
      Icon: IconDeals,
      accent: 'text-purple-600 bg-purple-50',
      changeIcon: null,
      changeColor: 'text-slate-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards with Trends */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map(({ label, value, change, Icon, accent, changeIcon: ChangeIcon, changeColor }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent}`}>
                <Icon />
              </div>
            </div>
            <div className="mb-2">
              <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
            </div>
            {change !== null && ChangeIcon ? (
              <div className={`flex items-center gap-1 text-xs font-medium ${changeColor}`}>
                <ChangeIcon />
                <span>{Math.abs(change)}% vs last month</span>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Created in June</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Pipeline by Stage */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-sm font-semibold text-slate-900 mb-5">Pipeline by Stage</h2>
          <div className="space-y-4">
            {(['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'] as const).map((stageName) => {
              const count = stats?.byStage?.[stageName] || 0;
              const value = deals
                .filter(d => d.stage === stageName)
                .reduce((sum: number, d: any) => sum + d.value, 0);

              return (
                <div key={stageName}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-slate-700">{stageName}</span>
                    <span className="text-xs text-slate-500">{count} deals</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{fmt(value)}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-500">Total</p>
                <p className="font-semibold text-slate-900 text-sm">{fmt(stats?.totalPipeline || 0)}</p>
              </div>
              <div>
                <p className="text-slate-500">Avg deal</p>
                <p className="font-semibold text-slate-900 text-sm">{fmt(deals.length > 0 ? (stats?.totalPipeline || 0) / deals.length : 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Deals */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-900">Recent Deals</h2>
            <a href="/pipeline" className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all →</a>
          </div>

          {/* Search */}
          <div className="px-6 py-3 border-b border-slate-100 bg-slate-50">
            <div className="relative">
              <IconSearch />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              />
            </div>
          </div>

          {/* Deals List */}
          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
            {filteredDeals.length > 0 ? (
              filteredDeals.slice(0, 5).map((deal) => {
                const initials = (deal.account?.name || 'XX').split(' ').map((n: string) => n[0]).join('').toUpperCase();
                return (
                  <div key={deal.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {initials.substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{deal.title}</p>
                      <p className="text-xs text-slate-500 truncate">{deal.account?.name || 'Unassigned'}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap ${STAGE_COLORS[deal.stage] ?? 'bg-slate-100 text-slate-600'}`}>
                      {deal.stage}
                    </span>
                    <div className="text-right flex-shrink-0 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{fmt(deal.value)}</p>
                      <p className="text-xs font-medium text-slate-500">New</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-24 text-sm text-slate-500">
                No deals found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
