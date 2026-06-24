import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { completed, content, dueDate } = body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(typeof completed === 'boolean' && {
          completed,
          completedAt: completed ? new Date() : null,
        }),
        ...(content !== undefined && { content }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
    });

    return NextResponse.json({ task });
  } catch (err: any) {
    console.error('[PATCH /api/deals/tasks/[id]]', err);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[DELETE /api/deals/tasks/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
