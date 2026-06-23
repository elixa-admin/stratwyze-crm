'use client';

import { StageGates } from '@/lib/deal-gating';

interface StageGateIndicatorProps {
  gates: StageGates;
  canAdvance: boolean;
}

export default function StageGateIndicator({ gates, canAdvance }: StageGateIndicatorProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
      {/* Gate status header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-900">Requirements to Advance</h3>
        <div
          className={`text-sm font-semibold px-2 py-1 rounded-full ${
            canAdvance
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {canAdvance ? '✅ All set' : '⚠️ Not ready'}
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-2">
        {gates.missingRequirements.length === 0 ? (
          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
            <p className="text-sm text-emerald-700">All requirements met. Ready to advance to next stage.</p>
          </div>
        ) : (
          <>
            {gates.missingRequirements.map(req => (
              <div
                key={req.id}
                className="bg-amber-50 rounded-lg p-3 border border-amber-100 flex items-start gap-2"
              >
                <div className="text-amber-400 mt-0.5">○</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">{req.label}</p>
                  {req.blockerMessage && (
                    <p className="text-xs text-amber-700 mt-1">{req.blockerMessage}</p>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Summary message */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-600">{gates.message}</p>
      </div>
    </div>
  );
}
