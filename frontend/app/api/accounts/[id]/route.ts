import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const account = await prisma.account.findUnique({
      where: { id: params.id },
      include: {
        deals: {
          orderBy: { createdAt: 'desc' },
          select: { id: true, title: true, value: true, stage: true, createdAt: true },
        },
        contacts: true,
      },
    });
    if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    return NextResponse.json({ account });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { name, website, industry, headquarters, employees, annualRevenue } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    const account = await prisma.account.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        website: website || null,
        industry: industry || null,
        headquarters: headquarters || null,
        employees: employees ? parseInt(employees, 10) : null,
        annualRevenue: annualRevenue ? parseFloat(annualRevenue) : null,
      },
      include: { deals: { orderBy: { createdAt: 'desc' }, select: { id: true, title: true, value: true, stage: true, createdAt: true } }, contacts: true },
    });

    return NextResponse.json({ account });
  } catch (err: any) {
    console.error('PATCH /api/accounts/[id] error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to update account' }, { status: 500 });
  }
}
