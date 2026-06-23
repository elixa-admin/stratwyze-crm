import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { fetchMarketData, isCacheStale } from '@/lib/market-data';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const account = await prisma.account.findUnique({ where: { id: params.id } });
    if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

    if (!account.isListed || !account.jseTickerSymbol) {
      return NextResponse.json({ marketData: null, reason: 'not-listed' });
    }

    const cached = account.marketData as any;
    if (cached && !isCacheStale(cached.fetchedAt)) {
      return NextResponse.json({ marketData: cached, fromCache: true });
    }

    const fresh = await fetchMarketData(account.jseTickerSymbol, account.name);

    await prisma.account.update({
      where: { id: params.id },
      data: { marketData: fresh as any, lastMarketDataAt: new Date() },
    });

    return NextResponse.json({ marketData: fresh, fromCache: false });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { ticker, forceRefresh } = await req.json();

    const account = await prisma.account.findUnique({ where: { id: params.id } });
    if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

    const symbol = (ticker || account.jseTickerSymbol || '').toUpperCase().trim();
    if (!symbol) return NextResponse.json({ error: 'ticker required' }, { status: 400 });

    const cached = account.marketData as any;
    if (!forceRefresh && cached && cached.symbol === symbol && !isCacheStale(cached.fetchedAt)) {
      return NextResponse.json({ marketData: cached, fromCache: true });
    }

    const fresh = await fetchMarketData(symbol, account.name);

    await prisma.account.update({
      where: { id: params.id },
      data: {
        jseTickerSymbol: symbol,
        isListed: true,
        marketData: fresh as any,
        lastMarketDataAt: new Date(),
      },
    });

    return NextResponse.json({ marketData: fresh, fromCache: false });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
