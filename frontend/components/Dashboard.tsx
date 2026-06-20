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
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  if (!metrics) {
    return <div className="p-8 text-center text-gray-600">No data available</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">CEO Dashboard</h1>

        {/* Top 4 Metric Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Total Pipeline Value */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow border-l-4 border-blue-600">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Pipeline</p>
            <p className="text-3xl font-bold text-blue-600 mt-3">
              ${Math.round(metrics.total_pipeline_value).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">Weighted by probability</p>
          </div>

          {/* Win Rate */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow border-l-4 border-green-600">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Win Rate</p>
            <p className="text-3xl font-bold text-green-600 mt-3">
              {metrics.win_rate_percent.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-2">Closed Won / Total Closed</p>
          </div>

          {/* Sales Forecast */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow border-l-4 border-purple-600">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Forecast</p>
            <p className="text-3xl font-bold text-purple-600 mt-3">
              ${Math.round(metrics.forecast_value).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">Open opportunities</p>
          </div>

          {/* Deals This Month */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow border-l-4 border-amber-600">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Deals Created</p>
            <p className="text-3xl font-bold text-amber-600 mt-3">
              {metrics.deals_this_month}
            </p>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </div>
        </div>

        {/* Pipeline Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Pipeline by Stage</h2>
          <div className="space-y-4">
            {Object.entries(metrics.pipeline_by_stage).map(([stage, data]) => (
              <div key={stage}>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-gray-700">{stage}</p>
                  <p className="text-sm text-gray-600">
                    {data.count} deals · ${Math.round(data.value).toLocaleString()}
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full"
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

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Opportunities</span>
                <span className="font-semibold text-gray-900">{metrics.total_opportunities}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Deal Size</span>
                <span className="font-semibold text-gray-900">
                  ${Math.round(
                    metrics.total_pipeline_value / (metrics.total_opportunities || 1)
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Pipeline Momentum</span>
                <span className={`font-semibold ${metrics.deals_this_month > 2 ? 'text-green-600' : 'text-orange-600'}`}>
                  {metrics.deals_this_month > 2 ? '↑ Strong' : '→ Moderate'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Conversion Quality</span>
                <span className={`font-semibold ${metrics.win_rate_percent > 25 ? 'text-green-600' : 'text-orange-600'}`}>
                  {metrics.win_rate_percent > 25 ? '✓ Good' : '△ Review'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
