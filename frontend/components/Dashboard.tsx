'use client';

const MOCK = {
  totalPipeline: 2340000,
  winRate: 34,
  forecast: 890000,
  dealsThisMonth: 7,
  stages: [
    { label: 'Prospecting', count: 12, value: 880000 },
    { label: 'Qualification', count: 8, value: 620000 },
    { label: 'Proposal', count: 5, value: 430000 },
    { label: 'Negotiation', count: 3, value: 310000 },
    { label: 'Closed Won', count: 6, value: 100000 },
  ],
  recentDeals: [
    { name: 'Acme Enterprise Deal', company: 'Acme Corp', value: '$250K', stage: 'Negotiation', owner: 'AB', delta: '+12%' },
    { name: 'Global Corp Renewal', company: 'Global Inc', value: '$180K', stage: 'Proposal', owner: 'MR', delta: '+8%' },
    { name: 'TechStart Initial', company: 'TechStart', value: '$45K', stage: 'Qualification', owner: 'JD', delta: 'New' },
    { name: 'Fortune 500 Discussion', company: 'Fortune500', value: '$500K', stage: 'Prospecting', owner: 'SJ', delta: 'New' },
    { name: 'Mid-Market Close', company: 'MidCo', value: '$120K', stage: 'Negotiation', owner: 'AB', delta: '+5%' },
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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
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

const fmt = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${Math.round(n / 1000)}K`;

export default function Dashboard() {
  const total = MOCK.stages.reduce((s, st) => s + st.value, 0);

  const kpis = [
    { label: 'Total Pipeline', value: fmt(MOCK.totalPipeline), sub: '+12.5% this month', Icon: IconTrend, accent: 'text-blue-600 bg-blue-50' },
    { label: 'Win Rate', value: `${MOCK.winRate}%`, sub: 'Closed Won / Total Closed', Icon: IconTarget, accent: 'text-emerald-600 bg-emerald-50' },
    { label: 'Forecast', value: fmt(MOCK.forecast), sub: 'Open opportunities', Icon: IconForecast, accent: 'text-amber-600 bg-amber-50' },
    { label: 'Deals This Month', value: `${MOCK.dealsThisMonth}`, sub: 'Created in June', Icon: IconDeals, accent: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map(({ label, value, sub, Icon, accent }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent}`}>
                <Icon />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
            <p className="text-xs text-slate-500 mt-1.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Pipeline by Stage */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-sm font-semibold text-slate-900 mb-5">Pipeline by Stage</h2>
          <div className="space-y-4">
            {MOCK.stages.map((stage) => (
              <div key={stage.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm text-slate-700">{stage.label}</span>
                  <span className="text-xs text-slate-500">{stage.count} deals · {fmt(stage.value)}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${(stage.value / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500">
            <span>Total opportunities: <strong className="text-slate-900">34</strong></span>
            <span>Avg deal: <strong className="text-slate-900">{fmt(MOCK.totalPipeline / 34)}</strong></span>
          </div>
        </div>

        {/* Recent Deals */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Recent Deals</h2>
            <a href="/pipeline" className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all</a>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK.recentDeals.map((deal) => (
              <div key={deal.name} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {deal.owner}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{deal.name}</p>
                  <p className="text-xs text-slate-500 truncate">{deal.company}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${STAGE_COLORS[deal.stage] ?? 'bg-slate-100 text-slate-600'}`}>
                  {deal.stage}
                </span>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-slate-900">{deal.value}</p>
                  <p className="text-xs text-emerald-600">{deal.delta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
