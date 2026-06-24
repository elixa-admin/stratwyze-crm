'use client';

import { useState } from 'react';

interface Action {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  completed: boolean;
}

interface StageQuickLogProps {
  dealId: string;
  stage: string;
  actions: Action[];
  onActionLogged: (actionId: string, outcome: string, notes: string) => Promise<void>;
}

type Outcome = 'positive' | 'neutral' | 'blocked';

const OUTCOMES: { key: Outcome; label: string; symbol: string; active: string; icon: string }[] = [
  { key: 'positive', label: 'Positive', symbol: '✓', active: 'bg-emerald-500 border-emerald-500 text-white', icon: '✓' },
  { key: 'neutral',  label: 'Neutral',  symbol: '—', active: 'bg-amber-500 border-amber-500 text-white',   icon: '—' },
  { key: 'blocked',  label: 'Blocked',  symbol: '⚠', active: 'bg-red-500 border-red-500 text-white',       icon: '⚠' },
];

export default function StageQuickLog({ stage, actions, onActionLogged }: StageQuickLogProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<Outcome>('positive');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const pendingActions = actions.filter(a => !a.completed);

  if (pendingActions.length === 0) {
    return (
      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4">
        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-emerald-800">
          All {stage} actions complete — ready to advance
        </p>
      </div>
    );
  }

  const handleSave = async (actionId: string) => {
    if (saving) return;
    setSaving(true);
    try {
      await onActionLogged(actionId, outcome, notes);
      setExpanded(null);
      setNotes('');
      setOutcome('positive');
    } finally {
      setSaving(false);
    }
  };

  const collapse = () => { setExpanded(null); setNotes(''); setOutcome('positive'); };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">What happened?</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {pendingActions.length} action{pendingActions.length !== 1 ? 's' : ''} remaining · tap to log
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-50">
        {pendingActions.map(action => (
          <div key={action.id}>
            {expanded === action.id ? (
              // ─── Expanded inline form ───
              <div className="p-5 bg-blue-50 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{action.title}</p>
                    {action.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
                    )}
                  </div>
                  <button onClick={collapse} className="text-xs text-slate-400 hover:text-slate-600 flex-shrink-0 mt-0.5">
                    Cancel
                  </button>
                </div>

                {/* Outcome picker */}
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-2">How did it go?</p>
                  <div className="flex gap-2">
                    {OUTCOMES.map(o => (
                      <button
                        key={o.key}
                        onClick={() => setOutcome(o.key)}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                          outcome === o.key ? o.active : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {o.icon} {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1.5">Notes &amp; next steps</p>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Key takeaways, what was agreed, what happens next…"
                    rows={3}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
                  />
                </div>

                {/* Save */}
                <button
                  onClick={() => handleSave(action.id)}
                  disabled={saving}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving…
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Save + Mark Complete
                    </>
                  )}
                </button>
              </div>
            ) : (
              // ─── Collapsed dashed button ───
              <button
                onClick={() => setExpanded(action.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-all group"
              >
                <div className="w-5 h-5 rounded-full border-2 border-dashed border-slate-300 group-hover:border-blue-400 flex-shrink-0 transition-colors" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">
                    Log: {action.title}
                  </p>
                  {action.required && (
                    <p className="text-xs text-slate-400 mt-0.5">Required · tap to record outcome</p>
                  )}
                </div>
                <svg className="text-slate-300 group-hover:text-blue-400 transition-colors flex-shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
