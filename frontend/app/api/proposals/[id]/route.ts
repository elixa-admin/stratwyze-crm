import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        deal: {
          include: {
            account: true,
            primaryContact: true,
          },
        },
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    return NextResponse.json(proposal);
  } catch (error) {
    console.error('[GET /api/proposals/[id]]', error);
    return NextResponse.json({ error: 'Failed to fetch proposal' }, { status: 500 });
  }
}
