import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stage = searchParams.get('stage');

    const deals = await prisma.deal.findMany({
      where: {
        archived: false,
        ...(stage && { stage }),
      },
      include: { account: true },
      orderBy: { createdAt: 'desc' },
    });

    const stats = {
      totalDeals: deals.length,
      totalPipeline: deals.reduce((sum: number, d: { value: number }) => sum + d.value, 0),
      closedWon: deals.filter((d: { stage: string }) => d.stage === 'Closed Won').reduce((sum: number, d: { value: number }) => sum + d.value, 0),
      byStage: {
        Prospecting:   deals.filter(d => d.stage === 'Prospecting').length,
        Qualification: deals.filter(d => d.stage === 'Qualification').length,
        Proposal:      deals.filter(d => d.stage === 'Proposal').length,
        Negotiation:   deals.filter(d => d.stage === 'Negotiation').length,
        'Closed Won':  deals.filter(d => d.stage === 'Closed Won').length,
      },
    };

    return NextResponse.json({ deals, stats });
  } catch (err: any) {
    console.error('GET /api/deals error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to fetch deals' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, value, accountId, stageName, competitorId, saPartnerId, enrichmentData, competitiveBrief } = body;

    if (!title || !value) {
      return NextResponse.json({ error: 'Title and value are required' }, { status: 400 });
    }

    const deal = await prisma.deal.create({
      data: {
        title,
        value: parseFloat(value),
        currency: 'ZAR',
        stage: stageName || 'Prospecting',
        accountId: accountId || null,
        incumbentPlatform: competitorId || null,
        incumbentProvider: saPartnerId || null,
        enrichmentData: enrichmentData ?? null,
        competitiveBrief: competitiveBrief ?? null,
      },
      include: { account: true },
    });

    return NextResponse.json(
      { deal, message: `Deal "${title}" created successfully!` },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('POST /api/deals error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to create deal' }, { status: 500 });
  }
}
