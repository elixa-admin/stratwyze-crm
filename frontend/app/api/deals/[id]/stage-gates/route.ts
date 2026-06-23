import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkStageLocking } from '@/lib/deal-gating';

const prisma = new PrismaClient();

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = params.id;

    // Fetch deal and workflow
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        stageWorkflow: true,
      },
    });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    // Check gates for current stage
    const gates = checkStageLocking(
      deal.stage,
      deal.stageWorkflow?.stepsCompleted || [],
      {
        fitScore: deal.stageWorkflow?.fitScore,
      }
    );

    return NextResponse.json({
      dealId,
      currentStage: deal.stage,
      gates,
      stepsCompleted: deal.stageWorkflow?.stepsCompleted || [],
    });
  } catch (err: any) {
    console.error('Stage gates error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to check gates' }, { status: 500 });
  }
}
