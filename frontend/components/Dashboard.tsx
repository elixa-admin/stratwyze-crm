'use client';

import { useEffect, useState } from 'react';

interface Metrics {
  total_pipeline_value: number;
  win_rate_percent: number;
  forecast_value: number;
  deals_this_month: number;
  pipeline_by_stage: Record<string, { count: number; value: number }>;
  total_opportunities: number;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/dashboard/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-slate-600 py-16">Loading dashboard...</div>;
  }

  if (!metrics) {
    return <div className="text-center text-slate-500 py-16">No data available</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Good morning, Anthony</h1>
        <p className="text-slate-600 mt-2">Here's what's happening with your business today</p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Pipeline Value */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="section-label">Total Pipeline</div>
            <div className="text-2xl">📈</div>
          </div>
          <p className="text-4xl font-bold text-slate-900">
            ${Math.round(metrics.total_pipeline_value / 1000)}K
          </p>
          <p className="text-sm text-slate-600 mt-2">+12.5% this month</p>
        </div>

        {/* Win Rate */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="section-label">Win Rate</div>
            <div className="text-2xl">🎯</div>
          </div>
          <p className="text-4xl font-bold text-slate-900">
            {metrics.win_rate_percent.toFixed(0)}%
          </p>
          <p className="text-sm text-slate-600 mt-2">Closed Won / Total Closed</p>
        </div>

        {/* Forecast */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="section-label">Forecast</div>
            <div className="text-2xl">⚡</div>
          </div>
          <p className="text-4xl font-bold text-slate-900">
            ${Math.round(metrics.forecast_value / 1000)}K
          </p>
          <p className="text-sm text-slate-600 mt-2">Open opportunities</p>
        </div>

        {/* Deals This Month */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs hover:shadow-sm transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="section-label">Deals Created</div>
            <div className="text-2xl">✨</div>
          </div>
          <p className="text-4xl font-bold text-slate-900">
            {metrics.deals_this_month}
          </p>
          <p className="text-sm text-slate-600 mt-2">This month</p>
        </div>
      </div>

      {/* Pipeline by Stage */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Pipeline by Stage</h2>
        <div className="space-y-6">
          {Object.entries(metrics.pipeline_by_stage).map(([stage, data]) => (
            <div key={stage}>
              <div className="flex justify-between items-center mb-3">
                <p className="font-600 text-slate-900">{stage}</p>
                <p className="text-sm font-500 text-slate-600">
                  {data.count} deals · ${Math.round(data.value / 1000)}K
                </p>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (data.value / (metrics.total_pipeline_value || 1)) * 100,
                      100
                    )}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-500">Total Opportunities</span>
              <span className="font-bold text-slate-900">{metrics.total_opportunities}</span>
            </div>
            <div className="border-t border-slate-200"></div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-500">Avg Deal Size</span>
              <span className="font-bold text-slate-900">
                ${Math.round(
                  metrics.total_pipeline_value / (metrics.total_opportunities || 1) / 1000
                )}K
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Pipeline Health</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-500">Momentum</span>
              <span className={`font-bold ${metrics.deals_this_month > 2 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {metrics.deals_this_month > 2 ? '↑ Strong' : '→ Moderate'}
              </span>
            </div>
            <div className="border-t border-slate-200"></div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-500">Conversion</span>
              <span className={`font-bold ${metrics.win_rate_percent > 25 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {metrics.win_rate_percent > 25 ? '✓ Good' : '△ Review'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
