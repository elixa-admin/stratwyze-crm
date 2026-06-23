// eslint-disable-next-line @typescript-eslint/no-require-imports
const FirecrawlApp = require('@mendable/firecrawl-js').default;

let _client: any | null = null;

function getFirecrawlClient(): any {
  if (!_client) {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) throw new Error('FIRECRAWL_API_KEY not configured');
    _client = new FirecrawlApp({ apiKey });
  }
  return _client;
}

export interface CrawlResult {
  url: string;
  title: string;
  content: string;
  markdown?: string;
  confidence: number;
}

/**
 * Scrape a single URL and return structured content
 */
export async function scrapePage(url: string): Promise<CrawlResult | null> {
  try {
    const client = getFirecrawlClient();
    const result = await client.scrapeUrl(url, { formats: ['markdown'] });

    // v4 SDK returns the document object directly, not { success, ... }
    const markdown = result?.markdown || result?.content || '';
    if (!markdown || markdown.length < 50) return null;

    return {
      url,
      title: result?.metadata?.title || url.split('/').pop() || 'Page',
      content: markdown,
      markdown,
      confidence: 90,
    };
  } catch {
    return null;
  }
}

/**
 * Scrape multiple pages with rate limiting
 */
export async function scrapePages(urls: string[], delayMs = 500): Promise<CrawlResult[]> {
  const results: CrawlResult[] = [];

  for (const url of urls) {
    try {
      const result = await scrapePage(url);
      if (result) results.push(result);
      await new Promise(r => setTimeout(r, delayMs));
    } catch {
      // Skip failed pages
    }
  }

  return results;
}
