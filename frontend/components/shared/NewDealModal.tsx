'use client';

import { useState, useEffect } from 'react';
import ExpandableSection from './ExpandableSection';
import Tooltip from './Tooltip';
import { toast } from '@/lib/toast';
import { COMPETITORS } from '@/lib/data/competitors';
import { SA_PARTNERS } from '@/lib/data/sa-partners';

interface NewDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; value: number; accountId: string; stageName: string; dealId?: string; competitorId?: string; saPartnerId?: string }) => void;
}

interface FormErrors {
  title?: string;
  value?: string;
  research?: string;
}

export default function NewDealModal({ isOpen, onClose, onSubmit }: NewDealModalProps) {
  const [step, setStep] = useState<'basic' | 'research'>('basic');
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [accountId, setAccountId] = useState('');
  const [accounts, setAccounts] = useState<{ id: string; name: string; industry?: string; annualRevenue?: number }[]>([]);
  const [stageName, setStageName] = useState('Prospecting');
  const [competitorId, setCompetitorId] = useState('');
  const [saPartnerId, setSaPartnerId] = useState('');
  const [briefData, setBriefData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleGenerateBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !value) {
      toast('Deal title and value are required', 'error');
      return;
    }

    setLoading(true);
    try {
      const account = accounts.find(a => a.id === accountId);
      const response = await fetch('/api/deals/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          incumbentPlatform: competitorId ? COMPETITORS.find(c => c.id === competitorId)?.name : undefined,
          saPartner: saPartnerId ? SA_PARTNERS.find(p => p.id === saPartnerId)?.name : undefined,
          accountInfo: account ? { name: account.name, industry: account.industry, annualRevenue: account.annualRevenue } : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate brief');

      setBriefData(data);
      setStep('research');
    } catch (err: any) {
      toast(err?.message || 'Brief generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !value) {
      toast('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          value: parseFloat(value),
          accountId,
          stageName,
          competitorId: competitorId || undefined,
          saPartnerId: saPartnerId || undefined,
          competitiveBrief: briefData?.brief || undefined,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error || `Failed to create deal (${response.status})`);
      }

      toast(`Deal "${title}" created`, 'success');

      // Reset form
      setTitle('');
      setValue('');
      setAccountId('');
      setStageName('Prospecting');
      setCompetitorId('');
      setSaPartnerId('');
      setBriefData(null);

      // Call original callback for any additional handling
      onSubmit({
        title,
        value: parseFloat(value),
        accountId,
        stageName,
        dealId: responseData.deal?.id,
        competitorId: competitorId || undefined,
        saPartnerId: saPartnerId || undefined,
      });

      // Close modal after successful creation
      setTimeout(() => {
        onClose();
      }, 500);
      setErrors({});
      setStep('basic');
    } catch (err: any) {
      toast(err?.message || 'Failed to create deal', 'error');
      console.error('Deal creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/accounts')
      .then(r => r.json())
      .then(data => { if (data.accounts) setAccounts(data.accounts); })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-200 sticky top-0 bg-white flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Create New Deal</h2>
            <p className="text-xs text-slate-500 mt-1">Fill in the details below to add to your pipeline</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all -mt-0.5 -mr-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {step === 'basic' ? (
          <form onSubmit={handleGenerateBrief} className="p-6 space-y-5">
            {/* Deal Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Deal Title <span className="required-indicator">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: undefined });
                }}
                placeholder="e.g. Acme Corp Implementation"
                className={`input-field ${errors.title ? 'error' : ''}`}
              />
              {errors.title && <p className="error-message">{errors.title}</p>}
            </div>

            {/* Deal Value */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Deal Value (R) <span className="required-indicator">*</span>
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (errors.value) setErrors({ ...errors, value: undefined });
                }}
                placeholder="e.g. 250000"
                className={`input-field ${errors.value ? 'error' : ''}`}
              />
              {errors.value && <p className="error-message">{errors.value}</p>}
            </div>

            {/* Account */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Account</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="input-field"
              >
                <option value="">Select account (optional)</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            {/* Stage */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Stage</label>
              <select
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                className="input-field"
              >
                <option value="Prospecting">Prospecting</option>
                <option value="Qualification">Qualification</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed Won">Closed Won</option>
              </select>
            </div>

            {/* AI Research Section */}
            <div className="border-t border-slate-200 pt-5">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-slate-900">AI Research</h3>
                <Tooltip content="Generate competitive intelligence and battle cards using AI">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </Tooltip>
              </div>
              <p className="text-xs text-slate-600 mb-4">Select competitor and/or SI partner to generate AI competitive intelligence</p>

              {/* Incumbent Platform */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                  Incumbent Platform
                  <Tooltip content="Current platform in use by the prospect">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </Tooltip>
                </label>
                <select
                  value={competitorId}
                  onChange={(e) => setCompetitorId(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select platform or Unknown</option>
                  {COMPETITORS.map((competitor) => (
                    <option key={competitor.id} value={competitor.id}>
                      {competitor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Incumbent SI / Consultancy */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                  Incumbent SI / Consultancy
                  <Tooltip content="SI partner or consultancy implementing the current platform">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </Tooltip>
                </label>
                <select
                  value={saPartnerId}
                  onChange={(e) => setSaPartnerId(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select provider or Unknown</option>
                  {SA_PARTNERS.map((partner) => (
                    <option key={partner.id} value={partner.id}>
                      {partner.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-600 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-150 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {loading && <div className="spinner" />}
                {loading ? 'Researching...' : 'Generate Brief'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-500">Generating competitive brief...</p>
              </div>
            ) : briefData ? (
              <>
                {/* Phase 1: Opening Impact */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Opening</h4>
                      <p className="text-sm text-blue-800 leading-relaxed">{briefData.brief?.openingStatement}</p>
                    </div>
                  </div>
                </div>

                {/* Phase 2: Win Statement (Primary CTA) */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💪</span>
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">Your Win</h4>
                      <p className="text-sm text-green-800 font-medium italic">{briefData.brief?.winStatement}</p>
                    </div>
                  </div>
                </div>


                {/* Phase 3: Key Risks (Expandable) */}
                <ExpandableSection title="🚨 Key Risks" defaultOpen={true}>
                  <ul className="space-y-2">
                    {briefData.brief?.platformRisks?.map((risk: string, i: number) => (
                      <li key={i} className="text-sm text-slate-600 flex gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                    {briefData.brief?.siRisks?.map((risk: string, i: number) => (
                      <li key={`si-${i}`} className="text-sm text-slate-600 flex gap-2">
                        <span className="text-orange-500 font-bold">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </ExpandableSection>

                {/* Phase 4: Strategic Angles (Expandable) */}
                {(briefData.brief?.cioAngle || briefData.brief?.itManagerAngle) && (
                  <ExpandableSection title="📊 Strategic Angles" defaultOpen={false}>
                    <div className="space-y-3">
                      {briefData.brief?.cioAngle && (
                        <div className="bg-slate-50 rounded p-3 border-l-2 border-blue-500">
                          <h5 className="font-semibold text-sm text-slate-900 mb-1">CIO Perspective</h5>
                          <p className="text-xs text-slate-600">{briefData.brief.cioAngle}</p>
                        </div>
                      )}
                      {briefData.brief?.itManagerAngle && (
                        <div className="bg-slate-50 rounded p-3 border-l-2 border-indigo-500">
                          <h5 className="font-semibold text-sm text-slate-900 mb-1">IT Manager Perspective</h5>
                          <p className="text-xs text-slate-600">{briefData.brief.itManagerAngle}</p>
                        </div>
                      )}
                    </div>
                  </ExpandableSection>
                )}

                {/* Research Details */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 font-medium mb-2">Research Metadata</p>
                  <div className="text-xs text-slate-500 flex gap-4">
                    <span>⏱️ {briefData.duration}ms</span>
                    <span>💰 R{briefData.costEstimate?.toFixed(4)}</span>
                    <span>🤖 {briefData.aiTier}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep('basic')}
                    className="btn-ghost flex-1"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDeal}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-600 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-150"
                  >
                    ✓ Create Deal
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-500">No brief data available</p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
