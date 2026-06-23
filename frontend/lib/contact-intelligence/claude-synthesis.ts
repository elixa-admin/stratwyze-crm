import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export interface CareerSummary {
  currentRole: { title: string; company: string; type: 'FACT' | 'INFERENCE'; source: string };
  previousRoles: Array<{ title: string; company: string; type: 'FACT' | 'INFERENCE'; source: string }>;
  industryExperience: string;
  leadershipExperience: string;
  technicalIndicators: string[];
  publicInfluence: {
    articles: string[];
    speakingEngagements: string[];
    mediaAppearances: string[];
  };
}

export interface IntelligenceScores {
  decisionMakerScore: number;
  influenceScore: number;
  technicalInfluence: number;
  commercialInfluence: number;
  haloItsmRelevance: number;
  buyingRelevance: number;
  confidenceScore: number;
  reasoning: Record<string, string>;
}

export interface ContactBriefing {
  executiveSummary: string;
  currentRole: string;
  responsibilities: string[];
  likelyPriorities: string[];
  publicInterests: string[];
  technologyInterests: string[];
  businessInterests: string[];
  potentialPainPoints: string[];
  conversationStarters: string[];
  outreachAngle: string;
  discoveryQuestions: string[];
}

export interface EvidenceIndex {
  facts: Array<{
    type: string;
    value: string;
    source: string;
    url?: string;
    confidence: string;
  }>;
  inferences: Array<{
    type: string;
    inference: string;
    reasoning: string;
    confidence: string;
    sources: string[];
  }>;
  sources: Array<{
    url: string;
    title: string;
    platform: string;
    relevance: string;
    foundData: string[];
  }>;
}

/**
 * STEP 5: Synthesise career summary from raw research data
 */
export async function synthesiseCareerSummary(
  contact: { name: string; title?: string | null },
  company: { name: string; website?: string | null },
  companyContent: string,
  webResults: Array<{ url: string; title: string; snippet: string; platform: string }>
): Promise<CareerSummary> {
  const prompt = `You are a sales intelligence analyst. Analyse the following research data about a contact and generate a structured career summary.

CONTACT: ${contact.name}
KNOWN TITLE: ${contact.title || 'Unknown'}
COMPANY: ${company.name}

COMPANY WEB CONTENT (excerpts):
${companyContent.slice(0, 3000)}

WEB SEARCH RESULTS:
${webResults.map(r => `[${r.platform.toUpperCase()}] ${r.title}\n${r.snippet}\nURL: ${r.url}`).join('\n\n').slice(0, 3000)}

Generate a JSON career summary. For each field, mark as "FACT" if directly stated in sources, or "INFERENCE" if deduced. Be conservative — only infer what the evidence reasonably supports.

Respond ONLY with valid JSON in this exact structure:
{
  "currentRole": {
    "title": "string",
    "company": "string",
    "type": "FACT or INFERENCE",
    "source": "where this came from"
  },
  "previousRoles": [
    { "title": "string", "company": "string", "type": "FACT or INFERENCE", "source": "string" }
  ],
  "industryExperience": "brief description",
  "leadershipExperience": "brief description",
  "technicalIndicators": ["array", "of", "technical", "signals"],
  "publicInfluence": {
    "articles": ["list of article titles or empty array"],
    "speakingEngagements": ["list or empty array"],
    "mediaAppearances": ["list or empty array"]
  }
}`;

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse career summary');
  return JSON.parse(jsonMatch[0]);
}

/**
 * STEP 6: Calculate intelligence scores from all research data
 */
export async function calculateIntelligenceScores(
  contact: { name: string; title?: string | null },
  company: { name: string },
  careerSummary: CareerSummary,
  webResults: Array<{ url: string; title: string; snippet: string; platform: string }>,
  _companyContent: string
): Promise<IntelligenceScores> {
  const prompt = `You are a B2B sales intelligence scoring engine. Score this contact on 7 dimensions (0-100 each).

CONTACT: ${contact.name}
TITLE: ${contact.title || careerSummary.currentRole.title}
COMPANY: ${company.name}

CAREER SUMMARY:
${JSON.stringify(careerSummary, null, 2).slice(0, 1500)}

EVIDENCE SNIPPETS:
${webResults.slice(0, 5).map(r => `${r.title}: ${r.snippet}`).join('\n').slice(0, 1000)}

SCORING CRITERIA:

decisionMakerScore (0-100):
- 90-100: C-suite, Founder, Owner, President
- 70-89: VP, Head of, Director
- 50-69: Manager, Lead, Senior
- 30-49: Individual contributor
- 0-29: Admin, Intern, unknown

influenceScore (0-100):
- Public speaking, articles, media mentions → higher
- No public presence → lower

technicalInfluence (0-100):
- GitHub, technical writing, engineering titles → higher
- No technical signals → 10-30

commercialInfluence (0-100):
- Founder, CEO, Revenue, Sales, BD titles → higher
- Company growth signals → higher

haloItsmRelevance (0-100):
- IT, Operations, Service Desk, Facilities → 80-100
- Business operations, multi-location → 60-80
- Finance, HR, Sales → 40-60
- No operational role → 20-40

buyingRelevance (0-100):
- Budget authority + pain signals → higher
- C-suite at growing company → 80+
- Influencer but not buyer → 50-70

confidenceScore (0-100): How confident are we in the above scores, based on evidence quality?

Respond ONLY with valid JSON:
{
  "decisionMakerScore": 0-100,
  "influenceScore": 0-100,
  "technicalInfluence": 0-100,
  "commercialInfluence": 0-100,
  "haloItsmRelevance": 0-100,
  "buyingRelevance": 0-100,
  "confidenceScore": 0-100,
  "reasoning": {
    "decisionMaker": "one sentence",
    "influence": "one sentence",
    "technical": "one sentence",
    "commercial": "one sentence",
    "haloItsm": "one sentence",
    "buying": "one sentence"
  }
}`;

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 768,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse scores');
  return JSON.parse(jsonMatch[0]);
}

/**
 * STEP 7: Generate sales-ready contact briefing
 */
export async function generateContactBriefing(
  contact: { name: string; title?: string | null },
  company: { name: string; website?: string | null },
  careerSummary: CareerSummary,
  scores: IntelligenceScores,
  companyContent: string,
  webResults: Array<{ url: string; title: string; snippet: string; platform: string }>
): Promise<ContactBriefing> {
  const prompt = `You are a world-class sales intelligence analyst helping B2B sales reps prepare for conversations. Generate an actionable contact briefing based on the following research.

PRODUCT CONTEXT: HaloITSM — IT Service Management (ITSM) platform. Key value props:
- Centralised IT support across distributed/multi-location businesses
- Self-service portals for end users and franchise partners
- Incident, change, asset, and SLA management
- Scales from SMB to enterprise

CONTACT: ${contact.name}
TITLE: ${contact.title || careerSummary.currentRole.title}
COMPANY: ${company.name}

CAREER SUMMARY:
${JSON.stringify(careerSummary, null, 2).slice(0, 1000)}

INTELLIGENCE SCORES:
Decision Maker: ${scores.decisionMakerScore}/100
HaloITSM Relevance: ${scores.haloItsmRelevance}/100
Buying Relevance: ${scores.buyingRelevance}/100

COMPANY CONTEXT (from web):
${companyContent.slice(0, 2000)}

WEB EVIDENCE:
${webResults.slice(0, 6).map(r => `[${r.platform}] ${r.title}: ${r.snippet}`).join('\n').slice(0, 1500)}

Generate a sales-ready briefing. Be SPECIFIC to this person and company. Do NOT be generic. Every item should be grounded in evidence. Mark anything deduced as an inference in brackets like [INFERENCE].

Respond ONLY with valid JSON:
{
  "executiveSummary": "2-3 sentence summary of who they are and why they matter",
  "currentRole": "their role in one sentence",
  "responsibilities": ["3-5 specific likely responsibilities based on evidence"],
  "likelyPriorities": ["3-5 specific priorities relevant to their role and company situation"],
  "publicInterests": ["topics they've discussed publicly, or inferred from company/role"],
  "technologyInterests": ["specific tech areas relevant to their role"],
  "businessInterests": ["business concerns relevant to their level and company stage"],
  "potentialPainPoints": ["3-5 specific pain points THIS person at THIS company likely faces - tie to HaloITSM"],
  "conversationStarters": ["3 thoughtful opening questions specific to them"],
  "outreachAngle": "one paragraph: how to position HaloITSM specifically for this person",
  "discoveryQuestions": ["5 qualification questions for a discovery call"]
}`;

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse briefing');
  return JSON.parse(jsonMatch[0]);
}

/**
 * Build evidence index from all collected research
 */
export function buildEvidenceIndex(
  contact: { name: string; title?: string | null },
  domain: string,
  domainSource: string,
  companyPages: Array<{ url: string; title: string; content: string }>,
  webResults: Array<{ url: string; title: string; snippet: string; platform: string }>,
  emailResult: { email: string; confidence: number } | null,
  careerSummary: CareerSummary
): EvidenceIndex {
  const facts: EvidenceIndex['facts'] = [];
  const inferences: EvidenceIndex['inferences'] = [];
  const sources: EvidenceIndex['sources'] = [];

  // Domain fact
  facts.push({
    type: 'company_domain',
    value: domain,
    source: domainSource,
    url: domainSource,
    confidence: 'high',
  });

  // Title fact (if known)
  if (contact.title) {
    facts.push({
      type: 'job_title',
      value: contact.title,
      source: 'CRM record',
      confidence: 'high',
    });
  }

  // Career current role (fact or inference)
  if (careerSummary.currentRole.title) {
    const isFactType = careerSummary.currentRole.type === 'FACT';
    if (isFactType) {
      facts.push({
        type: 'current_role',
        value: `${careerSummary.currentRole.title} at ${careerSummary.currentRole.company}`,
        source: careerSummary.currentRole.source,
        confidence: 'high',
      });
    } else {
      inferences.push({
        type: 'current_role',
        inference: `${careerSummary.currentRole.title} at ${careerSummary.currentRole.company}`,
        reasoning: careerSummary.currentRole.source,
        confidence: 'medium',
        sources: [careerSummary.currentRole.source],
      });
    }
  }

  // Email fact
  if (emailResult?.email) {
    facts.push({
      type: 'email',
      value: emailResult.email,
      source: 'Hunter.io',
      confidence: emailResult.confidence >= 80 ? 'high' : emailResult.confidence >= 50 ? 'medium' : 'low',
    });
  }

  // Company pages as sources
  for (const page of companyPages) {
    sources.push({
      url: page.url,
      title: page.title,
      platform: 'company-website',
      relevance: page.url.includes('leadership') || page.url.includes('team') ? 'high' : 'medium',
      foundData: inferFoundData(page.content, contact.name),
    });
  }

  // Web results as sources
  for (const r of webResults) {
    sources.push({
      url: r.url,
      title: r.title,
      platform: r.platform,
      relevance: r.snippet.toLowerCase().includes(contact.name.toLowerCase()) ? 'high' : 'medium',
      foundData: [r.snippet.slice(0, 100)],
    });
  }

  return { facts, inferences, sources };
}

function inferFoundData(content: string, name: string): string[] {
  const found: string[] = [];
  const lower = content.toLowerCase();
  if (lower.includes(name.toLowerCase())) found.push('person mention');
  if (lower.includes('ceo') || lower.includes('founder') || lower.includes('director')) found.push('leadership info');
  if (lower.includes('news') || lower.includes('press')) found.push('company news');
  if (lower.includes('career') || lower.includes('job')) found.push('hiring signals');
  return found.length ? found : ['company content'];
}
