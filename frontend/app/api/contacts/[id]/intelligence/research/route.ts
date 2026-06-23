import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { scrapePages } from '@/lib/contact-intelligence/firecrawl-client';
import { multiSearch, scoreRelevance } from '@/lib/contact-intelligence/serp-client';
import { findEmail, getDomainInfo, scoreToConfidence } from '@/lib/contact-intelligence/hunter-client';
import {
  synthesiseCareerSummary,
  calculateIntelligenceScores,
  generateContactBriefing,
  buildEvidenceIndex,
} from '@/lib/contact-intelligence/claude-synthesis';
import { generateSearchQueries, generateEmailCandidates } from '@/lib/contact-intelligence/research-steps';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await req.json();
    const contactId = params.id;

    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: { account: true },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // If already in progress, reject
    let profile = await prisma.contactIntelligenceProfile.findUnique({ where: { contactId } });

    if (profile?.researchStatus === 'in_progress') {
      return NextResponse.json(
        { error: 'Research already in progress', profileId: profile.id },
        { status: 409 }
      );
    }

    // Create or reset profile
    if (!profile) {
      profile = await prisma.contactIntelligenceProfile.create({ data: { contactId } });
    }

    await prisma.contactIntelligenceProfile.update({
      where: { id: profile.id },
      data: {
        researchStatus: 'in_progress',
        researchStartedAt: new Date(),
        researchError: null,
      },
    });

    // Return immediately — research runs async
    runResearchAsync(profile.id, contact, contactId);

    return NextResponse.json({
      profileId: profile.id,
      status: 'in_progress',
      estimatedDuration: 60000,
      steps: STEP_NAMES.map((name, i) => ({ step: i + 1, name, status: i === 0 ? 'in_progress' : 'pending' })),
    });
  } catch (err: any) {
    console.error('[Intelligence] POST error:', err);
    return NextResponse.json({ error: err?.message || 'Research failed' }, { status: 500 });
  }
}

const STEP_NAMES = [
  'Resolve Company Domain',
  'Research Company Web',
  'Research Individual',
  'Find & Validate Email',
  'Generate Career Summary',
  'Calculate Intelligence Scores',
  'Generate Contact Briefing',
];

async function runResearchAsync(profileId: string, contact: any, contactId: string) {
  try {
    const name: string = contact.name;
    const companyName: string = contact.account?.name || '';
    const website: string | null = contact.account?.website || null;

    // ── STEP 1: Resolve domain ─────────────────────────────────────────────
    let domain = '';
    let domainSource = '';

    if (website) {
      try {
        const u = new URL(website);
        domain = u.hostname;
        domainSource = website;
      } catch {
        domain = website.replace(/^https?:\/\//, '').split('/')[0];
        domainSource = website;
      }
    }

    if (!domain && companyName) {
      // Fallback search
      const results = await multiSearch([`${companyName} official website`], 1);
      if (results[0]) {
        try {
          domain = new URL(results[0].url).hostname;
          domainSource = results[0].url;
        } catch { /* ignore */ }
      }
    }

    if (domain) {
      await prisma.contactIntelligenceProfile.update({
        where: { id: profileId },
        data: { companyDomain: domain, domainSource, domainConfidence: website ? 100 : 80 },
      });
    }

    await storeEvidence(profileId, {
      evidenceType: 'fact', category: 'company',
      factType: 'domain', factValue: domain || 'unknown',
      sourceUrl: domainSource, sourcePlatform: 'company-website',
      confidenceLevel: website ? 'high' : 'medium', researchStep: 1,
    });

    // ── STEP 2: Crawl company web ──────────────────────────────────────────
    const pagesToCrawl = domain ? [
      `https://${domain}`,
      `https://${domain}/about`,
      `https://${domain}/team`,
      `https://${domain}/leadership`,
      `https://${domain}/management`,
      `https://${domain}/news`,
      `https://${domain}/blog`,
      `https://${domain}/careers`,
    ] : [];

    const companyPages = domain ? await scrapePages(pagesToCrawl) : [];
    const companyContent = companyPages.map(p => `## ${p.title}\n${p.content}`).join('\n\n');

    await prisma.contactIntelligenceProfile.update({
      where: { id: profileId },
      data: {
        companyResearchData: {
          sources: companyPages.map(p => ({
            url: p.url,
            title: p.title,
            crawlDate: new Date().toISOString(),
            confidence: p.confidence,
            contentLength: p.content.length,
          })),
        },
      },
    });

    for (const page of companyPages) {
      await storeEvidence(profileId, {
        evidenceType: 'source', category: 'company',
        sourceUrl: page.url, sourceTitle: page.title,
        sourcePlatform: 'company-website',
        sourceContent: page.content.slice(0, 500),
        sourceCrawlDate: new Date(),
        sourceRelevance: page.url.includes('leadership') || page.url.includes('team') ? 'high' : 'medium',
        researchStep: 2,
      });
    }

    // ── STEP 3: Research individual ────────────────────────────────────────
    const queries = generateSearchQueries(name, companyName, domain);
    const webResults = await multiSearch(queries.slice(0, 8), 3, 200);

    const scoredResults = webResults.map(r => ({
      ...r,
      platform: r.platform || 'web',
      relevanceScore: scoreRelevance(r, name, companyName),
    })).filter(r => r.relevanceScore !== 'low' || r.platform === 'linkedin');

    await prisma.contactIntelligenceProfile.update({
      where: { id: profileId },
      data: {
        webResearchData: {
          sources: scoredResults.map(r => ({
            url: r.url,
            title: r.title,
            snippet: r.snippet,
            platform: r.platform,
            relevance: r.relevanceScore,
            date: r.date,
          })),
        },
      },
    });

    for (const r of scoredResults) {
      await storeEvidence(profileId, {
        evidenceType: 'source', category: 'individual',
        sourceUrl: r.url, sourceTitle: r.title,
        sourceContent: r.snippet,
        sourcePlatform: r.platform,
        sourceRelevance: r.relevanceScore,
        researchStep: 3,
      });
    }

    // ── STEP 4: Find & validate email ──────────────────────────────────────
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts[nameParts.length - 1] || '';

    let primaryEmail: string | null = null;
    let emailConfidence = 0;

    const emailCandidates = generateEmailCandidates(name, domain);

    if (domain && firstName && lastName) {
      // Try Hunter email-finder first
      const hunterResult = await findEmail(firstName, lastName, domain);
      if (hunterResult?.email) {
        primaryEmail = hunterResult.email;
        emailConfidence = hunterResult.confidence;
        emailCandidates.unshift({
          email: hunterResult.email,
          confidence: hunterResult.confidence,
          pattern: hunterResult.pattern || 'hunter',
          source: 'hunter',
          validated: true,
          validationStatus: 'valid',
        });
        await storeEvidence(profileId, {
          evidenceType: 'fact', category: 'email',
          factType: 'email', factValue: hunterResult.email,
          confidenceLevel: scoreToConfidence(hunterResult.confidence),
          sourceTitle: 'Hunter.io Email Finder',
          sourcePlatform: 'hunter',
          researchStep: 4,
        });
      } else {
        // Try domain pattern lookup as fallback
        const domainInfo = await getDomainInfo(domain);
        if (domainInfo?.pattern) {
          const patternEmail = buildEmailFromPattern(domainInfo.pattern, firstName, lastName, domain);
          if (patternEmail) {
            primaryEmail = patternEmail;
            emailConfidence = 65;
            emailCandidates.unshift({
              email: patternEmail,
              confidence: 65,
              pattern: domainInfo.pattern,
              source: 'hunter',
              validated: false,
            });
          }
        }
      }
    }

    await prisma.contactIntelligenceProfile.update({
      where: { id: profileId },
      data: {
        emailCandidates: { emails: emailCandidates } as any,
        primaryEmail: primaryEmail || undefined,
        emailConfidence: emailConfidence || undefined,
      },
    });

    // ── STEP 5: Career summary ─────────────────────────────────────────────
    const careerSummary = await synthesiseCareerSummary(
      { name, title: contact.title },
      { name: companyName, website },
      companyContent,
      scoredResults
    );

    await prisma.contactIntelligenceProfile.update({
      where: { id: profileId },
      data: { careerSummary: careerSummary as any },
    });

    // ── STEP 6: Intelligence scores ────────────────────────────────────────
    const scores = await calculateIntelligenceScores(
      { name, title: contact.title },
      { name: companyName },
      careerSummary,
      scoredResults,
      companyContent
    );

    await prisma.contactIntelligenceProfile.update({
      where: { id: profileId },
      data: {
        decisionMakerScore: scores.decisionMakerScore,
        influenceScore: scores.influenceScore,
        technicalInfluence: scores.technicalInfluence,
        commercialInfluence: scores.commercialInfluence,
        haloItsmRelevance: scores.haloItsmRelevance,
        buyingRelevance: scores.buyingRelevance,
        confidenceScore: scores.confidenceScore,
      },
    });

    // ── STEP 7: Contact briefing ───────────────────────────────────────────
    const briefing = await generateContactBriefing(
      { name, title: contact.title },
      { name: companyName, website },
      careerSummary,
      scores,
      companyContent,
      scoredResults
    );

    // Build evidence index
    const evidenceIndex = buildEvidenceIndex(
      { name, title: contact.title },
      domain,
      domainSource,
      companyPages,
      scoredResults,
      primaryEmail ? { email: primaryEmail, confidence: emailConfidence } : null,
      careerSummary
    );

    // Smart refresh: decision makers every 7d, others every 30d
    const refreshDays = scores.decisionMakerScore >= 70 ? 7 : scores.decisionMakerScore >= 40 ? 14 : 30;
    const nextRefreshAt = new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000);

    await prisma.contactIntelligenceProfile.update({
      where: { id: profileId },
      data: {
        briefing: briefing as any,
        evidenceIndex: evidenceIndex as any,
        researchStatus: 'completed',
        researchCompletedAt: new Date(),
        nextRefreshAt,
      },
    });

    // Also update the contact's legacy intelligenceData field for backwards compat
    await prisma.contact.update({
      where: { id: contactId },
      data: {
        lastResearchedAt: new Date(),
        intelligenceData: {
          briefing,
          decisionMakerScore: scores.decisionMakerScore,
          haloItsmRelevance: scores.haloItsmRelevance,
          buyingRelevance: scores.buyingRelevance,
          primaryEmail,
          emailConfidence,
        } as any,
      },
    });

    console.log(`[Intelligence] Research complete for ${name} (${contactId})`);
  } catch (err: any) {
    console.error(`[Intelligence] Research failed for contact ${contactId}:`, err);
    await prisma.contactIntelligenceProfile.update({
      where: { id: profileId },
      data: { researchStatus: 'failed', researchError: err?.message },
    }).catch(() => {});
  }
}

function buildEmailFromPattern(pattern: string, first: string, last: string, domain: string): string | null {
  switch (pattern) {
    case '{first}': return `${first.toLowerCase()}@${domain}`;
    case '{first}.{last}': return `${first.toLowerCase()}.${last.toLowerCase()}@${domain}`;
    case '{f}{last}': return `${first.charAt(0).toLowerCase()}${last.toLowerCase()}@${domain}`;
    case '{first}{l}': return `${first.toLowerCase()}${last.charAt(0).toLowerCase()}@${domain}`;
    case '{f}.{last}': return `${first.charAt(0).toLowerCase()}.${last.toLowerCase()}@${domain}`;
    default: return null;
  }
}

async function storeEvidence(profileId: string, data: Record<string, any>) {
  try {
    await prisma.contactIntelligenceEvidence.create({
      data: { profileId, evidenceType: 'source', category: 'general', ...data } as any,
    });
  } catch { /* non-fatal */ }
}
