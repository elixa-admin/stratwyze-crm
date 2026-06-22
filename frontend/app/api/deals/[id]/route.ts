import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/server/store';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deal = store.getDeal(params.id);
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }
    return NextResponse.json({ deal });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch deal' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const deal = store.updateDeal(params.id, body);
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }
    return NextResponse.json({ deal });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update deal' }, { status: 500 });
  }
}
