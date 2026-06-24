import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const SEED_TEMPLATES = [
  {
    name: 'Follow-Up After Discovery Call',
    category: 'follow_up',
    subject: 'Following up — {{dealTitle}}',
    body: `Hi {{contactName}},

Thank you for taking the time to speak with us today. It was great learning more about your current ITSM setup and the challenges your team is facing.

Based on our conversation, I believe HaloITSM could be a strong fit for {{accountName}}. To recap what we discussed:

- {{painPoint1}}
- {{painPoint2}}

As a next step, I'd like to schedule a technical deep-dive to walk through how HaloITSM handles your specific requirements. Would you be available for a 45-minute session later this week?

Looking forward to continuing the conversation.

Kind regards,`,
    isAI: false,
  },
  {
    name: 'Proposal Introduction',
    category: 'proposal',
    subject: 'Your HaloITSM Proposal — {{referenceNumber}}',
    body: `Hi {{contactName}},

Please find attached your tailored proposal for {{accountName}}.

The proposal outlines a solution for {{agentCount}} agents on a {{deploymentPref}} deployment, designed around the requirements we discussed.

Key highlights:
- Full HaloITSM implementation with professional services
- Phased rollout plan to minimise disruption
- Dedicated onboarding and training support

I'll be in touch to walk you through the proposal in detail. In the meantime, please don't hesitate to reach out with any questions.

Kind regards,`,
    isAI: false,
  },
  {
    name: 'Objection — Price Concern',
    category: 'objection',
    subject: 'Re: {{dealTitle}} — TCO Comparison',
    body: `Hi {{contactName}},

Thank you for raising the pricing concern — I appreciate the transparency.

I'd like to share a few points that may help with the evaluation:

1. **Total Cost of Ownership**: When comparing against {{incumbentPlatform}}, HaloITSM typically delivers a 30–40% reduction in total licensing and maintenance costs over 3 years.

2. **Included services**: Unlike many competitors, our pricing includes implementation support, training, and unlimited support tickets — there are no hidden professional services fees.

3. **Flexible licensing**: We can adjust the agent count or deployment model to better match your budget cycle.

Would it be helpful to do a side-by-side TCO comparison? I can have one ready within 24 hours.

Kind regards,`,
    isAI: false,
  },
  {
    name: 'Post-Demo Follow-Up',
    category: 'follow_up',
    subject: 'Demo recap — {{dealTitle}}',
    body: `Hi {{contactName}},

Thank you for joining the HaloITSM demo session today. I hope it gave your team a clear picture of what's possible.

I've noted the following items from our Q&A that I'll follow up on:

- {{actionItem1}}
- {{actionItem2}}

I'll have these back to you by {{followUpDate}}.

In the meantime, here's a link to our knowledge base if your team would like to explore specific features: https://halosoftware.com/resources

Looking forward to the next steps.

Kind regards,`,
    isAI: false,
  },
];

export async function GET() {
  try {
    let templates = await prisma.emailTemplate.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    // Seed if empty
    if (templates.length === 0) {
      await prisma.emailTemplate.createMany({ data: SEED_TEMPLATES });
      templates = await prisma.emailTemplate.findMany({
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
      });
    }

    return NextResponse.json({ templates });
  } catch (err: any) {
    console.error('[GET /api/email/templates]', err);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, category, subject, body } = await request.json();
    if (!name || !subject || !body) {
      return NextResponse.json({ error: 'name, subject, body required' }, { status: 400 });
    }

    const template = await prisma.emailTemplate.create({
      data: { name, category: category ?? 'custom', subject, body },
    });

    return NextResponse.json({ template });
  } catch (err: any) {
    console.error('[POST /api/email/templates]', err);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
