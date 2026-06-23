'use client';

interface PreMeetingBriefScreenProps {
  data: any;
  onNext: () => void;
  onBack: () => void;
  loading: boolean;
}

export default function PreMeetingBriefScreen({ data, onNext, onBack, loading }: PreMeetingBriefScreenProps) {
  const brief = data.preBrief || {};
  const snapshot = brief.companySnapshot || {};
  const research = brief.companyIntelligence || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">{data.companyName}</h2>
        <p className="text-sm text-slate-600">Pre-meeting brief • AI-researched insights</p>
      </div>

      {/* Company Snapshot */}
      {snapshot.description && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <span>📊</span> Company Snapshot
          </h3>
          <p className="text-sm text-slate-700 mb-4 leading-relaxed">{snapshot.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {snapshot.revenue && (
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-slate-500 font-medium mb-1">Revenue</p>
                <p className="text-sm font-bold text-blue-700">{snapshot.revenue}</p>
              </div>
            )}
            {snapshot.employees && (
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-slate-500 font-medium mb-1">Employees</p>
                <p className="text-sm font-bold text-blue-700">{snapshot.employees}</p>
              </div>
            )}
            {snapshot.headquarters && (
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-slate-500 font-medium mb-1">HQ</p>
                <p className="text-sm font-bold text-blue-700">{snapshot.headquarters}</p>
              </div>
            )}
            {snapshot.founded && (
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-slate-500 font-medium mb-1">Founded</p>
                <p className="text-sm font-bold text-blue-700">{snapshot.founded}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Incumbent Platform */}
      {(brief.incumbentConfirmed || data.incumbentPlatform) && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <span>⚔️</span> Incumbent Platform Alert
          </h3>
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
            <p className="text-sm font-bold text-red-700">{data.incumbentPlatform || brief.incumbentConfirmed}</p>
            <p className="text-xs text-red-600 mt-1">Confirmed incumbent ITSM platform</p>
          </div>
          {brief.battlecardLoaded && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Battle-Card Status</p>
              <p className="text-sm text-slate-600">
                ✅ Battle-card loaded for {data.incumbentPlatform || brief.incumbentConfirmed}. Review next slide before your call.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ITSM Relevance */}
      {research.itsmRelevance && (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <span>💡</span> Why HaloITSM Matters for Them
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">{research.itsmRelevance}</p>
        </div>
      )}

      {/* Recent Activity */}
      {research.recentNews && research.recentNews.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <span>📰</span> Recent News & Activity ({research.recentNews.length})
          </h3>
          <div className="space-y-2">
            {research.recentNews.slice(0, 3).map((item: any, i: number) => (
              <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <p className="text-xs font-bold text-slate-900">{item.headline}</p>
                <p className="text-xs text-slate-600 mt-1">{item.summary}</p>
                {item.significance && (
                  <p className="text-xs text-blue-600 font-medium mt-1.5">💼 {item.significance}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* M&A Activity */}
      {research.maActivity && research.maActivity.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2">
            <span>📈</span> M&A / Growth Events
          </h3>
          <div className="space-y-2">
            {research.maActivity.slice(0, 2).map((event: any, i: number) => (
              <div key={i} className="bg-white rounded-lg p-3 border border-amber-100">
                <p className="text-xs font-bold text-amber-900">{event.event}</p>
                <p className="text-xs text-amber-700 mt-1">{event.implication}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Readiness */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">✅</div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-emerald-900 mb-1">You're Ready for Discovery</h3>
            <p className="text-sm text-emerald-700 mb-3">
              Your pre-meeting brief is ready. Next, we'll load your discovery guide with tailored questions.
            </p>
            <p className="text-xs text-emerald-600">
              💡 TIP: Print this brief or have it handy during your call. Reference it when needed.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 py-3 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={loading}
          className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          Discovery Guide →
        </button>
      </div>
    </div>
  );
}
