'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/lib/toast';

interface QualificationScorecardEmbeddedProps {
  deal: any;
  onComplete?: (qualificationData: any) => void;
}

/**
 * Embedded qualification scorecard for Qualification stage
 * Shows: Fit score (0-100), pain alignment, battle-card, go/no-go decision
 */
export default function QualificationScorecardEmbedded({
  deal,
  onComplete,
}: QualificationScorecardEmbeddedProps) {
  const [fitScore, setFitScore] = useState(deal?.stageWorkflow?.fitScore || 0);
  const [goNoGo, setGoNoGo] = useState<'GO' | 'NO-GO' | 'MAYBE' | ''>(
    deal?.stageWorkflow?.goNoGo || ''
  );
  const [reasoningNotes, setReasoningNotes] = useState('');
  const [decided, setDecided] = useState(false);

  // Calculate fit score based on discovery data
  useEffect(() => {
    const calculateFitScore = () => {
      let score = 50; // baseline

      const workflow = deal?.stageWorkflow;
      if (!workflow) return score;

      // Factors that increase fit
      if (workflow.painPoints?.includes('High implementation cost')) score += 15; // HaloITSM is cheaper
      if (workflow.painPoints?.includes('Slow time-to-value')) score += 15; // HaloITSM is faster
      if (workflow.painPoints?.includes('User adoption challenges')) score += 10; // HaloITSM has better UX
      if (workflow.painPoints?.includes('Licensing complexity')) score += 10; // HaloITSM has simpler pricing
      if (workflow.budgetRange) score += 5; // Budget clarity is good
      if (workflow.timeline && workflow.timeline.includes('months')) score += 5; // Timeline clarity is good

      // Factors that decrease fit
      if (workflow.timeline?.includes('12+')) score -= 10; // Long timelines less urgent
      if (!workflow.incumbent) score -= 5; // Unknown incumbent is risky

      return Math.max(0, Math.min(100, score));
    };

    const calculated = calculateFitScore();
    setFitScore(calculated);
  }, [deal]);

  const handleConfirmDecision = async () => {
    if (!goNoGo) {
      toast('Please select Go or No-Go', 'error');
      return;
    }

    setDecided(true);

    // Save qualification decision
    const qualData = {
      fitScore,
      goNoGo,
      reasoningNotes,
      positioningAngle: getPositioningAngle(),
    };

    onComplete?.(qualData);

    // Update deal workflow
    try {
      await fetch(`/api/deals/${deal.id}/stage-completion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepId: 'qualified-scored',
          metadata: qualData,
        }),
      });

      // Update workflow with qualification data
      await fetch(`/api/deals/${deal.id}/opportunity-profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qualificationData: qualData,
        }),
      });

      toast(`Deal qualified: ${goNoGo}`, 'success');
    } catch (err) {
      console.error('Failed to save qualification:', err);
    }
  };

  const getPositioningAngle = (): string => {
    const workflow = deal?.stageWorkflow;
    if (!workflow) return 'General';

    if (workflow.painPoints?.includes('High implementation cost')) return 'Cost';
    if (workflow.painPoints?.includes('Slow time-to-value')) return 'Speed';
    if (workflow.painPoints?.includes('User adoption challenges')) return 'Adoption';
    if (workflow.painPoints?.includes('Licensing complexity')) return 'Simplicity';

    return 'General';
  };

  const positioningAngle = getPositioningAngle();

  return (
    <div className="space-y-4">
      {/* Fit Score Display */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Deal Fit Score</h3>

        {/* Score visualization */}
        <div className="flex items-end gap-4 mb-6">
          <div className="flex-1">
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  fitScore >= 70
                    ? 'bg-emerald-500'
                    : fitScore >= 50
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${fitScore}%` }}
              />
            </div>
          </div>
          <div className="text-4xl font-bold text-slate-900">{fitScore}</div>
        </div>

        {/* Interpretation */}
        <div className={`rounded-lg p-3 ${
          fitScore >= 70
            ? 'bg-emerald-50 border border-emerald-100'
            : fitScore >= 50
            ? 'bg-amber-50 border border-amber-100'
            : 'bg-red-50 border border-red-100'
        }`}>
          <p className={`text-sm font-semibold ${
            fitScore >= 70
              ? 'text-emerald-700'
              : fitScore >= 50
              ? 'text-amber-700'
              : 'text-red-700'
          }`}>
            {fitScore >= 70
              ? '✓ Strong fit - This deal is qualified'
              : fitScore >= 50
              ? '⚠️ Moderate fit - Additional qualification needed'
              : '✗ Poor fit - Consider nurturing or pass'}
          </p>
        </div>
      </div>

      {/* Positioning Angle */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Recommended Positioning</h3>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <p className="text-sm font-bold text-blue-700 mb-2">{positioningAngle}</p>
          <p className="text-xs text-blue-600">
            {positioningAngle === 'Cost' &&
              'Lead with HaloITSM\'s 70% cost advantage over competitors'}
            {positioningAngle === 'Speed' &&
              'Lead with HaloITSM\'s 4-6 month implementation (vs 12-18 months)'}
            {positioningAngle === 'Adoption' &&
              'Lead with HaloITSM\'s superior UX and 90%+ adoption rates'}
            {positioningAngle === 'Simplicity' &&
              'Lead with HaloITSM\'s simple pricing and pre-built ITSM modules'}
            {positioningAngle === 'General' && 'Tailor positioning to their specific pain points'}
          </p>
        </div>
      </div>

      {/* Decision */}
      {!decided ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">Qualification Decision</h3>

          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="goNoGo"
                value="GO"
                checked={goNoGo === 'GO'}
                onChange={() => setGoNoGo('GO')}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-700">
                <span className="font-semibold text-emerald-600">GO</span> - Proceed to Proposal
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="goNoGo"
                value="MAYBE"
                checked={goNoGo === 'MAYBE'}
                onChange={() => setGoNoGo('MAYBE')}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-700">
                <span className="font-semibold text-amber-600">MAYBE</span> - Nurture, need more info
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="goNoGo"
                value="NO-GO"
                checked={goNoGo === 'NO-GO'}
                onChange={() => setGoNoGo('NO-GO')}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-700">
                <span className="font-semibold text-red-600">NO-GO</span> - Pass on this deal
              </span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Reasoning (optional)
            </label>
            <textarea
              value={reasoningNotes}
              onChange={e => setReasoningNotes(e.target.value)}
              placeholder="Why did you make this decision?"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          <button
            onClick={handleConfirmDecision}
            disabled={!goNoGo}
            className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            ✓ Confirm Decision
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-emerald-900 mb-2">✓ Decision Recorded</h3>
          <p className="text-sm text-emerald-700">
            {goNoGo === 'GO'
              ? 'This deal is qualified. Ready to advance to Proposal stage.'
              : goNoGo === 'MAYBE'
              ? 'Deal flagged for nurturing. Return to qualification when ready.'
              : 'Deal marked as passed. May revisit if circumstances change.'}
          </p>
        </div>
      )}
    </div>
  );
}
