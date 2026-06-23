import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface PreMeetingBriefRequest {
  companyName: string;
  accountId?: string;
  incumbentGuess?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { companyName, accountId, incumbentGuess } = (await req.json()) as PreMeetingBriefRequest;

    if (!companyName) {
      return NextResponse.json({ error: 'Company name required' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // Step 1: Run company research + account lookup in parallel
    const [researchRes, accountRes] = await Promise.allSettled([
      fetch(`${baseUrl}/api/company/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName }),
      }),
      accountId ? fetch(`${baseUrl}/api/accounts/${accountId}`) : Promise.resolve(null),
    ]);

    let companyIntelligence: any = {};
    let detectedTicker: string | null = null;
    let marketData: any = null;

    if (researchRes.status === 'fulfilled' && researchRes.value?.ok) {
      const researchData = await researchRes.value.json();
      companyIntelligence = researchData.profile || {};
      detectedTicker = researchData.detectedTicker || null;
      marketData = researchData.marketData || null;
    }

    let accountData: any = {};
    if (accountRes.status === 'fulfilled' && accountRes.value?.ok) {
      const data = await accountRes.value.json();
      accountData = data.account || {};
      // Use cached market data from account if fresher than research fetch
      if (!marketData && accountData.marketData) {
        marketData = accountData.marketData;
      }
    }

    // Market health summary for AI context
    const marketSection = marketData?.quote
      ? `MARKET HEALTH (JSE: ${marketData.symbol}):
Price: ${marketData.quote.price} ${marketData.quote.currency} (${marketData.quote.percentChange > 0 ? '+' : ''}${marketData.quote.percentChange.toFixed(2)}% today)
52-week range position: ${marketData.rangePosition}% — ${marketData.healthLabel}
Sales context: ${marketData.salesContext}`
      : '';

    // Step 3: Generate pre-meeting brief using Claude
    const briefPrompt = `You are a B2B sales consultant. Generate a concise pre-meeting brief for a discovery call.

COMPANY INFORMATION:
${companyIntelligence.companySnapshot?.description || `Company: ${companyName}`}
${companyIntelligence.companySnapshot?.revenue ? `Revenue: ${companyIntelligence.companySnapshot.revenue}` : ''}
${companyIntelligence.companySnapshot?.employees ? `Employees: ${companyIntelligence.companySnapshot.employees}` : ''}
${companyIntelligence.itsmRelevance ? `ITSM Relevance: ${companyIntelligence.itsmRelevance}` : ''}
${marketSection}

RECENT ACTIVITY:
${companyIntelligence.recentNews?.slice(0, 2).map((n: any) => `- ${n.headline}: ${n.significance || n.summary}`).join('\n') || 'No recent news found'}

M&A ACTIVITY:
${companyIntelligence.maActivity?.slice(0, 1).map((m: any) => `- ${m.event}: ${m.implication}`).join('\n') || 'No M&A activity detected'}

INCUMBENT PLATFORM (guessed): ${incumbentGuess || 'Unknown - will discover'}

Generate a brief in JSON format with these sections:
{
  "companySnapshot": { "description": "1-2 sentence overview", "revenue": "...", "employees": "...", "headquarters": "..." },
  "incumbentConfirmed": "${incumbentGuess || 'unknown'}",
  "battlecardLoaded": ${!!incumbentGuess},
  "companyIntelligence": {
    "itsmRelevance": "Why HaloITSM matters for THIS company (2 sentences)",
    "recentNews": [{ "headline": "...", "summary": "...", "significance": "Sales angle" }],
    "maActivity": [{ "event": "...", "implication": "ITSM impact" }]
  },
  "preparationTips": [
    "Key talking point 1",
    "Key talking point 2",
    "Key question to ask"
  ]
}

Return ONLY valid JSON, no markdown.`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: briefPrompt }],
    });

    const briefText = message.content[0].type === 'text' ? message.content[0].text : '';
    let brief: any;

    try {
      const jsonMatch = briefText.match(/\{[\s\S]*\}/);
      brief = JSON.parse(jsonMatch ? jsonMatch[0] : briefText);
    } catch {
      // Fallback: minimal brief structure
      brief = {
        companySnapshot: { description: `${companyName} - basic brief` },
        incumbentConfirmed: incumbentGuess || 'unknown',
        battlecardLoaded: !!incumbentGuess,
        companyIntelligence,
      };
    }

    brief.companyIntelligence = companyIntelligence;
    brief.accountData = accountData;
    brief.marketData = marketData;
    brief.detectedTicker = detectedTicker;

    return NextResponse.json(brief);
  } catch (err: any) {
    console.error('Pre-meeting brief error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to generate brief' }, { status: 500 });
  }
}
