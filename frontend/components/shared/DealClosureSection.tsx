'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';

interface DealClosureSectionProps {
  dealId: string;
  stage: string;
  closureReason?: string;
  lossReason?: string;
  onUpdate?: () => void;
}

const CLOSURE_REASONS = [
  'Contract signed',
  'Budget approved',
  'Decision confirmed',
  'Implementation scheduled',
  'Other',
];

const LOSS_REASONS = [
  'Lost to competitor',
  'Budget constraints',
  'Timing/internal priorities',
  'No decision',
  'Feature mismatch',
  'Relationship issues',
  'Other',
];

export default function DealClosureSection({ dealId, stage, closureReason, lossReason, onUpdate }: DealClosureSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editClosureReason, setEditClosureReason] = useState(closureReason || '');
  const [editLossReason, setEditLossReason] = useState(lossReason || '');
  const [saving, setSaving] = useState(false);

  const showClosureUI = stage === 'Closed Won' || stage === 'Closed Lost';

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          closureReason: stage === 'Closed Won' ? editClosureReason || null : null,
          lossReason: stage === 'Closed Lost' ? editLossReason || null : null,
        }),
      });
      toast('Deal closure updated', 'success');
      onUpdate?.();
      setIsEditing(false);
    } catch (err) {
      toast('Failed to update deal', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!showClosureUI) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">
        {stage === 'Closed Won' ? '✅ Closed Won' : '❌ Closed Lost'}
      </h3>

      {!isEditing ? (
        <div className="space-y-3">
          <div>
            <p className="text-xs text-slate-400 mb-1">
              {stage === 'Closed Won' ? 'Closure reason' : 'Loss reason'}
            </p>
            <p className="text-sm text-slate-900">
              {stage === 'Closed Won' ? closureReason || 'Not specified' : lossReason || 'Not specified'}
            </p>
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
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              {stage === 'Closed Won' ? 'Closure reason' : 'Loss reason'}
            </label>
            <select
              value={stage === 'Closed Won' ? editClosureReason : editLossReason}
              onChange={e => {
                if (stage === 'Closed Won') setEditClosureReason(e.target.value);
                else setEditLossReason(e.target.value);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select reason...</option>
              {(stage === 'Closed Won' ? CLOSURE_REASONS : LOSS_REASONS).map(reason => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
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
