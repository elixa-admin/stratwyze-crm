import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      select: {
        id: true,
        title: true,
        value: true,
        stage: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ deals });
  } catch (err: any) {
    console.error('[GET /api/deals/list]', err);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}
