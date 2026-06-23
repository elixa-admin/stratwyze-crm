'use client';

import { useState, useRef, useEffect } from 'react';

interface PostDiscoveryLoggingScreenProps {
  data: any;
  onSubmit: (notes: string, quickCapture: any) => void;
  onBack: () => void;
  loading: boolean;
}

export default function PostDiscoveryLoggingScreen({
  data,
  onSubmit,
  onBack,
  loading,
}: PostDiscoveryLoggingScreenProps) {
  const [notes, setNotes] = useState('');
  const [incumbent, setIncumbent] = useState(data.incumbentPlatform || '');
  const [budgetMentioned, setBudgetMentioned] = useState(false);
  const [budgetRange, setBudgetRange] = useState('');
  const [timeline, setTimeline] = useState('');
  const [decisionProcess, setDecisionProcess] = useState('');
  const [pains, setPains] = useState<string[]>([]);
  const [championFound, setChampionFound] = useState(false);
  const [championName, setChampionName] = useState('');
  const notesRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (notesRef.current) {
      notesRef.current.focus();
    }
  }, []);

  const painOptions = [
    'High implementation cost',
    'Slow time-to-value',
    'User adoption challenges',
    'Licensing complexity',
    'Feature gaps',
    'Support/SLA issues',
    'Scalability concerns',
    'Integration challenges',
  ];

  const handleSubmit = () => {
    if (!notes.trim()) {
      alert('Please enter your call notes');
      return;
    }

    onSubmit(notes, {
      incumbent: incumbent || undefined,
      budgetMentioned,
      budgetRange: budgetMentioned ? budgetRange : undefined,
      timeline: timeline || undefined,
      decisionProcess: decisionProcess || undefined,
      pains,
      championFound,
      championName: championFound ? championName : undefined,
    });
  };

  const handleAutoExpand = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    if (notesRef.current) {
      notesRef.current.style.height = 'auto';
      notesRef.current.style.height = Math.min(notesRef.current.scrollHeight, 400) + 'px';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Post-Discovery Debrief</h2>
        <p className="text-sm text-slate-600">Capture what you learned during the call</p>
      </div>

      {/* Free-form Notes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
          Call Notes <span className="text-red-500">*</span>
        </label>
        <textarea
          ref={notesRef}
          value={notes}
          onChange={handleAutoExpand}
          placeholder="Paste your call transcript or write a summary. Include key quotes, pain points, objections, next steps..."
          className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={6}
          disabled={loading}
        />
        <p className="text-xs text-slate-400 mt-2">AI will extract intel from your notes</p>
      </div>

      {/* Quick Capture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Incumbent Platform */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
            Incumbent Platform Confirmed
          </label>
          <div className="space-y-2">
            {[
              'ServiceNow',
              'Jira Service Management',
              'Freshservice',
              'BMC Helix',
              'Zendesk',
              'Ivanti',
              'BMC Remedy',
              'Other',
            ].map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="incumbent"
                  value={opt}
                  checked={incumbent === opt}
                  onChange={e => setIncumbent(e.target.value)}
                  className="w-4 h-4"
                  disabled={loading}
                />
                <span className="text-sm text-slate-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
            Implementation Timeline
          </label>
          <div className="space-y-2">
            {['<3 months', '3-6 months', '6-12 months', '12+ months', 'Unclear'].map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="timeline"
                  value={opt}
                  checked={timeline === opt}
                  onChange={e => setTimeline(e.target.value)}
                  className="w-4 h-4"
                  disabled={loading}
                />
                <span className="text-sm text-slate-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <label className="flex items-center gap-2 cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={budgetMentioned}
              onChange={e => setBudgetMentioned(e.target.checked)}
              className="w-4 h-4"
              disabled={loading}
            />
            <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Budget Mentioned</span>
          </label>
          {budgetMentioned && (
            <input
              type="text"
              value={budgetRange}
              onChange={e => setBudgetRange(e.target.value)}
              placeholder="e.g., R150-250M over 3 years"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          )}
        </div>

        {/* Decision Process */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
            Decision Process
          </label>
          <div className="space-y-2">
            {['RFP/Formal procurement', 'Sole-source', 'Steering committee', 'Budget holder decision', 'Unclear'].map(
              opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="decision"
                    value={opt}
                    checked={decisionProcess === opt}
                    onChange={e => setDecisionProcess(e.target.value)}
                    className="w-4 h-4"
                    disabled={loading}
                  />
                  <span className="text-sm text-slate-700">{opt}</span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Key Pain Points */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
            Key Pain Points Mentioned
          </label>
          <div className="grid grid-cols-2 gap-2">
            {painOptions.map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pains.includes(opt)}
                  onChange={e => {
                    if (e.target.checked) {
                      setPains([...pains, opt]);
                    } else {
                      setPains(pains.filter(p => p !== opt));
                    }
                  }}
                  className="w-4 h-4"
                  disabled={loading}
                />
                <span className="text-sm text-slate-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Champion */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={championFound}
              onChange={e => setChampionFound(e.target.checked)}
              className="w-4 h-4"
              disabled={loading}
            />
            <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Champion Identified</span>
          </label>
          {championFound && (
            <input
              type="text"
              value={championName}
              onChange={e => setChampionName(e.target.value)}
              placeholder="e.g., John Smith, VP IT"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          )}
        </div>
      </div>

      {/* Ready for Analysis */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🔬</div>
          <div>
            <h3 className="text-sm font-semibold text-emerald-900 mb-1">Ready for AI Analysis</h3>
            <p className="text-sm text-emerald-700">
              We'll extract budget, timeline, pain points, incumbent platform, and champion intel from your notes and
              quick captures. This feeds directly into your qualification scorecard (Phase 15).
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
          onClick={handleSubmit}
          disabled={loading || !notes.trim()}
          className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Analyze & Move to Phase 15 →
            </>
          )}
        </button>
      </div>
    </div>
  );
}
