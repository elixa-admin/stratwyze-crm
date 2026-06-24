'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/lib/toast';
import { formatCurrency } from '@/lib/format';
import { COMPETITORS } from '@/lib/data/competitors';
import { SA_PARTNERS } from '@/lib/data/sa-partners';

interface NewDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; value: number; accountId: string; stageName: string; dealId?: string }) => void;
}

type Step = 'details' | 'confirm';

const INDUSTRIES = ['IT Services', 'Financial Services', 'Healthcare', 'Manufacturing', 'Retail & FMCG', 'Government & Public Sector', 'Logistics & Transport', 'Education', 'Mining & Resources', 'Telecommunications', 'Professional Services', 'Other'];
const STAGES = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'];
const CLOSED = ['Closed Won', 'Closed Lost'];

interface AccountLite {
  id: string; name: string; industry?: string; annualRevenue?: number;
  website?: string; employees?: number; headquarters?: string;
}
interface DealLite {
  id: string; title: string; stage: string; value: number;
  account?: { id: string; name: string } | null;
}

const IconChevron = ({ dir = 'right' }: { dir?: 'left' | 'right' }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    {dir === 'right' ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
  </svg>
);
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const Spinner = () => (
  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
);

function StepIndicator({ current }: { current: number }) {
  const steps = ['Deal Details', 'Review & Create'];
  return (
    <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-100 bg-slate-50">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
            i < current ? 'bg-blue-600 text-white' :
            i === current ? 'bg-blue-600 text-white ring-2 ring-blue-200' :
            'bg-slate-200 text-slate-500'
          }`}>
            {i < current ? '✓' : i + 1}
          </div>
          <span className={`text-xs font-medium ${i === current ? 'text-blue-700' : i < current ? 'text-slate-600' : 'text-slate-400'}`}>
            {label}
          </span>
          {i < steps.length - 1 && <div className={`w-6 h-px ${i < current ? 'bg-blue-400' : 'bg-slate-200'}`} />}
        </div>
      ))}
    </div>
  );
}

export default function NewDealModal({ isOpen, onClose, onSubmit }: NewDealModalProps) {
  const [step, setStep] = useState<Step>('details');
  // Essentials
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [accountId, setAccountId] = useState('');
  const [stageName, setStageName] = useState('Prospecting');
  // New-account fields (only used when no account is linked)
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  // Optional extras
  const [showExtras, setShowExtras] = useState(false);
  const [competitorId, setCompetitorId] = useState('');
  const [saPartnerId, setSaPartnerId] = useState('');
  const [notes, setNotes] = useState('');
  // Data
  const [accounts, setAccounts] = useState<AccountLite[]>([]);
  const [existingDeals, setExistingDeals] = useState<DealLite[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/accounts').then(r => r.json()).then(d => { if (d.accounts) setAccounts(d.accounts); }).catch(() => {});
    fetch('/api/deals').then(r => r.json()).then(d => { if (d.deals) setExistingDeals(d.deals); }).catch(() => {});
  }, [isOpen]);

  // Auto-fill new-account fields when an account is selected (so the company
  // summary on the review step reflects the linked account).
  useEffect(() => {
    if (!accountId) return;
    const acct = accounts.find(a => a.id === accountId);
    if (!acct) return;
    if (!companyName) setCompanyName(acct.name);
    if (!website && acct.website) setWebsite(acct.website);
    if (!industry && acct.industry) setIndustry(acct.industry);
    if (!location && acct.headquarters) setLocation(acct.headquarters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  const resetAll = () => {
    setStep('details');
    setTitle(''); setValue(''); setAccountId(''); setStageName('Prospecting');
    setCompanyName(''); setWebsite(''); setIndustry(''); setLocation('');
    setShowExtras(false); setCompetitorId(''); setSaPartnerId(''); setNotes('');
    setLoading(false);
  };

  const handleClose = () => { resetAll(); onClose(); };

  const selectedAccount = accounts.find(a => a.id === accountId);
  const incumbentPlatform = competitorId ? COMPETITORS.find(c => c.id === competitorId)?.name : undefined;
  const incumbentProvider = saPartnerId ? SA_PARTNERS.find(p => p.id === saPartnerId)?.name : undefined;

  // Duplicate guard — open deals already on the chosen account
  const openDealsOnAccount = accountId
    ? existingDeals.filter(d => d.account?.id === accountId && !CLOSED.includes(d.stage))
    : [];

  const goToReview = () => {
    if (!title.trim() || !value) { toast('Deal title and value required', 'error'); return; }
    if (parseFloat(value) <= 0) { toast('Deal value must be greater than zero', 'error'); return; }
    setStep('confirm');
  };

  const handleCreateDeal = async () => {
    setLoading(true);
    try {
      const autoCreateAccount = !accountId && (companyName.trim() || title.trim())
        ? {
            name: companyName.trim() || title.trim(),
            website: website.trim() || null,
            industry: industry || null,
            headquarters: location.trim() || null,
          }
        : undefined;

      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          value: parseFloat(value),
          stage: stageName,
          accountId: accountId || undefined,
          incumbentPlatform,
          incumbentProvider,
          notes: notes.trim() || undefined,
          autoCreateAccount,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create deal');

      const accountMsg = data.accountCreated ? ' · Account auto-created' : '';
      toast(`Deal "${title.trim()}" created${accountMsg}`, 'success');
      onSubmit({ title: title.trim(), value: parseFloat(value), accountId: data.deal?.accountId || accountId, stageName, dealId: data.deal?.id });
      setTimeout(() => { resetAll(); onClose(); }, 300);
    } catch (err: any) {
      toast(err?.message || 'Failed to create deal', 'error');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between bg-gradient-to-r from-blue-600 to-indigo-600">
          <div>
            <h2 className="text-base font-bold text-white">Create New Deal</h2>
            <p className="text-xs text-blue-200 mt-0.5">Capture the essentials — generate the AI brief later from the deal.</p>
          </div>
          <button onClick={handleClose} className="w-7 h-7 rounded-full flex items-center justify-center text-blue-200 hover:text-white hover:bg-white/20 transition-all">
            <IconX />
          </button>
        </div>

        <StepIndicator current={step === 'details' ? 0 : 1} />

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* ─── STEP 1: Details ─── */}
          {step === 'details' && (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Deal Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') goToReview(); }}
                  placeholder="e.g. MTN ITSM Modernisation"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                    Value (ZAR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder="250000"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Stage</label>
                  <select value={stageName} onChange={e => setStageName(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Link to Account</label>
                <select value={accountId} onChange={e => setAccountId(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">No account — create a new one below</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>

              {/* Linked account summary OR new-account fields */}
              {selectedAccount ? (
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                  <p className="text-xs font-semibold text-slate-700">{selectedAccount.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {[selectedAccount.industry, selectedAccount.headquarters].filter(Boolean).join(' · ') || 'Linked account'}
                  </p>
                  {openDealsOnAccount.length > 0 && (
                    <p className="text-[11px] text-amber-600 mt-1.5 font-medium">
                      ⚠ {openDealsOnAccount.length} open deal{openDealsOnAccount.length !== 1 ? 's' : ''} already on this account
                    </p>
                  )}
                </div>
              ) : (
                <div className="border border-dashed border-slate-300 rounded-lg p-4 space-y-3 bg-slate-50/50">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">New account will be created</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        placeholder={title || 'Company name'}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Leave blank to use the deal title</p>
                    </div>
                    <input
                      type="url"
                      value={website}
                      onChange={e => setWebsite(e.target.value)}
                      placeholder="Website"
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select value={industry} onChange={e => setIndustry(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Industry</option>
                      {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="Headquarters / location"
                      className="col-span-2 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Optional extras — collapsed by default to keep the flow fast */}
              {!showExtras ? (
                <button
                  onClick={() => setShowExtras(true)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  + Add competitive context & notes (optional)
                </button>
              ) : (
                <div className="border-t border-slate-100 pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1.5">Incumbent Platform</label>
                      <select value={competitorId} onChange={e => setCompetitorId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="">Unknown / None</option>
                        {COMPETITORS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1.5">Incumbent SI</label>
                      <select value={saPartnerId} onChange={e => setSaPartnerId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="">Unknown / None</option>
                        {SA_PARTNERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Notes</label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="e.g. Met at MicroFocus event. CIO mentioned pain with current ticketing. Budget cycle Q1 2026."
                      rows={2}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── STEP 2: Review & Create ─── */}
          {step === 'confirm' && (
            <div className="p-6 space-y-4">
              {/* Summary */}
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Deal</span>
                  <span className="text-sm font-semibold text-slate-900 text-right">{title.trim()}</span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Value</span>
                  <span className="text-sm font-semibold text-slate-900">{value ? formatCurrency(parseFloat(value)) : '—'}</span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Stage</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">{stageName}</span>
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Account</span>
                  <span className="text-sm font-medium text-slate-900 text-right">
                    {selectedAccount
                      ? selectedAccount.name
                      : <span className="text-emerald-700">{companyName.trim() || title.trim()} <span className="text-[11px] font-normal text-emerald-600">(new)</span></span>}
                  </span>
                </div>
                {(incumbentPlatform || incumbentProvider) && (
                  <div className="px-4 py-3 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500">Competitive</span>
                    <span className="flex gap-1.5 flex-wrap justify-end">
                      {incumbentPlatform && <span className="text-[11px] bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-full">vs {incumbentPlatform}</span>}
                      {incumbentProvider && <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">SI: {incumbentProvider}</span>}
                    </span>
                  </div>
                )}
              </div>

              {/* Duplicate guard */}
              {openDealsOnAccount.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                    <span>⚠</span> This account already has {openDealsOnAccount.length} open deal{openDealsOnAccount.length !== 1 ? 's' : ''}
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {openDealsOnAccount.slice(0, 4).map(d => (
                      <li key={d.id} className="text-xs text-amber-700 flex items-center justify-between gap-2">
                        <span className="truncate">{d.title}</span>
                        <span className="text-[11px] text-amber-600 flex-shrink-0">{d.stage} · {formatCurrency(d.value)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-amber-600 mt-1.5">Create anyway if this is a separate opportunity.</p>
                </div>
              )}

              {/* Brief hint */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-2.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500 flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                </svg>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Need a competitive brief and prospect research? Generate it in one click from the deal page after creating — no need to wait now.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-100 px-6 py-4 bg-white flex gap-3">
          {step === 'details' && (
            <>
              <button onClick={handleClose} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={goToReview}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Review <IconChevron />
              </button>
            </>
          )}

          {step === 'confirm' && (
            <>
              <button onClick={() => setStep('details')} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1">
                <IconChevron dir="left" /> Back
              </button>
              <button
                onClick={handleCreateDeal}
                disabled={loading}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Spinner /> : '✓'} Create Deal
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
