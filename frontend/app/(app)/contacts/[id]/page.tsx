'use client';

import { useState } from 'react';
import Link from 'next/link';
import CompanyResearch from '@/components/research/CompanyResearch';

const MOCK_CONTACTS: Record<string, {
  id: string; name: string; title: string; company: string; email: string;
  phone: string; avatar: string; location: string; linkedin: string;
  status: string; lastActivity: string; deals: number; totalValue: string;
}> = {
  '1': { id: '1', name: 'Sarah Johnson', title: 'VP of Sales', company: 'Acme Corp', email: 'sarah.johnson@acme.com', phone: '+1 (415) 555-0101', avatar: 'SJ', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/sarahjohnson', status: 'Active', lastActivity: '2 days ago', deals: 3, totalValue: '$450K' },
  '2': { id: '2', name: 'John Smith', title: 'CFO', company: 'Global Inc', email: 'j.smith@globalinc.com', phone: '+1 (212) 555-0182', avatar: 'JS', location: 'New York, NY', linkedin: 'linkedin.com/in/johnsmith', status: 'Active', lastActivity: '5 days ago', deals: 2, totalValue: '$320K' },
  '3': { id: '3', name: 'Emily Davis', title: 'Director of IT', company: 'TechStart', email: 'emily.davis@techstart.io', phone: '+1 (512) 555-0173', avatar: 'ED', location: 'Austin, TX', linkedin: 'linkedin.com/in/emilydavis', status: 'Lead', lastActivity: '1 week ago', deals: 1, totalValue: '$85K' },
  '4': { id: '4', name: 'Michael Chen', title: 'CEO', company: 'Fortune500', email: 'mchen@fortune500.com', phone: '+1 (650) 555-0164', avatar: 'MC', location: 'Palo Alto, CA', linkedin: 'linkedin.com/in/michaelchen', status: 'Strategic', lastActivity: 'Today', deals: 4, totalValue: '$1.2M' },
};

const ACTIVITIES = [
  { type: 'email', label: 'Email sent', description: 'Sent Q3 proposal follow-up', time: '2 days ago' },
  { type: 'call', label: 'Call logged', description: 'Discovery call — 45 min. Strong interest in enterprise tier.', time: '1 week ago' },
  { type: 'meeting', label: 'Meeting', description: 'Product demo scheduled and completed', time: '2 weeks ago' },
  { type: 'note', label: 'Note added', description: 'Key decision maker. Budget approved Q4. Wants pilot in 30 days.', time: '3 weeks ago' },
];

const DEALS = [
  { title: 'Enterprise License', value: '$250K', stage: 'Negotiation', probability: 75, close: 'Aug 2026' },
  { title: 'Add-on Modules', value: '$85K', stage: 'Proposal', probability: 40, close: 'Sep 2026' },
  { title: 'Annual Renewal', value: '$115K', stage: 'Closed Won', probability: 100, close: 'Closed' },
];

const STAGE_COLORS: Record<string, string> = {
  'Negotiation': 'bg-orange-100 text-orange-700',
  'Proposal': 'bg-yellow-100 text-yellow-700',
  'Closed Won': 'bg-emerald-100 text-emerald-700',
  'Discovery': 'bg-blue-100 text-blue-700',
};

const ACTIVITY_ICONS: Record<string, string> = {
  email: 'Em', call: 'Ca', meeting: 'Mt', note: 'Nt',
};

const STATUS_COLORS: Record<string, string> = {
  'Active': 'bg-emerald-50 text-emerald-700',
  'Lead': 'bg-blue-50 text-blue-700',
  'Strategic': 'bg-purple-50 text-purple-700',
  'Inactive': 'bg-slate-100 text-slate-600',
};

type Tab = 'overview' | 'activity' | 'deals' | 'research';

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const contact = MOCK_CONTACTS[params.id] ?? MOCK_CONTACTS['1'];

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'activity', label: 'Activity' },
    { key: 'deals', label: 'Deals' },
    { key: 'research', label: 'AI Research' },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/contacts" className="hover:text-slate-900 transition-colors">Contacts</Link>
        <span>/</span>
        <span className="text-slate-900 font-500">{contact.name}</span>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-md">
              {contact.avatar}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">{contact.name}</h1>
                <span className={`px-2.5 py-1 rounded-full text-xs font-600 ${STATUS_COLORS[contact.status] ?? 'bg-slate-100 text-slate-600'}`}>
                  {contact.status}
                </span>
              </div>
              <p className="text-slate-600 text-sm">{contact.title} at <span className="font-500 text-slate-900">{contact.company}</span></p>
              <p className="text-slate-500 text-xs mt-1">{contact.location} · Last active {contact.lastActivity}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <a href={`mailto:${contact.email}`} className="px-4 py-2 rounded-lg text-sm font-600 bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-sm">
              Send Email
            </a>
            <button className="px-4 py-2 rounded-lg text-sm font-500 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition-all">
              Log Activity
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 border-t border-slate-200 mt-6 pt-6">
          <div>
            <p className="text-xs font-700 uppercase text-slate-500 mb-1">Email</p>
            <p className="text-sm text-blue-600 truncate">{contact.email}</p>
          </div>
          <div>
            <p className="text-xs font-700 uppercase text-slate-500 mb-1">Phone</p>
            <p className="text-sm text-slate-900">{contact.phone}</p>
          </div>
          <div>
            <p className="text-xs font-700 uppercase text-slate-500 mb-1">Open Deals</p>
            <p className="text-sm font-bold text-slate-900">{contact.deals}</p>
          </div>
          <div>
            <p className="text-xs font-700 uppercase text-slate-500 mb-1">Total Pipeline</p>
            <p className="text-sm font-bold text-slate-900">{contact.totalValue}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-3 text-sm font-500 border-b-2 transition-all ${
              activeTab === key
                ? 'border-blue-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-5">Contact Information</h2>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: 'Full Name', value: contact.name },
                  { label: 'Job Title', value: contact.title },
                  { label: 'Company', value: contact.company },
                  { label: 'Location', value: contact.location },
                  { label: 'Email', value: contact.email },
                  { label: 'Phone', value: contact.phone },
                  { label: 'LinkedIn', value: contact.linkedin },
                  { label: 'Status', value: contact.status },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-700 uppercase text-slate-500 mb-1">{label}</p>
                    <p className="text-sm text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
                <button onClick={() => setActiveTab('activity')} className="text-sm text-blue-600 hover:text-blue-700 font-500">View all →</button>
              </div>
              <div className="space-y-4">
                {ACTIVITIES.slice(0, 2).map((act, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm flex-shrink-0">
                      {ACTIVITY_ICONS[act.type]}
                    </div>
                    <div>
                      <p className="text-sm font-500 text-slate-900">{act.label}</p>
                      <p className="text-xs text-slate-600">{act.description}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <p className="text-xs font-700 uppercase text-slate-500 mb-2">Account</p>
              <Link href="/accounts/1" className="text-sm font-600 text-blue-600 hover:text-blue-700">{contact.company} →</Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <p className="text-xs font-700 uppercase text-slate-500 mb-3">AI Insight</p>
              <p className="text-sm text-slate-900">Key decision maker with strong budget authority. High-value contact — prioritize Q4 close.</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <span className="px-2 py-1 rounded text-xs bg-purple-50 text-purple-700 font-500">Decision Maker</span>
                <span className="px-2 py-1 rounded text-xs bg-green-50 text-green-700 font-500">High Intent</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <p className="text-xs font-700 uppercase text-slate-500 mb-3">Pipeline Summary</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Open Deals</span>
                  <span className="font-600 text-slate-900">{contact.deals}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total Value</span>
                  <span className="font-600 text-slate-900">{contact.totalValue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-slate-900">Activity Timeline</h2>
            <button className="px-4 py-2 rounded-lg text-sm font-600 bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-sm">
              + Log Activity
            </button>
          </div>
          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-200" />
            <div className="space-y-6 relative">
              {ACTIVITIES.map((act, i) => (
                <div key={i} className="flex gap-4 pl-1">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-sm z-10 flex-shrink-0">
                    {ACTIVITY_ICONS[act.type]}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-600 text-slate-900">{act.label}</p>
                      <p className="text-xs text-slate-400">{act.time}</p>
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5">{act.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Deals Tab */}
      {activeTab === 'deals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Associated Deals ({DEALS.length})</h2>
            <button className="px-4 py-2 rounded-lg text-sm font-600 bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-sm">
              + New Deal
            </button>
          </div>
          {DEALS.map((deal, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-600 text-slate-900">{deal.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Close: {deal.close}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-600 ${STAGE_COLORS[deal.stage] ?? 'bg-slate-100 text-slate-600'}`}>
                    {deal.stage}
                  </span>
                  <p className="font-bold text-slate-900">{deal.value}</p>
                </div>
              </div>
              {deal.stage !== 'Closed Won' && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Win probability</span>
                    <span>{deal.probability}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${deal.probability}%` }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* AI Research Tab */}
      {activeTab === 'research' && (
        <CompanyResearch companyName={contact.company} />
      )}
    </div>
  );
}
