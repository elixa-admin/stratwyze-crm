'use client';

import { useState } from 'react';
import ExpandableSection from './ExpandableSection';
import Tooltip from './Tooltip';
import { Toast, useToast } from './Toast';
import { COMPETITORS } from '@/lib/data/competitors';
import { SA_PARTNERS } from '@/lib/data/sa-partners';
import { BriefParser } from '@/lib/utils/brief-parser';
import type { DealEnrichmentData } from '@/lib/types/deal-enrichment';

interface NewDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; value: number; accountId: string; stageName: string; competitorId?: string; saPartnerId?: string }) => void;
}

interface FormErrors {
  title?: string;
  value?: string;
  research?: string;
}

export default function NewDealModal({ isOpen, onClose, onSubmit }: NewDealModalProps) {
  // CRITICAL FIX: Deal creation without competitor/provider required
  // Deployed: 2026-06-22 - Remove validation blocking deal creation
  const { toasts, success, error } = useToast();
  const [step, setStep] = useState<'basic' | 'research'>('basic');
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [accountId, setAccountId] = useState('');
  const [stageName, setStageName] = useState('Prospecting');
  const [competitorId, setCompetitorId] = useState('');
  const [saPartnerId, setSaPartnerId] = useState('');
  const [briefData, setBriefData] = useState<any>(null);
  const [enrichmentData, setEnrichmentData] = useState<DealEnrichmentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [researchLog, setResearchLog] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = 'Deal title is required';
    if (!value || parseFloat(value) <= 0) newErrors.value = 'Deal value must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleConfirmDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !value) {
      error('Please fill in all required fields');
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
          enrichmentData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed to create deal (${response.status})`);
      }

      const data = await response.json();
      success(`Deal "${title}" created successfully! 🎉`);

      // Reset form
      setTitle('');
      setValue('');
      setAccountId('');
      setStageName('Prospecting');
      setCompetitorId('');
      setSaPartnerId('');
      setBriefData(null);
      setEnrichmentData(null);

      // Call original callback for any additional handling
      onSubmit({
        title,
        value: parseFloat(value),
        accountId,
        stageName,
        competitorId: competitorId || undefined,
        saPartnerId: saPartnerId || undefined,
      });

      // Close modal after successful creation
      setTimeout(() => {
        onClose();
      }, 500);
      setEnrichmentData(null);
      setResearchLog('');
      setErrors({});
      setStep('basic');
      onClose();
    } catch (err: any) {
      error(err?.message || 'Failed to create deal');
      console.error('Deal creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-slate-900">
            {step === 'basic' ? 'Create New Deal' : 'Research Results'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {step === 'basic' ? 'Step 1 of 2' : 'Step 2 of 2'}
          </p>
        </div>

        {step === 'basic' ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!title || !value) {
              error('Deal title and value are required');
              return;
            }
            handleConfirmDeal(e);
          }} className="p-6 space-y-5">
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
                <option value="acme">Acme Corp</option>
                <option value="global">Global Inc</option>
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
                {loading ? 'Researching...' : (competitorId || saPartnerId ? 'Generate Brief' : 'Create Deal')}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            {briefData && (
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

                {/* Phase 2b: Deal Enrichment Data */}
                {enrichmentData && (
                  <ExpandableSection title="📋 Company Intelligence" defaultOpen={true}>
                    <div className="space-y-2 text-sm">
                      {enrichmentData.website && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Website:</span>
                          <a href={enrichmentData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {enrichmentData.website}
                          </a>
                        </div>
                      )}
                      {enrichmentData.annualRevenue && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Annual Revenue:</span>
                          <span className="font-medium text-slate-900">
                            {enrichmentData.annualRevenue.currency} {enrichmentData.annualRevenue.value.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {enrichmentData.employees && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Employees:</span>
                          <span className="font-medium text-slate-900">{enrichmentData.employees.toLocaleString()}</span>
                        </div>
                      )}
                      {enrichmentData.industry && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Industry:</span>
                          <span className="font-medium text-slate-900">{enrichmentData.industry}</span>
                        </div>
                      )}
                      {enrichmentData.legalEntity && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Legal Entity:</span>
                          <span className="font-medium text-slate-900">{enrichmentData.legalEntity}</span>
                        </div>
                      )}
                      {enrichmentData.cxoDetails && enrichmentData.cxoDetails.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-slate-200">
                          <span className="text-slate-600 font-medium">CxO Contacts:</span>
                          <div className="space-y-1 mt-2">
                            {enrichmentData.cxoDetails.map((cxo, i) => (
                              <div key={i} className="text-xs bg-slate-50 p-2 rounded">
                                <div className="font-medium text-slate-900">{cxo.name} — {cxo.title}</div>
                                {cxo.email && <div className="text-slate-600">{cxo.email}</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {enrichmentData.dataConfidence && (
                        <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between">
                          <span className="text-slate-600 text-xs">Data Confidence:</span>
                          <span className={`text-xs font-medium ${enrichmentData.dataConfidence === 'High' ? 'text-green-600' : enrichmentData.dataConfidence === 'Medium' ? 'text-amber-600' : 'text-red-600'}`}>
                            {enrichmentData.dataConfidence}
                          </span>
                        </div>
                      )}
                    </div>
                  </ExpandableSection>
                )}

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

                {/* Phase 5: Research Details (Expandable) */}
                <ExpandableSection title="🔍 Research Details" defaultOpen={false}>
                  <div className="space-y-2">
                    {researchLog && (
                      <div className="bg-slate-900 text-slate-100 rounded p-2 font-mono text-xs overflow-auto max-h-32">
                        <div className="whitespace-pre-wrap text-slate-400">{researchLog}</div>
                      </div>
                    )}
                    <div className="text-xs text-slate-500 flex gap-4">
                      <span>⏱️ {briefData.totalDuration}ms</span>
                      <span>💰 R{briefData.costEstimate?.toFixed(2)}</span>
                      <span>🤖 {briefData.aiTier}</span>
                    </div>
                  </div>
                </ExpandableSection>

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
            )}
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      {toasts.map((toast, idx) => (
        <Toast key={idx} message={toast.message} type={toast.type} duration={4000} />
      ))}
    </div>
  );
}
