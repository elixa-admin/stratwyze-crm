import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      select: {
        id: true,
        stage: true,
        value: true,
        createdAt: true,
        source: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const OPEN_STAGES = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation'];
    const ALL_STAGES = [...OPEN_STAGES, 'Closed Won', 'Closed Lost'];

    // Pipeline by stage
    const pipelineByStage = ALL_STAGES.map(stage => {
      const stageDeals = deals.filter(d => d.stage === stage);
      return {
        stage,
        deals: stageDeals.length,
        value: stageDeals.reduce((sum, d) => sum + (d.value ?? 0), 0),
      };
    }).filter(s => s.deals > 0 || OPEN_STAGES.includes(s.stage));

    // Summary stats
    const openDeals = deals.filter(d => OPEN_STAGES.includes(d.stage));
    const wonDeals = deals.filter(d => d.stage === 'Closed Won');
    const closedDeals = deals.filter(d => d.stage === 'Closed Won' || d.stage === 'Closed Lost');

    const totalPipeline = openDeals.reduce((sum, d) => sum + (d.value ?? 0), 0);
    const wonValue = wonDeals.reduce((sum, d) => sum + (d.value ?? 0), 0);
    const avgDealSize = openDeals.length > 0
      ? Math.round(totalPipeline / openDeals.length)
      : 0;
    const winRate = closedDeals.length > 0
      ? Math.round((wonDeals.length / closedDeals.length) * 100)
      : 0;

    // Deal velocity funnel
    const qualified = deals.filter(d =>
      ['Qualification', 'Proposal', 'Negotiation', 'Closed Won'].includes(d.stage)
    ).length;
    const proposals = deals.filter(d =>
      ['Proposal', 'Negotiation', 'Closed Won'].includes(d.stage)
    ).length;

    // Revenue by source
    const sourceMap: Record<string, number> = {};
    deals.forEach(d => {
      if (d.source) {
        sourceMap[d.source] = (sourceMap[d.source] ?? 0) + 1;
      }
    });
    const totalWithSource = Object.values(sourceMap).reduce((a, b) => a + b, 0);
    const sourceData = Object.entries(sourceMap)
      .map(([name, count]) => ({
        name,
        count,
        pct: totalWithSource > 0 ? Math.round((count / totalWithSource) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Revenue trend — group by month (last 6 months of deal creation)
    const now = new Date();
    const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = d.toLocaleString('default', { month: 'short' });
      const monthDeals = deals.filter(deal => {
        const cd = new Date(deal.createdAt);
        return cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth();
      });
      return {
        month: label,
        deals: monthDeals.length,
        value: monthDeals.reduce((sum, d) => sum + (d.value ?? 0), 0),
      };
    });

    return NextResponse.json({
      summary: { totalPipeline, wonValue, avgDealSize, winRate },
      pipelineByStage,
      dealVelocity: {
        leads: deals.length,
        qualified,
        proposals,
        closedWon: wonDeals.length,
      },
      sourceData,
      monthlyTrend,
    });
  } catch (err: any) {
    console.error('[GET /api/analytics]', err);
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 });
  }
}
