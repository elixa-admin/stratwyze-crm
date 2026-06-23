import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkStageLocking } from '@/lib/deal-gating';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const dealId = params.id;
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: { stageWorkflow: true },
    });
    if (!deal) return NextResponse.json({ error: 'Deal not found' }, { status: 404 });

    const gates = checkStageLocking(deal.stage, deal.stageWorkflow?.stepsCompleted ?? [], {
      fitScore: deal.stageWorkflow?.fitScore,
    });

    return NextResponse.json({ dealId, currentStage: deal.stage, gates, stepsCompleted: deal.stageWorkflow?.stepsCompleted ?? [] });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
