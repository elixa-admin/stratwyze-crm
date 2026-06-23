'use client';

interface DiscoveryAnalysisScreenProps {
  data: any;
  onComplete: () => void;
  onBack: () => void;
}

export default function DiscoveryAnalysisScreen({ data, onComplete, onBack }: DiscoveryAnalysisScreenProps) {
  const analysis = data.analysis || {};
  const extracted = analysis.extracted || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Discovery Analysis</h2>
        <p className="text-sm text-slate-600">AI-extracted intelligence from your call</p>
      </div>

      {/* Extracted Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Incumbent Confirmed */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">Incumbent Platform</p>
          {extracted.incumbent ? (
            <>
              <p className="text-xl font-bold text-red-700 mb-2">{extracted.incumbent}</p>
              <p className="text-xs text-red-600">Battle-card ready for Phase 15</p>
            </>
          ) : (
            <p className="text-sm text-red-600">Not confirmed yet—will discover in next call</p>
          )}
        </div>

        {/* Budget */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Budget Range</p>
          {extracted.budgetRange ? (
            <>
              <p className="text-xl font-bold text-green-700 mb-2">{extracted.budgetRange}</p>
              <p className="text-xs text-green-600">Over 3 years</p>
            </>
          ) : (
            <p className="text-sm text-green-600">Not mentioned—bring up in next conversation</p>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Timeline</p>
          {extracted.timeline ? (
            <>
              <p className="text-xl font-bold text-amber-700 mb-2">{extracted.timeline}</p>
              <p className="text-xs text-amber-600">Implementation window</p>
            </>
          ) : (
            <p className="text-sm text-amber-600">Unclear—clarify in next meeting</p>
          )}
        </div>

        {/* Decision Process */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Decision Process</p>
          {extracted.decisionProcess ? (
            <>
              <p className="text-lg font-bold text-blue-700 mb-2">{extracted.decisionProcess}</p>
              <p className="text-xs text-blue-600">Procurement path</p>
            </>
          ) : (
            <p className="text-sm text-blue-600">Unclear—ask about RFP timeline</p>
          )}
        </div>
      </div>

      {/* Pain Points */}
      {extracted.pains && extracted.pains.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <span>💔</span> Top Pain Points
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {extracted.pains.map((pain: string, i: number) => (
              <div key={i} className="bg-red-50 rounded-lg p-3 border border-red-100">
                <p className="text-sm font-medium text-red-700">• {pain}</p>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 rounded-lg p-4 mt-4 border border-blue-100">
            <p className="text-sm font-semibold text-blue-900 mb-2">HaloITSM Positioning for This Deal:</p>
            <p className="text-sm text-blue-800">
              These pain points are your sales angles. In Phase 16, we'll craft a proposal that directly addresses
              {extracted.pains.slice(0, 2).join(' and ')}.
            </p>
          </div>
        </div>
      )}

      {/* Champion */}
      {extracted.champion && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <p className="text-sm font-semibold text-purple-900 mb-2">🎯 Internal Champion Identified</p>
          <p className="text-lg font-bold text-purple-700 mb-2">{extracted.champion}</p>
          <p className="text-sm text-purple-700">
            This is your primary stakeholder. Keep them in the loop. They'll help navigate the decision process.
          </p>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-3">Next: Phase 15 - Qualification Scorecard</h3>
        <p className="text-sm text-blue-800 mb-4">
          We'll run these extracted details through our HaloITSM Competitive Knowledgebase to:
        </p>
        <ul className="space-y-2 text-sm text-blue-800 mb-4">
          <li className="flex gap-2">
            <span className="flex-shrink-0 font-bold text-blue-600">1.</span>
            <span>Auto-load the <strong>{extracted.incumbent}</strong> battle-card with positioning + rebuttals</span>
          </li>
          <li className="flex gap-2">
            <span className="flex-shrink-0 font-bold text-blue-600">2.</span>
            <span>Score the deal (0-100) on HaloITSM fit based on their pain points + budget + timeline</span>
          </li>
          <li className="flex gap-2">
            <span className="flex-shrink-0 font-bold text-blue-600">3.</span>
            <span>Recommend Go/No-Go decision with clear reasoning</span>
          </li>
          <li className="flex gap-2">
            <span className="flex-shrink-0 font-bold text-blue-600">4.</span>
            <span>Arm you with objection handlers for the next call</span>
          </li>
        </ul>
        <p className="text-xs text-blue-700 font-medium">
          ⏱️ Phase 15 takes 10-15 minutes. Then you're ready for Phase 16 (Proposal).
        </p>
      </div>

      {/* Readiness Check */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">✅</div>
          <div>
            <h3 className="text-sm font-semibold text-emerald-900 mb-2">You're Ready to Advance</h3>
            <p className="text-sm text-emerald-700">
              Your discovery is complete. The intelligence is extracted and contextualized. Phase 15 will qualify this
              deal and prepare you for the proposal.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onComplete}
          className="flex-1 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
        >
          Continue to Phase 15: Qualification →
        </button>
      </div>
    </div>
  );
}
