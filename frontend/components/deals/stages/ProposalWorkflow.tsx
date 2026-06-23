'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';
import StageGateIndicator from '../StageGateIndicator';
import { checkStageLocking } from '@/lib/deal-gating';
import SolutionDesignForm from '../embedded-workflows/SolutionDesignForm';
import ProposalGenerator from '../embedded-workflows/ProposalGenerator';
import NegotiationBrief from '../embedded-workflows/NegotiationBrief';

type ProposalTab = 'design' | 'proposal' | 'negotiate' | 'close';

interface ProposalWorkflowProps {
  deal: any;
  onStepComplete?: (stepId: string) => void;
  onAdvance?: () => void;
}

export default function ProposalWorkflow({ deal, onStepComplete, onAdvance }: ProposalWorkflowProps) {
  const stepsCompleted: string[] = deal?.stageWorkflow?.stepsCompleted ?? [];

  const [activeTab, setActiveTab] = useState<ProposalTab>(
    stepsCompleted.includes('proposal-generated') ? 'negotiate' : 'design'
  );
  const [solutionDesign, setSolutionDesign] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(
    (deal?.stageWorkflow?.proposalData as any) ?? null
  );

  const gates = checkStageLocking('Proposal', stepsCompleted, {});

  const handleDesignComplete = (design: any) => {
    setSolutionDesign(design);
    setActiveTab('proposal');
  };

  const handleProposalGenerated = async (proposalData: any) => {
    setProposal(proposalData);
    onStepComplete?.('proposal-generated');
    setActiveTab('negotiate');
  };

  const handleAdvanceToWon = async () => {
    if (!gates.canAdvance) {
      toast('Approve the proposal before closing', 'error');
      return;
    }
    onAdvance?.();
  };

  const tabs: { id: ProposalTab; label: string; stepId?: string }[] = [
    { id: 'design', label: 'Solution Design' },
    { id: 'proposal', label: 'Generate Proposal', stepId: 'proposal-generated' },
    { id: 'negotiate', label: 'Negotiation Brief' },
    { id: 'close', label: 'Close Deal', stepId: 'proposal-approved' },
  ];

  const tabUnlocked = (tab: ProposalTab) => {
    if (tab === 'design') return true;
    if (tab === 'proposal') return !!solutionDesign || stepsCompleted.includes('proposal-generated');
    if (tab === 'negotiate') return stepsCompleted.includes('proposal-generated') || !!proposal;
    if (tab === 'close') return stepsCompleted.includes('proposal-generated');
    return false;
  };

  return (
    <div className="space-y-4">
      <StageGateIndicator gates={gates} canAdvance={gates.canAdvance} />

      {/* Tab bar */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex border-b border-slate-100 px-4">
          {tabs.map(tab => {
            const unlocked = tabUnlocked(tab.id);
            const done = tab.stepId ? stepsCompleted.includes(tab.stepId) : false;
            return (
              <button
                key={tab.id}
                onClick={() => unlocked && setActiveTab(tab.id)}
                disabled={!unlocked}
                className={`px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : unlocked
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                {done ? <span className="text-emerald-600">✓ </span> : null}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'design' && (
        <SolutionDesignForm deal={deal} onComplete={handleDesignComplete} />
      )}

      {activeTab === 'proposal' && (
        <ProposalGenerator
          deal={deal}
          solutionDesign={solutionDesign}
          existingProposal={proposal}
          onGenerated={handleProposalGenerated}
        />
      )}

      {activeTab === 'negotiate' && (
        <NegotiationBrief deal={deal} proposal={proposal} />
      )}

      {activeTab === 'close' && (
        <CloseDeal
          deal={deal}
          stepsCompleted={stepsCompleted}
          onStepComplete={onStepComplete}
          onAdvance={handleAdvanceToWon}
          gates={gates}
        />
      )}
    </div>
  );
}

// Inline close component — small enough to not warrant a separate file
function CloseDeal({ deal, stepsCompleted: _stepsCompleted, onStepComplete, onAdvance, gates: _gates }: any) {
  const [outcome, setOutcome] = useState<'Won' | 'Lost' | ''>('');
  const [lossReason, setLossReason] = useState('');
  const [signedDate, setSignedDate] = useState('');
  const [saving, setSaving] = useState(false);

  const handleClose = async () => {
    if (!outcome) { toast('Select Won or Lost', 'error'); return; }
    if (outcome === 'Won' && !signedDate) { toast('Enter the signature date', 'error'); return; }
    if (outcome === 'Lost' && !lossReason) { toast('Enter a loss reason', 'error'); return; }

    setSaving(true);
    try {
      await fetch(`/api/deals/${deal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: outcome, lossReason: outcome === 'Lost' ? lossReason : undefined }),
      });
      onStepComplete?.('proposal-approved');
      toast(`Deal marked as ${outcome}`, 'success');
      onAdvance?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Close Deal</h3>
        <p className="text-xs text-slate-500">Record the final outcome and complete the audit trail.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(['Won', 'Lost'] as const).map(opt => (
          <button
            key={opt}
            onClick={() => setOutcome(opt)}
            className={`py-3 rounded-lg border-2 text-sm font-bold transition-all ${
              outcome === opt
                ? opt === 'Won'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-red-400 bg-red-50 text-red-700'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {opt === 'Won' ? '🏆 Won' : '❌ Lost'}
          </button>
        ))}
      </div>

      {outcome === 'Won' && (
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">Signature Date</label>
          <input
            type="date"
            value={signedDate}
            onChange={e => setSignedDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          />
        </div>
      )}

      {outcome === 'Lost' && (
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">Loss Reason</label>
          <select
            value={lossReason}
            onChange={e => setLossReason(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
          >
            <option value="">Select reason...</option>
            <option>Chose competitor — ServiceNow</option>
            <option>Chose competitor — Jira Service Management</option>
            <option>Chose competitor — Freshservice</option>
            <option>Chose competitor — BMC Helix</option>
            <option>Budget frozen / no budget</option>
            <option>Project cancelled / deprioritised</option>
            <option>No decision — stalled</option>
            <option>Lost to incumbent (renewal)</option>
            <option>Poor fit — requirements mismatch</option>
            <option>Internal champion left</option>
          </select>
        </div>
      )}

      {outcome && (
        <button
          onClick={handleClose}
          disabled={saving}
          className={`w-full py-3 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 ${
            outcome === 'Won'
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {saving ? 'Saving...' : `Confirm ${outcome}`}
        </button>
      )}
    </div>
  );
}
