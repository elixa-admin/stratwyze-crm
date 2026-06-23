import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface DiscoveryAnalysisRequest {
  discoveryNotes: string;
  quickCapture: any;
  companyName: string;
  incumbentPlatform?: string;
  preBrief?: any;
}

export async function POST(req: NextRequest) {
  try {
    const { discoveryNotes, quickCapture, companyName } = (await req.json()) as DiscoveryAnalysisRequest;

    if (!discoveryNotes) {
      return NextResponse.json({ error: 'Discovery notes required' }, { status: 400 });
    }

    // Use Claude to extract key intelligence from discovery notes
    const extractionPrompt = `You are a B2B sales intelligence analyst. Extract key information from these discovery call notes.

COMPANY: ${companyName}
INCUMBENT PLATFORM (from form): ${quickCapture?.incumbent || 'Not specified'}

CALL NOTES:
${discoveryNotes}

QUICK CAPTURE DATA:
- Budget mentioned: ${quickCapture?.budgetMentioned ? quickCapture.budgetRange : 'No'}
- Timeline: ${quickCapture?.timeline || 'Not specified'}
- Decision process: ${quickCapture?.decisionProcess || 'Not specified'}
- Pain points: ${quickCapture?.pains?.join(', ') || 'None captured'}
- Champion found: ${quickCapture?.championFound ? quickCapture.championName : 'No'}

Extract and return ONLY valid JSON (no markdown) with this structure:
{
  "extracted": {
    "incumbent": "ServiceNow/Jira/Freshservice/etc. or null if still unknown",
    "budgetRange": "R[X]-[Y]M over 3 years or null",
    "timeline": "<3 months / 3-6 months / 6-12 months / 12+ months or null",
    "decisionProcess": "RFP / Sole-source / Steering committee / etc. or null",
    "champion": "Name and title if mentioned, or null",
    "pains": ["pain1", "pain2", "pain3"],
    "keyQuotes": ["quote1", "quote2"],
    "nextSteps": "What the prospect said they'd do next"
  },
  "qualificationSignals": {
    "fitScore": "0-100 based on pain alignment to HaloITSM MOATs",
    "fitReasoning": "Why this score (in 1 sentence)",
    "goNoGo": "GO / MAYBE / NO-GO with brief reasoning",
    "recommendedAngle": "Which HaloITSM MOAT to lead with (Speed/Cost/Adoption/AI/Cloud-native)"
  },
  "nextAction": "What to do next: Schedule technical discovery / Send proposal prep / Schedule follow-up call / etc."
}

Focus on extracting factual information from the notes. If something isn't mentioned, leave it null.`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: extractionPrompt }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    let analysis: any;

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch {
      // Fallback: minimal structure
      analysis = {
        extracted: {
          incumbent: quickCapture?.incumbent || null,
          budgetRange: quickCapture?.budgetRange || null,
          timeline: quickCapture?.timeline || null,
          pains: quickCapture?.pains || [],
        },
        qualificationSignals: {
          fitScore: 50,
          goNoGo: 'MAYBE',
          recommendedAngle: 'Cost',
        },
      };
    }

    // Ensure extracted data has our quick captures as fallback
    if (!analysis.extracted.incumbent && quickCapture?.incumbent) {
      analysis.extracted.incumbent = quickCapture.incumbent;
    }
    if (!analysis.extracted.pains) {
      analysis.extracted.pains = quickCapture?.pains || [];
    }
    if (!analysis.extracted.champion && quickCapture?.championName) {
      analysis.extracted.champion = quickCapture.championName;
    }

    return NextResponse.json({
      extracted: analysis.extracted,
      qualificationSignals: analysis.qualificationSignals,
      nextAction: analysis.nextAction,
      companyName,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Discovery analysis error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to analyze discovery' }, { status: 500 });
  }
}
