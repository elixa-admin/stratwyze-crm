'use client';

import { DEAL_STAGES } from '@/lib/deal-gating';

const STAGE_STEPS: Record<string, { id: string; label: string; required?: boolean }[]> = {
  Prospecting: [
    { id: 'pre-brief-generated', label: 'Pre-meeting brief generated', required: true },
    { id: 'discovery-scheduled', label: 'Discovery call scheduled', required: true },
    { id: 'discovery-completed', label: 'Discovery call completed', required: true },
    { id: 'intel-extracted', label: 'Intel extracted from call', required: true },
  ],
  Qualification: [
    { id: 'discovery-completed', label: 'Full discovery completed', required: true },
    { id: 'qualified-scored', label: 'Deal qualified and scored', required: true },
    { id: 'fit-threshold', label: 'Fit score ≥ 70', required: true },
  ],
  Solutioning: [
    { id: 'solution-defined', label: 'Modules and scope defined', required: true },
    { id: 'demo-planned', label: 'Demo scheduled', required: false },
    { id: 'scope-agreed', label: 'Proposal readiness ≥ 70%', required: true },
  ],
  Proposal: [
    { id: 'proposal-generated', label: 'AI proposal generated', required: true },
    { id: 'proposal-approved', label: 'Proposal reviewed and sent', required: true },
    { id: 'negotiation-reviewed', label: 'Negotiation brief reviewed', required: false },
  ],
};

const STAGE_COLORS: Record<string, { bg: string; border: string; dot: string; label: string }> = {
  Prospecting:   { bg: 'bg-indigo-50',  border: 'border-indigo-200', dot: 'bg-indigo-500',  label: 'text-indigo-700'  },
  Qualification: { bg: 'bg-amber-50',   border: 'border-amber-200',  dot: 'bg-amber-500',   label: 'text-amber-700'   },
  Solutioning:   { bg: 'bg-purple-50',  border: 'border-purple-200', dot: 'bg-purple-500',  label: 'text-purple-700'  },
  Proposal:      { bg: 'bg-blue-50',    border: 'border-blue-200',   dot: 'bg-blue-500',    label: 'text-blue-700'    },
};

interface Props {
  deal: any;
}

export default function DealJourneyTimeline({ deal }: Props) {
  const stepsCompleted: string[] = deal?.stageWorkflow?.stepsCompleted ?? [];
  const currentStage: string = deal?.stage ?? 'Prospecting';
  const stageHistory: any[] = deal?.stageWorkflow?.stageHistory ?? [];

  const currentStageIdx = DEAL_STAGES.indexOf(currentStage);
  const activeStages = DEAL_STAGES.filter((_, i) => i <= currentStageIdx && currentStage !== 'Won' && currentStage !== 'Lost');

  // Completion % per stage
  const getStageCompletion = (stage: string) => {
    const steps = STAGE_STEPS[stage];
    if (!steps) return 0;
    const done = steps.filter(s => stepsCompleted.includes(s.id)).length;
    return Math.round((done / steps.length) * 100);
  };

  // Find when a stage was entered from history
  const getStageDate = (stage: string) => {
    const entry = stageHistory.find((h: any) => h.stage === stage);
    if (!entry?.enteredAt) return null;
    return new Date(entry.enteredAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
  };

  if (activeStages.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">Deal Journey</h3>
        <p className="text-xs text-slate-500 mt-0.5">Steps completed across all stages</p>
      </div>

      <div className="divide-y divide-slate-50">
        {activeStages.map(stage => {
          const colors = STAGE_COLORS[stage] ?? STAGE_COLORS.Prospecting;
          const steps = STAGE_STEPS[stage] ?? [];
          const pct = getStageCompletion(stage);
          const isCurrentStage = stage === currentStage;
          const stageDate = getStageDate(stage);

          return (
            <div key={stage} className={`px-5 py-4 ${isCurrentStage ? '' : 'opacity-80'}`}>
              {/* Stage header */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`} />
                  <span className={`text-xs font-bold uppercase tracking-wide ${colors.label}`}>
                    {stage}
                  </span>
                  {isCurrentStage && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">Active</span>
                  )}
                  {stageDate && !isCurrentStage && (
                    <span className="text-[10px] text-slate-400">{stageDate}</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-600">{pct}%</span>
                  <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${colors.dot} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-1.5 ml-4">
                {steps.map(step => {
                  const done = stepsCompleted.includes(step.id);
                  return (
                    <div key={step.id} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        done ? `${colors.dot} border-transparent` : 'border-slate-200 bg-white'
                      }`}>
                        {done && <span className="text-white text-[9px] font-bold">✓</span>}
                      </div>
                      <span className={`text-xs ${done ? 'text-slate-700 font-medium' : step.required ? 'text-slate-400' : 'text-slate-300'}`}>
                        {step.label}
                      </span>
                      {!done && step.required && isCurrentStage && (
                        <span className="text-[9px] text-amber-500 font-semibold">required</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall completion */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
        {(() => {
          const allSteps = activeStages.flatMap(s => STAGE_STEPS[s] ?? []);
          const doneCt = allSteps.filter(s => stepsCompleted.includes(s.id)).length;
          const totalPct = allSteps.length > 0 ? Math.round((doneCt / allSteps.length) * 100) : 0;
          return (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-slate-600 transition-all" style={{ width: `${totalPct}%` }} />
              </div>
              <span className="text-xs font-bold text-slate-600 tabular-nums">{doneCt}/{allSteps.length} steps</span>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
