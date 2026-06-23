'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';

interface DiscoveryWorkflowEmbeddedProps {
  deal: any;
  onComplete?: (discoveryData: any) => void;
}

/**
 * Embedded discovery workflow for Qualification stage
 * Simplified version of Phase 14 for inline use
 * Flows: Discovery Guide → Post-logging → Analysis
 */
export default function DiscoveryWorkflowEmbedded({
  deal,
  onComplete,
}: DiscoveryWorkflowEmbeddedProps) {
  const [step, setStep] = useState<'guide' | 'logging' | 'analysis'>('guide');
  const [discoveryNotes, setDiscoveryNotes] = useState('');
  const [incumbent, setIncumbent] = useState(deal?.stageWorkflow?.incumbentPlatform || '');
  const [budgetRange, setBudgetRange] = useState(deal?.stageWorkflow?.budgetRange || '');
  const [timeline, setTimeline] = useState(deal?.stageWorkflow?.timeline || '');
  const [painPoints, setPainPoints] = useState<string[]>(deal?.stageWorkflow?.painPoints || []);
  const [loading, setLoading] = useState(false);

  const discoveryQuestions = [
    {
      id: 'q1',
      question: 'Tell me about your current ITSM platform—how long have you been on it?',
      listen: 'Implementation timeline, satisfaction level, pain points',
    },
    {
      id: 'q2',
      question: "What's working well? What would you change if you could?",
      listen: 'Cost complaints, speed issues, adoption challenges',
    },
    {
      id: 'q3',
      question: 'How much are you spending annually on your ITSM platform?',
      listen: 'Budget range, cost structure',
    },
    {
      id: 'q4',
      question: 'How quickly can your team deploy new workflows or changes?',
      listen: 'Timeframes, complexity, speed',
    },
    {
      id: 'q5',
      question: 'How satisfied is your IT ops team with the platform?',
      listen: 'Frustration, interface usability, adoption',
    },
    {
      id: 'q6',
      question: 'If you were starting fresh today, would you choose your current platform again?',
      listen: 'Honest assessment, regrets, switching desire',
    },
  ];

  const painOptions = [
    'High implementation cost',
    'Slow time-to-value',
    'User adoption challenges',
    'Licensing complexity',
    'Feature gaps',
    'Support/SLA issues',
    'Scalability concerns',
  ];

  const handleSubmitLogging = async () => {
    if (!discoveryNotes.trim()) {
      toast('Please enter discovery notes', 'error');
      return;
    }

    setLoading(true);
    try {
      // Analyze discovery notes
      const analysisRes = await fetch('/api/phase14/discovery-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discoveryNotes,
          quickCapture: {
            incumbent,
            budgetRange: budgetRange || undefined,
            timeline: timeline || undefined,
            painPoints,
          },
          companyName: deal?.title,
        }),
      });

      if (analysisRes.ok) {
        const analysis = await analysisRes.json();
        setStep('analysis');

        // Call onComplete with extracted data
        onComplete?.({
          incumbent: analysis.extracted?.incumbent || incumbent,
          budgetRange: analysis.extracted?.budgetRange || budgetRange,
          timeline: analysis.extracted?.timeline || timeline,
          painPoints: analysis.extracted?.pains || painPoints,
          champion: analysis.extracted?.champion,
          qualificationSignals: analysis.qualificationSignals,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Step 1: Discovery Guide */}
      {step === 'guide' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">Discovery Questions</h3>
          <p className="text-xs text-slate-600">
            Use these questions to guide your discovery call. Have them on hand during the meeting.
          </p>

          <div className="space-y-3">
            {discoveryQuestions.map(q => (
              <div key={q.id} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <p className="text-sm font-medium text-slate-900">{q.question}</p>
                <p className="text-xs text-slate-600 mt-1">👂 {q.listen}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep('logging')}
            className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            ✓ Ready - Continue to Logging
          </button>
        </div>
      )}

      {/* Step 2: Post-Discovery Logging */}
      {step === 'logging' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">Post-Call Debrief</h3>

          <div className="space-y-3">
            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                Call Notes
              </label>
              <textarea
                value={discoveryNotes}
                onChange={e => setDiscoveryNotes(e.target.value)}
                placeholder="Paste transcript or write summary of key points..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
                disabled={loading}
              />
            </div>

            {/* Quick Capture Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Incumbent */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                  Incumbent
                </label>
                <input
                  type="text"
                  value={incumbent}
                  onChange={e => setIncumbent(e.target.value)}
                  placeholder="e.g., ServiceNow"
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                  Budget
                </label>
                <input
                  type="text"
                  value={budgetRange}
                  onChange={e => setBudgetRange(e.target.value)}
                  placeholder="e.g., R150-250M"
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              {/* Timeline */}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                  Timeline
                </label>
                <select
                  value={timeline}
                  onChange={e => setTimeline(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="">Select timeline...</option>
                  <option value="<3 months">&lt;3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6-12 months">6-12 months</option>
                  <option value="12+ months">12+ months</option>
                </select>
              </div>

              {/* Pain Points */}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                  Pain Points
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {painOptions.map(pain => (
                    <label key={pain} className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={painPoints.includes(pain)}
                        onChange={e => {
                          if (e.target.checked) {
                            setPainPoints([...painPoints, pain]);
                          } else {
                            setPainPoints(painPoints.filter(p => p !== pain));
                          }
                        }}
                        className="w-3 h-3"
                        disabled={loading}
                      />
                      <span className="text-xs text-slate-700">{pain}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmitLogging}
              disabled={loading || !discoveryNotes.trim()}
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : '✓ Submit & Analyze'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Analysis Results */}
      {step === 'analysis' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-emerald-900 mb-2">✓ Discovery Complete</h3>
          <p className="text-sm text-emerald-700">
            Your discovery notes have been analyzed. Key intel extracted and ready for qualification scoring. Proceed to Step 2.
          </p>
        </div>
      )}
    </div>
  );
}
