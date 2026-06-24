import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { dealId, rawText, inputType } = await request.json();

    if (!dealId || !rawText?.trim()) {
      return NextResponse.json({ error: 'dealId and rawText required' }, { status: 400 });
    }

    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        account: { select: { name: true, industry: true, headquarters: true } },
        activities: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    const contextLines = [
      `Deal: ${deal.title}`,
      `Stage: ${deal.stage}`,
      deal.account ? `Account: ${deal.account.name}${deal.account.industry ? ` (${deal.account.industry})` : ''}` : null,
      deal.incumbentPlatform ? `Incumbent Platform: ${deal.incumbentPlatform}` : null,
      deal.incumbentProvider ? `Incumbent SI: ${deal.incumbentProvider}` : null,
    ].filter(Boolean).join('\n');

    const prompt = `You are a sales intelligence AI for HaloITSM deals. Analyse the following ${inputType === 'email' ? 'email thread' : 'call/meeting notes'} and extract structured intelligence.

DEAL CONTEXT:
${contextLines}

${inputType === 'email' ? 'EMAIL THREAD:' : 'CALL / MEETING NOTES:'}
---
${rawText.trim()}
---

Return a JSON object with exactly this structure:
{
  "summary": "2-3 sentence structured summary of what happened, what was agreed, and the current deal position",
  "sentiment": "positive" | "neutral" | "at_risk",
  "stageSuggestion": {
    "action": "advance" | "stay" | "risk",
    "reason": "one sentence explanation"
  },
  "actionItems": [
    { "content": "specific action item", "suggestedDueDays": <integer days from now>, "owner": "rep" | "client" | "both" }
  ],
  "objections": [
    { "text": "objection as stated or implied", "competitor": "competitor name if mentioned, otherwise null", "category": "pricing" | "integration" | "migration" | "risk" | "stakeholder" | "other" }
  ]
}

Rules:
- actionItems: only include concrete commitments, not vague intentions. Max 6.
- objections: only include genuine pushback or concerns, not neutral questions. Max 5.
- sentiment: "at_risk" if there is a clear blocker, budget freeze, or champion loss; "positive" if there is strong buying signal; "neutral" otherwise.
- stageSuggestion action "advance" only if clear readiness was expressed; "risk" if there is a serious blocker.
- Return ONLY the JSON object, no markdown, no commentary.`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : '';
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON in response');
      parsed = JSON.parse(jsonMatch[0]);
    }

    // Create Activity record
    const inputLabel = inputType === 'email' ? 'email thread' : 'call notes';
    const activityContent = `[AI Debrief — ${inputLabel}] ${parsed.summary}`;
    const activity = await prisma.activity.create({
      data: {
        dealId,
        type: 'debrief',
        content: activityContent,
        metadata: {
          sentiment: parsed.sentiment,
          stageSuggestion: parsed.stageSuggestion,
          actionItems: parsed.actionItems ?? [],
          objections: parsed.objections ?? [],
          inputType,
          rawTextLength: rawText.trim().length,
        },
      },
    });

    // Create Task records for each action item
    const now = new Date();
    const tasks = await Promise.all(
      (parsed.actionItems ?? []).map((item: any) => {
        const due = new Date(now);
        due.setDate(due.getDate() + (item.suggestedDueDays ?? 3));
        return prisma.task.create({
          data: {
            dealId,
            content: item.content,
            dueDate: due,
            assignedTo: item.owner ?? 'rep',
            source: 'debrief',
          },
        });
      })
    );

    return NextResponse.json({
      activityId: activity.id,
      summary: parsed.summary,
      sentiment: parsed.sentiment,
      stageSuggestion: parsed.stageSuggestion,
      actionItems: parsed.actionItems ?? [],
      objections: parsed.objections ?? [],
      tasksCreated: tasks.length,
    });
  } catch (err: any) {
    console.error('[POST /api/deals/debrief]', err);
    return NextResponse.json({ error: err.message ?? 'Debrief failed' }, { status: 500 });
  }
}
