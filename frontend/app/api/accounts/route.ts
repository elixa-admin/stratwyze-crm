import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_req: NextRequest) {
  try {
    const accounts = await prisma.account.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ accounts });
  } catch (err: any) {
    console.error('GET /api/accounts error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to fetch accounts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, website, industry, employees, annualRevenue, headquarters, legalEntity, contacts } = body;

    if (!name) {
      return NextResponse.json({ error: 'Account name is required' }, { status: 400 });
    }

    const account = await prisma.account.create({
      data: {
        name,
        website:       website       || null,
        industry:      industry      || null,
        employees:     employees     ? parseInt(employees)      : null,
        annualRevenue: annualRevenue ? parseFloat(annualRevenue) : null,
        headquarters:  headquarters  || null,
        legalEntity:   legalEntity   || null,
        contacts:      contacts      ?? null,
      },
    });

    return NextResponse.json(
      { account, message: `Account "${name}" created successfully!` },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('POST /api/accounts error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to create account' }, { status: 500 });
  }
}
