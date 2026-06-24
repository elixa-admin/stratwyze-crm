'use client';

import { useState } from 'react';
import StageChecklist from './StageChecklist';
import ActivityTimeline from '@/components/activity/ActivityTimeline';
import { getStageDef } from '@/lib/deals/stage-definitions';
import { toast } from '@/lib/toast';

interface StageProgressCardProps {
  dealId: string;
  currentStage: string;
  daysInStage: number;
  activities: any[];
}

/**
 * Stage Progress Card - Shows what needs to happen in current stage
 */
export default function StageProgressCard({
  dealId,
  currentStage,
  daysInStage,
  activities,
}: StageProgressCardProps) {
  const stageDef = getStageDef(currentStage);
  const [stageActions, setStageActions] = useState<Array<{
    id: string;
    title: string;
    description?: string;
    required: boolean;
    completed: boolean;
    completedAt?: string;
  }>>(stageDef?.actions.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    required: a.required,
    completed: false,
  })) || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);

  // Calculate readiness based on completed required actions
  const requiredActions = stageActions.filter((a) => a.required);
  const completedRequired = stageActions.filter((a) => a.required && a.completed).length;
  const readinessPercent = requiredActions.length > 0
    ? (completedRequired / requiredActions.length) * 100
    : 0;

  const isReadyToAdvance = readinessPercent >= 90;

  const handleActionToggle = async (actionId: string, completed: boolean) => {
    setIsLoading(true);
    try {
      // Update local state
      setStageActions((prev) =>
        prev.map((a) =>
          a.id === actionId
            ? { ...a, completed, completedAt: completed ? new Date().toISOString() : undefined }
            : a
        )
      );

      // TODO: Persist to API
      // await fetch(`/api/deals/${dealId}/stage-progress`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ actionId, completed }),
      // });

      toast(`Action ${completed ? 'completed' : 'uncompleted'}`, 'success');
    } catch (error) {
      toast('Failed to update action', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdvanceStage = async () => {
    if (!isReadyToAdvance) return;

    setIsAdvancing(true);
    try {
      // TODO: Call API to advance stage
      // const res = await fetch(`/api/deals/${dealId}/stage-advance`, {
      //   method: 'POST',
      // });
      // const data = await res.json();
      // onStageChange?.(data.newStage);

      toast(`Deal advanced from ${currentStage}`, 'success');
    } catch (error) {
      toast('Failed to advance stage', 'error');
    } finally {
      setIsAdvancing(false);
    }
  };

  if (!stageDef) {
    return <div className="text-slate-500">Unknown stage: {currentStage}</div>;
  }

  // Filter activities to THIS stage only
  const stageActivities = activities.filter((a) => !a.dealId || a.dealId === dealId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{stageDef.label} Stage</h2>
            <p className="text-sm text-slate-600 mt-1">{stageDef.description}</p>
            <p className="text-xs text-slate-500 mt-2">
              {daysInStage} days in stage (expected: {stageDef.expectedDays} days)
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{Math.round(readinessPercent)}%</div>
            <p className="text-xs text-slate-600 mt-1">Ready to advance</p>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <StageChecklist
        actions={stageActions}
        onActionToggle={handleActionToggle}
        isLoading={isLoading}
      />

      {/* Conversation Starters */}
      {stageDef.conversationStarters.length > 0 && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">💬 Conversation Starters</h3>
          <ul className="space-y-2">
            {stageDef.conversationStarters.map((starter, idx) => (
              <li key={idx} className="text-sm text-blue-800 flex gap-2">
                <span className="text-blue-600 font-bold min-w-fit">•</span>
                <span>"{starter}"</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent Activity */}
      {stageActivities.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">📋 Recent Activity</h3>
          <ActivityTimeline
            events={stageActivities.map((a) => ({
              id: a.id,
              type: a.type,
              timestamp: a.timestamp,
              summary: a.summary,
              details: a.details,
            }))}
          />
        </div>
      )}

      {/* Advance Button */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        {isReadyToAdvance ? (
          <div className="space-y-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
              <p className="text-sm font-semibold text-emerald-900">✓ Ready to advance!</p>
              <p className="text-xs text-emerald-700 mt-1">
                All required actions for {stageDef.label} are complete.
              </p>
            </div>
            <button
              onClick={handleAdvanceStage}
              disabled={isAdvancing}
              className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-all"
            >
              {isAdvancing ? 'Advancing...' : `Move to Next Stage →`}
            </button>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded p-3">
            <p className="text-sm font-semibold text-amber-900">
              ⏳ Not quite ready yet ({Math.round(readinessPercent)}%)
            </p>
            <p className="text-xs text-amber-700 mt-2">
              Complete {requiredActions.length - completedRequired} more action
              {requiredActions.length - completedRequired !== 1 ? 's' : ''} to advance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
