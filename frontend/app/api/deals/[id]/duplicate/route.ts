import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const original = await prisma.deal.findUnique({ where: { id: params.id } });
    if (!original) return NextResponse.json({ error: 'Deal not found' }, { status: 404 });

    const duplicated = await prisma.deal.create({
      data: {
        title: `${original.title} (Copy)`,
        value: original.value,
        currency: original.currency,
        stage: 'Prospecting',
        accountId: original.accountId,
        incumbentPlatform: original.incumbentPlatform,
        incumbentProvider: original.incumbentProvider,
      },
      include: { account: true, activities: { orderBy: { createdAt: 'desc' } } },
    });

    return NextResponse.json({ deal: duplicated }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/deals/[id]/duplicate error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to duplicate deal' }, { status: 500 });
  }
}
