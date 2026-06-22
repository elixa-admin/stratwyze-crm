'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Deal {
  id: string;
  title: string;
  value: number;
  currency: string;
  stage: 'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won';
  accountId?: string;
  account?: { id: string; name: string; industry?: string };
  incumbentPlatform?: string;
  incumbentProvider?: string;
  createdAt: string;
  updatedAt: string;
}

const STAGES: Deal['stage'][] = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'];

const STAGE_COLORS: Record<string, string> = {
  'Prospecting':   'bg-slate-100 text-slate-700',
  'Qualification': 'bg-blue-100 text-blue-700',
  'Proposal':      'bg-amber-100 text-amber-700',
  'Negotiation':   'bg-purple-100 text-purple-700',
  'Closed Won':    'bg-green-100 text-green-700',
};

export default function DealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editStage, setEditStage] = useState<Deal['stage']>('Prospecting');
  const [editNotes, setEditNotes] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch(`/api/deals/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.deal) {
          setDeal(data.deal);
          setEditTitle(data.deal.title);
          setEditValue(String(data.deal.value));
          setEditStage(data.deal.stage);
          setEditNotes('');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!deal) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/deals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          value: parseFloat(editValue),
          stage: editStage,
        }),
      });
      const data = await res.json();
      if (data.deal) {
        setDeal(data.deal);
        setDirty(false);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-slate-500">Deal not found.</p>
        <Link href="/pipeline" className="text-sm text-blue-600 hover:underline">← Back to Pipeline</Link>
      </div>
    );
  }

  const stageIndex = STAGES.indexOf(editStage);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/pipeline" className="hover:text-slate-700 transition-colors">Pipeline</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate">{deal.title}</span>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={editTitle}
              onChange={e => { setEditTitle(e.target.value); setDirty(true); }}
              className="w-full text-2xl font-bold text-slate-900 bg-transparent border-0 focus:outline-none focus:ring-0 p-0 placeholder:text-slate-300"
              placeholder="Deal title"
            />
            <p className="text-sm text-slate-500 mt-1">
              Created {new Date(deal.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STAGE_COLORS[editStage]}`}>
              {editStage}
            </span>
          </div>
        </div>

        {/* Stage progression bar */}
        <div className="mb-5">
          <p className="text-xs font-medium text-slate-500 mb-2">Stage</p>
          <div className="flex gap-1">
            {STAGES.map((s, i) => (
              <button
                key={s}
                onClick={() => { setEditStage(s); setDirty(true); }}
                className={`flex-1 py-1.5 rounded text-[11px] font-medium transition-all ${
                  i <= stageIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {s === 'Closed Won' ? 'Won' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Value + Account */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Deal Value</label>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">R</span>
              <input
                type="number"
                value={editValue}
                onChange={e => { setEditValue(e.target.value); setDirty(true); }}
                className="flex-1 text-lg font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Account</label>
            <div className="text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 min-h-[42px] flex items-center">
              {deal.account?.name ?? <span className="text-slate-400">No account linked</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Competitive context */}
      {(deal.incumbentPlatform || deal.incumbentProvider) && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Competitive Context</h3>
          <div className="grid grid-cols-2 gap-4">
            {deal.incumbentPlatform && (
              <div>
                <p className="text-xs text-slate-500 mb-1">Incumbent Platform</p>
                <p className="text-sm font-medium text-slate-900">{deal.incumbentPlatform}</p>
              </div>
            )}
            {deal.incumbentProvider && (
              <div>
                <p className="text-xs text-slate-500 mb-1">SI Partner</p>
                <p className="text-sm font-medium text-slate-900">{deal.incumbentProvider}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes placeholder */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Notes</h3>
        <textarea
          value={editNotes}
          onChange={e => { setEditNotes(e.target.value); setDirty(true); }}
          placeholder="Add notes about this deal..."
          rows={4}
          className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder:text-slate-400"
        />
      </div>

      {/* Save bar */}
      {dirty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-lg z-50">
          <span className="text-sm">Unsaved changes</span>
          <button
            onClick={() => {
              setEditTitle(deal.title);
              setEditValue(String(deal.value));
              setEditStage(deal.stage);
              setEditNotes('');
              setDirty(false);
            }}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      )}
    </div>
  );
}
