import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: params.id },
      include: { account: true, activities: { orderBy: { createdAt: 'desc' } } },
    });
    if (!deal) return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    return NextResponse.json({ deal });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { title, value, stage, notes, noteContent } = body;

    const existing = await prisma.deal.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Deal not found' }, { status: 404 });

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (value !== undefined) updates.value = parseFloat(value);
    if (stage !== undefined) updates.stage = stage;
    if (notes !== undefined) updates.notes = notes;

    await prisma.deal.update({
      where: { id: params.id },
      data: updates,
    });

    // Auto-log stage change activity
    if (stage && stage !== existing.stage) {
      await prisma.activity.create({
        data: {
          dealId: params.id,
          type: 'stage_change',
          content: `Stage moved from ${existing.stage} to ${stage}`,
          metadata: { fromStage: existing.stage, toStage: stage },
        },
      });
    }

    // Log an explicit note if provided
    if (noteContent?.trim()) {
      await prisma.activity.create({
        data: { dealId: params.id, type: 'note', content: noteContent.trim() },
      });
    }

    // Re-fetch with fresh activities after any new ones were created
    const fresh = await prisma.deal.findUnique({
      where: { id: params.id },
      include: { account: true, activities: { orderBy: { createdAt: 'desc' } } },
    });

    return NextResponse.json({ deal: fresh });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
