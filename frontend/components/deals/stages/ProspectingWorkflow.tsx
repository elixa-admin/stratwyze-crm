'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';
import StageGateIndicator from '../StageGateIndicator';
import { checkStageLocking } from '@/lib/deal-gating';

interface ProspectingWorkflowProps {
  deal: any;
  onStepComplete?: (stepId: string) => void;
  onAdvance?: () => void;
}

export default function ProspectingWorkflow({ deal, onStepComplete, onAdvance }: ProspectingWorkflowProps) {
  const [discoveryScheduled, setDiscoveryScheduled] = useState(deal?.discoveryScheduledDate || '');
  const [loading, setLoading] = useState(false);

  const stepsCompleted = deal?.stageWorkflow?.stepsCompleted || [];
  const gates = checkStageLocking(deal?.stage || 'Prospecting', stepsCompleted, deal);

  const handleGeneratePreBrief = async () => {
    setLoading(true);
    try {
      // Trigger pre-meeting brief generation
      const res = await fetch(`/api/phase14/pre-meeting-brief`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: deal?.title,
          accountId: deal?.accountId,
          incumbentGuess: deal?.incumbentPlatform,
        }),
      });

      if (res.ok) {
        toast('Pre-meeting brief generated', 'success');
        onStepComplete?.('pre-brief-generated');
      } else {
        toast('Failed to generate brief', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleDiscovery = async () => {
    if (!discoveryScheduled) {
      toast('Please select a date for discovery call', 'error');
      return;
    }

    setLoading(true);
    try {
      // Log that discovery is scheduled
      const res = await fetch(`/api/deals/${deal.id}/stage-completion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepId: 'discovery-scheduled',
          metadata: { discoveryDate: discoveryScheduled },
        }),
      });

      if (res.ok) {
        toast('Discovery call scheduled', 'success');
        onStepComplete?.('discovery-scheduled');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdvance = () => {
    if (!gates.canAdvance) {
      toast('Complete all requirements before advancing', 'error');
      return;
    }
    onAdvance?.();
  };

  return (
    <div className="space-y-4">
      {/* Gate status */}
      <StageGateIndicator gates={gates} canAdvance={gates.canAdvance} />

      {/* Step 1: Generate Pre-Meeting Brief */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Step 1: Generate Pre-Meeting Brief</h3>
            <p className="text-xs text-slate-500 mt-0.5">AI research on company, news, M&A, ITSM relevance</p>
          </div>
          {stepsCompleted.includes('pre-brief-generated') && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              ✓ Done
            </span>
          )}
        </div>

        {!stepsCompleted.includes('pre-brief-generated') ? (
          <button
            onClick={handleGeneratePreBrief}
            disabled={loading}
            className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                🔍 Generate Pre-Meeting Brief
              </>
            )}
          </button>
        ) : (
          <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <p className="text-xs text-emerald-700">Pre-meeting brief has been generated. Review it in the Opportunity Profile panel.</p>
          </div>
        )}
      </div>

      {/* Step 2: Schedule Discovery Call */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Step 2: Schedule Discovery Call</h3>
            <p className="text-xs text-slate-500 mt-0.5">When will you have your discovery meeting?</p>
          </div>
          {stepsCompleted.includes('discovery-scheduled') && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              ✓ Done
            </span>
          )}
        </div>

        {!stepsCompleted.includes('discovery-scheduled') ? (
          <div className="mt-3 space-y-3">
            <input
              type="datetime-local"
              value={discoveryScheduled}
              onChange={e => setDiscoveryScheduled(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={handleScheduleDiscovery}
              disabled={loading || !discoveryScheduled}
              className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Scheduling...' : '📅 Confirm Discovery Call'}
            </button>
          </div>
        ) : (
          <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <p className="text-xs text-emerald-700">✓ Discovery call scheduled for {new Date(discoveryScheduled).toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* Step 3: Completion Notes */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">What happens next</h3>
        <p className="text-sm text-slate-600 mb-3">
          When you've scheduled the discovery call and generated the pre-meeting brief, you'll be able to advance to the Qualification stage. There, you'll run the discovery workflow, extract key intel, and score the deal.
        </p>
        <button
          onClick={handleAdvance}
          disabled={!gates.canAdvance}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            gates.canAdvance
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {gates.canAdvance ? '→ Advance to Qualification' : '⚠️ Complete requirements above'}
        </button>
      </div>
    </div>
  );
}
