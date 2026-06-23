/**
 * Contact Intelligence Research Steps 1-4
 *
 * Step 1: Resolve company domain
 * Step 2: Research company web (requires Firecrawl)
 * Step 3: Research individual (requires web search)
 * Step 4: Find & validate email (requires Hunter)
 */

export interface ResearchStep {
  step: number;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  error?: string;
}

export interface DomainResolutionResult {
  domain: string;
  source: string;
  confidence: number;
}

export interface CompanyResearchResult {
  sources: CompanySource[];
  extractedData: {
    leadershopTeam?: string[];
    companySize?: string;
    industry?: string;
    recentNews?: string[];
  };
}

export interface CompanySource {
  url: string;
  title: string;
  platform: 'company-website';
  crawlDate: Date;
  confidence: number;
  content?: string;
  relevance: 'high' | 'medium' | 'low';
}

export interface IndividualResearchResult {
  sources: IndividualSource[];
  foundProfiles: {
    linkedin?: string;
    github?: string;
    medium?: string;
    substack?: string;
    twitter?: string;
    companyBio?: string;
  };
}

export interface IndividualSource {
  url: string;
  title: string;
  snippet: string;
  platform: string;
  confidence: number;
  relevance: 'high' | 'medium' | 'low';
}

export interface EmailCandidate {
  email: string;
  confidence: number;
  pattern: string;
  source: 'generated' | 'discovered' | 'hunter';
  validated: boolean;
  validationStatus?: 'valid' | 'invalid' | 'unknown';
}

export interface EmailFindingResult {
  candidates: EmailCandidate[];
  primaryEmail?: string;
  primaryConfidence?: number;
}

/**
 * STEP 1: Resolve company domain
 * Can execute without external APIs (uses URL parsing)
 */
export function resolveDomainFromUrl(websiteUrl: string): DomainResolutionResult | null {
  try {
    const url = new URL(websiteUrl);
    return {
      domain: url.hostname,
      source: websiteUrl,
      confidence: 100,
    };
  } catch {
    return null;
  }
}

/**
 * Domain extraction helper
 */
export function extractDomainFromString(website: string): string | null {
  if (!website) return null;

  // Remove protocol
  let domain = website.replace(/^https?:\/\//, '');

  // Remove path
  domain = domain.split('/')[0];

  // Validate
  if (domain.includes('.')) {
    return domain;
  }

  return null;
}

/**
 * STEP 2: Prepare URLs for company web research
 * Ready for Firecrawl integration
 */
export function getPagesToCrawl(domain: string): string[] {
  const https = `https://${domain}`;
  return [
    https,
    `${https}/about`,
    `${https}/team`,
    `${https}/leadership`,
    `${https}/management`,
    `${https}/executives`,
    `${https}/news`,
    `${https}/press`,
    `${https}/press-releases`,
    `${https}/blog`,
    `${https}/careers`,
    `${https}/company`,
    `${https}/contact`,
  ];
}

/**
 * STEP 3: Generate search queries for individual research
 */
export function generateSearchQueries(name: string, company: string, domain: string): string[] {
  const queries = [
    // Broad searches
    `"${name}" "${company}"`,
    `"${name}" ${company}`,

    // Platform-specific
    `site:linkedin.com "${name}"`,
    `site:github.com "${name}"`,
    `site:medium.com "${name}"`,
    `site:substack.com "${name}"`,
    `site:twitter.com "${name}"`,

    // Company domain
    `site:${domain} "${name}"`,
    `site:${domain} author "${name}"`,

    // Specific roles
    `"${name}" CEO "${company}"`,
    `"${name}" CTO "${company}"`,
    `"${name}" founder "${company}"`,
    `"${name}" speaker`,
    `"${name}" conference`,
    `"${name}" podcast`,
  ];

  return [...new Set(queries)]; // Remove duplicates
}

/**
 * STEP 4: Generate email candidates
 * Ready for Hunter validation
 */
export function generateEmailCandidates(name: string, domain: string): EmailCandidate[] {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) {
    return [];
  }

  const first = parts[0].toLowerCase();
  const last = parts[parts.length - 1].toLowerCase();
  const firstInitial = first.charAt(0);
  const lastInitial = last.charAt(0);

  const candidates: EmailCandidate[] = [
    {
      email: `${first}@${domain}`,
      pattern: 'firstname@domain',
      confidence: 0,
      source: 'generated',
      validated: false,
    },
    {
      email: `${first}.${last}@${domain}`,
      pattern: 'firstname.lastname@domain',
      confidence: 0,
      source: 'generated',
      validated: false,
    },
    {
      email: `${firstInitial}${last}@${domain}`,
      pattern: 'firstinitial lastname@domain',
      confidence: 0,
      source: 'generated',
      validated: false,
    },
    {
      email: `${first}${lastInitial}@${domain}`,
      pattern: 'firstname lastinitial@domain',
      confidence: 0,
      source: 'generated',
      validated: false,
    },
    {
      email: `${firstInitial}.${last}@${domain}`,
      pattern: 'firstinitial.lastname@domain',
      confidence: 0,
      source: 'generated',
      validated: false,
    },
  ];

  return candidates;
}

/**
 * Extract email addresses from text using regex
 */
export function extractEmailsFromText(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return [...new Set(text.match(emailRegex) || [])];
}

/**
 * Confidence score helpers
 */
export function calculateDomainConfidence(source: 'url' | 'search' | 'inference'): number {
  const scores: Record<string, number> = {
    url: 100,
    search: 85,
    inference: 60,
  };
  return scores[source] || 0;
}

export function calculateEmailConfidence(
  source: 'generated' | 'discovered' | 'hunter',
  pattern: string,
  validated: boolean
): number {
  let baseScore = 0;

  if (source === 'hunter' && validated) {
    return 95;
  }

  if (source === 'discovered') {
    baseScore = 80;
  } else if (source === 'generated') {
    // Most common patterns get higher base scores
    if (pattern === 'firstname@domain' || pattern === 'firstname.lastname@domain') {
      baseScore = 60;
    } else {
      baseScore = 40;
    }
  }

  return validated ? baseScore + 15 : baseScore;
}

/**
 * Evidence storage helpers
 */
export interface Evidence {
  type: 'FACT' | 'INFERENCE';
  category: string;
  value: string;
  source: string;
  url?: string;
  confidence: 'high' | 'medium' | 'low';
  reasoning?: string;
}

export function createDomainEvidence(domain: string, source: string, confidence: number): Evidence {
  return {
    type: 'FACT',
    category: 'company_domain',
    value: domain,
    source,
    url: source,
    confidence: confidence >= 90 ? 'high' : confidence >= 70 ? 'medium' : 'low',
  };
}

export function createEmailEvidence(email: string, pattern: string, confidence: number): Evidence {
  return {
    type: 'FACT',
    category: 'email_candidate',
    value: email,
    source: pattern,
    confidence: confidence >= 80 ? 'high' : confidence >= 60 ? 'medium' : 'low',
  };
}
