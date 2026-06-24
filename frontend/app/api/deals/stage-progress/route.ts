import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

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
      activities: deal.activities.map(a => ({
        id: a.id,
        type: a.type,
        timestamp: a.createdAt.toISOString(),
        summary: a.content,
      })),
    });
  } catch (error) {
    console.error('[GET /api/deals/stage-progress]', error);
    return NextResponse.json({ error: 'Failed to fetch stage progress' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { dealId, actionId, completed, activityType, content, metadata } = await request.json();

    if (!dealId || !actionId) {
      return NextResponse.json({ error: 'dealId and actionId required' }, { status: 400 });
    }

    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: { stageWorkflow: true },
    });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    // Create activity record
    if (content) {
      await prisma.activity.create({
        data: {
          dealId,
          type: activityType ?? 'note',
          content,
          metadata: metadata ?? null,
        },
      });
    }

    // Update stepsCompleted on stageWorkflow
    const currentSteps: string[] = deal.stageWorkflow?.stepsCompleted ?? [];
    const updatedSteps = completed
      ? [...new Set([...currentSteps, actionId])]
      : currentSteps.filter((s: string) => s !== actionId);

    let stageWorkflow;
    if (deal.stageWorkflow) {
      stageWorkflow = await prisma.dealStageWorkflow.update({
        where: { dealId },
        data: { stepsCompleted: updatedSteps },
      });
    } else {
      stageWorkflow = await prisma.dealStageWorkflow.create({
        data: {
          dealId,
          stage: deal.stage,
          stepsCompleted: updatedSteps,
        },
      });
    }

    return NextResponse.json({
      success: true,
      stepsCompleted: stageWorkflow.stepsCompleted,
    });
  } catch (error) {
    console.error('[PATCH /api/deals/stage-progress]', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
