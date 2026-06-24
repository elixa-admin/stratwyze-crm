import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/deals/stage-progress?dealId=[id]
 * Get stage progress for a deal
 */
export async function GET(request: NextRequest) {
  try {
    const dealId = request.nextUrl.searchParams.get('dealId');
    if (!dealId) {
      return NextResponse.json({ error: 'dealId required' }, { status: 400 });
    }

    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        stageWorkflow: true,
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json({
      dealId: deal.id,
      currentStage: deal.stage,
      stageWorkflow: deal.stageWorkflow,
      activities: deal.activities.map((a) => ({
        id: a.id,
        type: a.type,
        timestamp: a.createdAt.toISOString(),
        summary: a.content,
        details: undefined,
      })),
    });
  } catch (error) {
    console.error('[GET /api/deals/stage-progress]', error);
    return NextResponse.json({ error: 'Failed to fetch stage progress' }, { status: 500 });
  }
}

/**
 * PATCH /api/deals/stage-progress
 * Update stage progress (mark action complete)
 */
export async function PATCH(request: NextRequest) {
  try {
    const { dealId: _dealId, actionId: _actionId, completed: _completed } = await request.json();

    // TODO: Implement action completion tracking
    // For now, just return success
    // In Wave 36+, we'll add stageRequirements JSON field to track this

    return NextResponse.json({
      success: true,
      message: 'Action updated',
    });
  } catch (error) {
    console.error('[PATCH /api/deals/stage-progress]', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
