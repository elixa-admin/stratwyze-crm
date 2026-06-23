'use client';

import { useEffect, useState } from 'react';
import ProspectingWorkflow from '@/components/deals/stages/ProspectingWorkflow';
import QualificationWorkflow from '@/components/deals/stages/QualificationWorkflow';
import ProposalWorkflow from '@/components/deals/stages/ProposalWorkflow';
import OpportunityProfileSidebar from '@/components/deals/OpportunityProfileSidebar';
import { getNextStage } from '@/lib/deal-gating';
import { toast } from '@/lib/toast';

interface DealPageV2Props {
  params: { id: string };
}

/**
 * Wave 17: New deal detail page with workflow-driven stages
 * Replaces: app/(app)/deals/[id]/page.tsx (old static page)
 * Features:
 *   - Gated stage progression (strict)
 *   - Workflow panel (changes per stage)
 *   - OpportunityProfile sidebar (always visible)
 *   - Auto-triggers workflows (workflows open on stage entry)
 */
export default function DealDetailPageV2({ params }: DealPageV2Props) {
  const dealId = params.id;

  const [deal, setDeal] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch deal + workflow + profile
  useEffect(() => {
    async function loadDeal() {
      try {
        const res = await fetch(`/api/deals/${dealId}`);
        if (res.ok) {
          const data = await res.json();
          setDeal(data.deal);
        }

        // Fetch opportunity profile
        const profileRes = await fetch(`/api/deals/${dealId}/opportunity-profile`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData.profile);
        }
      } catch (err) {
        console.error('Failed to load deal:', err);
        toast('Failed to load deal', 'error');
      } finally {
        setLoading(false);
      }
    }

    loadDeal();
  }, [dealId]);

  const handleStepComplete = async (stepId: string) => {
    try {
      // Log step completion
      await fetch(`/api/deals/${dealId}/stage-completion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId }),
      });

      // Refresh deal state
      const res = await fetch(`/api/deals/${dealId}`);
      if (res.ok) {
        const data = await res.json();
        setDeal(data.deal);
      }
    } catch (err) {
      console.error('Failed to complete step:', err);
    }
  };

  const handleAdvanceStage = async () => {
    try {
      const nextStage = getNextStage(deal.stage);
      if (!nextStage) {
        toast('Cannot advance from final stage', 'error');
        return;
      }

      // Update deal stage
      const res = await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: nextStage }),
      });

      if (res.ok) {
        const data = await res.json();
        setDeal(data.deal);
        toast(`Moved to ${nextStage}`, 'success');

        // Mark stage completion
        await fetch(`/api/deals/${dealId}/stage-completion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stepId: `${deal.stage.toLowerCase()}-completed`,
          }),
        });
      }
    } catch (err) {
      toast('Failed to advance stage', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-600">Loading deal...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-sm text-red-600">Deal not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{deal.title}</h1>
              <p className="text-sm text-slate-600 mt-1">
                {deal.account?.name || 'No account linked'} •{' '}
                <span className="font-semibold text-blue-600">{deal.stage}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-900">
                R{(deal.value || 0).toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-1">Deal value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stage progress indicator */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <StageStepper currentStage={deal.stage} />
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column (70%): Workflow panel */}
          <div className="lg:col-span-2">
            {deal.stage === 'Prospecting' && (
              <ProspectingWorkflow
                deal={deal}
                onStepComplete={handleStepComplete}
                onAdvance={handleAdvanceStage}
              />
            )}

            {deal.stage === 'Qualification' && (
              <QualificationWorkflow
                deal={deal}
                onStepComplete={handleStepComplete}
                onAdvance={handleAdvanceStage}
              />
            )}

            {deal.stage === 'Proposal' && (
              <ProposalWorkflow
                deal={deal}
                onStepComplete={handleStepComplete}
                onAdvance={handleAdvanceStage}
              />
            )}

            {(deal.stage === 'Won' || deal.stage === 'Lost') && (
              <DealOutcomeCard deal={deal} />
            )}
          </div>

          {/* Right column (30%): Opportunity profile sidebar */}
          <div className="lg:col-span-1">
            <OpportunityProfileSidebar profile={profile} deal={deal} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Stage stepper — top of page progress indicator
const STAGES = ['Prospecting', 'Qualification', 'Proposal', 'Won'];

function StageStepper({ currentStage }: { currentStage: string }) {
  const isLost = currentStage === 'Lost';
  const currentIdx = STAGES.indexOf(currentStage);
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-6 py-3 flex items-center gap-0">
      {STAGES.map((stage, idx) => {
        const isDone = !isLost && currentIdx > idx;
        const isCurrent = stage === currentStage;
        return (
          <div key={stage} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                isDone ? 'bg-emerald-500 border-emerald-500 text-white'
                  : isCurrent ? (isLost ? 'bg-red-500 border-red-500 text-white' : 'bg-blue-600 border-blue-600 text-white')
                  : 'border-slate-200 text-slate-400'
              }`}>
                {isDone ? '✓' : idx + 1}
              </div>
              <span className={`text-[10px] mt-1 font-semibold ${isCurrent ? 'text-blue-600' : isDone ? 'text-emerald-600' : 'text-slate-400'}`}>
                {stage}
              </span>
            </div>
            {idx < STAGES.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 -mt-4 ${isDone ? 'bg-emerald-400' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
      {isLost && (
        <div className="flex flex-col items-center ml-2">
          <div className="w-7 h-7 rounded-full bg-red-100 border-2 border-red-300 text-red-500 flex items-center justify-center text-xs font-bold">✗</div>
          <span className="text-[10px] mt-1 font-semibold text-red-500">Lost</span>
        </div>
      )}
    </div>
  );
}

function DealOutcomeCard({ deal }: { deal: any }) {
  const isWon = deal.stage === 'Won';
  return (
    <div className={`rounded-xl border p-8 text-center ${isWon ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
      <div className="text-5xl mb-4">{isWon ? '🏆' : '📋'}</div>
      <h2 className={`text-2xl font-bold mb-2 ${isWon ? 'text-emerald-800' : 'text-red-800'}`}>
        Deal {deal.stage}
      </h2>
      {isWon && (
        <p className="text-sm text-emerald-700">
          Congratulations! R{(deal.value || 0).toLocaleString()} closed successfully.
        </p>
      )}
      {!isWon && deal.lossReason && (
        <p className="text-sm text-red-700">Loss reason: {deal.lossReason}</p>
      )}
      <div className="mt-6 flex justify-center gap-3">
        <a href="/deals" className="px-5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">
          ← Back to Pipeline
        </a>
        {!isWon && (
          <button
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Review Deal
          </button>
        )}
      </div>
    </div>
  );
}
