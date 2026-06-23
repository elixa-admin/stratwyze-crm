// Automatic Contact Intelligence Enrichment Strategy
// Auto-run intelligence on contacts based on pre-qualification rules

export interface ContactPreQualification {
  shouldAutoEnrich: boolean;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

// Pre-qualification rules — determines which contacts get auto-enriched
export function preQualifyContact(contact: any, account: any): ContactPreQualification {
  const reasons: string[] = [];
  let score = 0;

  // RULE 1: Role-based scoring (executive roles = high priority)
  const executiveRoles = ['CEO', 'CTO', 'CFO', 'VP', 'Head of', 'Director', 'Founder'];
  const isExecutive = executiveRoles.some(role =>
    contact.title?.toUpperCase().includes(role.toUpperCase()) ||
    contact.role?.toUpperCase().includes(role.toUpperCase())
  );
  if (isExecutive) {
    score += 40;
    reasons.push('Executive role detected');
  }

  // RULE 2: First contact bias (primary contact = enrich first)
  if (contact.isPrimary || contact.id === account?.primaryContactId) {
    score += 30;
    reasons.push('Primary contact for account');
  }

  // RULE 3: Deal stage triggers
  const accountHasRecentDeals = account?.deals?.some((d: any) => {
    const daysOld = (Date.now() - new Date(d.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysOld < 30; // Deals created in last 30 days
  });
  if (accountHasRecentDeals) {
    score += 20;
    reasons.push('Account has recent deal activity');
  }

  // RULE 4: Intelligence gap (no existing intelligence = auto-enrich)
  if (!contact.intelligenceData || Object.keys(contact.intelligenceData || {}).length === 0) {
    score += 25;
    reasons.push('No existing intelligence on file');
  } else {
    // Check if intelligence is stale (>7 days old)
    const lastResearched = new Date(contact.lastResearchedAt);
    const daysSince = (Date.now() - lastResearched.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince > 7) {
      score += 15;
      reasons.push('Intelligence is stale (>7 days old)');
    }
  }

  // RULE 5: Contact completeness (missing email = lower priority, but still eligible)
  if (!contact.email) {
    score += 10;
    reasons.push('Email not on file (may limit intelligence depth)');
  } else {
    score += 5;
    reasons.push('Email available for research');
  }

  // RULE 6: LinkedIn availability (if we have LinkedIn = higher confidence)
  if (contact.linkedin) {
    score += 5;
    reasons.push('LinkedIn profile found');
  }

  // Determine priority tier
  let priority: 'high' | 'medium' | 'low' = 'low';
  if (score >= 60) priority = 'high';
  else if (score >= 35) priority = 'medium';
  else priority = 'low';

  return {
    shouldAutoEnrich: score >= 30, // Threshold: 30+ points = auto-enrich
    priority,
    reason: reasons.join(' → '),
  };
}

// Queue management: which contacts to research next
export function prioritizeEnrichmentQueue(contacts: any[], account: any): any[] {
  return contacts
    .map(c => ({
      contact: c,
      qualification: preQualifyContact(c, account),
    }))
    .filter(item => item.qualification.shouldAutoEnrich)
    .sort((a, b) => {
      // Sort by priority: high → medium → low
      const priorityScore = { high: 3, medium: 2, low: 1 };
      return priorityScore[b.qualification.priority] - priorityScore[a.qualification.priority];
    })
    .map(item => item.contact);
}

// Caching strategy: avoid re-running research too frequently
export function shouldRefreshIntelligence(contact: any, forceRefresh: boolean = false): boolean {
  if (forceRefresh) return true;
  if (!contact.lastResearchedAt) return true; // Never researched

  const lastResearched = new Date(contact.lastResearchedAt);
  const daysSince = (Date.now() - lastResearched.getTime()) / (1000 * 60 * 60 * 24);

  // Refresh strategy:
  // - High-value contacts: refresh every 7 days
  // - Medium: every 14 days
  // - Low: every 30 days
  const executiveRoles = ['CEO', 'CTO', 'CFO', 'VP', 'Head of', 'Director', 'Founder'];
  const isExecutive = executiveRoles.some(role =>
    contact.title?.toUpperCase().includes(role.toUpperCase())
  );

  if (isExecutive) return daysSince > 7;
  if (contact.isPrimary) return daysSince > 14;
  return daysSince > 30;
}

// API endpoint trigger strategy
export const ENRICHMENT_CONFIG = {
  // Auto-run on page load if:
  AUTO_RUN_ON_PAGE_LOAD: true,

  // Only auto-run for these pre-qualification priorities
  AUTO_RUN_FOR_PRIORITIES: ['high', 'medium'],

  // Never auto-run on these conditions (user preference)
  DO_NOT_AUTO_RUN_IF: {
    userDisabledAutoEnrichment: true,
    contactIsArchived: true,
    accountIsArchived: true,
  },

  // Background queue processing
  BACKGROUND_QUEUE: {
    enabled: true,
    batchSize: 5, // Process 5 contacts at a time
    delayBetweenBatches: 2000, // 2 second delay to avoid rate limiting
    maxConcurrent: 3, // Max 3 concurrent enrichment requests
  },

  // Show UI feedback
  SHOW_ENRICHING_STATE: true,
  ENRICHING_MESSAGE: '🔍 Researching contact intelligence...',
  SHOW_CONFIDENCE_SCORE: true,
};

export type ContactAutoEnrichmentConfig = typeof ENRICHMENT_CONFIG;
