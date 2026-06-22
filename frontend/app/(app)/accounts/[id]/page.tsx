'use client';

import { useParams } from 'next/navigation';
import CompanyResearch from '@/components/research/CompanyResearch';
import AccountTechStack from '@/components/accounts/AccountTechStack';
import { MOCK_ACCOUNTS } from '@/lib/data/accounts';

export default function AccountDetailPage() {
  const params = useParams();
  const account = MOCK_ACCOUNTS.find(a => a.id === params.id) ?? MOCK_ACCOUNTS[0];

  const opportunities = [
    { id: '1', title: 'Enterprise Implementation', value: 'R1.25M', stage: 'Proposal' },
    { id: '2', title: 'Add-on Modules', value: 'R425K', stage: 'Qualification' },
    { id: '3', title: 'Renewal + Expansion', value: 'R600K', stage: 'Negotiation' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{account.name}</h1>
            <p className="text-slate-500 mt-1">{account.industry} · {account.location}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
            account.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {account.status}
          </span>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-100 pt-6">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1 tracking-wide">ARR</p>
            <p className="text-2xl font-bold text-slate-900">{account.arr}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1 tracking-wide">Employees</p>
            <p className="text-2xl font-bold text-slate-900">{account.employees.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1 tracking-wide">Contacts</p>
            <p className="text-2xl font-bold text-slate-900">12</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1 tracking-wide">Open Deals</p>
            <p className="text-2xl font-bold text-slate-900">3</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 -mt-4">
        <button className="px-4 py-3 text-sm font-semibold text-slate-900 border-b-2 border-blue-500">Overview</button>
        <button className="px-4 py-3 text-sm font-semibold text-slate-500 hover:text-slate-900 border-b-2 border-transparent transition-colors">Contacts</button>
        <button className="px-4 py-3 text-sm font-semibold text-slate-500 hover:text-slate-900 border-b-2 border-transparent transition-colors">Activities</button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">

          {/* Active Opportunities */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Active Opportunities</h2>
            <div className="space-y-2">
              {opportunities.map((opp) => (
                <div key={opp.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{opp.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{opp.stage}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{opp.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Company Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Company Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-wide mb-0.5">Website</p>
                <p className="text-sm text-blue-600">{account.website}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-wide mb-0.5">Industry</p>
                <p className="text-sm text-slate-900">{account.industry}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-wide mb-0.5">Location</p>
                <p className="text-sm text-slate-900">{account.location}</p>
              </div>
            </div>
          </div>

          {/* SerpAPI Research Panel */}
          <CompanyResearch companyName={account.name} />
        </div>

        {/* Right Column */}
        <div className="space-y-4">

          {/* Technology Stack — Sprint A */}
          {account.technologyStack ? (
            <AccountTechStack
              accountName={account.name}
              technologyStack={account.technologyStack}
            />
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Technology Stack</span>
              </div>
              <p className="text-xs text-slate-400 text-center py-4">No tech stack recorded yet</p>
              <button className="w-full py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                + Add tech stack
              </button>
            </div>
          )}

          {/* Account Health */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-wide mb-2">Account Health</p>
            <div className="text-xl font-bold text-green-600 mb-1">Excellent</div>
            <p className="text-xs text-slate-500">High engagement, growth trajectory</p>
          </div>

          {/* Potential Value */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-wide mb-2">Potential Value</p>
            <div className="text-xl font-bold text-slate-900 mb-1">R2.275M</div>
            <p className="text-xs text-slate-500">Sum of open opportunities</p>
          </div>

          {/* AI Insight */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-wide mb-3">AI Insight</p>
            <p className="text-sm text-slate-800 leading-relaxed">
              {account.technologyStack?.notes
                ? account.technologyStack.notes
                : 'High-value strategic account. Expansion opportunity in enterprise tier.'}
            </p>
            <div className="flex gap-2 pt-3">
              <span className="px-2 py-1 rounded text-xs bg-green-50 text-green-700 font-medium">Priority</span>
              {account.technologyStack?.competitorId && (
                <span className="px-2 py-1 rounded text-xs bg-red-50 text-red-700 font-medium">Competitive</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
