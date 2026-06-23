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

    // Step 1: Fetch company research (from Phase 14 research endpoint, or basic lookup)
    let companyIntelligence: any = {};
    try {
      const researchRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/company/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName }),
      });

      if (researchRes.ok) {
        const researchData = await researchRes.json();
        companyIntelligence = researchData.profile || {};
      }
    } catch (err) {
      console.warn('Company research unavailable, proceeding with basic brief');
    }

    // Step 2: Fetch existing account data (if linked)
    let accountData: any = {};
    if (accountId) {
      try {
        const accountRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/accounts/${accountId}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (accountRes.ok) {
          const data = await accountRes.json();
          accountData = data.account || {};
        }
      } catch (err) {
        console.warn('Account lookup failed');
      }
    }

    // Step 3: Generate pre-meeting brief using Claude
    const briefPrompt = `You are a B2B sales consultant. Generate a concise pre-meeting brief for a discovery call.

COMPANY INFORMATION:
${companyIntelligence.companySnapshot?.description || `Company: ${companyName}`}
${companyIntelligence.companySnapshot?.revenue ? `Revenue: ${companyIntelligence.companySnapshot.revenue}` : ''}
${companyIntelligence.companySnapshot?.employees ? `Employees: ${companyIntelligence.companySnapshot.employees}` : ''}
${companyIntelligence.itsmRelevance ? `ITSM Relevance: ${companyIntelligence.itsmRelevance}` : ''}

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

    // Add research data to brief
    brief.companyIntelligence = companyIntelligence;
    brief.accountData = accountData;

    return NextResponse.json(brief);
  } catch (err: any) {
    console.error('Pre-meeting brief error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to generate brief' }, { status: 500 });
  }
}
