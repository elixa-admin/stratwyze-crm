import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      select: {
        id: true,
        name: true,
        title: true,
        email: true,
        account: { select: { name: true } },
        intelligenceProfile: {
          select: {
            decisionMakerScore: true,
            buyingRelevance: true,
            researchCompletedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const mapped = contacts.map((c) => ({
      id: c.id,
      name: c.name,
      title: c.title,
      email: c.email,
      company: c.account?.name,
      intelligenceProfile: c.intelligenceProfile,
    }));

    return NextResponse.json({ contacts: mapped, count: mapped.length });
  } catch (error) {
    console.error('[GET /api/contacts/grid]', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
