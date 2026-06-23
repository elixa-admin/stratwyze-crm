import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Incumbent-specific positioning copy pulled from the knowledgebase
const INCUMBENT_ANGLES: Record<string, { label: string; weakness: string; bridge: string }> = {
  servicenow: {
    label: 'ServiceNow',
    weakness: '12–18 month implementations, 3–4× TCO, legacy UI with poor adoption',
    bridge: 'HaloITSM deploys in 4–6 months at 70% lower total cost with modern UX that drives 90%+ adoption',
  },
  jira: {
    label: 'Jira Service Management',
    weakness: 'Developer-centric design, missing enterprise ITSM modules, costly add-ons',
    bridge: 'HaloITSM is purpose-built for IT operations—Change, Asset, Problem Management included, simpler for non-developers',
  },
  freshservice: {
    label: 'Freshservice',
    weakness: 'Ticketing-only depth, 500-agent ceiling, limited Change/Asset Management',
    bridge: 'HaloITSM delivers enterprise-complete ITSM with unlimited scale and all modules in one platform',
  },
  bmchelix: {
    label: 'BMC Helix',
    weakness: 'Legacy on-premises roots, 10–15 month implementation, high SI dependency',
    bridge: 'HaloITSM is cloud-native from the ground up—faster, cheaper, zero infrastructure management',
  },
  zendesk: {
    label: 'Zendesk',
    weakness: 'Customer support tool, not designed for IT operations, requires heavy customisation',
    bridge: 'HaloITSM is built for IT ops—native incident severity, ITIL 4-compliant, no customisation needed',
  },
};

const MOAT_COPY: Record<string, string> = {
  Cost: 'reduce total cost of ownership by up to 70% versus legacy ITSM platforms',
  Speed: 'go live in 4–6 months versus the 12–18 months typical of incumbent solutions',
  Adoption: 'achieve 90%+ user adoption within 6 months through modern, intuitive UX',
  Simplicity: 'eliminate licensing complexity with all enterprise modules included in a single price',
  'AI Automation': 'reduce manual IT workload by 40–50% through AI-powered ticket routing, resolution suggestions, and SLA prediction',
};

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const dealId = params.id;
    const body = await req.json();

    // Gather all deal intelligence
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: { account: true, stageWorkflow: true, opportunityProfile: true },
    });
    if (!deal) return NextResponse.json({ error: 'Deal not found' }, { status: 404 });

    const workflow = deal.stageWorkflow;
    const profile = deal.opportunityProfile;
    const companyIntel = (profile?.companyIntel as any) ?? {};
    const discoveryData = (profile?.discoveryData as any) ?? {};

    // Resolve inputs: prefer body overrides, then stored workflow, then body
    const incumbent = (body.incumbent || workflow?.incumbentPlatform || deal.incumbentPlatform || 'the existing platform').toLowerCase();
    const painPoints: string[] = body.painPoints || workflow?.painPoints || discoveryData.painPoints || [];
    const budgetRange = body.budgetRange || workflow?.budgetRange || discoveryData.budgetRange || 'to be confirmed';
    const timeline = body.timeline || workflow?.timeline || discoveryData.timeline || 'to be confirmed';
    const champion = body.champion || workflow?.champion || discoveryData.champion || '';
    const positioningAngle = body.positioningAngle || workflow?.positioningAngle || 'Cost';
    const solutionModules: string[] = body.solutionModules || ['Incident Management', 'Change Management', 'Asset Management', 'Service Catalogue'];
    const userCount = body.userCount || '500–1,000';
    const companyName = deal.account?.name || deal.title;
    const snapshot = companyIntel.companySnapshot?.description || '';
    const recentNews = companyIntel.recentNews?.slice(0, 2).map((n: any) => n.headline).join('; ') || '';

    const incumbentData = INCUMBENT_ANGLES[incumbent] ?? {
      label: body.incumbent || 'your current platform',
      weakness: 'cost and complexity challenges typical of incumbent solutions',
      bridge: 'HaloITSM delivers faster implementation, lower TCO, and better adoption',
    };
    const moatLine = MOAT_COPY[positioningAngle] ?? MOAT_COPY['Cost'];

    const prompt = `You are a senior B2B sales strategist at Stratwyze Solutions, a certified HaloITSM/HaloCRM partner in South Africa. Write a compelling, personalised proposal for the following prospect. Every paragraph must reference their specific situation—never use generic filler.

DEAL CONTEXT
Company: ${companyName}
${snapshot ? `Company overview: ${snapshot}` : ''}
${recentNews ? `Recent news: ${recentNews}` : ''}

DISCOVERY FINDINGS
Incumbent platform: ${incumbentData.label}
Key pain points: ${painPoints.join(', ') || 'cost, complexity, slow time-to-value'}
Budget range: ${budgetRange}
Timeline: ${timeline}
${champion ? `Internal champion: ${champion}` : ''}

PROPOSED SOLUTION
Modules: ${solutionModules.join(', ')}
User count: ${userCount}
Primary value angle: ${positioningAngle} — ${moatLine}
Incumbent weakness to address: ${incumbentData.weakness}
HaloITSM bridge statement: ${incumbentData.bridge}

Generate a structured proposal in valid JSON with EXACTLY this shape:
{
  "executiveSummary": "3–4 sentences: acknowledge their situation, name the pain, introduce HaloITSM as the answer, state the primary benefit",
  "situationAnalysis": "2–3 sentences referencing their incumbent and the specific pain points discovered",
  "proposedSolution": {
    "headline": "One punchy line summarising the solution",
    "modules": ["module 1", "module 2"],
    "implementationTimeline": "4–6 months",
    "deploymentApproach": "2–3 sentences on phased rollout approach"
  },
  "valueProposition": [
    { "moat": "Speed / Cost / Adoption / AI / Cloud", "headline": "Short headline", "detail": "1–2 sentences with numbers specific to their situation" }
  ],
  "incumbentComparison": {
    "incumbent": "${incumbentData.label}",
    "theirWeakness": "2 sentences on why the incumbent fails for this company",
    "ourAdvantage": "2 sentences on how HaloITSM specifically addresses those gaps"
  },
  "roiSummary": {
    "headline": "ROI headline with a number",
    "detail": "2–3 sentences on projected savings/gains based on their budget and pain points"
  },
  "nextSteps": ["Step 1 with timing", "Step 2 with timing", "Step 3 with timing"],
  "openingLine": "One sentence personalised opener to use when sending this proposal"
}

Return ONLY valid JSON. Reference ${companyName} by name at least twice. Be specific—vague claims weaken the proposal.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1800,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    let proposalData: any;
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      proposalData = JSON.parse(match ? match[0] : raw);
    } catch {
      proposalData = { executiveSummary: raw, error: 'Partial parse—review raw content' };
    }

    // Persist proposal data to stage workflow + opportunity profile
    await Promise.all([
      prisma.dealStageWorkflow.upsert({
        where: { dealId },
        create: { dealId, stage: 'Proposal', proposalData, proposalGenerated: new Date() },
        update: { proposalData, proposalGenerated: new Date() },
      }),
      prisma.opportunityProfile.upsert({
        where: { dealId },
        create: { dealId, proposalData: { generated: proposalData, solutionDesign: body } },
        update: { proposalData: { generated: proposalData, solutionDesign: body } },
      }),
      prisma.activity.create({
        data: { dealId, type: 'proposal-generated', content: 'AI proposal generated', metadata: { positioningAngle, incumbent } },
      }),
    ]);

    return NextResponse.json({ proposal: proposalData, meta: { incumbent: incumbentData.label, positioningAngle } });
  } catch (err: any) {
    console.error('Proposal generation error:', err);
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
