import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = params.id;

    // Fetch opportunity profile
    let profile = await prisma.opportunityProfile.findUnique({
      where: { dealId },
    });

    // If not found, create stub
    if (!profile) {
      const deal = await prisma.deal.findUnique({ where: { id: dealId } });
      if (!deal) {
        return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
      }

      profile = await prisma.opportunityProfile.create({
        data: { dealId },
      });
    }

    return NextResponse.json({ profile });
  } catch (err: any) {
    console.error('Opportunity profile error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = params.id;
    const updates = await req.json();

    // Get or create profile
    let profile = await prisma.opportunityProfile.findUnique({
      where: { dealId },
    });

    if (!profile) {
      const deal = await prisma.deal.findUnique({ where: { id: dealId } });
      if (!deal) {
        return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
      }

      profile = await prisma.opportunityProfile.create({
        data: { dealId },
      });
    }

    // Update profile
    const updated = await prisma.opportunityProfile.update({
      where: { dealId },
      data: updates,
    });

    return NextResponse.json({ profile: updated });
  } catch (err: any) {
    console.error('Profile update error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
