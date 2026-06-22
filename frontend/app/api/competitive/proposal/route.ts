import { NextRequest } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { COMPETITORS } from '@/lib/data/competitors';
import { SA_PARTNERS } from '@/lib/data/sa-partners';

const deepseek = createOpenAI({
  baseURL: process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
});

export async function POST(req: NextRequest) {
  const { competitorId, saPartnerId, accountContext, dealContext, verificationReport } = await req.json();

  const competitor = COMPETITORS.find(c => c.id === competitorId) ?? null;
  const partner = SA_PARTNERS.find(p => p.id === saPartnerId) ?? null;

  const prospectName = accountContext?.name ?? 'the Prospect';
  const industry = accountContext?.industry ?? 'enterprise';
  const location = accountContext?.location ?? 'South Africa';

  const competitorSection = competitor ? `
INCUMBENT PLATFORM TO DISPLACE: ${competitor.name}
- Current pricing: ${competitor.pricing.type} at ${competitor.pricing.basePrice}
- 3-year TCO (competitor): R${competitor.tco3Year.competitor.min/1000}K–R${competitor.tco3Year.competitor.max/1000}K
- 3-year TCO (HaloITSM): R${competitor.tco3Year.haloITSM.min/1000}K–R${competitor.tco3Year.haloITSM.max/1000}K
- Implementation time: ${competitor.complexity.implementation}
- Top weaknesses: ${competitor.keyWeaknesses.slice(0, 3).map(w => `${w.title}: ${w.description}`).join(' | ')}
- Win message: ${competitor.salesRebuttal.keyMessage}
` : '';

  const siSection = partner ? `
INCUMBENT SI TO DISPLACE: ${partner.name}
- Weaknesses: ${partner.weaknesses.slice(0, 3).join(' | ')}
- Our advantages vs them: ${partner.stratwyzeAdvantages.slice(0, 3).join(' | ')}
- Win message: ${partner.flankingStrategy.keyMessage}
` : '';

  const verifySection = verificationReport ? `
VERIFIED INTELLIGENCE (checked against current sources):
- Freshness: ${verificationReport.freshnessScore}
- Key update: ${verificationReport.freshnessRationale}
- New intelligence: ${(verificationReport.newIntelligence ?? []).join(' | ') || 'none'}
` : '';

  const fieldNotes = dealContext?.notes ? `\nFIELD NOTES FROM SE: ${dealContext.notes}` : '';

  const prompt = `You are a senior proposals writer for Stratwyze Solutions — South Africa's specialist HaloITSM partner.

Write a professional proposal for ${prospectName} (${industry}, ${location}).

STRATWYZE & HALOISTSM:
- Stratwyze Solutions: pure-play HaloITSM partner, Potchefstroom, North West, Reg. 2026/246323/07
- HaloITSM: enterprise ITSM platform by Halo Technologies Ltd (UK), ISO 27001, ITIL 4 certified
- Deployment: on-premises or cloud — full POPIA data sovereignty
- Implementation: 4–8 weeks with Stratwyze methodology
- Full Halo suite: HaloITSM + HaloCRM + HaloPSA

${competitorSection}
${siSection}
${verifySection}
${fieldNotes}

Write a complete, professional proposal in Markdown. Use exactly these section headers (## for each section):

## Executive Summary
## Understanding Your Challenge
## The HaloITSM Platform
## Why HaloITSM vs [Competitor/Current Solution]
## Why Stratwyze
## Commercial Proposition
## Implementation Approach
## Next Steps

Rules:
- Write for a ${industry} executive audience
- Use ZAR (R) for all pricing
- Reference POPIA compliance where relevant
- Be specific — use numbers, timelines, percentages
- Keep each section concise (150–250 words)
- Replace [Competitor/Current Solution] with the actual competitor name
- Make the Executive Summary prospect-specific and compelling
- End with clear, low-friction next steps`;

  if (!process.env.DEEPSEEK_API_KEY) {
    return new Response('AI not configured', { status: 503 });
  }

  const result = streamText({
    model: deepseek('deepseek-chat'),
    prompt,
    temperature: 0.5,
    maxOutputTokens: 3000,
  });

  return result.toTextStreamResponse();
}
