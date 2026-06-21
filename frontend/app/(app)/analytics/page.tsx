'use client';

export default function AnalyticsPage() {
  const revenueData = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 52 },
    { month: 'Mar', value: 58 },
    { month: 'Apr', value: 72 },
    { month: 'May', value: 85 },
    { month: 'Jun', value: 98 },
  ];

  const pipelineData = [
    { stage: 'Prospecting', deals: 9, value: 4200000 },
    { stage: 'Qualification', deals: 6, value: 3800000 },
    { stage: 'Proposal', deals: 4, value: 5100000 },
    { stage: 'Negotiation', deals: 3, value: 2400000 },
  ];

  const sourceData = [
    { name: 'Direct', value: 45 },
    { name: 'Referral', value: 28 },
    { name: 'Inbound', value: 18 },
    { name: 'Channel', value: 9 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-600 mt-1">Sales performance and pipeline insights</p>
        </div>
        <select className="px-3 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>This Year</option>
          <option>This Quarter</option>
          <option>This Month</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
          <p className="text-xs font-700 uppercase text-slate-500 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-slate-900">$410K</p>
          <p className="text-xs text-green-600 font-500 mt-2">↑ 12.5% vs last month</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
          <p className="text-xs font-700 uppercase text-slate-500 mb-2">New Revenue</p>
          <p className="text-3xl font-bold text-slate-900">$156K</p>
          <p className="text-xs text-amber-600 font-500 mt-2">→ -3.2% vs last month</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
          <p className="text-xs font-700 uppercase text-slate-500 mb-2">Avg Deal Size</p>
          <p className="text-3xl font-bold text-slate-900">$52.4K</p>
          <p className="text-xs text-green-600 font-500 mt-2">↑ 8.1% vs last month</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
          <p className="text-xs font-700 uppercase text-slate-500 mb-2">Win Rate</p>
          <p className="text-3xl font-bold text-slate-900">64%</p>
          <p className="text-xs text-green-600 font-500 mt-2">↑ 2.3% vs last quarter</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Revenue Trend</h2>
          <div className="flex items-end justify-between h-48 gap-2">
            {revenueData.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-500 rounded-t" style={{ height: `${(data.value / 98) * 100}%` }}></div>
                <p className="text-xs text-slate-600 mt-2">{data.month}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Revenue by Source</h2>
          <div className="space-y-3">
            {sourceData.map((source, idx) => {
              const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500'];
              return (
                <div key={source.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-500 text-slate-900">{source.name}</span>
                    <span className="text-sm text-slate-600">{source.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[idx]}`} style={{ width: `${source.value}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Pipeline by Stage</h2>
        <div className="space-y-4">
          {pipelineData.map((stage) => (
            <div key={stage.stage}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-500 text-slate-900">{stage.stage}</span>
                <span className="text-sm text-slate-600">{stage.deals} deals · ${(stage.value / 1000000).toFixed(1)}M</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(stage.value / 5100000) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Deal Velocity</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Leads', value: 145, color: 'bg-blue-50 text-blue-700' },
            { label: 'Qualified', value: 78, color: 'bg-purple-50 text-purple-700' },
            { label: 'Proposals', value: 34, color: 'bg-amber-50 text-amber-700' },
            { label: 'Closed Won', value: 22, color: 'bg-green-50 text-green-700' },
          ].map((item, idx) => (
            <div key={idx} className={`${item.color} rounded-lg p-4 text-center`}>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs font-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
