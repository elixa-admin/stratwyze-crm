import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? 'onboarding@resend.dev';

export async function POST(request: NextRequest) {
  try {
    const { dealId, to, subject, body, contactId } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'to, subject, and body required' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [to],
      subject,
      html: body.replace(/\n/g, '<br/>'),
      text: body,
    });

    if (error) {
      console.error('[Resend send error]', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Log activity on the deal
    if (dealId) {
      await prisma.activity.create({
        data: {
          dealId,
          type: 'email',
          content: `Email sent: "${subject}" → ${to}`,
          metadata: {
            to,
            subject,
            body,
            messageId: data?.id ?? null,
            contactId: contactId ?? null,
          },
        },
      });
    }

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (err: any) {
    console.error('[POST /api/email/send]', err);
    return NextResponse.json({ error: err.message ?? 'Send failed' }, { status: 500 });
  }
}
