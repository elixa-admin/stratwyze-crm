'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NewAccountModal from '@/components/shared/NewAccountModal';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import PageHeader from '@/components/shared/PageHeader';
import { parseARRInput } from '@/lib/format';

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
  const [accounts, setAccounts] = useState<any[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'deals' | 'contacts'>('name');

  useEffect(() => {
    fetch('/api/accounts')
      .then(r => r.json())
      .then(data => {
        if (data.accounts) {
          setAccounts(data.accounts);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = accounts.filter(acc =>
      acc.name.toLowerCase().includes(search.toLowerCase()) ||
      acc.industry?.toLowerCase().includes(search.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'deals':
          return (b.deals?.length ?? 0) - (a.deals?.length ?? 0);
        case 'contacts':
          return (b.contacts?.length ?? 0) - (a.contacts?.length ?? 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredAccounts(filtered);
  }, [accounts, search, sortBy]);

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
    <div>
      <Breadcrumbs items={[{ label: 'Accounts' }]} />
      <div className="space-y-6">
        <PageHeader
          title="Accounts"
          subtitle={`${filteredAccounts.length} account${filteredAccounts.length !== 1 ? 's' : ''} in your CRM`}
          action={
            <button onClick={() => setShowModal(true)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/20 hover:bg-white/30 text-white transition-all border border-white/30">
              + New Account
            </button>
          }
        />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white rounded-xl border border-slate-200 p-4">
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Search by company name or industry..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="name">Sort by: Name</option>
          <option value="created">Sort by: Created</option>
          <option value="deals">Sort by: Deals</option>
          <option value="contacts">Sort by: Contacts</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 4 }).map((_, i) => <AccountSkeleton key={i} />)}
          </div>
        ) : filteredAccounts.length === 0 ? (
          <EmptyState onAdd={() => setShowModal(true)} />
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAccounts.map((account) => (
              <Link
                key={account.id}
                href={`/accounts/${account.id}`}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-blue-700">
                    {account.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>

                {/* Company Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {account.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {[account.industry, account.headquarters].filter(Boolean).join(' · ') || 'No details'}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-right">
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-slate-900">{account.deals?.length ?? 0}</p>
                    <p className="text-xs text-slate-500">Deal{(account.deals?.length ?? 0) !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-slate-900">{account.contacts?.length ?? 0}</p>
                    <p className="text-xs text-slate-500">Contact{(account.contacts?.length ?? 0) !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="w-5 h-5 text-slate-300 group-hover:text-slate-400 flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <NewAccountModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleAddAccount} />
      </div>
    </div>
  );
}
