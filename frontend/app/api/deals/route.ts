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
    const {
      title, value, accountId, stageName, competitorId, saPartnerId,
      enrichmentData, competitiveBrief, autoCreateAccount,
    } = body;

    if (!title || !value) {
      return NextResponse.json({ error: 'Title and value are required' }, { status: 400 });
    }

    // Auto-create account from research data if no accountId provided
    let resolvedAccountId = accountId || null;
    if (!resolvedAccountId && autoCreateAccount?.name) {
      const snap = enrichmentData?.companySnapshot;
      const account = await (prisma.account.create as any)({
        data: {
          name: autoCreateAccount.name,
          legalEntity: snap?.legalEntity || autoCreateAccount.legalEntity || null,
          website: snap?.website || autoCreateAccount.website || null,
          phone: snap?.phone || autoCreateAccount.phone || null,
          industry: snap?.industry || autoCreateAccount.industry || null,
          employees: snap?.employeesNumeric ? Number(snap.employeesNumeric) : (autoCreateAccount.employees ? parseInt(autoCreateAccount.employees) : null),
          headquarters: snap?.headquarters || autoCreateAccount.headquarters || null,
          description: snap?.description || null,
          enrichmentData: enrichmentData ?? null,
          jseTickerSymbol: autoCreateAccount.jseTickerSymbol || null,
          isListed: !!autoCreateAccount.jseTickerSymbol,
        },
      });
      resolvedAccountId = account.id;

      // Auto-create key contacts from research if found
      const keyContacts: any[] = enrichmentData?.keyContacts ?? [];
      if (keyContacts.length > 0) {
        await prisma.contact.createMany({
          data: keyContacts.slice(0, 5).map((c: any) => ({
            accountId: account.id,
            name: c.name || 'Unknown Contact',
            title: c.title || null,
            role: c.relevance || null,
            department: c.department || null,
            linkedin: c.linkedin || null,
          })),
          skipDuplicates: true,
        });
      }
    }

    const deal = await prisma.deal.create({
      data: {
        title,
        value: parseFloat(value),
        currency: 'ZAR',
        stage: stageName || 'Prospecting',
        accountId: resolvedAccountId,
        incumbentPlatform: competitorId || null,
        incumbentProvider: saPartnerId || null,
        enrichmentData: enrichmentData ?? null,
        competitiveBrief: competitiveBrief ?? null,
      },
      include: { account: { include: { contacts: true } } },
    });

    return NextResponse.json(
      { deal, message: `Deal "${title}" created successfully!`, accountCreated: !accountId && !!resolvedAccountId },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('POST /api/deals error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to create deal' }, { status: 500 });
  }
}
