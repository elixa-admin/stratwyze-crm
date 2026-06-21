'use client';

import ActivityTimeline from '@/components/shared/ActivityTimeline';

export default function ContactDetailPage() {
  const contact = {
    name: 'Sarah Johnson',
    title: 'VP of Sales',
    company: 'Acme Corporation',
    email: 'sarah.johnson@acme.com',
    phone: '+1 (415) 555-0123',
    location: 'San Francisco, CA',
    avatar: 'SJ',
  };

  const relatedDeals = [
    { id: '1', title: 'Enterprise Implementation', value: '$250K', stage: 'Proposal' },
    { id: '2', title: 'Add-on Modules', value: '$85K', stage: 'Qualification' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-xs">
        <div className="flex items-start gap-6 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
            {contact.avatar}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{contact.name}</h1>
            <p className="text-slate-600 mt-1">{contact.title} at {contact.company}</p>
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-200 pt-6">
          <div>
            <p className="text-xs font-700 uppercase text-slate-500 mb-2">Email</p>
            <p className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">{contact.email}</p>
          </div>
          <div>
            <p className="text-xs font-700 uppercase text-slate-500 mb-2">Phone</p>
            <p className="text-sm text-slate-900">{contact.phone}</p>
          </div>
          <div>
            <p className="text-xs font-700 uppercase text-slate-500 mb-2">Location</p>
            <p className="text-sm text-slate-900">{contact.location}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button className="px-4 py-3 font-500 text-slate-900 border-b-2 border-blue-500">Overview</button>
        <button className="px-4 py-3 font-500 text-slate-600 hover:text-slate-900 border-b-2 border-transparent">Activities</button>
        <button className="px-4 py-3 font-500 text-slate-600 hover:text-slate-900 border-b-2 border-transparent">Notes</button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Related Deals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Related Opportunities</h2>
            <div className="space-y-3">
              {relatedDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="font-500 text-slate-900">{deal.title}</p>
                    <p className="text-xs text-slate-600">{deal.stage}</p>
                  </div>
                  <p className="font-600 text-slate-900">{deal.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Activity Timeline</h2>
            <ActivityTimeline />
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
            <p className="text-xs font-700 uppercase text-slate-500 mb-2">Total Value</p>
            <p className="text-2xl font-bold text-slate-900">$335K</p>
            <p className="text-xs text-slate-600 mt-2">Across 2 opportunities</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
            <p className="text-xs font-700 uppercase text-slate-500 mb-2">Last Contact</p>
            <p className="text-sm font-500 text-slate-900">2 hours ago</p>
            <p className="text-xs text-slate-600 mt-2">Discovery call</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
            <p className="text-xs font-700 uppercase text-slate-500 mb-3">AI Insight</p>
            <div className="space-y-2 text-sm">
              <p className="text-slate-900">High engagement with product team. Budget approved for 2026.</p>
              <div className="flex gap-2 pt-2">
                <span className="px-2 py-1 rounded text-xs bg-green-50 text-green-700 font-500">Strong prospect</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
