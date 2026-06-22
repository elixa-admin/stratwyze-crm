import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { COMPETITORS } from '@/lib/data/competitors';
import { SA_PARTNERS } from '@/lib/data/sa-partners';

const deepseek = createOpenAI({
  baseURL: process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
});

async function serpSearch(query: string): Promise<{ title: string; snippet: string; url: string; date: string | null }[]> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) return [];
  const url = new URL('https://serpapi.com/search');
  url.searchParams.set('engine', 'google');
  url.searchParams.set('q', query);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('num', '4');
  url.searchParams.set('gl', 'za');
  url.searchParams.set('hl', 'en');
  try {
    const res = await fetch(url.toString());
    const data = await res.json();
    return (data.organic_results ?? []).slice(0, 4).map((r: { title: string; snippet: string; link: string; date?: string }) => ({
      title: r.title, snippet: r.snippet, url: r.link, date: r.date ?? null,
    }));
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const { competitorId, saPartnerId } = await req.json();

  const competitor = COMPETITORS.find(c => c.id === competitorId) ?? null;
  const partner = SA_PARTNERS.find(p => p.id === saPartnerId) ?? null;

  if (!competitor && !partner) {
    return NextResponse.json({ error: 'At least one competitor required' }, { status: 400 });
  }

  const searches: Array<{ label: string; query: string }> = [];
  if (competitor) {
    searches.push(
      { label: 'pricing', query: `${competitor.name} ITSM pricing South Africa 2025 2026` },
      { label: 'news', query: `${competitor.name} company news acquisition merger 2025 2026` },
      { label: 'security', query: `${competitor.name} security vulnerability CVE advisory 2025 2026` },
    );
  }
  if (partner) {
    searches.push(
      { label: 'partner_news', query: `${partner.name} South Africa ITSM news 2025 2026` },
      { label: 'partner_platform', query: `${partner.name} ${partner.platformAlignment} partnership 2025` },
    );
  }

  const searchResults = await Promise.all(
    searches.map(async s => ({ label: s.label, query: s.query, results: await serpSearch(s.query) }))
  );

  const competitorSummary = competitor ? `
Competitor: ${competitor.name}
Our static claims:
- Pricing: ${competitor.pricing.type} at ${competitor.pricing.basePrice}
- Weaknesses: ${competitor.keyWeaknesses.slice(0, 3).map(w => w.title).join(', ')}
- Deployment: ${competitor.deployment}
- Ownership: ${competitor.ownership}
- Architecture: ${competitor.architecture}
` : '';

  const partnerSummary = partner ? `
SI: ${partner.name} (${partner.platformAlignment})
Our static claims:
- Threat level: ${partner.threatLevel}
- Key weaknesses: ${partner.weaknesses.slice(0, 3).join(', ')}
- Data confidence: ${partner.dataConfidence}
- Last verified: ${partner.lastVerified}
` : '';

  const searchContext = searchResults
    .filter(s => s.results.length > 0)
    .map(s => `[${s.label.toUpperCase()} SEARCH: "${s.query}"]
${s.results.map(r => `- ${r.title}: ${r.snippet}${r.date ? ` (${r.date})` : ''}`).join('\n')}`)
    .join('\n\n');

  const prompt = `You are a competitive intelligence analyst for Stratwyze Solutions (HaloITSM partner, South Africa).

Review our static competitive intelligence against recent web search results and assess what needs updating.

OUR STATIC DATA:
${competitorSummary}
${partnerSummary}

RECENT SEARCH RESULTS (${new Date().getFullYear()}):
${searchContext || 'No search results available — assess confidence based on data age.'}

Return ONLY valid JSON (no markdown, no explanation):
{
  "freshnessScore": "Current|Likely current|Needs verification|Stale",
  "freshnessRationale": "One sentence explaining the score",
  "changes": [
    {
      "claim": "The specific claim from our static data",
      "status": "Confirmed|Changed|Unverifiable",
      "evidence": "What the search results show",
      "sourceUrl": "URL if available or null",
      "impact": "low|medium|high"
    }
  ],
  "newIntelligence": ["Any net-new intelligence worth knowing from the search results"],
  "recommendation": "One paragraph on what to verify before submitting a proposal",
  "safeToPropose": true
}

Rules:
- Only include changes where you found relevant evidence — don't fabricate
- Mark as "Unverifiable" if search results don't address the claim
- safeToPropose: false only if you found evidence that significantly contradicts our static data
- Focus on South African market context`;

  try {
    const { text } = await generateText({
      model: deepseek('deepseek-chat'),
      prompt,
      temperature: 0.2,
      maxOutputTokens: 1200,
    });

    let report;
    try {
      const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      report = JSON.parse(clean);
    } catch {
      return NextResponse.json({ error: 'Parse failed', raw: text }, { status: 500 });
    }

    return NextResponse.json({
      report,
      searchesRun: searches.length,
      resultsFound: searchResults.reduce((n, s) => n + s.results.length, 0),
      competitorName: competitor?.name ?? null,
      siName: partner?.name ?? null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI call failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
