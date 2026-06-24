import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

const STAGE_ORDER = [
  'Prospecting',
  'Qualification',
  'Proposal',
  'Negotiation',
  'Won',
];

/**
 * POST /api/deals/stage-advance?dealId=[id]
 * Advance deal to next stage
 */
export async function POST(request: NextRequest) {
  try {
    const dealId = request.nextUrl.searchParams.get('dealId');
    if (!dealId) {
      return NextResponse.json({ error: 'dealId required' }, { status: 400 });
    }

    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: { stageWorkflow: true },
    });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    // Find next stage
    const currentIndex = STAGE_ORDER.indexOf(deal.stage);
    if (currentIndex === -1 || currentIndex === STAGE_ORDER.length - 1) {
      return NextResponse.json(
        { error: 'Cannot advance from this stage' },
        { status: 400 }
      );
    }

    const nextStage = STAGE_ORDER[currentIndex + 1];

    // Update deal stage
    await prisma.deal.update({
      where: { id: dealId },
      data: { stage: nextStage },
    });

    // Update stage workflow
    if (deal.stageWorkflow) {
      const stageHistory = (deal.stageWorkflow.stageHistory as any[]) || [];
      const lastStage = stageHistory[stageHistory.length - 1];

      if (lastStage && !lastStage.exitedAt) {
        lastStage.exitedAt = new Date().toISOString();
        lastStage.durationDays = Math.floor(
          (new Date().getTime() - new Date(lastStage.enteredAt).getTime()) /
            (1000 * 60 * 60 * 24)
        );
      }

      stageHistory.push({
        stage: nextStage,
        enteredAt: new Date().toISOString(),
        exitedAt: null,
        durationDays: 0,
      });

      await prisma.dealStageWorkflow.update({
        where: { dealId },
        data: {
          stage: nextStage,
          stageHistory,
        },
      });
    }

    // Log activity
    await prisma.activity.create({
      data: {
        dealId,
        type: 'stage_change',
        content: `Deal advanced from ${deal.stage} to ${nextStage}`,
        metadata: {
          oldStage: deal.stage,
          newStage: nextStage,
          timestamp: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      dealId,
      oldStage: deal.stage,
      newStage: nextStage,
      message: `Deal advanced to ${nextStage}`,
    });
  } catch (error) {
    console.error('[POST /api/deals/stage-advance]', error);
    return NextResponse.json({ error: 'Failed to advance stage' }, { status: 500 });
  }
}
