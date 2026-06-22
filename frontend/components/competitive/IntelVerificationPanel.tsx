'use client';

import { useState } from 'react';

interface VerificationChange {
  claim: string;
  status: 'Confirmed' | 'Changed' | 'Unverifiable';
  evidence?: string;
  sourceUrl?: string | null;
  impact: 'low' | 'medium' | 'high';
}

interface VerificationReport {
  freshnessScore: 'Current' | 'Likely current' | 'Needs verification' | 'Stale';
  freshnessRationale: string;
  changes: VerificationChange[];
  newIntelligence: string[];
  recommendation: string;
  safeToPropose: boolean;
}

interface Props {
  competitorId: string;
  saPartnerId: string;
  onComplete: (report: VerificationReport) => void;
}

const FRESHNESS_COLORS: Record<string, string> = {
  'Current':            'bg-green-100 text-green-700 border-green-200',
  'Likely current':     'bg-green-50 text-green-600 border-green-200',
  'Needs verification': 'bg-amber-100 text-amber-700 border-amber-200',
  'Stale':              'bg-red-100 text-red-700 border-red-200',
};

const STATUS_CONFIG: Record<string, { color: string; icon: string }> = {
  Confirmed:     { color: 'text-green-700 bg-green-50 border-green-200', icon: '✓' },
  Changed:       { color: 'text-red-700 bg-red-50 border-red-200', icon: '!' },
  Unverifiable:  { color: 'text-slate-600 bg-slate-50 border-slate-200', icon: '?' },
};

const IMPACT_COLORS: Record<string, string> = {
  high:   'text-red-600',
  medium: 'text-amber-600',
  low:    'text-slate-400',
};

export default function IntelVerificationPanel({ competitorId, saPartnerId, onComplete }: Props) {
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchCount, setSearchCount] = useState(0);

  const runVerification = async () => {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const res = await fetch('/api/competitive/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorId, saPartnerId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Verification failed');
      setReport(data.report);
      setSearchCount(data.searchesRun ?? 0);
      onComplete(data.report);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  if (!report && !loading && !error) {
    return (
      <div className="border border-amber-200 bg-amber-50 rounded-xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600 flex-shrink-0 mt-0.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <div>
            <p className="text-sm font-semibold text-amber-900 mb-0.5">Verify intel before proposing</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Runs live web searches against our static intelligence to flag pricing changes, M&A activity, CVEs, and market shifts. Takes ~10–15 seconds.
            </p>
          </div>
        </div>
        <button
          onClick={runVerification}
          className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-all"
        >
          Run Verification
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border border-amber-200 bg-amber-50 rounded-xl p-5 flex flex-col items-center justify-center min-h-[140px]">
        <div className="w-8 h-8 rounded-full border-2 border-amber-600 border-t-transparent animate-spin mb-3" />
        <p className="text-sm font-semibold text-amber-900 mb-1">Searching published sources...</p>
        <p className="text-xs text-amber-600">Running web searches — pricing, news, security advisories</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 rounded-xl p-4 text-center">
        <p className="text-sm font-semibold text-red-700 mb-1">Verification failed</p>
        <p className="text-xs text-red-600 mb-3">{error}</p>
        <button onClick={runVerification} className="text-xs font-semibold text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-all">Retry</button>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="border border-slate-200 bg-white rounded-xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span className="text-xs font-semibold text-slate-700">Intelligence Verification</span>
          <span className="text-[10px] text-slate-400">{searchCount} searches</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${FRESHNESS_COLORS[report.freshnessScore]}`}>
            {report.freshnessScore}
          </span>
          {report.safeToPropose ? (
            <span className="text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Safe to propose</span>
          ) : (
            <span className="text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">Review required</span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">

        {/* Freshness rationale */}
        <p className="text-xs text-slate-600 leading-relaxed italic">{report.freshnessRationale}</p>

        {/* Changes */}
        {report.changes.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-2">Claim Verification</p>
            <div className="space-y-2">
              {report.changes.map((change, i) => (
                <div key={i} className="rounded-lg border border-slate-100 overflow-hidden">
                  <div className={`flex items-start gap-2 p-2.5 ${STATUS_CONFIG[change.status]?.color ?? ''}`}>
                    <span className="text-[10px] font-bold w-4 flex-shrink-0 text-center">{STATUS_CONFIG[change.status]?.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold leading-snug">{change.claim}</p>
                      {change.evidence && <p className="text-[10px] opacity-80 mt-0.5 leading-snug">{change.evidence}</p>}
                    </div>
                    <span className={`text-[9px] font-bold uppercase flex-shrink-0 ${IMPACT_COLORS[change.impact]}`}>{change.impact}</span>
                  </div>
                  {change.sourceUrl && (
                    <div className="px-2.5 py-1 bg-slate-50 border-t border-slate-100">
                      <a href={change.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 truncate block hover:underline">
                        {change.sourceUrl}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New intelligence */}
        {report.newIntelligence.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-2">New Intelligence</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1.5">
              {report.newIntelligence.map((item, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-500 flex-shrink-0 mt-0.5"><polyline points="9 18 15 12 9 6"/></svg>
                  <p className="text-[11px] text-blue-900 leading-snug">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">Recommendation</p>
          <p className="text-[11px] text-slate-700 leading-relaxed">{report.recommendation}</p>
        </div>

      </div>
    </div>
  );
}
