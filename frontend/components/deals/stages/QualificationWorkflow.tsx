'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';
import StageGateIndicator from '../StageGateIndicator';
import { checkStageLocking } from '@/lib/deal-gating';
import DiscoveryWorkflowEmbedded from '../embedded-workflows/DiscoveryWorkflowEmbedded';
import QualificationScorecardEmbedded from '../embedded-workflows/QualificationScorecardEmbedded';

type QualificationTab = 'discovery' | 'scorecard' | 'decision';

interface QualificationWorkflowProps {
  deal: any;
  onStepComplete?: (stepId: string) => void;
  onAdvance?: () => void;
}

export default function QualificationWorkflow({
  deal,
  onStepComplete,
  onAdvance,
}: QualificationWorkflowProps) {
  const [activeTab, setActiveTab] = useState<QualificationTab>('discovery');
  const [discoveryComplete, setDiscoveryComplete] = useState(
    deal?.stageWorkflow?.stepsCompleted?.includes('discovery-completed') || false
  );
  const [scoredComplete, setScoredComplete] = useState(
    deal?.stageWorkflow?.stepsCompleted?.includes('qualified-scored') || false
  );

  const stepsCompleted = deal?.stageWorkflow?.stepsCompleted || [];
  const gates = checkStageLocking('Qualification', stepsCompleted, {
    fitScore: deal?.stageWorkflow?.fitScore,
  });

  const handleDiscoveryComplete = async (discoveryData: any) => {
    setDiscoveryComplete(true);
    setActiveTab('scorecard');
    onStepComplete?.('discovery-completed');

    // Save discovery data to opportunity profile
    try {
      await fetch(`/api/deals/${deal.id}/opportunity-profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discoveryData,
        }),
      });
    } catch (err) {
      console.error('Failed to save discovery data:', err);
    }
  };

  const handleScoreComplete = async (qualificationData: any) => {
    setScoredComplete(true);
    onStepComplete?.('qualified-scored');

    // Save qualification data
    try {
      await fetch(`/api/deals/${deal.id}/opportunity-profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qualificationData,
        }),
      });
    } catch (err) {
      console.error('Failed to save qualification data:', err);
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

      {/* Tab navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex gap-2 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('discovery')}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === 'discovery'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Step 1: Discovery {discoveryComplete && '✓'}
          </button>
          <button
            onClick={() => setActiveTab('scorecard')}
            disabled={!discoveryComplete}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === 'scorecard'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : discoveryComplete
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            Step 2: Score {scoredComplete && '✓'}
          </button>
          <button
            onClick={() => setActiveTab('decision')}
            disabled={!scoredComplete}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === 'decision'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : scoredComplete
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            Step 3: Decide
          </button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'discovery' && (
        <DiscoveryWorkflowEmbedded
          deal={deal}
          onComplete={handleDiscoveryComplete}
        />
      )}

      {activeTab === 'scorecard' && (
        <QualificationScorecardEmbedded
          deal={deal}
          onComplete={handleScoreComplete}
        />
      )}

      {activeTab === 'decision' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Decision & Next Steps
          </h3>
          <div className="space-y-3">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <p className="text-sm text-slate-600">
                Based on the discovery and qualification scorecard, you're ready to advance to the
                Proposal stage.
              </p>
            </div>
            <button
              onClick={handleAdvance}
              disabled={!gates.canAdvance}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                gates.canAdvance
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {gates.canAdvance ? '→ Advance to Proposal' : '⚠️ Complete all steps'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
