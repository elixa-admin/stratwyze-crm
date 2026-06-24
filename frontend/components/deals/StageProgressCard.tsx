'use client';

import { useState, useEffect } from 'react';
import StageChecklist from './StageChecklist';
import StageQuickLog from './StageQuickLog';
import { getStageDef } from '@/lib/deals/stage-definitions';
import { toast } from '@/lib/toast';

interface StageProgressCardProps {
  dealId: string;
  currentStage: string;
  daysInStage: number;
  activities: any[];
}

type ActionState = {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  completed: boolean;
  completedAt?: string;
};

// Map action IDs to activity types for the activity feed
const ACTION_ACTIVITY_TYPE: Record<string, string> = {
  contact_found: 'note',
  initial_contact: 'call',
  fit_assessment: 'note',
  discovery_call: 'call',
  pain_points: 'note',
  budget_confirmed: 'note',
  timeline_identified: 'note',
  solution_designed: 'note',
  proposal_sent: 'email',
  demo_scheduled: 'meeting',
  objections_addressed: 'call',
  contract_ready: 'note',
  executive_approval: 'meeting',
  contract_signed: 'note',
  deal_closed: 'note',
  loss_documented: 'note',
};

function buildActions(stage: string, completedIds: string[] = []): ActionState[] {
  const def = getStageDef(stage);
  return def?.actions.map(a => ({
    id: a.id,
    title: a.title,
    description: a.description,
    required: a.required,
    completed: completedIds.includes(a.id),
    completedAt: completedIds.includes(a.id) ? new Date().toISOString() : undefined,
  })) ?? [];
}

export default function StageProgressCard({
  dealId,
  currentStage,
  daysInStage,
}: StageProgressCardProps) {
  const stageDef = getStageDef(currentStage);
  const [stageActions, setStageActions] = useState<ActionState[]>(() => buildActions(currentStage));
  const [isAdvancing, setIsAdvancing] = useState(false);

  // Fetch persisted completion state on mount
  useEffect(() => {
    fetch(`/api/deals/stage-progress?dealId=${dealId}`)
      .then(r => r.json())
      .then(data => {
        const completedIds: string[] = data.stageWorkflow?.stepsCompleted ?? [];
        setStageActions(buildActions(currentStage, completedIds));
      })
      .catch(() => {
        // Silently fall back to all-incomplete state
        setStageActions(buildActions(currentStage));
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealId]);

  // Reset checklist whenever the deal changes stage
  useEffect(() => {
    setStageActions(buildActions(currentStage));
  }, [currentStage]);

  const requiredActions = stageActions.filter(a => a.required);
  const completedRequired = stageActions.filter(a => a.required && a.completed).length;
  const readinessPercent = requiredActions.length > 0
    ? Math.round((completedRequired / requiredActions.length) * 100)
    : 0;
  const isReadyToAdvance = readinessPercent >= 90;

  const readinessColor = readinessPercent >= 90
    ? 'text-emerald-600'
    : readinessPercent >= 60
    ? 'text-amber-600'
    : 'text-red-500';

  const handleActionLogged = async (actionId: string, outcome: string, notes: string) => {
    const action = stageActions.find(a => a.id === actionId);
    if (!action) return;

    const activityType = ACTION_ACTIVITY_TYPE[actionId] ?? 'note';
    const outcomeLabel = outcome === 'positive' ? '✓' : outcome === 'blocked' ? '⚠' : '—';
    const content = `[${outcomeLabel} ${outcome}] ${action.title}${notes ? ': ' + notes : ''}`;

    try {
      const res = await fetch('/api/deals/stage-progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId,
          actionId,
          completed: true,
          activityType,
          content,
          metadata: { outcome, notes, actionId, stage: currentStage },
        }),
      });

      if (!res.ok) throw new Error('Save failed');

      setStageActions(prev =>
        prev.map(a =>
          a.id === actionId
            ? { ...a, completed: true, completedAt: new Date().toISOString() }
            : a
        )
      );

      toast(`${action.title} logged`, 'success');
    } catch {
      toast('Failed to save — try again', 'error');
    }
  };

  const handleAdvanceStage = async () => {
    if (!isReadyToAdvance || isAdvancing) return;
    setIsAdvancing(true);
    try {
      const res = await fetch('/api/deals/stage-advance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId }),
      });
      if (!res.ok) throw new Error('Advance failed');
      const data = await res.json();
      toast(`Moved to ${data.newStage}`, 'success');
      window.location.reload();
    } catch {
      toast('Failed to advance stage', 'error');
    } finally {
      setIsAdvancing(false);
    }
  };

  if (!stageDef) {
    return <div className="text-xs text-slate-400 px-1">Stage definition not found: {currentStage}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Stage header */}
      <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{stageDef.label} Stage</h2>
            <p className="text-sm text-slate-500 mt-0.5">{stageDef.description}</p>
            <p className="text-xs text-slate-400 mt-2">
              {daysInStage}d in stage · expected: {stageDef.expectedDays}d
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`text-3xl font-bold ${readinessColor}`}>{readinessPercent}%</div>
            <p className="text-xs text-slate-500 mt-0.5">Ready to advance</p>
          </div>
        </div>
      </div>

      {/* Inline quick log — "What happened?" */}
      <StageQuickLog
        dealId={dealId}
        stage={currentStage}
        actions={stageActions}
        onActionLogged={handleActionLogged}
      />

      {/* Readiness score strip */}
      <div
        className="rounded-xl px-5 py-4"
        style={{
          backgroundColor: readinessPercent >= 90 ? '#ECFDF5' : readinessPercent >= 60 ? '#FFFBEB' : '#FEF2F2',
          borderLeft: `4px solid ${readinessPercent >= 90 ? '#10B981' : readinessPercent >= 60 ? '#F59E0B' : '#EF4444'}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-semibold ${readinessPercent >= 90 ? 'text-emerald-800' : readinessPercent >= 60 ? 'text-amber-800' : 'text-red-800'}`}>
              Readiness Score
            </p>
            <p className={`text-xs mt-0.5 ${readinessPercent >= 90 ? 'text-emerald-600' : readinessPercent >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
              {completedRequired} of {requiredActions.length} required actions complete
            </p>
          </div>
          <span className={`text-2xl font-bold ${readinessColor}`}>{readinessPercent}%</span>
        </div>
      </div>

      {/* Full checklist (completed + incomplete) */}
      <StageChecklist
        actions={stageActions}
        onActionToggle={async (actionId, completed) => {
          setStageActions(prev =>
            prev.map(a =>
              a.id === actionId
                ? { ...a, completed, completedAt: completed ? new Date().toISOString() : undefined }
                : a
            )
          );
        }}
      />

      {/* Conversation starters */}
      {stageDef.conversationStarters.length > 0 && (
        <div className="bg-blue-50 rounded-xl border border-blue-100 px-5 py-4">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-3">
            Conversation Starters
          </p>
          <ul className="space-y-2">
            {stageDef.conversationStarters.map((s, i) => (
              <li key={i} className="text-sm text-blue-800 flex gap-2">
                <span className="text-blue-400 font-bold flex-shrink-0">•</span>
                <span>"{s}"</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Advance stage button */}
      {isReadyToAdvance ? (
        <div className="space-y-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4">
            <p className="text-sm font-semibold text-emerald-800">All required actions complete</p>
            <p className="text-xs text-emerald-600 mt-0.5">This deal is ready to move to the next stage.</p>
          </div>
          <button
            onClick={handleAdvanceStage}
            disabled={isAdvancing}
            className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all text-sm"
          >
            {isAdvancing ? 'Advancing…' : `Advance to next stage →`}
          </button>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4">
          <p className="text-sm font-semibold text-slate-700">
            {requiredActions.length - completedRequired} required action{requiredActions.length - completedRequired !== 1 ? 's' : ''} remaining
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Complete the checklist above to unlock the advance button.</p>
        </div>
      )}
    </div>
  );
}
