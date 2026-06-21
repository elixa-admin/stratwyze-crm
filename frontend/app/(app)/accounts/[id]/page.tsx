'use client';

import CompanyResearch from '@/components/research/CompanyResearch';

export default function AccountDetailPage() {
  const account = {
    name: 'Acme Corporation',
    industry: 'Technology',
    location: 'San Francisco, CA',
    website: 'www.acme.com',
    arr: '$850K',
    employees: 450,
    status: 'Active',
    contacts: 12,
    openDeals: 3,
  };

  const opportunities = [
    { id: '1', title: 'Enterprise Implementation', value: '$250K', stage: 'Proposal' },
    { id: '2', title: 'Add-on Modules', value: '$85K', stage: 'Qualification' },
    { id: '3', title: 'Renewal + Expansion', value: '$120K', stage: 'Negotiation' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-xs">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">{account.name}</h1>
          <p className="text-slate-600 mt-1">{account.industry} • {account.location}</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t border-slate-200 pt-6">
          <div>
            <p className="text-xs font-700 uppercase text-slate-500 mb-2">ARR</p>
            <p className="text-2xl font-bold text-slate-900">{account.arr}</p>
          </div>
          <div>
            <p className="text-xs font-700 uppercase text-slate-500 mb-2">Employees</p>
            <p className="text-2xl font-bold text-slate-900">{account.employees}</p>
          </div>
          <div>
            <p className="text-xs font-700 uppercase text-slate-500 mb-2">Contacts</p>
            <p className="text-2xl font-bold text-slate-900">{account.contacts}</p>
          </div>
          <div>
            <p className="text-xs font-700 uppercase text-slate-500 mb-2">Open Deals</p>
            <p className="text-2xl font-bold text-slate-900">{account.openDeals}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button className="px-4 py-3 font-500 text-slate-900 border-b-2 border-blue-500">Overview</button>
        <button className="px-4 py-3 font-500 text-slate-600 hover:text-slate-900 border-b-2 border-transparent">Contacts</button>
        <button className="px-4 py-3 font-500 text-slate-600 hover:text-slate-900 border-b-2 border-transparent">Activities</button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Opportunities */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Active Opportunities</h2>
            <div className="space-y-3">
              {opportunities.map((opp) => (
                <div key={opp.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="font-500 text-slate-900">{opp.title}</p>
                    <p className="text-xs text-slate-600">{opp.stage}</p>
                  </div>
                  <p className="font-600 text-slate-900">{opp.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Company Info */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Company Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-700 uppercase text-slate-500 mb-1">Website</p>
                <p className="text-sm text-blue-600">{account.website}</p>
              </div>
              <div>
                <p className="text-xs font-700 uppercase text-slate-500 mb-1">Industry</p>
                <p className="text-sm text-slate-900">{account.industry}</p>
              </div>
            </div>
          </div>

          {/* SerpAPI Research Panel */}
          <CompanyResearch companyName={account.name} />
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
            <p className="text-xs font-700 uppercase text-slate-500 mb-2">Account Health</p>
            <div className="text-2xl font-bold text-green-600 mb-2">Excellent</div>
            <p className="text-xs text-slate-600">High engagement, growth trajectory</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
            <p className="text-xs font-700 uppercase text-slate-500 mb-2">Potential Value</p>
            <div className="text-2xl font-bold text-slate-900 mb-2">$455K</div>
            <p className="text-xs text-slate-600">Sum of open opportunities</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
            <p className="text-xs font-700 uppercase text-slate-500 mb-3">AI Insight</p>
            <div className="space-y-2 text-sm">
              <p className="text-slate-900">High-value strategic account. Expansion opportunity in enterprise tier.</p>
              <div className="flex gap-2 pt-2">
                <span className="px-2 py-1 rounded text-xs bg-green-50 text-green-700 font-500">Priority</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
