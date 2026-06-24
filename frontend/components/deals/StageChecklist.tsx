'use client';

import { useCallback } from 'react';

interface ChecklistAction {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
  required: boolean;
}

interface StageChecklistProps {
  actions: ChecklistAction[];
  onActionToggle?: (actionId: string, completed: boolean) => void;
  isLoading?: boolean;
}

export default function StageChecklist({
  actions,
  onActionToggle,
  isLoading = false,
}: StageChecklistProps) {
  const handleToggle = useCallback(
    (actionId: string, completed: boolean) => {
      onActionToggle?.(actionId, !completed);
    },
    [onActionToggle]
  );

  const totalRequired = actions.filter((a) => a.required).length;
  const completedRequired = actions.filter((a) => a.required && a.completed).length;
  const readinessPercent = totalRequired > 0 ? (completedRequired / totalRequired) * 100 : 0;

  const getReadinessColor = (percent: number) => {
    if (percent >= 90) return 'bg-emerald-100 text-emerald-900';
    if (percent >= 60) return 'bg-amber-100 text-amber-900';
    return 'bg-red-100 text-red-900';
  };

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${getReadinessColor(readinessPercent)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Readiness Score</p>
            <p className="text-xs opacity-75 mt-1">
              {completedRequired} of {totalRequired} required actions complete
            </p>
          </div>
          <div className="text-3xl font-bold">{Math.round(readinessPercent)}%</div>
        </div>
      </div>

      {actions.some((a) => a.required) && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Required Actions</h3>
          <div className="space-y-2">
            {actions
              .filter((a) => a.required)
              .map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleToggle(action.id, action.completed)}
                  disabled={isLoading}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    action.completed
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {action.completed ? (
                        <div className="w-5 h-5 bg-emerald-500 rounded text-white flex items-center justify-center text-xs">
                          ✓
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-slate-300 rounded" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${action.completed ? 'text-emerald-900' : 'text-slate-900'}`}>
                        {action.title}
                      </p>
                      {action.description && <p className="text-xs text-slate-600 mt-1">{action.description}</p>}
                      {action.completedAt && action.completed && (
                        <p className="text-xs text-emerald-700 mt-2">
                          ✓ Completed {new Date(action.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
