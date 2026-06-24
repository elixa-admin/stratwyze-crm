'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';

interface GenerateProposalModalProps {
  dealId: string;
  dealTitle: string;
  onClose: () => void;
}

export default function GenerateProposalModal({ dealId, dealTitle, onClose }: GenerateProposalModalProps) {
  const [agentCount, setAgentCount] = useState(30);
  const [deploymentPref, setDeploymentPref] = useState<'SaaS' | 'On-Premises'>('SaaS');
  const [exchangeRate, setExchangeRate] = useState(17.0);
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch('/api/proposals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, agentCount, deploymentPref, exchangeRate }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Generation failed');
      }

      const { proposalId, referenceNumber } = await res.json();
      toast(`Proposal ${referenceNumber} generated`, 'success');
      onClose();
      window.open(`/proposals/${proposalId}`, '_blank');
    } catch (err: any) {
      toast(err.message ?? 'Failed to generate proposal', 'error');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{ color: '#2A7FD4' }}>
                S T R A T W Y Z E &nbsp; S O L U T I O N S
              </p>
              <h2 className="text-base font-bold text-slate-900">Generate Proposal</h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">{dealTitle}</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Agent count */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Agent / Analyst Headcount
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={agentCount}
                onChange={e => setAgentCount(Number(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#2A7FD4' }}
              />
              <span className="text-sm font-bold text-slate-900 w-10 text-right">{agentCount}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Named agent seats for Scenario A pricing</p>
          </div>

          {/* Deployment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Preferred Deployment
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['SaaS', 'On-Premises'] as const).map(opt => (
                <button
                  key={opt}
                  onClick={() => setDeploymentPref(opt)}
                  className={`py-2.5 px-3 rounded-lg text-sm font-semibold border transition-all ${
                    deploymentPref === opt
                      ? 'text-white border-transparent shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                  style={deploymentPref === opt ? { backgroundColor: '#2A7FD4' } : {}}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Exchange rate */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              USD/ZAR Exchange Rate
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium">R</span>
              <input
                type="number"
                min={10}
                max={30}
                step={0.5}
                value={exchangeRate}
                onChange={e => setExchangeRate(Number(e.target.value))}
                className="w-24 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': '#2A7FD4' } as any}
              />
              <span className="text-xs text-slate-400">per USD (indicative)</span>
            </div>
          </div>

          {/* Info box */}
          <div className="rounded-lg p-3 text-xs text-slate-600 space-y-1" style={{ backgroundColor: '#EFF6FF', borderLeft: '3px solid #2A7FD4' }}>
            <p className="font-semibold text-slate-800">What gets generated:</p>
            <ul className="space-y-0.5 ml-2">
              <li>• AI-written Executive Summary tailored to this deal</li>
              <li>• Why HaloITSM capability mapping</li>
              <li>• 4 pricing scenarios (Named A/B + Concurrent C1/C2)</li>
              <li>• Deployment options, implementation timeline, T&Cs</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-60"
            style={{ backgroundColor: generating ? '#93C5FD' : '#2A7FD4' }}
          >
            {generating ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating with AI…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Generate Proposal
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
