import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const dealId = request.nextUrl.searchParams.get('dealId');
    if (!dealId) return NextResponse.json({ error: 'dealId required' }, { status: 400 });

    const tasks = await prisma.task.findMany({
      where: { dealId },
      orderBy: [{ completed: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ tasks });
  } catch (err: any) {
    console.error('[GET /api/deals/tasks]', err);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { dealId, content, dueDate, assignedTo } = await request.json();
    if (!dealId || !content?.trim()) {
      return NextResponse.json({ error: 'dealId and content required' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        dealId,
        content: content.trim(),
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedTo: assignedTo ?? null,
        source: 'manual',
      },
    });

    return NextResponse.json({ task });
  } catch (err: any) {
    console.error('[POST /api/deals/tasks]', err);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
