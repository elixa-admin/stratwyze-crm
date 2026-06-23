'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';
import LeadEntryScreen from './screens/LeadEntryScreen';
import PreMeetingBriefScreen from './screens/PreMeetingBriefScreen';
import DiscoveryGuideScreen from './screens/DiscoveryGuideScreen';
import PostDiscoveryLoggingScreen from './screens/PostDiscoveryLoggingScreen';
import DiscoveryAnalysisScreen from './screens/DiscoveryAnalysisScreen';

type Phase14Stage = 'lead-entry' | 'pre-brief' | 'discovery-guide' | 'post-logging' | 'analysis';

interface DiscoveryFlowData {
  companyName: string;
  accountId?: string;
  incumbentPlatform?: string;
  industry?: string;
  employees?: string;
  location?: string;
  preBrief?: any;
  discoveryNotes?: string;
  analysis?: any;
}

interface Phase14Props {
  onComplete?: (data: DiscoveryFlowData) => void;
  onClose?: () => void;
}

export default function DiscoveryFlowContainer({ onComplete, onClose }: Phase14Props) {
  const [stage, setStage] = useState<Phase14Stage>('lead-entry');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DiscoveryFlowData>({
    companyName: '',
    incumbentPlatform: undefined,
  });

  // Stage 1: Lead Entry → Stage 2: Pre-Meeting Brief
  const handleLeadEntry = async (entryData: { companyName: string; accountId?: string; incumbentPlatform?: string }) => {
    setLoading(true);
    try {
      const newData = { ...data, ...entryData };
      setData(newData);

      // Fetch pre-meeting brief (company research + incumbent detection)
      const briefRes = await fetch('/api/phase14/pre-meeting-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: entryData.companyName,
          accountId: entryData.accountId,
          incumbentGuess: entryData.incumbentPlatform,
        }),
      });

      if (briefRes.ok) {
        const brief = await briefRes.json();
        setData(prev => ({ ...prev, preBrief: brief }));
        setStage('pre-brief');
      } else {
        toast('Failed to generate brief', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Stage 2: Pre-Meeting Brief → Stage 3: Discovery Guide
  const handleBriefConfirm = () => {
    setStage('discovery-guide');
  };

  // Stage 3: Discovery Guide → Stage 4: Post-Discovery Logging
  const handleDiscoveryStart = () => {
    setStage('post-logging');
  };

  // Stage 4: Post-Discovery Logging → Stage 5: Analysis
  const handlePostDiscoverySubmit = async (notes: string, quickCapture: any) => {
    setLoading(true);
    try {
      const newData = { ...data, discoveryNotes: notes };
      setData(newData);

      // Analyze discovery notes (extract budget, timeline, pain points, etc.)
      const analysisRes = await fetch('/api/phase14/discovery-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discoveryNotes: notes,
          quickCapture,
          companyName: data.companyName,
          incumbentPlatform: data.incumbentPlatform || quickCapture?.incumbent,
          preBrief: data.preBrief,
        }),
      });

      if (analysisRes.ok) {
        const analysis = await analysisRes.json();
        setData(prev => ({ ...prev, analysis }));
        setStage('analysis');
      } else {
        toast('Failed to analyze discovery', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Stage 5: Analysis → Complete & Move to Phase 15
  const handleAnalysisComplete = () => {
    if (onComplete) {
      onComplete(data);
    }
  };

  // Progress indicator
  const stageOrder: Phase14Stage[] = ['lead-entry', 'pre-brief', 'discovery-guide', 'post-logging', 'analysis'];
  const stageIndex = stageOrder.indexOf(stage);
  const stageLabels = ['Lead Entry', 'Pre-Brief', 'Discovery', 'Debrief', 'Analysis'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Progress bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-slate-900">Phase 14: Guided Discovery</h1>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-sm font-medium"
            >
              ✕ Close
            </button>
          </div>
          <div className="flex gap-2">
            {stageLabels.map((label, i) => (
              <div key={i} className="flex items-center gap-1.5 flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    i < stageIndex
                      ? 'bg-emerald-500 text-white'
                      : i === stageIndex
                      ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {i < stageIndex ? '✓' : i + 1}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:inline ${
                    i <= stageIndex ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {label}
                </span>
                {i < stageLabels.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 ${i < stageIndex ? 'bg-emerald-300' : 'bg-slate-200'}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage content */}
      <div className="max-w-4xl mx-auto py-6 px-4">
        {stage === 'lead-entry' && (
          <LeadEntryScreen
            onNext={handleLeadEntry}
            loading={loading}
          />
        )}

        {stage === 'pre-brief' && (
          <PreMeetingBriefScreen
            data={data}
            onNext={handleBriefConfirm}
            onBack={() => setStage('lead-entry')}
            loading={loading}
          />
        )}

        {stage === 'discovery-guide' && (
          <DiscoveryGuideScreen
            data={data}
            onStart={handleDiscoveryStart}
            onBack={() => setStage('pre-brief')}
          />
        )}

        {stage === 'post-logging' && (
          <PostDiscoveryLoggingScreen
            data={data}
            onSubmit={handlePostDiscoverySubmit}
            onBack={() => setStage('discovery-guide')}
            loading={loading}
          />
        )}

        {stage === 'analysis' && (
          <DiscoveryAnalysisScreen
            data={data}
            onComplete={handleAnalysisComplete}
            onBack={() => setStage('post-logging')}
          />
        )}
      </div>
    </div>
  );
}
