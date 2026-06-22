'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NewAccountModal from '@/components/shared/NewAccountModal';
import { formatCurrency, parseARRInput } from '@/lib/format';

interface Account {
  id: string;
  name: string;
  industry?: string;
  location?: string;
  annualRevenue?: number;
  employees?: number;
  status?: string;
  technologyStack?: { platform?: string; siPartner?: string };
}

function AccountSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs animate-pulse">
      <div className="mb-4">
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
      </div>
      <div className="space-y-2 border-t border-slate-100 pt-3">
        <div className="flex justify-between">
          <div className="h-3 bg-slate-100 rounded w-8" />
          <div className="h-3 bg-slate-200 rounded w-16" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-slate-100 rounded w-16" />
          <div className="h-3 bg-slate-200 rounded w-10" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-slate-100 rounded w-10" />
          <div className="h-3 bg-slate-200 rounded w-12" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="col-span-4 flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
          <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-slate-900 mb-1">No accounts yet</h3>
      <p className="text-xs text-slate-500 mb-4">Add your first account to start tracking relationships.</p>
      <button
        onClick={onAdd}
        className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all"
      >
        + Add Account
      </button>
    </div>
  );
}

export default function AccountsPage() {
  const [showModal, setShowModal] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/accounts')
      .then(r => r.json())
      .then(data => {
        if (data.accounts) {
          setAccounts(data.accounts.map((a: any): Account => ({
            id: a.id,
            name: a.name,
            industry: a.industry || 'Unknown',
            location: a.headquarters || 'Unknown',
            annualRevenue: a.annualRevenue || 0,
            employees: a.employees || 0,
            status: 'Active',
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddAccount = async (data: { name: string; industry: string; location: string; arr: string; employees: number }) => {
    const response = await fetch('/api/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        industry: data.industry,
        headquarters: data.location,
        annualRevenue: parseARRInput(data.arr),
        employees: data.employees,
      }),
    });
    if (response.ok) {
      const { account } = await response.json();
      setAccounts(prev => [{
        id: account.id,
        name: account.name,
        industry: account.industry || 'Unknown',
        location: account.headquarters || 'Unknown',
        annualRevenue: account.annualRevenue || 0,
        employees: account.employees || 0,
        status: 'Active',
      }, ...prev]);
      setShowModal(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Accounts</h1>
          <p className="text-slate-600 mt-1">Manage your business accounts</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm">
          + Add Account
        </button>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <AccountSkeleton key={i} />)
        ) : accounts.length === 0 ? (
          <EmptyState onAdd={() => setShowModal(true)} />
        ) : (
          accounts.map((account) => (
            <Link href={`/accounts/${account.id}`} key={account.id}>
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition-all cursor-pointer h-full">
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900 mb-0.5">{account.name}</h3>
                  <p className="text-xs text-slate-500">{account.industry} · {account.location}</p>
                </div>
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">ARR</span>
                    <span className="text-sm font-semibold text-slate-900">{formatCurrency(account.annualRevenue || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Employees</span>
                    <span className="text-sm font-semibold text-slate-900">{(account.employees || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Status</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-green-50 text-green-700">
                      {account.status}
                    </span>
                  </div>
                </div>
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
          ))
        )}
      </div>

      <NewAccountModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleAddAccount} />
    </div>
  );
}
