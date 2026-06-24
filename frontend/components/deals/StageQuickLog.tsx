'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';

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
  onDebriefComplete?: () => void;
}

type Mode = 'log' | 'debrief';
type Outcome = 'positive' | 'neutral' | 'blocked';
type InputType = 'notes' | 'email';

const OUTCOMES: { key: Outcome; label: string; active: string; icon: string }[] = [
  { key: 'positive', label: 'Positive', active: 'bg-emerald-500 border-emerald-500 text-white', icon: '✓' },
  { key: 'neutral',  label: 'Neutral',  active: 'bg-amber-500  border-amber-500  text-white', icon: '—' },
  { key: 'blocked',  label: 'Blocked',  active: 'bg-red-500    border-red-500    text-white', icon: '⚠' },
];

interface DebriefResult {
  summary: string;
  sentiment: 'positive' | 'neutral' | 'at_risk';
  stageSuggestion: { action: 'advance' | 'stay' | 'risk'; reason: string };
  actionItems: { content: string; suggestedDueDays: number; owner: string }[];
  objections: { text: string; competitor: string | null; category: string }[];
  tasksCreated: number;
}

const SENTIMENT_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  positive: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: 'Positive signal' },
  neutral:  { bg: 'bg-amber-50  border-amber-200',   text: 'text-amber-700',   label: 'Neutral' },
  at_risk:  { bg: 'bg-red-50    border-red-200',     text: 'text-red-700',     label: 'At risk' },
};

const STAGE_ACTION_STYLE: Record<string, { badge: string; label: string }> = {
  advance: { badge: 'bg-emerald-100 text-emerald-700', label: '↑ Ready to advance' },
  stay:    { badge: 'bg-blue-100 text-blue-700',       label: '→ Stay in stage' },
  risk:    { badge: 'bg-red-100 text-red-700',         label: '⚠ Stage at risk' },
};

export default function StageQuickLog({ dealId, stage, actions, onActionLogged, onDebriefComplete }: StageQuickLogProps) {
  // Mode toggle
  const [mode, setMode] = useState<Mode>('log');

  // Quick Log state
  const [expanded, setExpanded] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<Outcome>('positive');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // AI Debrief state
  const [inputType, setInputType] = useState<InputType>('notes');
  const [rawText, setRawText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<DebriefResult | null>(null);

  const pendingActions = actions.filter(a => !a.completed);

  // ─── Quick Log handlers ───────────────────────────────────────

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

  // ─── AI Debrief handlers ──────────────────────────────────────

  const handleDebrief = async () => {
    if (!rawText.trim() || processing) return;
    setProcessing(true);
    setResult(null);
    try {
      const res = await fetch('/api/deals/debrief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, rawText: rawText.trim(), inputType }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Debrief failed');
      const data = await res.json();
      setResult(data);
      toast(`Debrief complete — ${data.tasksCreated} action item${data.tasksCreated !== 1 ? 's' : ''} created`, 'success');
      onDebriefComplete?.();
    } catch (err: any) {
      toast(err.message ?? 'Debrief failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const resetDebrief = () => { setRawText(''); setResult(null); };

  // ─── Render ───────────────────────────────────────────────────

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Mode toggle header */}
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">What happened?</p>
          {mode === 'log' && pendingActions.length > 0 && (
            <p className="text-xs text-slate-400 mt-0.5">{pendingActions.length} action{pendingActions.length !== 1 ? 's' : ''} remaining · tap to log</p>
          )}
        </div>
        <div className="flex items-center gap-1 bg-white rounded-lg border border-slate-200 p-0.5">
          <button
            onClick={() => setMode('log')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${mode === 'log' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Quick Log
          </button>
          <button
            onClick={() => setMode('debrief')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${mode === 'debrief' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
            AI Debrief
          </button>
        </div>
      </div>

      {/* ─── Quick Log mode ─── */}
      {mode === 'log' && (
        <>
          {pendingActions.length === 0 ? (
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-emerald-800">All {stage} actions complete — ready to advance</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {pendingActions.map(action => (
                <div key={action.id}>
                  {expanded === action.id ? (
                    <div className="p-5 bg-blue-50 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{action.title}</p>
                          {action.description && <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>}
                        </div>
                        <button onClick={collapse} className="text-xs text-slate-400 hover:text-slate-600 flex-shrink-0 mt-0.5">Cancel</button>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">How did it go?</p>
                        <div className="flex gap-2">
                          {OUTCOMES.map(o => (
                            <button
                              key={o.key}
                              onClick={() => setOutcome(o.key)}
                              className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${outcome === o.key ? o.active : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                            >
                              {o.icon} {o.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-1.5">Notes &amp; next steps</p>
                        <textarea
                          value={notes}
                          onChange={e => setNotes(e.target.value)}
                          placeholder="Key takeaways, what was agreed, what happens next…"
                          rows={3}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
                        />
                      </div>

                      <button
                        onClick={() => handleSave(action.id)}
                        disabled={saving}
                        className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                      >
                        {saving ? (
                          <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving…</>
                        ) : (
                          <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Save + Mark Complete</>
                        )}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setExpanded(action.id)}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-all group"
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-dashed border-slate-300 group-hover:border-blue-400 flex-shrink-0 transition-colors" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">Log: {action.title}</p>
                        {action.required && <p className="text-xs text-slate-400 mt-0.5">Required · tap to record outcome</p>}
                      </div>
                      <svg className="text-slate-300 group-hover:text-blue-400 transition-colors flex-shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ─── AI Debrief mode ─── */}
      {mode === 'debrief' && (
        <div className="p-5 space-y-4">
          {!result ? (
            <>
              {/* Input type toggle */}
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-slate-600 mr-1">Input:</p>
                {(['notes', 'email'] as InputType[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setInputType(t)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                      inputType === t ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {t === 'notes' ? '📝 Call / Meeting Notes' : '📧 Email Thread'}
                  </button>
                ))}
              </div>

              {/* Text area */}
              <div>
                <textarea
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  placeholder={
                    inputType === 'notes'
                      ? 'Paste your call notes here…\ne.g. "Spoke with CIO — confirmed Q3 budget of R1.2M. Main concern is migration timeline. Wants to see a phased plan. Asked us to send pricing by Friday. Incumbent is still BMC Remedy, they hate the upgrade cycle. Competing against Dimension Data SI."'
                      : 'Paste the email thread here…\nThe AI will extract the latest context, commitments, and any concerns raised.'
                  }
                  rows={8}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-slate-50"
                />
              </div>

              {/* Process button */}
              <button
                onClick={handleDebrief}
                disabled={!rawText.trim() || processing}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {processing ? (
                  <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Analysing with AI…</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>Extract Intelligence</>
                )}
              </button>
            </>
          ) : (
            /* ─── Debrief result ─── */
            <div className="space-y-4">
              {/* Sentiment + stage signal */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${SENTIMENT_STYLE[result.sentiment]?.bg} ${SENTIMENT_STYLE[result.sentiment]?.text}`}>
                  {SENTIMENT_STYLE[result.sentiment]?.label}
                </span>
                {result.stageSuggestion && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STAGE_ACTION_STYLE[result.stageSuggestion.action]?.badge}`}>
                    {STAGE_ACTION_STYLE[result.stageSuggestion.action]?.label}
                  </span>
                )}
              </div>

              {/* Summary */}
              <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Summary</p>
                <p className="text-sm text-slate-800 leading-relaxed">{result.summary}</p>
                {result.stageSuggestion?.reason && (
                  <p className="text-xs text-slate-500 mt-2 italic">{result.stageSuggestion.reason}</p>
                )}
              </div>

              {/* Action items */}
              {result.actionItems.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Action Items <span className="text-emerald-600 normal-case font-medium">({result.tasksCreated} added to deal)</span>
                  </p>
                  <div className="space-y-2">
                    {result.actionItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-emerald-50 rounded-lg px-3 py-2.5 border border-emerald-100">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-600 flex-shrink-0 mt-0.5">
                          <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-800">{item.content}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Due in {item.suggestedDueDays}d · {item.owner}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Objections */}
              {result.objections.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Objections Detected</p>
                  <div className="space-y-2">
                    {result.objections.map((obj, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-amber-50 rounded-lg px-3 py-2.5 border border-amber-100">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-600 flex-shrink-0 mt-0.5">
                          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-800">{obj.text}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">{obj.category}</span>
                            {obj.competitor && (
                              <span className="text-xs text-slate-500">vs {obj.competitor}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reset */}
              <button
                onClick={resetDebrief}
                className="w-full py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 transition-all"
              >
                + New Debrief
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
