'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Analytics {
  funnel: {
    total_leads: number;
    leads_to_opp_rate: number;
    opportunities_count: number;
    opp_to_won_rate: number;
    total_won: number;
    overall_conversion: number;
  };
  by_stage: Record<string, { count: number; total_value: number; avg_value: number }>;
  forecast: Array<{ month: string; projected_revenue: number; deal_count: number }>;
  cycle_metrics: {
    avg_cycle_days: number;
    median_cycle_days: number;
    fastest_deal_days: number;
    slowest_deal_days: number;
  };
  monthly_performance: Array<{
    month: string;
    deals_created: number;
    deals_closed: number;
    revenue_generated: number;
    avg_deal_size: number;
  }>;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setAuthenticated(true);
      fetchAnalytics();
    }
  }, [router]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (!authenticated) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return <div className="p-8 text-center">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="p-8 text-center text-gray-600">No analytics data available</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              Stratwyze CRM
            </Link>
            <div className="flex gap-4">
              <Link href="/leads" className="text-gray-600 hover:text-gray-900 font-medium">
                Leads
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
                Dashboard
              </Link>
              <Link href="/analytics" className="text-blue-600 font-bold">
                Analytics
              </Link>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Advanced Analytics</h1>

        {/* Sales Funnel */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sales Funnel</h2>
          <div className="grid grid-cols-5 gap-4 mb-8">
            {/* Leads */}
            <div className="text-center">
              <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                <p className="text-gray-600 text-sm font-semibold">Leads</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">{analytics.funnel.total_leads}</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="text-2xl text-gray-400">→</div>
            </div>

            {/* Opportunities */}
            <div className="text-center">
              <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                <p className="text-gray-600 text-sm font-semibold">Opportunities</p>
                <p className="text-4xl font-bold text-yellow-600 mt-2">{analytics.funnel.opportunities_count}</p>
                <p className="text-xs text-gray-500 mt-2">{analytics.funnel.leads_to_opp_rate.toFixed(1)}% conversion</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="text-2xl text-gray-400">→</div>
            </div>

            {/* Won */}
            <div className="text-center">
              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                <p className="text-gray-600 text-sm font-semibold">Won</p>
                <p className="text-4xl font-bold text-green-600 mt-2">{analytics.funnel.total_won}</p>
                <p className="text-xs text-gray-500 mt-2">{analytics.funnel.opp_to_won_rate.toFixed(1)}% close rate</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-lg font-semibold text-blue-900">
              Overall Conversion: <span className="text-2xl">{analytics.funnel.overall_conversion.toFixed(1)}%</span>
            </p>
            <p className="text-sm text-blue-700 mt-1">From leads to closed won</p>
          </div>
        </div>

        {/* Deal Cycle Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm font-semibold">Avg Cycle Time</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {analytics.cycle_metrics.avg_cycle_days.toFixed(0)} days
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
            <p className="text-gray-600 text-sm font-semibold">Median Cycle</p>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {analytics.cycle_metrics.median_cycle_days.toFixed(0)} days
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-semibold">Fastest Deal</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {analytics.cycle_metrics.fastest_deal_days} days
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <p className="text-gray-600 text-sm font-semibold">Slowest Deal</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {analytics.cycle_metrics.slowest_deal_days} days
            </p>
          </div>
        </div>

        {/* Revenue Forecast */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">3-Month Revenue Forecast</h2>
          <div className="grid grid-cols-3 gap-6">
            {analytics.forecast.map((forecast) => (
              <div key={forecast.month} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                <p className="text-gray-600 font-semibold text-sm">{forecast.month}</p>
                <p className="text-3xl font-bold text-blue-600 mt-3">
                  ${Math.round(forecast.projected_revenue).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">{forecast.deal_count} deals</p>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Historical Performance (Last 6 Months)</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Month</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Deals Created</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Deals Closed</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg Deal Size</th>
                </tr>
              </thead>
              <tbody>
                {analytics.monthly_performance.map((perf) => (
                  <tr key={perf.month} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{perf.month}</td>
                    <td className="py-3 px-4 text-center text-gray-600">{perf.deals_created}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-semibold ${perf.deals_closed > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                        {perf.deals_closed}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                      ${Math.round(perf.revenue_generated).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      ${Math.round(perf.avg_deal_size).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
