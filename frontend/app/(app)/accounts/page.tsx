'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MOCK_ACCOUNTS } from '@/lib/data/accounts';
import NewAccountModal from '@/components/shared/NewAccountModal';

export default function AccountsPage() {
  const [showModal, setShowModal] = useState(false);

  const handleAddAccount = (data: { name: string; industry: string; location: string; arr: string; employees: number }) => {
    console.log('New account created:', data);
    setShowModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Accounts</h1>
          <p className="text-slate-600 mt-1">Manage your business accounts</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-sm">
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
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition-all cursor-pointer h-full">
              <div className="mb-4">
                <h3 className="font-semibold text-slate-900 mb-0.5">{account.name}</h3>
                <p className="text-xs text-slate-500">{account.industry} · {account.location}</p>
              </div>
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">ARR</span>
                  <span className="text-sm font-semibold text-slate-900">{account.arr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Employees</span>
                  <span className="text-sm font-semibold text-slate-900">{account.employees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Status</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    account.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {account.status}
                  </span>
                </div>
              </div>

              {/* Tech Stack indicator */}
              {account.technologyStack?.platform && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 flex-shrink-0">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span className="text-[10px] text-slate-500 truncate">
                    {account.technologyStack.platform}
                    {account.technologyStack.siPartner && ` / ${account.technologyStack.siPartner}`}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <NewAccountModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleAddAccount} />
    </div>
  );
}
