import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = params.id;
    let profile = await prisma.opportunityProfile.findUnique({ where: { dealId } });
    if (!profile) {
      const deal = await prisma.deal.findUnique({ where: { id: dealId } });
      if (!deal) return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
      profile = await prisma.opportunityProfile.create({ data: { dealId } });
    }
    return NextResponse.json({ profile });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const dealId = params.id;
    const updates = await req.json();
    let profile = await prisma.opportunityProfile.findUnique({ where: { dealId } });
    if (!profile) {
      const deal = await prisma.deal.findUnique({ where: { id: dealId } });
      if (!deal) return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
      profile = await prisma.opportunityProfile.create({ data: { dealId } });
    }
    const updated = await prisma.opportunityProfile.update({ where: { dealId }, data: updates });
    return NextResponse.json({ profile: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
