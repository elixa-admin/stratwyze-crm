import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_req: NextRequest) {
  try {
    const templates = await prisma.dealTemplate.findMany({
      include: { account: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ templates });
  } catch (err: any) {
    console.error('GET /api/templates error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, accountId, incumbentPlatform, incumbentProvider } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Template name is required' }, { status: 400 });
    }

    const template = await prisma.dealTemplate.create({
      data: {
        name,
        accountId: accountId || null,
        incumbentPlatform: incumbentPlatform || null,
        incumbentProvider: incumbentProvider || null,
      },
      include: { account: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/templates error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to create template' }, { status: 500 });
  }
}
