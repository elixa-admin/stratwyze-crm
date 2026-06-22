import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/server/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stage = searchParams.get('stage');

    if (stage) {
      const validStages = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'];
      if (!validStages.includes(stage)) {
        return NextResponse.json(
          { error: 'Invalid stage' },
          { status: 400 }
        );
      }
      const deals = store.listDealsByStage(stage as any);
      return NextResponse.json({ deals });
    }

    const deals = store.listDeals();
    const stats = store.getDealStats();

    return NextResponse.json({ deals, stats });
  } catch (err: any) {
    console.error('GET /api/deals error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, value, accountId, stageName, competitorId, saPartnerId, enrichmentData } = body;

    if (!title || !value) {
      return NextResponse.json(
        { error: 'Title and value are required' },
        { status: 400 }
      );
    }

    const deal = store.createDeal({
      title,
      value: parseFloat(value),
      currency: 'ZAR',
      stage: stageName || 'Prospecting',
      accountId,
      incumbentPlatform: competitorId,
      incumbentProvider: saPartnerId,
      enrichmentData,
    });

    return NextResponse.json(
      { deal, message: `Deal "${title}" created successfully!` },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('POST /api/deals error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to create deal' },
      { status: 500 }
    );
  }
}
