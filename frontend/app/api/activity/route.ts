import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      include: { deal: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const mapped = activities.map((a) => ({
      id: a.id,
      type: a.type,
      timestamp: a.createdAt.toISOString(),
      summary: a.content,
      details: undefined,
      dealId: a.deal?.id,
      dealTitle: a.deal?.title,
    }));

    return NextResponse.json({ activities: mapped });
  } catch (error) {
    console.error('[GET /api/activity]', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}
