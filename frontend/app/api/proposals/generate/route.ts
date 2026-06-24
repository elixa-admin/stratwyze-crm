import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '@/lib/db';
import { buildAllScenarios } from '@/lib/proposals/pricing';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function generateReference(clientName: string): string {
  const abbrev = clientName
    .replace(/[^a-zA-Z\s]/g, '')
    .split(' ')
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 4);
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `STR-${abbrev}-${year}-${seq}`;
}

export async function POST(request: NextRequest) {
  try {
    const {
      dealId,
      agentCount = 30,
      deploymentPref = 'SaaS',
      exchangeRate = 17.0,
    } = await request.json();

    if (!dealId) {
      return NextResponse.json({ error: 'dealId required' }, { status: 400 });
    }

    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        account: true,
        primaryContact: {
          include: { intelligenceProfile: true },
        },
      },
    });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    const clientName = deal.account?.name ?? deal.title;
    const contactName = deal.primaryContact?.name ?? '';
    const contactEmail = deal.primaryContact?.email ?? '';
    const industry = deal.account?.industry ?? 'enterprise';
    const employees = deal.account?.employees ?? 0;
    const incumbent = deal.incumbentPlatform ?? 'existing platform';
    const intel = deal.primaryContact?.intelligenceProfile;
    const briefing = intel?.briefing as any;
    const painPoints: string[] = briefing?.painPoints ?? [];
    const priorities: string[] = briefing?.priorities ?? [];

    // Claude generates Executive Summary + capability relevance
    const prompt = `You are writing a section of a formal B2B sales proposal for Stratwyze Solutions (South Africa's premier HaloITSM partner).

CLIENT CONTEXT:
- Company: ${clientName}
- Industry: ${industry}
- Employees: ${employees > 0 ? employees : 'unknown'}
- Current platform: ${incumbent}
- Agent/analyst headcount: approximately ${agentCount}
- Contact: ${contactName}
- Pain points: ${painPoints.slice(0, 5).join('; ') || 'operational efficiency, cost control, scalability'}
- Strategic priorities: ${priorities.slice(0, 3).join('; ') || 'platform modernisation, compliance, support quality'}
- Deal value: R${Math.round(deal.value).toLocaleString()}

Generate two sections in JSON:

1. "executiveSummary": An object with:
   - "headline": A 5-8 word bold heading describing the business case (e.g. "A Governance-Driven Platform Migration")
   - "paragraph1": 2-3 sentence paragraph describing the client's current situation and challenge, specific to their industry and incumbent platform. Mention ${clientName} by name.
   - "paragraph2": 1-2 sentence paragraph introducing HaloITSM as the solution and what this document covers.
   - "stats": Array of exactly 4 objects {value: string, label: string} — key metrics about the client/deal (e.g. agent count, client environments, target scale, ITIL 4 certification). Use real numbers where known, sensible estimates otherwise.

2. "whyHaloITSM": Object with:
   - "subtitle": "Purpose-Built for [2-4 word description of their operation]"
   - "capabilities": Array of 6 objects {capability: string, relevance: string} mapping HaloITSM features to THIS client's specific situation. Always include: ITIL 4 Certified, Named Agent Licensing, Flexible Deployment, API-First Architecture, Local Support by Stratwyze Solutions. Add 1 capability specific to their industry/pain points.

Respond with only valid JSON, no markdown fences.`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    });

    let aiSections: any = {};
    try {
      const raw = (message.content[0] as any).text;
      aiSections = JSON.parse(raw);
    } catch {
      aiSections = {
        executiveSummary: {
          headline: `Service Management Modernisation for ${clientName}`,
          paragraph1: `${clientName} currently operates on ${incumbent} and is evaluating a platform migration to improve operational governance, scalability, and support quality.`,
          paragraph2: `This document provides budgetary commercial terms for HaloITSM — an ITIL 4 certified, purpose-built service management platform.`,
          stats: [
            { value: String(agentCount), label: 'Named Agents' },
            { value: industry, label: 'Industry' },
            { value: incumbent, label: 'Incumbent Platform' },
            { value: 'ITIL 4', label: 'Certified Platform' },
          ],
        },
        whyHaloITSM: {
          subtitle: 'Purpose-Built for Governed Service Operations',
          capabilities: [
            { capability: 'ITIL 4 Certified (PinkVERIFY)', relevance: 'Incident, Problem, Change, Asset & Service Catalogue — native. No third-party add-ons required.' },
            { capability: 'Named Agent Licensing', relevance: 'Predictable per-seat annual subscription. No per-ticket charges. Scales linearly as headcount grows.' },
            { capability: 'Flexible Deployment', relevance: 'Available as SaaS (cloud) or on-premises. Both options use the same per-agent licence rate.' },
            { capability: 'API-First Architecture', relevance: 'Native integration with Microsoft 365, Azure AD and 200+ third-party platforms.' },
            { capability: 'Local Support by Stratwyze Solutions', relevance: '8×5 certified maintenance support with 4-hour P1 SLA. No offshore queues.' },
            { capability: 'Per-Client SLA Management', relevance: 'Automated SLA clocks, breach alerting, and per-client reporting — board-ready without additional BI tooling.' },
          ],
        },
      };
    }

    const pricing = buildAllScenarios(agentCount, exchangeRate);
    const reference = generateReference(clientName);

    const sections = {
      ...aiSections,
      pricing,
      deploymentPref,
      agentCount,
      exchangeRate,
    };

    const proposal = await prisma.proposal.create({
      data: {
        dealId,
        referenceNumber: reference,
        clientName,
        clientContact: contactName || null,
        clientEmail: contactEmail || null,
        agentCount,
        deploymentPref,
        exchangeRate,
        sections,
        status: 'draft',
      },
    });

    return NextResponse.json({ proposalId: proposal.id, referenceNumber: reference });
  } catch (error) {
    console.error('[POST /api/proposals/generate]', error);
    return NextResponse.json({ error: 'Failed to generate proposal' }, { status: 500 });
  }
}
