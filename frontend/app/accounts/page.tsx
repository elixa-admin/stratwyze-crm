'use client';

import Link from 'next/link';

const MOCK_ACCOUNTS = [
  { id: '1', name: 'Acme Corporation', industry: 'Technology', arr: '$850K', employees: 450, status: 'Active' },
  { id: '2', name: 'Global Industries Inc', industry: 'Manufacturing', arr: '$1.2M', employees: 1200, status: 'Active' },
  { id: '3', name: 'TechStart Ventures', industry: 'SaaS', arr: '$280K', employees: 65, status: 'Active' },
  { id: '4', name: 'Fortune 500 Corp', industry: 'Finance', arr: '$2.5M', employees: 5000, status: 'Prospect' },
];

export default function AccountsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Accounts</h1>
          <p className="text-slate-600 mt-1">Manage your business accounts</p>
        </div>
        <button className="px-4 py-2.5 rounded-lg text-sm font-600 bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-sm">
          + Add Account
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search accounts..."
          className="flex-1 px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select className="px-3 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Status</option>
          <option>Active</option>
          <option>Prospect</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_ACCOUNTS.map((account) => (
          <Link href={`/accounts/${account.id}`} key={account.id}>
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs hover:shadow-sm transition-all cursor-pointer">
              <div className="mb-4">
                <h3 className="font-600 text-slate-900 mb-1">{account.name}</h3>
                <p className="text-xs text-slate-600">{account.industry}</p>
              </div>
              <div className="space-y-2 border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-600">ARR</span>
                  <span className="text-sm font-600 text-slate-900">{account.arr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-600">Employees</span>
                  <span className="text-sm font-600 text-slate-900">{account.employees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-600">Status</span>
                  <span className={`text-xs font-600 px-2 py-1 rounded ${
                    account.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {account.status}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
