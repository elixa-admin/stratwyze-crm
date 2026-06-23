'use client';

interface NewsItem {
  headline: string;
  summary: string;
  date?: string;
  significance?: string;
}

interface MAEvent {
  event: string;
  date?: string;
  amount?: string;
  implication: string;
}

interface LinkedinInsights {
  followerRange?: string;
  growthSignal?: string;
  keyHires?: string;
}

interface CompanySnapshot {
  description: string;
  revenue?: string;
  employees?: string;
  founded?: string;
  headquarters?: string;
  website?: string;
  industry?: string;
}

interface Intelligence {
  companySnapshot?: CompanySnapshot;
  recentNews?: NewsItem[];
  maActivity?: MAEvent[];
  linkedinInsights?: LinkedinInsights;
  itsmRelevance?: string;
  qualificationQuestions?: string[];
  redFlags?: string[];
  dataConfidence?: string;
}

interface Props {
  enrichmentData: Intelligence | null;
}

export default function CompanyIntelligencePanel({ enrichmentData }: Props) {
  if (!enrichmentData) return null;

  const snapshot = enrichmentData.companySnapshot;
  const news = enrichmentData.recentNews || [];
  const ma = enrichmentData.maActivity || [];
  const linkedin = enrichmentData.linkedinInsights;
  const questions = enrichmentData.qualificationQuestions || [];
  const flags = enrichmentData.redFlags || [];
  const relevance = enrichmentData.itsmRelevance;
  const confidence = enrichmentData.dataConfidence;

  return (
    <div className="space-y-4">
      {/* Company Snapshot */}
      {snapshot && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">Company Snapshot</h3>
            {confidence && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                confidence === 'High' ? 'bg-emerald-100 text-emerald-700' :
                confidence === 'Medium' ? 'bg-amber-100 text-amber-700' :
                'bg-slate-200 text-slate-700'
              }`}>
                {confidence} Confidence
              </span>
            )}
          </div>
          {snapshot.description && (
            <p className="text-sm text-slate-700 mb-3 leading-relaxed">{snapshot.description}</p>
          )}
          <div className="grid grid-cols-2 gap-2">
            {snapshot.revenue && (
              <div className="bg-white rounded-lg p-2.5 border border-blue-100">
                <p className="text-xs text-slate-500 font-semibold">Revenue</p>
                <p className="text-sm font-bold text-blue-700 mt-0.5">{snapshot.revenue}</p>
              </div>
            )}
            {snapshot.employees && (
              <div className="bg-white rounded-lg p-2.5 border border-blue-100">
                <p className="text-xs text-slate-500 font-semibold">Employees</p>
                <p className="text-sm font-bold text-blue-700 mt-0.5">{snapshot.employees}</p>
              </div>
            )}
            {snapshot.headquarters && (
              <div className="bg-white rounded-lg p-2.5 border border-blue-100">
                <p className="text-xs text-slate-500 font-semibold">Headquarters</p>
                <p className="text-sm font-bold text-blue-700 mt-0.5">{snapshot.headquarters}</p>
              </div>
            )}
            {snapshot.founded && (
              <div className="bg-white rounded-lg p-2.5 border border-blue-100">
                <p className="text-xs text-slate-500 font-semibold">Founded</p>
                <p className="text-sm font-bold text-blue-700 mt-0.5">{snapshot.founded}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ITSM Relevance */}
      {relevance && (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-2">Why HaloITSM Matters</p>
          <p className="text-sm text-slate-700 leading-relaxed">{relevance}</p>
        </div>
      )}

      {/* Recent News */}
      {news.length > 0 && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-700">Recent News & Events</p>
          </div>
          <div className="divide-y divide-slate-100">
            {news.map((item, i) => (
              <div key={i} className="px-4 py-3">
                <p className="text-sm font-medium text-slate-900">{item.headline}</p>
                <p className="text-xs text-slate-600 mt-1">{item.summary}</p>
                {item.significance && (
                  <p className="text-xs text-teal-600 font-medium mt-1.5">💡 {item.significance}</p>
                )}
                {item.date && <p className="text-[10px] text-slate-400 mt-1">{item.date}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* M&A Activity */}
      {ma.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-amber-900 mb-2.5">M&A & Growth Events</p>
          <div className="space-y-2">
            {ma.map((event, i) => (
              <div key={i} className="bg-white/50 rounded-lg p-2.5 border border-amber-100">
                <p className="text-xs font-bold text-amber-900">{event.event}</p>
                {event.date && <p className="text-[10px] text-amber-700 mt-0.5">{event.date}</p>}
                {event.amount && <p className="text-[10px] text-amber-700">{event.amount}</p>}
                <p className="text-xs text-amber-800 mt-1">{event.implication}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LinkedIn Insights */}
      {linkedin && (linkedin.followerRange || linkedin.growthSignal || linkedin.keyHires) && (
        <div className="border border-blue-200 rounded-xl p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
          <p className="text-sm font-semibold text-slate-700 mb-2.5">LinkedIn Insights</p>
          <div className="space-y-1.5 text-xs">
            {linkedin.followerRange && (
              <p className="text-slate-700"><span className="font-semibold">Followers:</span> {linkedin.followerRange}</p>
            )}
            {linkedin.growthSignal && (
              <p className="text-slate-700"><span className="font-semibold">Growth:</span> {linkedin.growthSignal}</p>
            )}
            {linkedin.keyHires && (
              <p className="text-slate-700"><span className="font-semibold">Notable hires:</span> {linkedin.keyHires}</p>
            )}
          </div>
        </div>
      )}

      {/* Discovery Questions */}
      {questions.length > 0 && (
        <div className="border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
          <p className="text-sm font-semibold text-slate-700 mb-2.5">Discovery Questions</p>
          <ol className="space-y-1.5">
            {questions.map((q, i) => (
              <li key={i} className="text-xs text-slate-700 flex gap-2">
                <span className="font-bold text-purple-500 flex-shrink-0">{i + 1}.</span>
                <span>{q}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Red Flags */}
      {flags.length > 0 && (
        <div className="border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-4">
          <p className="text-sm font-semibold text-red-700 mb-2.5">⚠️ Red Flags & Risks</p>
          <ul className="space-y-1">
            {flags.map((flag, i) => (
              <li key={i} className="text-xs text-red-700 flex gap-2">
                <span className="text-red-400 flex-shrink-0">•</span>{flag}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
