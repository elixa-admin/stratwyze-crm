'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const ROLE_DOTS: Record<string, string> = {
  executive_sponsor: 'bg-purple-500',
  champion: 'bg-emerald-500',
  technical_evaluator: 'bg-blue-500',
  gatekeeper: 'bg-amber-500',
  end_user: 'bg-slate-400',
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    fetch(`/api/contacts?${params}`)
      .then(r => r.json())
      .then(d => { if (d.contacts) setContacts(d.contacts); })
      .finally(() => setLoading(false));
  }, [search]);

  const filtered = contacts; // server-side search already applied

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Contacts</h1>
          <p className="text-slate-600 mt-1">Key people across your accounts</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search contacts by name, title or email..."
          className="flex-1 px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-sm">No contacts yet.</p>
            <p className="text-slate-400 text-xs mt-1">Contacts are auto-created when you create a deal with company research.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wide">Name</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wide">Title</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wide">Company</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wide">Email</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wide">Intel</th>
                <th className="text-right px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((contact) => {
                const initials = contact.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
                const intel = contact.intelligenceData;
                const roleDot = intel?.decisionRole ? ROLE_DOTS[intel.decisionRole] : null;
                return (
                  <tr key={contact.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                            {initials}
                          </div>
                          {roleDot && (
                            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${roleDot}`} />
                          )}
                        </div>
                        <span className="font-medium text-slate-900 text-sm">{contact.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{contact.title || '—'}</td>
                    <td className="px-6 py-4 text-sm">
                      {contact.account ? (
                        <Link href={`/accounts/${contact.account.id}`} className="text-blue-600 hover:underline">
                          {contact.account.name}
                        </Link>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{contact.email || '—'}</td>
                    <td className="px-6 py-4">
                      {intel ? (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                          ★ {intel.influence ?? '—'}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/contacts/${contact.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Legend */}
      {filtered.length > 0 && (
        <div className="flex items-center gap-4 text-[11px] text-slate-400 px-1">
          <span className="font-semibold">Role dots:</span>
          {Object.entries({ 'Executive Sponsor': 'bg-purple-500', 'Champion': 'bg-emerald-500', 'Technical': 'bg-blue-500', 'Gatekeeper': 'bg-amber-500' }).map(([label, cls]) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${cls}`} />
              {label}
            </span>
          ))}
          <span className="ml-auto text-slate-300">{filtered.length} contact{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  );
}
