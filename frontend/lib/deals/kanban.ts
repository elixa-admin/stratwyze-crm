/**
 * Kanban utilities for deal pipeline management
 */

export const DEAL_STAGES = [
  { id: 'Prospecting', label: 'Prospecting', order: 1 },
  { id: 'Qualification', label: 'Qualification', order: 2 },
  { id: 'Proposal', label: 'Proposal', order: 3 },
  { id: 'Negotiation', label: 'Negotiation', order: 4 },
  { id: 'Won', label: 'Won', order: 5 },
  { id: 'Lost', label: 'Lost', order: 6 },
];

export type DealStage = typeof DEAL_STAGES[number]['id'];

/**
 * Calculate win probability from deal intelligence
 * Based on decision maker score and buying relevance
 */
export function calculateWinProbability(
  decisionMakerScore: number | null | undefined,
  buyingRelevance: number | null | undefined
): number {
  if (!decisionMakerScore || !buyingRelevance) return 0;
  // Average of the two scores
  return Math.round((decisionMakerScore + buyingRelevance) / 2);
}

/**
 * Get color for deal value visualization
 * Small: <$50k, Medium: $50-200k, Large: >$200k
 */
export function getDealSizeColor(value: number): string {
  if (value < 50000) return 'bg-blue-100';
  if (value < 200000) return 'bg-purple-100';
  return 'bg-red-100';
}

/**
 * Format deal value for display
 */
export function formatDealValue(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
}

/**
 * Calculate days in current stage
 */
export function calculateDaysInStage(stageHistory: any[] | null | undefined): number {
  if (!stageHistory || stageHistory.length === 0) return 0;
  const currentStage = stageHistory[stageHistory.length - 1];
  if (!currentStage?.enteredAt) return 0;
  const now = new Date();
  const entered = new Date(currentStage.enteredAt);
  return Math.floor((now.getTime() - entered.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Get win probability color
 */
export function getWinProbabilityColor(probability: number): string {
  if (probability >= 75) return 'text-emerald-600';
  if (probability >= 50) return 'text-amber-600';
  return 'text-slate-600';
}

/**
 * Get win probability badge
 */
export function getWinProbabilityBadge(probability: number): string {
  if (probability >= 75) return '🟢';
  if (probability >= 50) return '🟡';
  return '⚪';
}
