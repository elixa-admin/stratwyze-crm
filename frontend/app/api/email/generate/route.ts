import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { dealId, purpose, tone, contactName, extraContext } = await request.json();

    if (!dealId || !purpose) {
      return NextResponse.json({ error: 'dealId and purpose required' }, { status: 400 });
    }

    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        account: { select: { name: true, industry: true } },
        primaryContact: { select: { name: true, title: true, email: true } },
      },
    });

    if (!deal) return NextResponse.json({ error: 'Deal not found' }, { status: 404 });

    const recipientName = contactName || deal.primaryContact?.name || 'there';
    const accountName = deal.account?.name ?? deal.title;

    const purposeMap: Record<string, string> = {
      follow_up: 'a professional follow-up after a sales meeting or call',
      proposal_intro: 'introducing a proposal and highlighting the key value proposition',
      objection: 'addressing a pricing or competitive objection professionally',
      demo_request: 'requesting a product demonstration with a compelling reason to say yes',
      check_in: 'a light-touch check-in to re-engage a deal that has gone quiet',
      closing: 'a closing email to prompt a decision and summarise the value',
      custom: extraContext ?? 'a professional sales email',
    };

    const toneMap: Record<string, string> = {
      professional: 'professional and formal',
      friendly: 'warm, conversational, and friendly — still professional but approachable',
      urgent: 'concise and action-oriented, creating a sense of appropriate urgency',
      consultative: 'consultative and insight-led — position as a trusted advisor, not a salesperson',
    };

    const prompt = `You are a senior B2B sales professional at Stratwyze Solutions, a HaloITSM reseller in South Africa.

Write ${purposeMap[purpose] ?? purposeMap.follow_up} to ${recipientName} at ${accountName}.

Context:
- Deal: ${deal.title}
- Stage: ${deal.stage}
- Value: R${deal.value.toLocaleString()}
${deal.account?.industry ? `- Industry: ${deal.account.industry}` : ''}
${deal.incumbentPlatform ? `- Incumbent platform: ${deal.incumbentPlatform}` : ''}
${deal.incumbentProvider ? `- Incumbent SI: ${deal.incumbentProvider}` : ''}
${extraContext ? `- Additional context: ${extraContext}` : ''}

Tone: ${toneMap[tone] ?? toneMap.professional}

Rules:
- Address the recipient as "${recipientName}"
- Sign off as "Kind regards," (no name — the sender will add their own)
- Do NOT include placeholders like [Your Name] or [Date]
- Keep to 150–250 words
- No subject line — output the email body only
- Make it specific to the deal context above, not generic

Output only the email body.`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    });

    const body = message.content[0].type === 'text' ? message.content[0].text.trim() : '';

    // Generate a subject line separately
    const subjectMsg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 60,
      messages: [{
        role: 'user',
        content: `Write a concise, professional email subject line for this email. Output ONLY the subject line, nothing else.\n\n${body}`,
      }],
    });

    const subject = subjectMsg.content[0].type === 'text'
      ? subjectMsg.content[0].text.trim().replace(/^["']|["']$/g, '')
      : `Following up — ${deal.title}`;

    return NextResponse.json({ subject, body });
  } catch (err: any) {
    console.error('[POST /api/email/generate]', err);
    return NextResponse.json({ error: err.message ?? 'Generation failed' }, { status: 500 });
  }
}
