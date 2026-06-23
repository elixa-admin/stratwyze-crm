import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * PATCH /api/deals/[id]/stage
 * Update a deal's stage and track stage history
 */
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const { stage } = await request.json();

    if (!stage) {
      return NextResponse.json(
        { error: 'Stage is required' },
        { status: 400 }
      );
    }

    // Get current deal
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: { stageWorkflow: true },
    });

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    // Update deal stage
    const updatedDeal = await prisma.deal.update({
      where: { id },
      data: { stage },
      include: {
        account: true,
        primaryContact: {
          include: { intelligenceProfile: true },
        },
        stageWorkflow: true,
      },
    });

    // Update or create stage workflow
    let stageWorkflow = deal.stageWorkflow;
    if (stageWorkflow) {
      // Update existing workflow
      const stageHistory = stageWorkflow.stageHistory as any[] | null || [];
      const lastStage = stageHistory[stageHistory.length - 1];

      // Mark previous stage as exited
      if (lastStage && !lastStage.exitedAt) {
        lastStage.exitedAt = new Date().toISOString();
        lastStage.durationDays = Math.floor(
          (new Date().getTime() - new Date(lastStage.enteredAt).getTime()) /
            (1000 * 60 * 60 * 24)
        );
      }

      // Add new stage
      stageHistory.push({
        stage,
        enteredAt: new Date().toISOString(),
        exitedAt: null,
        durationDays: 0,
      });

      stageWorkflow = await prisma.dealStageWorkflow.update({
        where: { dealId: id },
        data: {
          stage,
          stageHistory,
        },
      });
    } else {
      // Create new workflow
      stageWorkflow = await prisma.dealStageWorkflow.create({
        data: {
          dealId: id,
          stage,
          stageHistory: [
            {
              stage,
              enteredAt: new Date().toISOString(),
              exitedAt: null,
              durationDays: 0,
            },
          ],
        },
      });
    }

    // Log activity
    await prisma.activity.create({
      data: {
        dealId: id,
        type: 'stage_change',
        content: `Deal moved to ${stage} stage`,
        metadata: {
          oldStage: deal.stage,
          newStage: stage,
          timestamp: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({
      deal: updatedDeal,
      stageWorkflow,
      message: `Deal moved to ${stage}`,
    });
  } catch (error) {
    console.error('[PATCH /api/deals/:id/stage]', error);
    return NextResponse.json(
      { error: 'Failed to update deal stage' },
      { status: 500 }
    );
  }
}
