import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { accountId, name, email, phone, title, role } = await req.json();

    if (!accountId || !name) {
      return NextResponse.json({ error: 'Account ID and name are required' }, { status: 400 });
    }

    const contact = await prisma.contact.create({
      data: { accountId, name, email: email || null, phone: phone || null, title: title || null, role: role || null },
    });

    return NextResponse.json({ contact }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/contacts error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to create contact' }, { status: 500 });
  }
}
