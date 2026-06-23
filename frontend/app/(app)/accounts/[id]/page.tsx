'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/format';
import AccountEditorModal from '@/components/shared/AccountEditorModal';

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  createdAt: string;
}

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  role?: string;
}

interface Account {
  id: string;
  name: string;
  industry?: string;
  headquarters?: string;
  website?: string;
  employees?: number;
  annualRevenue?: number;
  legalEntity?: string;
  deals: Deal[];
  contacts: Contact[];
}

const STAGE_COLORS: Record<string, string> = {
  Prospecting:   'bg-slate-100 text-slate-600',
  Qualification: 'bg-blue-50 text-blue-700',
  Proposal:      'bg-amber-50 text-amber-700',
  Negotiation:   'bg-purple-50 text-purple-700',
  'Closed Won':  'bg-emerald-50 text-emerald-700',
};

function AccountSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <div className="h-8 bg-slate-200 rounded w-64 mb-2" />
        <div className="h-4 bg-slate-100 rounded w-40 mb-6" />
        <div className="grid grid-cols-4 gap-4 border-t border-slate-100 pt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 bg-slate-100 rounded w-16 mb-2" />
              <div className="h-6 bg-slate-200 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <div className="h-4 bg-slate-200 rounded w-32 mb-4" />
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded-lg" />)}
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="h-3 bg-slate-100 rounded w-24 mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-3 bg-slate-100 rounded w-full" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', title: '', role: '' });
  const [addingContact, setAddingContact] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/accounts/${id}`)
      .then(r => r.json())
      .then(data => { if (data.account) setAccount(data.account); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddContact = async () => {
    if (!newContact.name || !account) return;
    setAddingContact(true);
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: account.id, ...newContact }),
      });
      const data = await res.json();
      if (data.contact) {
        setAccount({ ...account, contacts: [...account.contacts, data.contact] });
        setNewContact({ name: '', email: '', phone: '', title: '', role: '' });
      }
    } catch (err) {
      console.error('Failed to add contact:', err);
    } finally {
      setAddingContact(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!account) return;
    try {
      await fetch(`/api/contacts/${contactId}`, { method: 'DELETE' });
      setAccount({ ...account, contacts: account.contacts.filter(c => c.id !== contactId) });
    } catch (err) {
      console.error('Failed to delete contact:', err);
    }
  };

  if (loading) return <AccountSkeleton />;
  if (!account) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-slate-500">Account not found.</p>
      <Link href="/accounts" className="text-sm text-blue-600 hover:underline">← Back to Accounts</Link>
    </div>
  );

  const openDeals = account.deals.filter(d => d.stage !== 'Closed Won');
  const closedDeals = account.deals.filter(d => d.stage === 'Closed Won');
  const totalPipeline = openDeals.reduce((s, d) => s + d.value, 0);
  const totalWon = closedDeals.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/accounts" className="hover:text-slate-700 transition-colors">Accounts</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{account.name}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{account.name}</h1>
            <p className="text-slate-500 mt-1">
              {[account.industry, account.headquarters].filter(Boolean).join(' · ')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200">
              Active
            </span>
            <button
              onClick={() => setEditorOpen(true)}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-100 pt-6">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1 tracking-wide">ARR</p>
            <p className="text-2xl font-bold text-slate-900">
              {account.annualRevenue ? formatCurrency(account.annualRevenue) : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1 tracking-wide">Employees</p>
            <p className="text-2xl font-bold text-slate-900">
              {account.employees ? account.employees.toLocaleString() : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1 tracking-wide">Open Deals</p>
            <p className="text-2xl font-bold text-slate-900">{openDeals.length}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1 tracking-wide">Pipeline Value</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalPipeline)}</p>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: deals */}
        <div className="lg:col-span-2 space-y-5">

          {/* Active Deals */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">Active Deals</h2>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('openNewDealModal'))}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                + New deal
              </button>
            </div>
            {openDeals.length > 0 ? (
              <div className="space-y-2">
                {openDeals.map(deal => (
                  <Link key={deal.id} href={`/deals/${deal.id}`}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 truncate">{deal.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(deal.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STAGE_COLORS[deal.stage] ?? 'bg-slate-100 text-slate-600'}`}>
                        {deal.stage}
                      </span>
                      <p className="text-sm font-semibold text-slate-900">{formatCurrency(deal.value)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-400 mb-2">No active deals for this account</p>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('openNewDealModal'))}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Create the first deal →
                </button>
              </div>
            )}
          </div>

          {/* Closed Won */}
          {closedDeals.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">
                Closed Won
                <span className="ml-2 text-xs font-normal text-emerald-600">{formatCurrency(totalWon)}</span>
              </h2>
              <div className="space-y-2">
                {closedDeals.map(deal => (
                  <Link key={deal.id} href={`/deals/${deal.id}`}
                    className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100 hover:border-emerald-200 transition-all">
                    <p className="text-sm font-medium text-slate-900 truncate">{deal.title}</p>
                    <p className="text-sm font-semibold text-emerald-700 flex-shrink-0 ml-3">{formatCurrency(deal.value)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Contacts */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Contacts</h2>
            {account.contacts && account.contacts.length > 0 ? (
              <div className="space-y-3 mb-4">
                {account.contacts.map(contact => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{contact.name}</p>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-slate-500">
                        {contact.title && <span>{contact.title}</span>}
                        {contact.email && <span className="text-blue-600 cursor-pointer hover:underline">{contact.email}</span>}
                        {contact.phone && <span>{contact.phone}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-xs text-slate-400 hover:text-red-600 ml-2 flex-shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 mb-4">No contacts added yet</p>
            )}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <input
                type="text"
                placeholder="Name *"
                value={newContact.name}
                onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={newContact.email}
                onChange={e => setNewContact({ ...newContact, email: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Title"
                value={newContact.title}
                onChange={e => setNewContact({ ...newContact, title: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleAddContact}
                disabled={!newContact.name || addingContact}
                className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-medium rounded-lg transition-colors"
              >
                {addingContact ? 'Adding...' : '+ Add contact'}
              </button>
            </div>
          </div>

          {/* Company info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Company Information</h2>
            <div className="space-y-3">
              {[
                { label: 'Website', value: account.website, link: true },
                { label: 'Industry', value: account.industry },
                { label: 'Headquarters', value: account.headquarters },
                { label: 'Legal Entity', value: account.legalEntity },
              ].filter(r => r.value).map(row => (
                <div key={row.label}>
                  <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-wide mb-0.5">{row.label}</p>
                  {row.link ? (
                    <a href={row.value!} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline">{row.value}</a>
                  ) : (
                    <p className="text-sm text-slate-900">{row.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: summary */}
        <div className="space-y-4">

          {/* Pipeline summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wide mb-3">Pipeline Summary</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Open pipeline</span>
                <span className="text-sm font-semibold text-blue-600">{formatCurrency(totalPipeline)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Closed won</span>
                <span className="text-sm font-semibold text-emerald-600">{formatCurrency(totalWon)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-sm font-medium text-slate-700">Total value</span>
                <span className="text-sm font-bold text-slate-900">{formatCurrency(totalPipeline + totalWon)}</span>
              </div>
            </div>
          </div>

          {/* Stage breakdown */}
          {account.deals.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <p className="text-xs font-semibold uppercase text-slate-400 tracking-wide mb-3">By Stage</p>
              <div className="space-y-2">
                {Object.entries(
                  account.deals.reduce((acc: Record<string, number>, d) => {
                    acc[d.stage] = (acc[d.stage] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([stage, count]) => (
                  <div key={stage} className="flex justify-between items-center">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STAGE_COLORS[stage] ?? 'bg-slate-100 text-slate-600'}`}>
                      {stage}
                    </span>
                    <span className="text-xs text-slate-500">{count} deal{count !== 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wide mb-3">Quick Actions</p>
            <div className="space-y-2">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('openNewDealModal'))}
                className="w-full text-left text-sm text-slate-700 hover:text-blue-600 py-1.5 flex items-center gap-2 transition-colors"
              >
                <span className="text-slate-300">+</span> Add deal
              </button>
              <Link href="/pipeline" className="block text-sm text-slate-700 hover:text-blue-600 py-1.5 flex items-center gap-2 transition-colors">
                <span className="text-slate-300">→</span> View pipeline
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Account Editor Modal */}
      {account && (
        <AccountEditorModal
          isOpen={editorOpen}
          account={account}
          onClose={() => setEditorOpen(false)}
          onSaved={(updated) => setAccount(updated)}
        />
      )}
    </div>
  );
}
