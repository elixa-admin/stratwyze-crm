import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const activities = await prisma.activity.findMany({
      where: { dealId: params.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ activities });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { type, content, metadata } = await req.json();
    if (!content) return NextResponse.json({ error: 'content required' }, { status: 400 });

    const activity = await prisma.activity.create({
      data: { dealId: params.id, type: type || 'note', content, metadata: metadata ?? null },
    });
    return NextResponse.json({ activity }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
