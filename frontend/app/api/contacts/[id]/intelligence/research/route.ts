import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * POST /api/contacts/[id]/intelligence/research
 * Trigger comprehensive contact intelligence research (Steps 1-4)
 *
 * Steps:
 * 1. Resolve company domain
 * 2. Research company web (requires Firecrawl)
 * 3. Research individual web
 * 4. Find & validate email
 */

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await req.json();
    const contactId = params.id;

    // Get contact + account
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: { account: true },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Check if research already in progress
    let profile = await prisma.contactIntelligenceProfile.findUnique({
      where: { contactId },
    });

    if (profile?.researchStatus === 'in_progress') {
      return NextResponse.json(
        { error: 'Research already in progress', profileId: profile.id },
        { status: 409 }
      );
    }

    // Create or update profile
    if (!profile) {
      profile = await prisma.contactIntelligenceProfile.create({
        data: { contactId },
      });
    }

    // Start research (mark as in_progress)
    await prisma.contactIntelligenceProfile.update({
      where: { id: profile.id },
      data: {
        researchStatus: 'in_progress',
        researchStartedAt: new Date(),
        researchError: null,
      },
    });

    // Return progress indicator (don't wait for completion)
    const progressResponse = {
      profileId: profile.id,
      status: 'in_progress',
      estimatedDuration: 45000,
      steps: [
        { step: 1, status: 'in_progress', name: 'Resolve Company Domain' },
        { step: 2, status: 'pending', name: 'Research Company Web' },
        { step: 3, status: 'pending', name: 'Research Individual' },
        { step: 4, status: 'pending', name: 'Find & Validate Email' },
        { step: 5, status: 'pending', name: 'Generate Career Summary' },
        { step: 6, status: 'pending', name: 'Calculate Scores' },
        { step: 7, status: 'pending', name: 'Generate Briefing' },
      ],
    };

    // Run research asynchronously
    runResearchAsync(profile.id, contact, contactId);

    return NextResponse.json(progressResponse);
  } catch (err: any) {
    console.error('Research endpoint error:', err);
    return NextResponse.json(
      { error: err?.message || 'Research failed' },
      { status: 500 }
    );
  }
}

/**
 * Background research execution (Steps 1-4)
 * This runs independently of the HTTP response
 */
async function runResearchAsync(profileId: string, contact: any, contactId: string) {
  try {
    // STEP 1: Resolve company domain
    const domain = await step1ResolveDomain(profileId, contact);
    if (!domain) throw new Error('Failed to resolve company domain');

    // STEP 2: Research company web (requires Firecrawl)
    await step2ResearchCompanyWeb(profileId, domain);

    // STEP 3: Research individual
    await step3ResearchIndividual(profileId, contact, domain);

    // STEP 4: Find email
    await step4FindEmail(profileId, contact, domain);

    // Mark Steps 1-4 complete
    await prisma.contactIntelligenceProfile.update({
      where: { id: profileId },
      data: {
        researchStatus: 'step4_complete',
      },
    });

    console.log(`[Contact Intelligence] Steps 1-4 complete for contact ${contactId}`);
  } catch (err: any) {
    console.error(`[Contact Intelligence] Error for contact ${contactId}:`, err);
    await prisma.contactIntelligenceProfile.update({
      where: { id: profileId },
      data: {
        researchStatus: 'failed',
        researchError: err?.message,
      },
    });
  }
}

/**
 * STEP 1: Resolve company domain from website or search
 */
async function step1ResolveDomain(profileId: string, contact: any) {
  try {
    const companyName = contact.account?.name;
    const website = contact.account?.website;

    let domain: string | null = null;
    let source = '';
    let confidence = 0;

    // If website provided, extract domain
    if (website) {
      try {
        const url = new URL(website);
        domain = url.hostname;
        source = website;
        confidence = 100;
      } catch (e) {
        // Invalid URL, fall back to search
      }
    }

    // If no domain yet, search for it
    if (!domain && companyName) {
      try {
        const searchQuery = `${companyName} official website`;
        // TODO: Use SerpAPI to search
        // For now, store as pending
        console.log(`[Step 1] Need to search for domain: ${searchQuery}`);
      } catch (e) {
        console.error('Domain search failed:', e);
      }
    }

    if (domain) {
      // Store domain evidence
      await storeEvidence(profileId, {
        evidenceType: 'fact',
        category: 'company',
        factType: 'domain',
        factValue: domain,
        sourceUrl: source,
        sourceTitle: 'Company Website',
        sourcePlatform: 'company-website',
        sourceRelevance: 'high',
        researchStep: 1,
        confidenceLevel: confidence >= 90 ? 'high' : 'medium',
      });

      // Update profile with domain
      await prisma.contactIntelligenceProfile.update({
        where: { id: profileId },
        data: {
          companyDomain: domain,
          domainSource: source,
          domainConfidence: confidence,
        },
      });

      return domain;
    }

    return null;
  } catch (err) {
    console.error('Step 1 error:', err);
    throw err;
  }
}

/**
 * STEP 2: Research company web with Firecrawl
 * BLOCKED: Needs Firecrawl API key
 */
async function step2ResearchCompanyWeb(profileId: string, domain: string) {
  try {
    const pagesToCrawl = [
      `https://${domain}`,
      `https://${domain}/about`,
      `https://${domain}/team`,
      `https://${domain}/leadership`,
      `https://${domain}/executives`,
      `https://${domain}/news`,
      `https://${domain}/press`,
      `https://${domain}/blog`,
      `https://${domain}/careers`,
    ];

    const sources: any[] = [];

    for (const url of pagesToCrawl) {
      try {
        // TODO: Use Firecrawl to scrape
        // For now, store placeholder
        console.log(`[Step 2] Would crawl: ${url}`);

        // Store source evidence placeholder
        await storeEvidence(profileId, {
          evidenceType: 'source',
          category: 'company',
          sourceUrl: url,
          sourceTitle: url.split('/').pop() || 'Company Page',
          sourcePlatform: 'company-website',
          sourceRelevance: 'pending',
          researchStep: 2,
        });
      } catch (e) {
        console.error(`Failed to crawl ${url}:`, e);
      }
    }

    // Update profile with research data
    await prisma.contactIntelligenceProfile.update({
      where: { id: profileId },
      data: {
        companyResearchData: { sources },
      },
    });
  } catch (err) {
    console.error('Step 2 error:', err);
    throw err;
  }
}

/**
 * STEP 3: Research individual using web search
 */
async function step3ResearchIndividual(profileId: string, contact: any, domain: string) {
  try {
    const name = contact.name;
    const companyName = contact.account?.name;

    const searches = [
      `"${name}" "${companyName}"`,
      `site:linkedin.com "${name}"`,
      `site:github.com "${name}"`,
      `site:medium.com "${name}"`,
      `site:${domain} "${name}"`,
      `"${name}" speaker`,
      `"${name}" author`,
    ];

    const sources: any[] = [];

    for (const query of searches) {
      try {
        // TODO: Use SerpAPI to search
        console.log(`[Step 3] Would search: ${query}`);

        // Store search attempt
        await storeEvidence(profileId, {
          evidenceType: 'source',
          category: 'individual',
          sourceTitle: `Search: ${query}`,
          sourcePlatform: 'web-search',
          sourceRelevance: 'pending',
          researchStep: 3,
        });
      } catch (e) {
        console.error(`Search failed for query "${query}":`, e);
      }
    }

    // Update profile with research data
    await prisma.contactIntelligenceProfile.update({
      where: { id: profileId },
      data: {
        webResearchData: { sources },
      },
    });
  } catch (err) {
    console.error('Step 3 error:', err);
    throw err;
  }
}

/**
 * STEP 4: Find & validate email
 * BLOCKED: Needs Hunter.io API key
 */
async function step4FindEmail(profileId: string, contact: any, domain: string) {
  try {
    const name = contact.name;
    const [first, last] = name.split(' ');

    // Generate email candidates
    const candidates = [
      `${first?.toLowerCase()}@${domain}`,
      `${first?.toLowerCase()}.${last?.toLowerCase()}@${domain}`,
      `${first?.charAt(0)?.toLowerCase()}${last?.toLowerCase()}@${domain}`,
    ];

    const emailCandidateData = [];

    for (const email of candidates) {
      // TODO: Validate with Hunter API
      emailCandidateData.push({
        email,
        confidence: 0, // Will be set by Hunter validation
        pattern: email.split('@')[0],
        source: 'candidate',
        validated: false,
      });

      await storeEvidence(profileId, {
        evidenceType: 'fact',
        category: 'email',
        factType: 'email_candidate',
        factValue: email,
        confidenceLevel: 'low',
        researchStep: 4,
      });
    }

    // Update profile with email candidates
    await prisma.contactIntelligenceProfile.update({
      where: { id: profileId },
      data: {
        emailCandidates: { emails: emailCandidateData },
      },
    });
  } catch (err) {
    console.error('Step 4 error:', err);
    throw err;
  }
}

/**
 * Helper: Store evidence in ContactIntelligenceEvidence table
 */
async function storeEvidence(profileId: string, data: any) {
  try {
    await prisma.contactIntelligenceEvidence.create({
      data: {
        profileId,
        ...data,
      },
    });
  } catch (err) {
    console.error('Failed to store evidence:', err);
  }
}

