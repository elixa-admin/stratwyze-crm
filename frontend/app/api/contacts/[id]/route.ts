import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, email, phone, title, role } = await req.json();
    const contact = await prisma.contact.update({
      where: { id: params.id },
      data: { name, email: email || null, phone: phone || null, title: title || null, role: role || null },
    });
    return NextResponse.json({ contact });
  } catch (err: any) {
    console.error('PATCH /api/contacts/[id] error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to update contact' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.contact.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Contact deleted' });
  } catch (err: any) {
    console.error('DELETE /api/contacts/[id] error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete contact' }, { status: 500 });
  }
}
