/**
 * Hunter.io API client for email finding and validation
 * Docs: https://hunter.io/api-documentation/v2
 */

const HUNTER_BASE = 'https://api.hunter.io/v2';

function getApiKey(): string {
  const key = process.env.HUNTER_API_KEY;
  if (!key) throw new Error('HUNTER_API_KEY not configured');
  return key;
}

export interface HunterEmailFindResult {
  email: string | null;
  confidence: number;
  pattern: string | null;
  sources: { uri: string; extracted_on: string }[];
  verification: {
    date: string | null;
    status: string | null;
  };
}

export interface HunterVerifyResult {
  email: string;
  result: 'deliverable' | 'undeliverable' | 'risky' | 'unknown';
  score: number;
  regexp: boolean;
  gibberish: boolean;
  disposable: boolean;
  webmail: boolean;
  mx_records: boolean;
  smtp_server: boolean;
  smtp_check: boolean;
  accept_all: boolean;
  block: boolean;
  sources: { uri: string }[];
}

export interface HunterDomainResult {
  pattern: string | null;
  emails: Array<{
    value: string;
    type: string;
    confidence: number;
    first_name: string;
    last_name: string;
    position: string;
  }>;
  organization: string;
}

/**
 * Find email for a person at a domain
 * Returns the most likely email with confidence score
 */
export async function findEmail(
  firstName: string,
  lastName: string,
  domain: string
): Promise<HunterEmailFindResult | null> {
  try {
    const params = new URLSearchParams({
      first_name: firstName,
      last_name: lastName,
      domain,
      api_key: getApiKey(),
    });

    const res = await fetch(`${HUNTER_BASE}/email-finder?${params}`);
    if (!res.ok) return null;

    const json = await res.json();
    const data = json.data;
    if (!data) return null;

    return {
      email: data.email,
      confidence: data.score || 0,
      pattern: data.pattern || null,
      sources: data.sources || [],
      verification: {
        date: data.verification?.date || null,
        status: data.verification?.status || null,
      },
    };
  } catch {
    return null;
  }
}

/**
 * Verify a single email address
 */
export async function verifyEmail(email: string): Promise<HunterVerifyResult | null> {
  try {
    const params = new URLSearchParams({
      email,
      api_key: getApiKey(),
    });

    const res = await fetch(`${HUNTER_BASE}/email-verifier?${params}`);
    if (!res.ok) return null;

    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

/**
 * Get domain pattern and known emails at a company
 */
export async function getDomainInfo(domain: string): Promise<HunterDomainResult | null> {
  try {
    const params = new URLSearchParams({
      domain,
      api_key: getApiKey(),
      limit: '5',
    });

    const res = await fetch(`${HUNTER_BASE}/domain-search?${params}`);
    if (!res.ok) return null;

    const json = await res.json();
    const data = json.data;
    if (!data) return null;

    return {
      pattern: data.pattern || null,
      emails: data.emails || [],
      organization: data.organization || '',
    };
  } catch {
    return null;
  }
}

/**
 * Map Hunter result score → confidence label
 */
export function scoreToConfidence(score: number): string {
  if (score >= 90) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
}

/**
 * Map Hunter verify result → delivery status
 */
export function resultToStatus(result: string): 'valid' | 'invalid' | 'risky' | 'unknown' {
  if (result === 'deliverable') return 'valid';
  if (result === 'undeliverable') return 'invalid';
  if (result === 'risky') return 'risky';
  return 'unknown';
}
