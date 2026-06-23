import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { detectJseTicker, fetchMarketData } from '@/lib/market-data';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function serpSearch(query: string, numResults = 5): Promise<any[]> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) return [];
  try {
    const url = new URL('https://serpapi.com/search');
    url.searchParams.set('engine', 'google');
    url.searchParams.set('q', query);
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('num', String(numResults));
    url.searchParams.set('gl', 'za');
    url.searchParams.set('hl', 'en');
    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.organic_results ?? []).slice(0, numResults);
  } catch {
    return [];
  }
}

function formatResults(results: any[]): string {
  return results.map(r => `- ${r.title}: ${r.snippet || ''}${r.date ? ` (${r.date})` : ''}`).join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const { companyName, website, industry, employees, location } = await req.json();
    if (!companyName) return NextResponse.json({ error: 'Company name required' }, { status: 400 });

    // Run all searches in parallel — includes JSE listing search
    const [overviewResults, newsResults, maResults, linkedinResults, revenueResults, jseResults] = await Promise.all([
      serpSearch(`"${companyName}" company overview ${industry || ''} ${location || 'South Africa'} employees revenue`),
      serpSearch(`"${companyName}" news 2025 2026`),
      serpSearch(`"${companyName}" acquisition merger funding investment 2024 2025 2026`),
      serpSearch(`site:linkedin.com/company "${companyName}"`),
      serpSearch(`"${companyName}" annual revenue turnover financial results`),
      serpSearch(`"${companyName}" JSE listed ticker symbol Johannesburg Stock Exchange`),
    ]);

    const webContext = [
      overviewResults.length ? `COMPANY OVERVIEW:\n${formatResults(overviewResults)}` : '',
      revenueResults.length ? `REVENUE & FINANCIALS:\n${formatResults(revenueResults)}` : '',
      newsResults.length ? `RECENT NEWS:\n${formatResults(newsResults)}` : '',
      maResults.length ? `M&A ACTIVITY:\n${formatResults(maResults)}` : '',
      linkedinResults.length ? `LINKEDIN PRESENCE:\n${formatResults(linkedinResults)}` : '',
      jseResults.length ? `JSE LISTING:\n${formatResults(jseResults)}` : '',
    ].filter(Boolean).join('\n\n');

    // Auto-detect JSE ticker from all research text
    const allResearchText = webContext + '\n' + jseResults.map((r: any) => `${r.title} ${r.snippet}`).join(' ');
    const detectedTicker = detectJseTicker(allResearchText, companyName);

    if (!webContext) {
      return NextResponse.json({ error: 'No research data found' }, { status: 404 });
    }

    const prompt = `You are a B2B sales intelligence analyst. Based on the following web research, create a structured company profile for sales qualification purposes. Return ONLY valid JSON.

Company: "${companyName}"
${website ? `Website: ${website}` : ''}
${industry ? `Industry: ${industry}` : ''}
${employees ? `Known employees: ${employees}` : ''}
${location ? `Location: ${location}` : ''}

WEB RESEARCH FINDINGS:
${webContext}

Return this exact JSON structure:
{
  "companySnapshot": {
    "description": "1-2 sentence overview of what the company does",
    "revenue": "estimated annual revenue or range (use ZAR if SA company)",
    "employees": "employee count or range",
    "founded": "founding year if known, else null",
    "headquarters": "city, country",
    "website": "website URL if found",
    "industry": "industry sector"
  },
  "recentNews": [
    { "headline": "news headline", "summary": "1-sentence summary", "date": "date if known", "significance": "why this matters for sales" }
  ],
  "maActivity": [
    { "event": "acquisition/merger/funding event", "date": "date", "amount": "deal amount if known", "implication": "what this means for IT/ITSM needs" }
  ],
  "linkedinInsights": {
    "followerRange": "estimated follower count range",
    "growthSignal": "any growth indicators from snippets",
    "keyHires": "any notable hires mentioned"
  },
  "itsmRelevance": "Why this company would benefit from HaloITSM — 2 sentences based on size, industry, and growth signals",
  "qualificationQuestions": [
    "Discovery question 1 tailored to their situation",
    "Discovery question 2",
    "Discovery question 3"
  ],
  "redFlags": ["any concerns or risks for this deal"],
  "dataConfidence": "High/Medium/Low based on how much public data was found"
}`;

    const models = ['claude-haiku-4-5-20251001', 'claude-sonnet-4-6'];
    let lastErr: any;

    for (const model of models) {
      try {
        const message = await anthropic.messages.create({
          model,
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }],
        });
        const text = message.content[0].type === 'text' ? message.content[0].text : '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const profile = JSON.parse(jsonMatch ? jsonMatch[0] : text);
        // Fetch live market data if ticker detected
        let marketData = null;
        if (detectedTicker) {
          try { marketData = await fetchMarketData(detectedTicker, companyName); } catch { /* non-blocking */ }
        }

        return NextResponse.json({
          profile,
          model,
          detectedTicker,
          isListed: !!detectedTicker,
          marketData,
          sourceCount: overviewResults.length + newsResults.length + maResults.length + linkedinResults.length + revenueResults.length + jseResults.length,
          sources: {
            overview: overviewResults.length,
            news: newsResults.length,
            ma: maResults.length,
            linkedin: linkedinResults.length,
            revenue: revenueResults.length,
            jse: jseResults.length,
          },
        });
      } catch (err) {
        lastErr = err;
      }
    }

    throw lastErr;
  } catch (err: any) {
    console.error('Company research error:', err);
    return NextResponse.json({ error: err?.message || 'Research failed' }, { status: 500 });
  }
}
