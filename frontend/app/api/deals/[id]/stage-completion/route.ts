import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { stepId, metadata } = await req.json();
    const dealId = params.id;
    if (!stepId) return NextResponse.json({ error: 'stepId required' }, { status: 400 });

    let workflow = await prisma.dealStageWorkflow.findUnique({ where: { dealId } });
    if (!workflow) {
      const deal = await prisma.deal.findUnique({ where: { id: dealId } });
      if (!deal) return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
      workflow = await prisma.dealStageWorkflow.create({ data: { dealId, stage: deal.stage } });
    }

    const updatedSteps = Array.from(new Set([...workflow.stepsCompleted, stepId]));
    const updated = await prisma.dealStageWorkflow.update({
      where: { dealId },
      data: { stepsCompleted: updatedSteps },
    });

    await prisma.activity.create({
      data: { dealId, type: 'stage-step-completed', content: `Completed: ${stepId}`, metadata: { stepId, ...metadata } },
    });

    return NextResponse.json({ success: true, workflow: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
