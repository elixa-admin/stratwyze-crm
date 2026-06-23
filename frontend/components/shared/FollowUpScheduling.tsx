'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';

interface FollowUpSchedulingProps {
  dealId: string;
  dueDate?: string;
  nextAction?: string;
  onUpdate?: (dueDate?: string, nextAction?: string) => void;
}

export default function FollowUpScheduling({ dealId, dueDate, nextAction, onUpdate }: FollowUpSchedulingProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [dueDateValue, setDueDateValue] = useState(dueDate ? dueDate.split('T')[0] : '');
  const [nextActionValue, setNextActionValue] = useState(nextAction || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dueDate: dueDateValue ? new Date(dueDateValue).toISOString() : null,
          nextAction: nextActionValue || null,
        }),
      });
      toast('Follow-up updated', 'success');
      onUpdate?.(dueDateValue ? new Date(dueDateValue).toISOString() : undefined, nextActionValue);
      setIsEditing(false);
    } catch (err) {
      toast('Failed to update follow-up', 'error');
    } finally {
      setSaving(false);
    }
  };

  const isOverdue = dueDate && new Date(dueDate) < new Date();
  const daysUntilDue = dueDate ? Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Follow-up Schedule</h3>

      {!isEditing ? (
        <div className="space-y-3">
          {/* Due Date Display */}
          <div>
            <p className="text-xs text-slate-400 mb-1">Due date</p>
            {dueDate ? (
              <div className="flex items-center gap-2">
                <p className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-slate-900'}`}>
                  {new Date(dueDate).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  isOverdue ? 'bg-red-50 text-red-600' : daysUntilDue! <= 3 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {isOverdue ? 'Overdue' : daysUntilDue === 0 ? 'Today' : daysUntilDue === 1 ? 'Tomorrow' : `${daysUntilDue}d`}
                </span>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Not set</p>
            )}
          </div>

          {/* Next Action Display */}
          <div>
            <p className="text-xs text-slate-400 mb-1">Next action</p>
            {nextAction ? (
              <p className="text-sm text-slate-900">{nextAction}</p>
            ) : (
              <p className="text-sm text-slate-500">Not set</p>
            )}
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="w-full px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-600 mb-1 block">Due date</label>
            <input
              type="date"
              value={dueDateValue}
              onChange={e => setDueDateValue(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-600 mb-1 block">Next action</label>
            <textarea
              value={nextActionValue}
              onChange={e => setNextActionValue(e.target.value)}
              placeholder="e.g., Follow up with decision-maker, send proposal..."
              className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded hover:bg-slate-200 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
