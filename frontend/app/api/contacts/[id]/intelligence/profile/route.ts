import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/contacts/[id]/intelligence/profile
 * Fetch complete contact intelligence profile
 */

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contactId = params.id;

    // Get contact with account
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: { account: true },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Get or create intelligence profile
    let profile = await prisma.contactIntelligenceProfile.findUnique({
      where: { contactId },
      include: {
        evidence: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        {
          contact: {
            name: contact.name,
            title: contact.title,
            company: contact.account?.name,
            email: contact.email,
            emailConfidence: 0,
          },
          profile: null,
          briefing: null,
          evidence: { facts: [], inferences: [], sources: [] },
          status: 'not_started',
          message: 'Intelligence profile not yet generated. Click "Research Intelligence" to begin.',
        },
        { status: 200 }
      );
    }

    // Build response
    return NextResponse.json({
      contact: {
        name: contact.name,
        title: contact.title,
        company: contact.account?.name,
        email: profile.primaryEmail || contact.email,
        emailConfidence: profile.emailConfidence || 0,
        linkedin: contact.linkedin,
      },
      profile: {
        researchCompletedAt: profile.researchCompletedAt,
        researchStatus: profile.researchStatus,
        decisionMakerScore: profile.decisionMakerScore,
        influenceScore: profile.influenceScore,
        technicalInfluence: profile.technicalInfluence,
        commercialInfluence: profile.commercialInfluence,
        haloItsmRelevance: profile.haloItsmRelevance,
        buyingRelevance: profile.buyingRelevance,
        confidenceScore: profile.confidenceScore,
      },
      careerSummary: profile.careerSummary,
      briefing: profile.briefing,
      evidence: profile.evidenceIndex || {
        facts: [],
        inferences: [],
        sources: [],
      },
      lastRefreshAt: profile.researchCompletedAt || profile.researchStartedAt,
      nextRefreshAt: profile.nextRefreshAt,
      researchProgress: {
        step1_domain: !!profile.companyDomain,
        step2_company_web: !!profile.companyResearchData,
        step3_individual: !!profile.webResearchData,
        step4_email: !!profile.emailCandidates,
        step5_career: !!profile.careerSummary,
        step6_scores: !!profile.decisionMakerScore,
        step7_briefing: !!profile.briefing,
      },
    });
  } catch (err: any) {
    console.error('Profile fetch error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
