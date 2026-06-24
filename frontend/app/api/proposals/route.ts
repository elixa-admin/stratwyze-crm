import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const proposals = await prisma.proposal.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        deal: {
          select: { id: true, title: true, stage: true },
        },
      },
    });

    return NextResponse.json({
      proposals: proposals.map(p => ({
        id: p.id,
        referenceNumber: p.referenceNumber,
        clientName: p.clientName,
        clientContact: p.clientContact,
        clientEmail: p.clientEmail,
        agentCount: p.agentCount,
        deploymentPref: p.deploymentPref,
        status: p.status,
        createdAt: p.createdAt.toISOString(),
        dealId: p.dealId,
        dealTitle: p.deal?.title ?? null,
        dealStage: p.deal?.stage ?? null,
      })),
    });
  } catch (err: any) {
    console.error('[GET /api/proposals]', err);
    return NextResponse.json({ error: 'Failed to load proposals' }, { status: 500 });
  }
}
