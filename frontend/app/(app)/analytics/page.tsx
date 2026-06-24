'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';

interface AnalyticsData {
  summary: {
    totalPipeline: number;
    wonValue: number;
    avgDealSize: number;
    winRate: number;
  };
  pipelineByStage: { stage: string; deals: number; value: number }[];
  dealVelocity: { leads: number; qualified: number; proposals: number; closedWon: number };
  sourceData: { name: string; count: number; pct: number }[];
  monthlyTrend: { month: string; deals: number; value: number }[];
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `R${(n / 1_000).toFixed(0)}K`;
  return `R${n}`;
}

const SOURCE_COLORS = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500'];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxPipelineValue = data
    ? Math.max(...data.pipelineByStage.map(s => s.value), 1)
    : 1;

  const maxMonthlyDeals = data
    ? Math.max(...data.monthlyTrend.map(m => m.deals), 1)
    : 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Live pipeline data and sales performance"
        action={
          <select className="px-3 py-1.5 rounded-lg border border-white/30 text-sm bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50">
            <option className="text-slate-900">All Time</option>
            <option className="text-slate-900">This Quarter</option>
            <option className="text-slate-900">This Month</option>
          </select>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center h-64 text-sm text-slate-400">Loading analytics…</div>
      ) : !data ? (
        <div className="flex items-center justify-center h-64 text-sm text-red-500">Failed to load analytics data</div>
      ) : (
        <>
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Pipeline Value', value: fmt(data.summary.totalPipeline), sub: 'open deals combined' },
              { label: 'Won Value', value: fmt(data.summary.wonValue), sub: 'closed won revenue' },
              { label: 'Avg Deal Size', value: fmt(data.summary.avgDealSize), sub: 'across open pipeline' },
              { label: 'Win Rate', value: `${data.summary.winRate}%`, sub: 'won vs all closed' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl border border-slate-200 px-5 py-4 shadow-xs">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1.5">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deals trend by month */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-base font-semibold text-slate-900 mb-4">Deals Created — Last 6 Months</h2>
              {data.monthlyTrend.every(m => m.deals === 0) ? (
                <div className="flex items-center justify-center h-36 text-xs text-slate-400">No deals in the last 6 months</div>
              ) : (
                <div className="flex items-end justify-between h-36 gap-2">
                  {data.monthlyTrend.map(m => (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-medium text-blue-600">{m.deals > 0 ? m.deals : ''}</span>
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-md min-h-[4px] transition-all"
                        style={{ height: `${Math.max((m.deals / maxMonthlyDeals) * 100, 4)}%` }}
                      />
                      <p className="text-xs text-slate-500">{m.month}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Revenue by source */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-base font-semibold text-slate-900 mb-4">Deals by Source</h2>
              {data.sourceData.length === 0 ? (
                <div className="flex items-center justify-center h-36 text-xs text-slate-400">No lead source data yet — set lead source on your deals</div>
              ) : (
                <div className="space-y-3">
                  {data.sourceData.map((src, idx) => (
                    <div key={src.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-900">{src.name}</span>
                        <span className="text-sm text-slate-500">{src.count} deal{src.count !== 1 ? 's' : ''} · {src.pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${SOURCE_COLORS[idx % SOURCE_COLORS.length]}`}
                          style={{ width: `${src.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pipeline by stage */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-base font-semibold text-slate-900 mb-5">Pipeline by Stage</h2>
            {data.pipelineByStage.filter(s => s.deals > 0).length === 0 ? (
              <div className="flex items-center justify-center h-24 text-xs text-slate-400">No open deals in the pipeline</div>
            ) : (
              <div className="space-y-4">
                {data.pipelineByStage.filter(s => s.deals > 0).map(stage => (
                  <div key={stage.stage}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium text-slate-900">{stage.stage}</span>
                      <span className="text-sm text-slate-500">{stage.deals} deal{stage.deals !== 1 ? 's' : ''} · {fmt(stage.value)}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        style={{ width: `${(stage.value / maxPipelineValue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Deal velocity */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-base font-semibold text-slate-900 mb-5">Deal Velocity</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Leads', value: data.dealVelocity.leads, color: 'bg-blue-50 text-blue-700' },
                { label: 'Qualified', value: data.dealVelocity.qualified, color: 'bg-purple-50 text-purple-700' },
                { label: 'Proposals', value: data.dealVelocity.proposals, color: 'bg-amber-50 text-amber-700' },
                { label: 'Closed Won', value: data.dealVelocity.closedWon, color: 'bg-emerald-50 text-emerald-700' },
              ].map(item => (
                <div key={item.label} className={`${item.color} rounded-xl p-4 text-center`}>
                  <p className="text-3xl font-bold">{item.value}</p>
                  <p className="text-xs font-medium mt-1 opacity-80">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
