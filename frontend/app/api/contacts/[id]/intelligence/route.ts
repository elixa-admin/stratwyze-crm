import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '@/lib/db';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function serpSearch(query: string, n = 5): Promise<any[]> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) return [];
  try {
    const url = new URL('https://serpapi.com/search');
    url.searchParams.set('engine', 'google');
    url.searchParams.set('q', query);
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('num', String(n));
    url.searchParams.set('gl', 'za');
    url.searchParams.set('hl', 'en');
    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.organic_results ?? []).slice(0, n);
  } catch {
    return [];
  }
}

function fmt(results: any[]): string {
  return results.map(r => `- ${r.title}: ${r.snippet || ''}${r.date ? ` (${r.date})` : ''}`).join('\n');
}

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: params.id },
      include: { account: { select: { name: true, industry: true, website: true } } },
    });
    if (!contact) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });

    const { name, title, account } = contact;
    const companyName = account?.name ?? '';
    const industry = account?.industry ?? '';

    // 5 parallel searches
    const [linkedinResults, newsResults, speakingResults, companyRoleResults, generalResults] = await Promise.all([
      serpSearch(`site:linkedin.com/in "${name}" "${companyName}"`),
      serpSearch(`"${name}" "${companyName}" news interview quote`),
      serpSearch(`"${name}" speaking conference panel ITSM IT leadership ${industry}`),
      serpSearch(`"${name}" "${title || ''}" "${companyName}" IT technology decision`),
      serpSearch(`"${name}" "${companyName}"`),
    ]);

    // Find LinkedIn URL from results
    const linkedinUrl = linkedinResults.find((r: any) => r.link?.includes('linkedin.com/in/'))?.link
      ?? generalResults.find((r: any) => r.link?.includes('linkedin.com/in/'))?.link
      ?? null;

    const researchContext = [
      linkedinResults.length ? `LINKEDIN PROFILE:\n${fmt(linkedinResults)}` : '',
      newsResults.length ? `NEWS & INTERVIEWS:\n${fmt(newsResults)}` : '',
      speakingResults.length ? `SPEAKING & THOUGHT LEADERSHIP:\n${fmt(speakingResults)}` : '',
      companyRoleResults.length ? `ROLE & COMPANY CONTEXT:\n${fmt(companyRoleResults)}` : '',
      generalResults.length ? `GENERAL MENTIONS:\n${fmt(generalResults)}` : '',
    ].filter(Boolean).join('\n\n');

    const prompt = `You are a B2B sales intelligence analyst helping sales reps prepare for meetings with key contacts.

Contact: ${name}
Title: ${title || 'Unknown'}
Company: ${companyName}
Industry: ${industry}

RESEARCH FINDINGS:
${researchContext || 'No public data found — provide inferences based on role and company context.'}

Return ONLY valid JSON with this structure:
{
  "background": "2-3 sentence professional background. What they do, how long likely in role, career trajectory if inferable.",
  "decisionRole": "executive_sponsor | champion | technical_evaluator | gatekeeper | end_user | unknown",
  "decisionRoleLabel": "e.g. 'IT Decision Maker' or 'Technical Evaluator'",
  "influence": "high | medium | low",
  "likelyPriorities": [
    "Priority 1 inferred from role/industry",
    "Priority 2",
    "Priority 3"
  ],
  "talkingPoints": [
    "Conversation starter tailored to their role and company situation",
    "Key pain point to validate",
    "Value angle most relevant to their priorities"
  ],
  "approachStyle": "Brief guidance on communication style — e.g. 'leads with data and ROI', 'values peer references', 'focused on risk mitigation'",
  "redFlags": ["any concerns — e.g. 'may not have budget authority', 'role suggests technical gatekeeper not decision maker'"],
  "linkedinFound": ${linkedinUrl ? 'true' : 'false'},
  "dataConfidence": "High/Medium/Low — based on how much public data was found",
  "sourceNote": "What data was or wasn't available — e.g. 'LinkedIn profile found, no recent news mentions'"
}`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const intelligence = JSON.parse(jsonMatch ? jsonMatch[0] : text);

    // Persist to contact record (cast to any — Prisma types lag schema push)
    await (prisma.contact.update as any)({
      where: { id: params.id },
      data: {
        intelligenceData: intelligence,
        lastResearchedAt: new Date(),
        ...(linkedinUrl && !(contact as any).linkedin ? { linkedin: linkedinUrl } : {}),
      },
    });

    return NextResponse.json({ intelligence, linkedinUrl, sourceCount: linkedinResults.length + newsResults.length + speakingResults.length });
  } catch (err: any) {
    console.error('Contact intelligence error:', err);
    return NextResponse.json({ error: err?.message || 'Intelligence generation failed' }, { status: 500 });
  }
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: params.id },
      include: {
        account: { select: { id: true, name: true, industry: true } },
        deals: { select: { id: true, title: true, stage: true, value: true } },
      },
    });
    if (!contact) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    return NextResponse.json({ contact });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
