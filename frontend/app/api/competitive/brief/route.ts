import { NextRequest, NextResponse } from 'next/server';
import { generateWithFallback } from '@/lib/utils/ai-fallback-chain';
import { COMPETITORS } from '@/lib/data/competitors';
import { SA_PARTNERS } from '@/lib/data/sa-partners';
import { ResearchActivityTracker } from '@/lib/utils/research-activity';

async function serpSearch(query: string): Promise<string> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) return '';

  try {
    const url = new URL('https://serpapi.com/search');
    url.searchParams.set('engine', 'google');
    url.searchParams.set('q', query);
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('num', '5');
    url.searchParams.set('gl', 'za');
    url.searchParams.set('hl', 'en');

    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return '';

    const data = await res.json();
    const results = (data.organic_results ?? []).slice(0, 5);

    return results
      .map((r: any) => `- ${r.title}: ${r.snippet}${r.date ? ` (${r.date})` : ''}`)
      .join('\n');
  } catch (err) {
    return '';
  }
}

const STRATWYZE_CONTEXT = `
Stratwyze Solutions — South Africa's specialist HaloITSM partner.
- Registered: 2026/246323/07, Potchefstroom, North West Province
- Website: stratwyze.co.za
- Pure-play HaloITSM partner: no competing platforms, no MSP operations
- Full Halo suite: HaloITSM + HaloCRM + HaloPSA — one SA partner, one platform
- Implementation: 4–8 weeks (vs 6–18 months for enterprise competitors)
- Deployment: On-premises and cloud — full POPIA data sovereignty from day one
- HaloITSM: UK-based vendor (Halo Technologies Ltd), ISO 27001, ITIL 4 certified
- Key differentiators: ZAR pricing, SA-based support, POPIA-compliant, ITIL 4 maturity programmes
`;

export async function POST(req: NextRequest) {
  const timeoutHandle = setTimeout(() => {}, 25000);

  try {
    const { competitorId, saPartnerId, dealContext } = await req.json();
    const activity = new ResearchActivityTracker();

    if (!process.env.DEEPSEEK_API_KEY && !process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
      clearTimeout(timeoutHandle);
      return NextResponse.json({ error: 'No AI providers configured' }, { status: 503 });
    }

    const competitor = COMPETITORS.find(c => c.id === competitorId) ?? null;
    const partner = SA_PARTNERS.find(p => p.id === saPartnerId) ?? null;

    if (!competitor && !partner) {
      clearTimeout(timeoutHandle);
      return NextResponse.json({ error: 'At least one competitor required' }, { status: 400 });
    }

    // Stage 1: SerpAPI web search for recent context (optional, skipped if no API key)
    let webContext = '';
    if (process.env.SERPAPI_KEY) {
      activity.addActivity('search', 'Searching for recent competitive intelligence...');
      if (competitor) {
        const compSearch = await serpSearch(`${competitor.name} ITSM pricing news updates 2025 2026`);
        if (compSearch) {
          webContext += `\nRECENT WEB FINDINGS (${competitor.name}):\n${compSearch}\n`;
          activity.addActivity('search', `Found ${compSearch.split('\n').length} recent results for ${competitor.name}`);
        }
      }
      if (partner) {
        const partnerSearch = await serpSearch(`${partner.name} ITSM implementation news 2025 2026`);
        if (partnerSearch) {
          webContext += `\nRECENT WEB FINDINGS (${partner.name}):\n${partnerSearch}\n`;
          activity.addActivity('search', `Found ${partnerSearch.split('\n').length} recent results for ${partner.name}`);
        }
      }
    }

    const competitorContext = competitor ? `
INCUMBENT PLATFORM: ${competitor.name}
Risk level: ${competitor.riskLevel}
Deployment: ${competitor.deployment}
Ownership: ${competitor.ownership}
Architecture: ${competitor.architecture}
Pricing: ${competitor.pricing.type} — ${competitor.pricing.basePrice}
Additional costs: ${competitor.pricing.additionalCosts.join(', ')}
Implementation: ${competitor.complexity.implementation}
Admin complexity: ${competitor.complexity.adminComplexity}
Customisation: ${competitor.complexity.customization}
Support quality: ${competitor.complexity.supportQuality}
3YR TCO (competitor): R${competitor.tco3Year.competitor.min/1000}K–R${competitor.tco3Year.competitor.max/1000}K
3YR TCO (HaloITSM): R${competitor.tco3Year.haloITSM.min/1000}K–R${competitor.tco3Year.haloITSM.max/1000}K
Key weaknesses: ${competitor.keyWeaknesses.slice(0, 4).map(w => `${w.title}: ${w.description}`).join(' | ')}
Sales rebuttal key message: ${competitor.salesRebuttal.keyMessage}
Known winning points: ${competitor.salesRebuttal.winningPoints.slice(0, 3).join(' | ')}
Security certifications: ${competitor.securityCertifications.join(', ') || 'limited public evidence'}
` : '';

    const partnerContext = partner ? `
INCUMBENT SI / CONSULTANCY: ${partner.name}
Category: ${partner.category}
Threat level: ${partner.threatLevel}
Platform alignment: ${partner.platformAlignment}
Headquarters: ${partner.headquarters}, ${partner.province}
Typical deal size: ${partner.typicalDealSize ?? 'unknown'}
Sales cycle: ${partner.salesCycle ?? 'unknown'}
Key weaknesses: ${partner.weaknesses.slice(0, 4).join(' | ')}
Flanking situation: ${partner.flankingStrategy.situation}
Flanking approach: ${partner.flankingStrategy.approach}
Flanking key message: ${partner.flankingStrategy.keyMessage}
Watch out: ${partner.flankingStrategy.watchOut}
Stratwyze advantages: ${partner.stratwyzeAdvantages.slice(0, 3).join(' | ')}
` : '';

    const accountContext = dealContext ? `
DEAL CONTEXT:
Account: ${dealContext.accountName ?? 'unknown'}
Industry: ${dealContext.industry ?? 'unknown'}
Location: ${dealContext.location ?? 'South Africa'}
Deal value: ${dealContext.dealValue ? `R${dealContext.dealValue/1000}K` : 'unknown'}
Notes: ${dealContext.notes ?? 'none'}
` : '';

    const prompt = `${STRATWYZE_CONTEXT}

${competitorContext}
${partnerContext}
${accountContext}
${webContext}

Generate a battle card. Return ONLY valid JSON (no markdown):

{
  "openingStatement": "2-sentence opening",
  "platformRisks": ["risk 1", "risk 2", "risk 3"],
  "siRisks": ["SI risk 1", "SI risk 2"],
  "winStatement": "Powerful sentence with TCO/timeline numbers",
  "cioAngle": "Strategic angle for CIO (1-2 sentences)",
  "itManagerAngle": "Operational angle for IT Manager (1-2 sentences)",
  "watchOuts": ["deal risk 1", "deal risk 2"],
  "dataConfidence": "High"
}`;

    try {
      // Stage 2: AI generation with fallback chain
      activity.addActivity('tier-attempt', 'Starting AI generation with fallback chain...');
      const aiStartTime = Date.now();

      const result = await generateWithFallback(prompt, {
        temperature: 0.4,
        maxOutputTokens: 2500,
        costBudget: 15,
      });

      const aiDuration = Date.now() - aiStartTime;
      activity.addActivity('tier-success', `${result.tier} generated brief`, result.tier, undefined, aiDuration);

      let brief;
      try {
        let clean = result.text.trim();
        // Remove markdown code block markers
        if (clean.startsWith('```json')) clean = clean.slice(7);
        if (clean.startsWith('```')) clean = clean.slice(3);
        if (clean.startsWith('\n')) clean = clean.slice(1);
        if (clean.endsWith('```')) clean = clean.slice(0, -3);
        clean = clean.trim();

        // Parse JSON
        brief = JSON.parse(clean);
      } catch (parseErr: unknown) {
        const msg = parseErr instanceof Error ? parseErr.message : 'unknown';
        console.error('JSON parse failed:', { msg, textLength: result.text.length, snippet: result.text.substring(6500, 6600) });
        clearTimeout(timeoutHandle);
        return NextResponse.json({ error: 'AI generated invalid JSON', details: msg }, { status: 500 });
      }

      const totalDuration = activity.getTotalDuration();
      activity.addActivity('complete', `Brief generated successfully in ${totalDuration}ms`);

      clearTimeout(timeoutHandle);
      return NextResponse.json({
        brief,
        competitorName: competitor?.name ?? null,
        siName: partner?.name ?? null,
        aiTier: result.tier,
        costEstimate: result.costEstimate,
        researchActivity: activity.getActivities(),
        researchLog: activity.getFormattedLog(),
        totalDuration,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'All AI tiers failed';
      activity.addActivity('tier-error', message);
      clearTimeout(timeoutHandle);
      return NextResponse.json(
        { error: message, researchActivity: activity.getActivities(), researchLog: activity.getFormattedLog() },
        { status: 503 }
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Request failed';
    clearTimeout(timeoutHandle);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
