'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from '@/lib/toast';

type Tab = 'overview' | 'intelligence' | 'deals' | 'activity';

const ROLE_BADGES: Record<string, { bg: string; text: string; label: string }> = {
  executive_sponsor:    { bg: 'bg-purple-50',  text: 'text-purple-700',  label: 'Executive Sponsor' },
  champion:             { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Champion' },
  technical_evaluator:  { bg: 'bg-blue-50',    text: 'text-blue-700',    label: 'Technical Evaluator' },
  gatekeeper:           { bg: 'bg-amber-50',   text: 'text-amber-700',   label: 'Gatekeeper' },
  end_user:             { bg: 'bg-slate-50',   text: 'text-slate-700',   label: 'End User' },
  unknown:              { bg: 'bg-slate-50',   text: 'text-slate-500',   label: 'Role Unknown' },
};

const INFLUENCE_COLORS: Record<string, string> = {
  high: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  medium: 'text-amber-700 bg-amber-50 border-amber-200',
  low: 'text-slate-600 bg-slate-50 border-slate-200',
};

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [researching, setResearching] = useState(false);
  const [intel, setIntel] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/contacts/${params.id}/intelligence`)
      .then(r => r.json())
      .then(d => {
        if (d.contact) {
          setContact(d.contact);
          if (d.contact.intelligenceData) setIntel(d.contact.intelligenceData);
        }
      })
      .catch(() => toast('Failed to load contact', 'error'))
      .finally(() => setLoading(false));
  }, [params.id]);

  const runIntelligence = async () => {
    setResearching(true);
    setActiveTab('intelligence');
    try {
      const res = await fetch(`/api/contacts/${params.id}/intelligence`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIntel(data.intelligence);
      // Refresh contact to get updated linkedin URL
      const cr = await fetch(`/api/contacts/${params.id}/intelligence`);
      const cd = await cr.json();
      if (cd.contact) setContact(cd.contact);
      toast('Contact intelligence updated', 'success');
    } catch (err: any) {
      toast(err?.message || 'Research failed', 'error');
    } finally {
      setResearching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 text-sm">Contact not found.</p>
        <Link href="/contacts" className="text-blue-600 text-sm mt-2 inline-block hover:underline">← Back to Contacts</Link>
      </div>
    );
  }

  const initials = contact.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const roleStyle = ROLE_BADGES[intel?.decisionRole ?? 'unknown'];

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'intelligence', label: intel ? '★ Intelligence' : 'Intelligence' },
    { key: 'deals', label: `Deals (${contact.deals?.length ?? 0})` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/contacts" className="hover:text-slate-900 transition-colors">Contacts</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{contact.name}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900">{contact.name}</h1>
                {intel?.decisionRole && roleStyle && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleStyle.bg} ${roleStyle.text}`}>
                    {roleStyle.label}
                  </span>
                )}
                {intel?.influence && (
                  <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${INFLUENCE_COLORS[intel.influence] ?? INFLUENCE_COLORS.medium}`}>
                    {intel.influence.charAt(0).toUpperCase() + intel.influence.slice(1)} influence
                  </span>
                )}
              </div>
              <p className="text-slate-600 text-sm">
                {contact.title || 'Unknown title'} at{' '}
                {contact.account ? (
                  <Link href={`/accounts/${contact.account.id}`} className="font-medium text-blue-600 hover:underline">
                    {contact.account.name}
                  </Link>
                ) : (
                  <span className="font-medium text-slate-900">{contact.department || 'Unknown company'}</span>
                )}
              </p>
              {contact.location && <p className="text-slate-400 text-xs mt-1">{contact.location}</p>}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                Email
              </a>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#0A66C2] hover:bg-[#004182] text-white transition-colors">
                LinkedIn
              </a>
            )}
            <button
              onClick={runIntelligence}
              disabled={researching}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {researching ? (
                <><span className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin" /> Researching…</>
              ) : (
                <>{intel ? '↺ Re-research' : '★ Research Contact'}</>
              )}
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-4 border-t border-slate-100 mt-6 pt-6">
          {[
            { label: 'Email', value: contact.email || '—' },
            { label: 'Phone', value: contact.phone || '—' },
            { label: 'Department', value: contact.department || contact.role || '—' },
            { label: 'Deals', value: contact.deals?.length ?? 0 },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs font-bold uppercase text-slate-400 mb-1">{label}</p>
              <p className="text-sm text-slate-900 truncate">{String(value)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === key ? 'border-blue-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', value: contact.name },
                  { label: 'Job Title', value: contact.title || '—' },
                  { label: 'Email', value: contact.email || '—' },
                  { label: 'Phone', value: contact.phone || '—' },
                  { label: 'Location', value: contact.location || '—' },
                  { label: 'Department', value: contact.department || '—' },
                  { label: 'LinkedIn', value: contact.linkedin || '—' },
                  { label: 'Role / Notes', value: contact.role || '—' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">{label}</p>
                    <p className="text-sm text-slate-800 break-words">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick intel preview if available */}
            {intel?.background && (
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-indigo-600 font-semibold text-xs uppercase tracking-wide">AI Intelligence Summary</span>
                  <button onClick={() => setActiveTab('intelligence')} className="text-xs text-blue-600 hover:underline ml-auto">View full →</button>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{intel.background}</p>
                {intel.approachStyle && (
                  <p className="text-xs text-indigo-600 mt-2 font-medium">Approach: {intel.approachStyle}</p>
                )}
              </div>
            )}

            {/* No intel yet prompt */}
            {!intel && (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-center">
                <p className="text-sm text-slate-600 mb-3">No intelligence data yet for this contact.</p>
                <button onClick={runIntelligence} disabled={researching}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {researching ? 'Researching…' : '★ Run Contact Intelligence'}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {contact.account && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-xs font-bold uppercase text-slate-400 mb-2">Account</p>
                <Link href={`/accounts/${contact.account.id}`} className="text-sm font-semibold text-blue-600 hover:underline">
                  {contact.account.name} →
                </Link>
                {contact.account.industry && <p className="text-xs text-slate-500 mt-1">{contact.account.industry}</p>}
              </div>
            )}

            {intel?.likelyPriorities?.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-xs font-bold uppercase text-slate-400 mb-3">Likely Priorities</p>
                <ul className="space-y-1.5">
                  {intel.likelyPriorities.map((p: string, i: number) => (
                    <li key={i} className="text-xs text-slate-700 flex gap-2">
                      <span className="text-blue-400 shrink-0">•</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {contact.deals?.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-xs font-bold uppercase text-slate-400 mb-3">Pipeline</p>
                <div className="space-y-2">
                  {contact.deals.slice(0, 3).map((d: any) => (
                    <Link key={d.id} href={`/deals/${d.id}`} className="flex items-center justify-between hover:bg-slate-50 rounded-lg p-2 -mx-2 transition-colors group">
                      <span className="text-xs text-slate-700 group-hover:text-blue-600 font-medium truncate">{d.title}</span>
                      <span className="text-xs text-slate-500 ml-2 shrink-0">R{(d.value || 0).toLocaleString()}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Intelligence tab */}
      {activeTab === 'intelligence' && (
        <div className="space-y-4">
          {researching && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-center gap-4">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-800">Researching {contact.name}…</p>
                <p className="text-xs text-blue-600 mt-0.5">Searching LinkedIn, news mentions, and professional background</p>
              </div>
            </div>
          )}

          {!intel && !researching && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">★</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">No intelligence data yet</h3>
              <p className="text-xs text-slate-500 mb-4">Click below to research this contact across LinkedIn, Google, and news sources.</p>
              <button onClick={runIntelligence} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Run Contact Intelligence
              </button>
            </div>
          )}

          {intel && (
            <>
              {/* Background + approach */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Professional Background</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {intel.decisionRole && roleStyle && (
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${roleStyle.bg} ${roleStyle.text}`}>{roleStyle.label}</span>
                      )}
                      {intel.influence && (
                        <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${INFLUENCE_COLORS[intel.influence] ?? ''}`}>
                          {intel.influence} influence
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 ml-auto">Confidence: {intel.dataConfidence}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">{intel.background}</p>
                {intel.approachStyle && (
                  <div className="bg-blue-50 rounded-lg px-4 py-3 border border-blue-100">
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wide mb-1">Recommended Approach</p>
                    <p className="text-sm text-blue-800">{intel.approachStyle}</p>
                  </div>
                )}
              </div>

              {/* Talking points */}
              {intel.talkingPoints?.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Talking Points</h3>
                  <div className="space-y-2.5">
                    {intel.talkingPoints.map((tp: string, i: number) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                        <p className="text-sm text-slate-700 leading-relaxed">{tp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Priorities */}
              {intel.likelyPriorities?.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Likely Priorities</h3>
                  <ul className="space-y-2">
                    {intel.likelyPriorities.map((p: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-700">
                        <span className="text-emerald-500 shrink-0">✓</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Red flags */}
              {intel.redFlags?.length > 0 && (
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
                  <h3 className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">Watch Out</h3>
                  <ul className="space-y-1.5">
                    {intel.redFlags.map((f: string, i: number) => (
                      <li key={i} className="text-sm text-amber-900 flex gap-2">
                        <span className="text-amber-500 shrink-0">⚠</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Source note + refresh */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>{intel.sourceNote}</span>
                <button onClick={runIntelligence} disabled={researching} className="text-blue-500 hover:text-blue-700 font-semibold disabled:opacity-50">
                  ↺ Refresh
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Deals tab */}
      {activeTab === 'deals' && (
        <div className="space-y-3">
          {contact.deals?.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="text-sm text-slate-500">No deals linked to this contact yet.</p>
            </div>
          ) : (
            contact.deals.map((d: any) => (
              <Link key={d.id} href={`/deals/${d.id}`}
                className="block bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-200 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{d.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{d.stage}</p>
                  </div>
                  <p className="font-bold text-slate-900">R{(d.value || 0).toLocaleString()}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
