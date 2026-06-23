import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/deals
 * Get all deals with intelligence scores for Kanban board
 */
export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      where: { archived: false },
      include: {
        account: {
          select: { id: true, name: true },
        },
        primaryContact: {
          select: {
            id: true,
            name: true,
            intelligenceProfile: {
              select: {
                decisionMakerScore: true,
                buyingRelevance: true,
              },
            },
          },
        },
        stageWorkflow: {
          select: {
            stageHistory: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      deals,
      count: deals.length,
    });
  } catch (error) {
    console.error('[GET /api/deals]', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/deals
 * Create a new deal
 */
export async function POST(request: NextRequest) {
  try {
    const {
      title,
      value,
      accountId,
      primaryContactId,
      stage = 'Prospecting',
      currency = 'ZAR',
    } = await request.json();

    if (!title || !value) {
      return NextResponse.json(
        { error: 'Title and value are required' },
        { status: 400 }
      );
    }

    const deal = await prisma.deal.create({
      data: {
        title,
        value,
        stage,
        currency,
        accountId: accountId || undefined,
        primaryContactId: primaryContactId || undefined,
      },
      include: {
        account: true,
        primaryContact: {
          include: { intelligenceProfile: true },
        },
        stageWorkflow: true,
      },
    });

    // Create stage workflow
    await prisma.dealStageWorkflow.create({
      data: {
        dealId: deal.id,
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

    // Log activity
    await prisma.activity.create({
      data: {
        dealId: deal.id,
        type: 'deal_created',
        content: `Deal "${title}" created`,
        metadata: {
          value,
          stage,
          timestamp: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json(
      {
        deal,
        message: 'Deal created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/deals]', error);
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}
