/**
 * Sales stage definitions with required actions per stage
 */

export interface StageAction {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  linkedActivityTypes?: string[];
}

export interface StageDef {
  id: string;
  label: string;
  description: string;
  expectedDays: number;
  actions: StageAction[];
  conversationStarters: string[];
}

export const STAGE_DEFINITIONS: Record<string, StageDef> = {
  Prospecting: {
    id: 'Prospecting',
    label: 'Prospecting',
    description: 'Identify and qualify prospect',
    expectedDays: 7,
    actions: [
      {
        id: 'contact_found',
        title: 'Primary contact identified',
        description: 'Find the main decision maker or contact',
        required: true,
        linkedActivityTypes: ['contact_added'],
      },
      {
        id: 'initial_contact',
        title: 'Initial outreach sent',
        description: 'First call, email, or message',
        required: true,
        linkedActivityTypes: ['call', 'email'],
      },
      {
        id: 'fit_assessment',
        title: 'Fit assessment documented',
        description: 'Does this company fit our solution?',
        required: true,
        linkedActivityTypes: ['note'],
      },
    ],
    conversationStarters: [
      "What's your biggest operational challenge right now?",
      'How many locations/teams do you operate?',
      "What's your tech stack for [key domain]?",
      'Who typically leads these kinds of decisions?',
    ],
  },

  Qualification: {
    id: 'Qualification',
    label: 'Qualification',
    description: 'Understand needs, budget, and timeline',
    expectedDays: 14,
    actions: [
      {
        id: 'discovery_call',
        title: 'Discovery call completed',
        description: 'Detailed conversation about their challenges',
        required: true,
        linkedActivityTypes: ['call', 'meeting'],
      },
      {
        id: 'pain_points',
        title: 'Pain points documented',
        description: '3+ specific challenges identified',
        required: true,
        linkedActivityTypes: ['note'],
      },
      {
        id: 'budget_confirmed',
        title: 'Budget range confirmed',
        description: 'Understand their budget constraints',
        required: true,
        linkedActivityTypes: ['note'],
      },
      {
        id: 'timeline_identified',
        title: 'Decision timeline confirmed',
        description: 'When do they need a solution?',
        required: true,
        linkedActivityTypes: ['note'],
      },
    ],
    conversationStarters: [
      'Walk me through your current process',
      "What's blocking you from solving this today?",
      'When would you like to have this solved?',
      "What would success look like for you?",
      'Who else needs to be involved in this decision?',
    ],
  },

  Proposal: {
    id: 'Proposal',
    label: 'Proposal',
    description: 'Build and present solution',
    expectedDays: 7,
    actions: [
      {
        id: 'solution_designed',
        title: 'Solution designed for their needs',
        description: 'Customized approach documented',
        required: true,
        linkedActivityTypes: ['note'],
      },
      {
        id: 'proposal_sent',
        title: 'Proposal document sent',
        description: 'Formal proposal delivered',
        required: true,
        linkedActivityTypes: ['email'],
      },
      {
        id: 'demo_scheduled',
        title: 'Demo or presentation scheduled',
        description: 'Live walkthrough of solution',
        required: true,
        linkedActivityTypes: ['meeting'],
      },
    ],
    conversationStarters: [
      "Here's how we'd approach your challenges",
      'This solution integrates with your existing [system]',
      'ROI typically looks like [X] in [timeframe]',
      'Would next Tuesday work for a demo?',
    ],
  },

  Negotiation: {
    id: 'Negotiation',
    label: 'Negotiation',
    description: 'Close objections and finalize terms',
    expectedDays: 14,
    actions: [
      {
        id: 'objections_addressed',
        title: 'Objections addressed',
        description: 'Key concerns overcome',
        required: true,
        linkedActivityTypes: ['call', 'note'],
      },
      {
        id: 'contract_ready',
        title: 'Contract prepared and reviewed',
        description: 'Legal docs ready for signature',
        required: true,
        linkedActivityTypes: ['note'],
      },
      {
        id: 'executive_approval',
        title: 'Executive approval obtained',
        description: 'Final sign-off from decision maker',
        required: true,
        linkedActivityTypes: ['call', 'meeting'],
      },
    ],
    conversationStarters: [
      "I understand your concern about [X]. Here's how we handle that...",
      'The contract is ready for review',
      'What approval chain do we need to go through?',
      'When can we get signatures?',
    ],
  },

  Won: {
    id: 'Won',
    label: 'Won',
    description: 'Deal closed successfully',
    expectedDays: 0,
    actions: [
      {
        id: 'contract_signed',
        title: 'Contract signed',
        required: true,
        linkedActivityTypes: ['note'],
      },
      {
        id: 'deal_closed',
        title: 'Deal entered as Won',
        required: true,
        linkedActivityTypes: ['note'],
      },
    ],
    conversationStarters: [],
  },

  'Lost': {
    id: 'Lost',
    label: 'Lost',
    description: 'Deal closed as Lost',
    expectedDays: 0,
    actions: [
      {
        id: 'loss_documented',
        title: 'Loss reason documented',
        required: true,
        linkedActivityTypes: ['note'],
      },
    ],
    conversationStarters: [],
  },
};

/**
 * Get stage definition by stage ID
 */
export function getStageDef(stageId: string): StageDef | null {
  return STAGE_DEFINITIONS[stageId] || null;
}

/**
 * Get all stages in order
 */
export function getAllStages(): StageDef[] {
  return [
    STAGE_DEFINITIONS.Prospecting,
    STAGE_DEFINITIONS.Qualification,
    STAGE_DEFINITIONS.Proposal,
    STAGE_DEFINITIONS.Negotiation,
    STAGE_DEFINITIONS.Won,
  ];
}
