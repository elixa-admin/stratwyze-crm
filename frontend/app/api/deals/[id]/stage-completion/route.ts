import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | undefined;

function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

interface StageCompletionRequest {
  stepId: string;
  metadata?: Record<string, any>;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { stepId, metadata } = (await req.json()) as StageCompletionRequest;
    const dealId = params.id;
    const db = getPrisma();

    if (!stepId) {
      return NextResponse.json({ error: 'stepId required' }, { status: 400 });
    }

    // Get or create deal stage workflow
    let workflow = await db.dealStageWorkflow.findUnique({
      where: { dealId },
    });

    if (!workflow) {
      const deal = await db.deal.findUnique({ where: { id: dealId } });
      if (!deal) {
        return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
      }

      workflow = await db.dealStageWorkflow.create({
        data: {
          dealId,
          stage: deal.stage,
        },
      });
    }

    // Add step to completed steps
    const updatedSteps = Array.from(new Set([...workflow.stepsCompleted, stepId]));

    // Update workflow
    const updated = await db.dealStageWorkflow.update({
      where: { dealId },
      data: {
        stepsCompleted: updatedSteps,
      },
    });

    // Log activity
    await db.activity.create({
      data: {
        dealId,
        type: 'stage-step-completed',
        content: `Completed: ${stepId}`,
        metadata: {
          stepId,
          ...metadata,
        },
      },
    });

    return NextResponse.json({ success: true, workflow: updated });
  } catch (err: any) {
    console.error('Stage completion error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to log completion' }, { status: 500 });
  }
}
