'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/lib/toast';

interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  body: string;
}

interface EmailComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealId: string;
  dealTitle: string;
  toEmail?: string;
  toName?: string;
  contactId?: string;
  accountName?: string;
  stage?: string;
}

const PURPOSES = [
  { key: 'follow_up',      label: 'Follow-up after meeting' },
  { key: 'proposal_intro', label: 'Proposal introduction' },
  { key: 'objection',      label: 'Address an objection' },
  { key: 'demo_request',   label: 'Request a demo' },
  { key: 'check_in',       label: 'Re-engagement check-in' },
  { key: 'closing',        label: 'Closing / decision prompt' },
  { key: 'custom',         label: 'Custom context…' },
];

const TONES = [
  { key: 'professional',  label: 'Professional' },
  { key: 'friendly',      label: 'Friendly' },
  { key: 'urgent',        label: 'Action-oriented' },
  { key: 'consultative',  label: 'Consultative' },
];

const CATEGORY_LABELS: Record<string, string> = {
  follow_up: 'Follow-up',
  proposal:  'Proposal',
  objection: 'Objection',
  custom:    'Custom',
};

export default function EmailComposeModal({
  isOpen, onClose, dealId, dealTitle, toEmail = '', toName = '', contactId, accountName,
}: EmailComposeModalProps) {
  const [tab, setTab] = useState<'compose' | 'ai'>('compose');

  // Compose fields
  const [to, setTo] = useState(toEmail);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  // Templates
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // AI draft
  const [purpose, setPurpose] = useState('follow_up');
  const [tone, setTone] = useState('professional');
  const [extraContext, setExtraContext] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTo(toEmail);
    fetch('/api/email/templates')
      .then(r => r.json())
      .then(d => setTemplates(d.templates ?? []))
      .catch(() => {});
  }, [isOpen, toEmail]);

  const applyTemplate = (id: string) => {
    const tpl = templates.find(t => t.id === id);
    if (!tpl) return;
    setSelectedTemplate(id);
    const vars: Record<string, string> = {
      dealTitle,
      contactName: toName || 'there',
      accountName: accountName ?? 'your organisation',
      actionItem1: '— to be added',
      actionItem2: '— to be added',
      followUpDate: 'end of this week',
      painPoint1: '— add from your notes',
      painPoint2: '— add from your notes',
      referenceNumber: 'STR-XXXX',
      agentCount: '—',
      deploymentPref: '—',
      incumbentPlatform: '—',
    };
    let s = tpl.subject;
    let b = tpl.body;
    Object.entries(vars).forEach(([k, v]) => {
      s = s.replace(new RegExp(`{{${k}}}`, 'g'), v);
      b = b.replace(new RegExp(`{{${k}}}`, 'g'), v);
    });
    setSubject(s);
    setBody(b);
    setTab('compose');
  };

  const handleAIDraft = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/email/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, purpose, tone, contactName: toName, extraContext }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Draft failed');
      const data = await res.json();
      setSubject(data.subject);
      setBody(data.body);
      setTab('compose');
      toast('AI draft ready — review before sending', 'success');
    } catch (err: any) {
      toast(err.message ?? 'Draft failed', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!to || !subject || !body || sending) return;
    setSending(true);
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, to, subject, body, contactId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Send failed');
      toast(`Email sent to ${to}`, 'success');
      onClose();
      setSubject(''); setBody(''); setSelectedTemplate('');
    } catch (err: any) {
      toast(err.message ?? 'Send failed', 'error');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const groupedTemplates = templates.reduce<Record<string, EmailTemplate[]>>((acc, t) => {
    const cat = t.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">Compose Email</h2>
            <p className="text-xs text-blue-200 mt-0.5">{dealTitle}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-blue-200 hover:text-white hover:bg-white/20 transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-100 flex-shrink-0">
          {[
            { id: 'compose', label: 'Compose' },
            { id: 'ai',      label: '✦ AI Draft' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all border-b-2 ${
                tab === t.id
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* ─── Compose tab ─── */}
          {tab === 'compose' && (
            <div className="p-6 space-y-4">
              {/* Template picker */}
              {templates.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Use Template</label>
                  <select
                    value={selectedTemplate}
                    onChange={e => applyTemplate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
                  >
                    <option value="">— Select a template —</option>
                    {Object.entries(groupedTemplates).map(([cat, tpls]) => (
                      <optgroup key={cat} label={CATEGORY_LABELS[cat] ?? cat}>
                        {tpls.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              )}

              {/* To */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">To</label>
                <input
                  type="email"
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  placeholder="recipient@company.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Email subject"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Message</label>
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="Write your email…"
                  rows={10}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-slate-800 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* ─── AI Draft tab ─── */}
          {tab === 'ai' && (
            <div className="p-6 space-y-5">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                <p className="text-xs text-indigo-700 font-medium">
                  AI will draft a contextual email using the deal stage, account, and incumbent data — then drop it into Compose for you to review before sending.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Purpose</label>
                <div className="grid grid-cols-2 gap-2">
                  {PURPOSES.map(p => (
                    <button
                      key={p.key}
                      onClick={() => setPurpose(p.key)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium text-left border transition-all ${
                        purpose === p.key
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tone</label>
                <div className="flex gap-2 flex-wrap">
                  {TONES.map(t => (
                    <button
                      key={t.key}
                      onClick={() => setTone(t.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        tone === t.key
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {purpose === 'custom' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Context for AI</label>
                  <textarea
                    value={extraContext}
                    onChange={e => setExtraContext(e.target.value)}
                    placeholder="e.g. We met at the MicroFocus event. CIO mentioned they need to replace BMC before end of Q3 due to a licence expiry."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              )}

              <button
                onClick={handleAIDraft}
                disabled={generating || (purpose === 'custom' && !extraContext.trim())}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {generating ? (
                  <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Drafting…</>
                ) : (
                  <>✦ Generate Draft</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer — send */}
        {tab === 'compose' && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-4 flex-shrink-0 bg-slate-50">
            <div className="text-xs text-slate-400 min-w-0 truncate">
              {to ? `To: ${to}` : 'Add a recipient'}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!to || !subject || !body || sending}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {sending ? (
                  <><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending…</>
                ) : (
                  <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Send Email</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
