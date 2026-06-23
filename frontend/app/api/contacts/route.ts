import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

async function triggerAutoEnrichment(contactId: string) {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try {
    await fetch(`${baseUrl}/api/contacts/${contactId}/intelligence/research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ forceRefresh: false }),
    });
  } catch (err) {
    console.error('[AutoEnrich] Failed to trigger research for contact', contactId, err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get('accountId');
    const search = searchParams.get('search') || '';

    const contacts = await prisma.contact.findMany({
      where: {
        ...(accountId && { accountId }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { title: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        account: { select: { id: true, name: true } },
        deals: { select: { id: true, title: true, stage: true, value: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ contacts });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { accountId, name, email, phone, title, role } = await req.json();

    if (!accountId || !name) {
      return NextResponse.json({ error: 'Account ID and name are required' }, { status: 400 });
    }

    const contact = await prisma.contact.create({
      data: { accountId, name, email: email || null, phone: phone || null, title: title || null, role: role || null },
      include: { account: true },
    });

    // Auto-enrich: kick off intelligence research in background (fire and forget)
    triggerAutoEnrichment(contact.id).catch(console.error);

    return NextResponse.json({ contact }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/contacts error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to create contact' }, { status: 500 });
  }
}
