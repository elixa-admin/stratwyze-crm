import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.dealTemplate.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Template deleted' });
  } catch (err: any) {
    console.error('DELETE /api/templates/[id] error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete template' }, { status: 500 });
  }
}
