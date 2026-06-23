/**
 * Deal stage gating logic
 * Enforces strict progression: must meet requirements to advance
 */

export interface StageRequirement {
  id: string;
  label: string;
  completed: boolean;
  blockerMessage?: string;
}

export interface StageGates {
  canAdvance: boolean;
  missingRequirements: StageRequirement[];
  message: string;
}

/**
 * Check if deal can advance FROM current stage to next stage
 */
export function checkStageLocking(
  currentStage: string,
  stepsCompleted: string[],
  dealData: any
): StageGates {
  const requirements: StageRequirement[] = [];

  switch (currentStage) {
    case 'Prospecting':
      // Requirements to move from Prospecting → Qualification
      requirements.push({
        id: 'pre-brief-generated',
        label: 'Pre-meeting brief generated',
        completed: stepsCompleted.includes('pre-brief-generated'),
      });
      requirements.push({
        id: 'discovery-scheduled',
        label: 'Discovery call scheduled',
        completed: stepsCompleted.includes('discovery-scheduled'),
      });
      requirements.push({
        id: 'discovery-completed',
        label: 'Discovery call completed',
        completed: stepsCompleted.includes('discovery-completed'),
      });
      requirements.push({
        id: 'intel-extracted',
        label: 'Discovery intel extracted',
        completed: stepsCompleted.includes('intel-extracted'),
      });
      break;

    case 'Qualification':
      // Requirements to move from Qualification → Solutioning
      requirements.push({
        id: 'discovery-completed',
        label: 'Discovery workflow completed',
        completed: stepsCompleted.includes('discovery-completed'),
      });
      requirements.push({
        id: 'qualified-scored',
        label: 'Deal qualified and scored',
        completed: stepsCompleted.includes('qualified-scored'),
      });
      requirements.push({
        id: 'fit-threshold',
        label: 'Fit score ≥ 70',
        completed: (dealData?.fitScore ?? 0) >= 70,
        blockerMessage: `Current fit score: ${dealData?.fitScore ?? 0}/100. Need ≥70 to advance.`,
      });
      break;

    case 'Solutioning':
      // Requirements to move from Solutioning → Proposal
      requirements.push({
        id: 'solution-defined',
        label: 'Solution modules and scope defined',
        completed: stepsCompleted.includes('solution-defined'),
      });
      requirements.push({
        id: 'scope-agreed',
        label: 'Proposal readiness ≥ 70%',
        completed: stepsCompleted.includes('scope-agreed') || (dealData?.proposalReadinessScore ?? 0) >= 70,
        blockerMessage: `Proposal readiness: ${dealData?.proposalReadinessScore ?? 0}%. Define modules, scope, and demo plan.`,
      });
      break;

    case 'Proposal':
      // Requirements to move from Proposal → Won
      requirements.push({
        id: 'proposal-generated',
        label: 'Proposal generated',
        completed: stepsCompleted.includes('proposal-generated'),
      });
      requirements.push({
        id: 'proposal-approved',
        label: 'Proposal reviewed and approved',
        completed: stepsCompleted.includes('proposal-approved'),
      });
      break;

    case 'Won':
    case 'Lost':
      // Terminal states—no advancement
      return {
        canAdvance: false,
        missingRequirements: [],
        message: 'Deal is in final state',
      };
  }

  const missing = requirements.filter(r => !r.completed);
  const canAdvance = missing.length === 0;

  return {
    canAdvance,
    missingRequirements: missing,
    message: canAdvance
      ? '✅ Ready to advance'
      : `⚠️ Complete ${missing.length} requirement${missing.length !== 1 ? 's' : ''} to advance`,
  };
}

/**
 * Log that a step was completed
 */
export function completeStep(currentSteps: string[], stepId: string): string[] {
  if (currentSteps.includes(stepId)) return currentSteps;
  return [...currentSteps, stepId];
}

/**
 * Get next stage after current stage
 */
export function getNextStage(currentStage: string): string | null {
  const progression = ['Prospecting', 'Qualification', 'Solutioning', 'Proposal', 'Won'];
  const currentIndex = progression.indexOf(currentStage);
  if (currentIndex === -1 || currentIndex === progression.length - 1) return null;
  return progression[currentIndex + 1];
}

export function getStageLabelReadable(stage: string): string {
  const labels: Record<string, string> = {
    Prospecting: 'Prospecting',
    Qualification: 'Qualification',
    Solutioning: 'Solutioning',
    Proposal: 'Proposal',
    Won: 'Won',
    Lost: 'Lost',
  };
  return labels[stage] || stage;
}

export const DEAL_STAGES = ['Prospecting', 'Qualification', 'Solutioning', 'Proposal', 'Won'];
