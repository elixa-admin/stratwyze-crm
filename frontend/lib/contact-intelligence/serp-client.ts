/**
 * SerpAPI client for individual and company web research
 * Reuses existing SERPAPI_KEY from Wave 22
 */

const SERP_BASE = 'https://serpapi.com/search';

function getApiKey(): string {
  const key = process.env.SERPAPI_KEY;
  if (!key) throw new Error('SERPAPI_KEY not configured');
  return key;
}

export interface SerpResult {
  title: string;
  url: string;
  snippet: string;
  date?: string | null;
  platform?: string;
}

/**
 * Run a single web search and return top results
 */
export async function webSearch(query: string, numResults = 5): Promise<SerpResult[]> {
  try {
    const url = new URL(SERP_BASE);
    url.searchParams.set('engine', 'google');
    url.searchParams.set('q', query);
    url.searchParams.set('api_key', getApiKey());
    url.searchParams.set('num', String(numResults));
    url.searchParams.set('gl', 'us');
    url.searchParams.set('hl', 'en');

    const res = await fetch(url.toString());
    if (!res.ok) return [];

    const data = await res.json();
    const organic = data.organic_results || [];

    return organic.slice(0, numResults).map((r: any) => ({
      title: r.title || '',
      url: r.link || '',
      snippet: r.snippet || '',
      date: r.date || null,
      platform: detectPlatform(r.link || ''),
    }));
  } catch {
    return [];
  }
}

/**
 * Run multiple searches in sequence with delay
 * Returns deduplicated results sorted by relevance
 */
export async function multiSearch(
  queries: string[],
  numPerQuery = 3,
  delayMs = 300
): Promise<SerpResult[]> {
  const seen = new Set<string>();
  const all: SerpResult[] = [];

  for (const query of queries) {
    try {
      const results = await webSearch(query, numPerQuery);
      for (const r of results) {
        if (!seen.has(r.url)) {
          seen.add(r.url);
          all.push(r);
        }
      }
      if (delayMs > 0) await new Promise(res => setTimeout(res, delayMs));
    } catch {
      // Skip failed queries
    }
  }

  return all;
}

/**
 * Detect platform from URL
 */
export function detectPlatform(url: string): string {
  if (!url) return 'web';
  if (url.includes('linkedin.com')) return 'linkedin';
  if (url.includes('github.com')) return 'github';
  if (url.includes('medium.com')) return 'medium';
  if (url.includes('substack.com')) return 'substack';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
  if (url.includes('youtube.com')) return 'youtube';
  if (url.includes('crunchbase.com')) return 'crunchbase';
  if (url.includes('bloomberg.com')) return 'news';
  if (url.includes('techcrunch.com')) return 'news';
  if (url.includes('forbes.com')) return 'news';
  if (url.includes('businessinsider.com')) return 'news';
  return 'web';
}

/**
 * Score a search result's relevance to a contact
 */
export function scoreRelevance(
  result: SerpResult,
  name: string,
  company: string
): 'high' | 'medium' | 'low' {
  const text = `${result.title} ${result.snippet}`.toLowerCase();
  const nameMatch = text.includes(name.toLowerCase());
  const companyMatch = text.includes(company.toLowerCase());

  if (nameMatch && companyMatch) return 'high';
  if (nameMatch || result.platform === 'linkedin') return 'medium';
  return 'low';
}
