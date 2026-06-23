'use client';

import { useEffect, useState } from 'react';
import ProspectingWorkflow from '@/components/deals/stages/ProspectingWorkflow';
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
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-3">Qualification Workflow</h2>
                <p className="text-sm text-slate-600">
                  Qualification workflow (Phase 18) will be embedded here.
                </p>
                <p className="text-xs text-slate-500 mt-2">Coming in Wave 18</p>
              </div>
            )}

            {deal.stage === 'Proposal' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-3">Proposal Workflow</h2>
                <p className="text-sm text-slate-600">
                  Proposal workflow (Phase 19) will be embedded here.
                </p>
                <p className="text-xs text-slate-500 mt-2">Coming in Wave 19</p>
              </div>
            )}

            {(deal.stage === 'Won' || deal.stage === 'Lost') && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-3">Deal Complete</h2>
                <p className="text-sm text-slate-600">
                  This deal is in a final state. No further actions available.
                </p>
              </div>
            )}
          </div>

          {/* Right column (30%): Opportunity profile sidebar */}
          <div className="lg:col-span-1">
            <OpportunityProfileSidebar profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
}
