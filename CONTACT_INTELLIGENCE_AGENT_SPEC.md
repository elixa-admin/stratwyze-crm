# Contact Intelligence Agent Specification
## Stratwyze Intelligence OS — Evidence-Based Sales Intelligence

---

## VISION

Transform basic contact records into rich, actionable intelligence profiles through systematic web research, without relying on LinkedIn APIs. Every insight is backed by evidence. Every recommendation is explainable.

---

## ARCHITECTURE

### Data Model: Contact Intelligence Profile

```prisma
model ContactIntelligenceProfile {
  id                    String    @id @default(cuid())
  contactId             String    @unique
  contact               Contact   @relation(fields: [contactId], references: [id], onDelete: Cascade)
  
  // RESEARCH METADATA
  researchStartedAt     DateTime?
  researchCompletedAt   DateTime?
  researchStatus        String    @default("pending") // pending | in_progress | completed | failed
  researchError         String?
  nextRefreshAt         DateTime?
  
  // STEP 1: Company Domain Resolution
  companyDomain         String?
  domainConfidence      Int?      // 0-100
  domainSource          String?
  
  // STEP 2: Company Web Research
  companyResearchData   Json?     // { sources: [{url, title, crawlDate, confidence, content}] }
  
  // STEP 3: Individual Web Research
  webResearchData       Json?     // { sources: [{url, title, snippet, platform, confidence}] }
  
  // STEP 4: Email Research
  emailCandidates       Json?     // { emails: [{email, confidence, pattern, source, validated}] }
  primaryEmail          String?
  emailConfidence       Int?
  
  // STEP 5: Career Summary
  careerSummary         Json?     // { currentRole, previousRoles[], industry, leadership, influence }
  
  // STEP 6: Intelligence Scores
  decisionMakerScore    Int?      // 0-100
  influenceScore        Int?      // 0-100
  technicalInfluence    Int?      // 0-100
  commercialInfluence   Int?      // 0-100
  haloItsmRelevance     Int?      // 0-100
  buyingRelevance       Int?      // 0-100
  confidenceScore       Int?      // 0-100
  
  // STEP 7: Contact Briefing
  briefing              Json?     // { executiveSummary, currentRole, responsibilities, ... }
  
  // EVIDENCE TRACKING
  evidenceIndex         Json?     // { facts: [...], inferences: [...], sources: [...] }
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

model ContactIntelligenceEvidence {
  id                    String    @id @default(cuid())
  profileId             String
  profile               ContactIntelligenceProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  
  // EVIDENCE TRACKING
  evidenceType          String    // "fact" | "inference" | "source"
  category              String    // "company" | "individual" | "email" | "career" | "influence"
  
  // FOR FACTS
  factType              String?   // "name", "title", "company", "email", "role", etc.
  factValue             String?
  
  // FOR INFERENCES
  inferenceType         String?   // "role_inference", "influence_inference", etc.
  inference             String?
  reasoning             String?
  confidenceLevel       String?   // "high" | "medium" | "low"
  
  // FOR SOURCES
  sourceUrl             String?
  sourceTitle           String?
  sourcePlatform        String?   // "company-website" | "linkedin" | "github" | "medium" | "news" | etc.
  sourceContent         String?
  sourceCrawlDate       DateTime?
  sourceRelevance       String?   // "high" | "medium" | "low"
  
  // METADATA
  researchStep          Int?      // 1-7 (which step generated this)
  dataExtractedAt       DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  @@index([profileId])
  @@index([category])
  @@index([sourcePlatform])
}
```

---

## API ENDPOINTS

### 1. POST /api/contacts/[id]/intelligence/research
**Trigger comprehensive contact research**

Request:
```json
{
  "forceRefresh": false
}
```

Response:
```json
{
  "profileId": "...",
  "status": "in_progress",
  "estimatedDuration": 45000,
  "steps": [
    { "step": 1, "status": "in_progress", "name": "Resolve Company Domain" },
    { "step": 2, "status": "pending", "name": "Research Company Web" },
    { "step": 3, "status": "pending", "name": "Research Individual" },
    { "step": 4, "status": "pending", "name": "Find Email" },
    { "step": 5, "status": "pending", "name": "Generate Career Summary" },
    { "step": 6, "status": "pending", "name": "Calculate Intelligence Scores" },
    { "step": 7, "status": "pending", "name": "Generate Briefing" }
  ]
}
```

---

### 2. GET /api/contacts/[id]/intelligence/profile
**Fetch complete intelligence profile**

Response:
```json
{
  "contact": {
    "name": "Stephan Bredell",
    "title": "CEO and Co-Founder",
    "company": "Plato Coffee",
    "email": "stephan@platocoffee.co.za",
    "emailConfidence": 92
  },
  "profile": {
    "researchCompletedAt": "2026-06-23T...",
    "decisionMakerScore": 95,
    "influenceScore": 72,
    "technicalInfluence": 45,
    "commercialInfluence": 88,
    "haloItsmRelevance": 78,
    "buyingRelevance": 89,
    "confidenceScore": 87
  },
  "briefing": {
    "executiveSummary": "Founder and strategic decision-maker at rapidly expanding retail franchise...",
    "currentRole": "CEO and Co-Founder",
    "responsibilities": ["Strategic direction", "Expansion planning", "Technology decisions", ...],
    "likelyPriorities": ["Operational efficiency", "Franchise support", "Technology modernization", ...],
    "publicInterests": ["Retail innovation", "Franchise models", "Tech adoption", ...],
    "technologyInterests": ["POS systems", "Cloud infrastructure", "Payment processing", ...],
    "businessInterests": ["Expansion strategy", "Multi-location management", "Risk mitigation", ...],
    "potentialPainPoints": [
      "Scaling IT support across 140+ locations",
      "Maintaining operational consistency",
      "Managing technology sprawl",
      "Franchise partner support"
    ],
    "conversationStarters": [
      "How are you managing IT support across 140+ locations?",
      "What's been the biggest operational challenge with rapid expansion?",
      "We work with franchise operations on incident management — curious if that's a pain point?"
    ],
    "outreachAngle": "Position HaloITSM as enabler of multi-location operational consistency and self-service support",
    "discoveryQuestions": [
      "With your expansion to 140+ locations, how do you currently handle IT service requests?",
      "What percentage of support requests could be resolved by franchisees themselves?",
      "How do you track compliance and SLA performance across locations?"
    ]
  },
  "evidence": {
    "facts": [
      {
        "type": "title",
        "value": "CEO and Co-Founder",
        "source": "Plato Coffee Leadership Page",
        "url": "https://platocoffee.co.za/leadership",
        "confidence": 100
      },
      {
        "type": "company_size",
        "value": "140+ locations across South Africa",
        "source": "Company website mentions",
        "url": "https://platocoffee.co.za/about",
        "confidence": 95
      },
      {
        "type": "founding_date",
        "value": "2010 (approx)",
        "source": "Company About page",
        "url": "https://platocoffee.co.za/about",
        "confidence": 90
      }
    ],
    "inferences": [
      {
        "type": "decision_maker",
        "inference": "Primary strategic decision-maker for technology investments",
        "reasoning": "CEO founder role + company growth trajectory + no CTO/IT officer mentioned = likely owns tech decisions",
        "confidence": "high",
        "sources": [
          "CEO role at founding company",
          "No separate IT leadership found",
          "Expansion timeline suggests active strategy involvement"
        ]
      },
      {
        "type": "buying_relevance",
        "inference": "High relevance for ITSM: multi-location franchise model creates operational complexity",
        "reasoning": "140+ locations + franchise model + rapid expansion = IT service management pain",
        "confidence": "high",
        "sources": [
          "Company size and structure",
          "Recent hiring for IT positions",
          "Expansion announcements mentioning 'centralized operations'"
        ]
      }
    ],
    "sources": [
      {
        "url": "https://platocoffee.co.za",
        "title": "Plato Coffee - Homepage",
        "platform": "company-website",
        "crawlDate": "2026-06-23",
        "relevance": "high",
        "foundData": ["leadership", "expansion metrics", "company vision"]
      },
      {
        "url": "https://platocoffee.co.za/leadership",
        "title": "Leadership Team",
        "platform": "company-website",
        "crawlDate": "2026-06-23",
        "relevance": "high",
        "foundData": ["Stephan's title", "bio", "photo"]
      },
      {
        "url": "https://www.linkedin.com/in/stephanbredell",
        "title": "Stephan Bredell - LinkedIn",
        "platform": "linkedin",
        "crawlDate": "2026-06-23",
        "relevance": "high",
        "foundData": ["career history", "endorsements", "connections"]
      }
    ]
  },
  "lastRefreshAt": "2026-06-23T14:35:00Z",
  "nextRefreshAt": "2026-06-30T14:35:00Z"
}
```

---

### 3. GET /api/contacts/[id]/intelligence/evidence
**Query evidence index for fact-checking**

Query params:
- `type` (fact | inference | source)
- `category` (company | individual | email | career | influence)
- `platform` (linkedin | github | company-website | news | etc.)

---

## RESEARCH WORKFLOW (7 STEPS)

### STEP 1: Resolve Company Domain

**Input:** Company Name, Website (if provided)

**Logic:**
```typescript
async function resolveCompanyDomain(company: string, website?: string) {
  // If website provided, extract domain
  if (website) {
    const domain = new URL(website).hostname;
    storeEvidence('domain', domain, website, 100);
    return domain;
  }
  
  // Otherwise, search for official domain
  const search = await web_search(`${company} official website`);
  const topResult = search[0];
  const domain = new URL(topResult.url).hostname;
  storeEvidence('domain', domain, topResult.url, topResult.confidence);
  return domain;
}
```

**Store:**
```json
{
  "companyDomain": "platocoffee.co.za",
  "domainSource": "https://platocoffee.co.za",
  "domainConfidence": 100
}
```

---

### STEP 2: Research Company Web (Firecrawl)

**Input:** Company Domain

**Logic:**
```typescript
async function crawlCompanyWeb(domain: string) {
  const pagesToCrawl = [
    `https://${domain}`,
    `https://${domain}/about`,
    `https://${domain}/team`,
    `https://${domain}/leadership`,
    `https://${domain}/management`,
    `https://${domain}/executives`,
    `https://${domain}/news`,
    `https://${domain}/press`,
    `https://${domain}/blog`,
    `https://${domain}/careers`
  ];
  
  for (const url of pagesToCrawl) {
    const content = await firecrawl.scrape(url);
    storeEvidence('company_web', {
      url,
      title: content.title,
      content: content.content,
      crawlDate: new Date(),
      confidence: content.validity_score || 85
    });
  }
}
```

**Store:**
```json
{
  "companyResearchData": {
    "sources": [
      {
        "url": "https://platocoffee.co.za",
        "title": "Homepage",
        "content": "...",
        "crawlDate": "2026-06-23T14:35:00Z",
        "confidence": 95
      },
      {
        "url": "https://platocoffee.co.za/leadership",
        "title": "Leadership",
        "content": "...",
        "crawlDate": "2026-06-23T14:35:00Z",
        "confidence": 95
      }
    ]
  }
}
```

---

### STEP 3: Research Individual

**Input:** Name, Company, Company Domain

**Logic:**
```typescript
async function researchIndividual(name: string, company: string, domain: string) {
  const searches = [
    `"${name}" "${company}"`,
    `site:linkedin.com/in "${name}"`,
    `site:medium.com "${name}"`,
    `site:github.com "${name}"`,
    `site:substack.com "${name}"`,
    `site:${domain} "${name}"`,
    `"${name}" speaker conference`,
    `"${name}" ${company} CTO`,
    `"${name}" ${company} technical`
  ];
  
  const results = [];
  for (const query of searches) {
    const matches = await web_search(query);
    for (const match of matches.slice(0, 3)) {
      results.push({
        url: match.url,
        title: match.title,
        snippet: match.snippet,
        query,
        confidence: match.relevance_score
      });
      storeEvidence('individual_web', match);
    }
  }
  
  return results;
}
```

**Store:**
```json
{
  "webResearchData": {
    "sources": [
      {
        "url": "https://www.linkedin.com/in/stephanbredell",
        "title": "Stephan Bredell - LinkedIn",
        "snippet": "CEO and Co-Founder at Plato Coffee...",
        "platform": "linkedin",
        "confidence": 98
      },
      {
        "url": "https://platocoffee.co.za/blog/author/stephan",
        "title": "Stephan's Articles - Plato Coffee Blog",
        "snippet": "Articles on franchise management...",
        "platform": "company-website",
        "confidence": 95
      }
    ]
  }
}
```

---

### STEP 4: Find Email

**Input:** Name, Company Domain, Web Research Results

**Logic:**
```typescript
async function findEmail(name: string, domain: string, webResults: any[]) {
  const [first, last] = name.split(' ');
  
  // Generate email candidates
  const candidates = [
    `${first.toLowerCase()}@${domain}`,
    `${first.toLowerCase()}.${last.toLowerCase()}@${domain}`,
    `${first.charAt(0).toLowerCase()}${last.toLowerCase()}@${domain}`,
    `${first.toLowerCase()}.${last.charAt(0).toLowerCase()}@${domain}`,
  ];
  
  // Use Hunter to validate
  const hunterResults = await hunter.verify(candidates);
  const validated = hunterResults.filter(r => r.verification === 'valid');
  
  // Check webResults for mentioned email addresses
  for (const result of webResults) {
    const emailMatch = result.snippet?.match(/[\w.-]+@[\w.-]+/);
    if (emailMatch) {
      candidates.push({
        email: emailMatch[0],
        source: result.url,
        confidence: 80
      });
    }
  }
  
  // Store all candidates with confidence scores
  storeEvidence('email_candidates', candidates);
  
  return candidates.sort((a, b) => b.confidence - a.confidence);
}
```

**Store:**
```json
{
  "emailCandidates": [
    {
      "email": "stephan@platocoffee.co.za",
      "confidence": 95,
      "pattern": "firstname@domain",
      "source": "company-website",
      "validated": true,
      "validationMethod": "Hunter"
    },
    {
      "email": "stephan.bredell@platocoffee.co.za",
      "confidence": 72,
      "pattern": "firstname.lastname@domain",
      "source": "hunter-guess",
      "validated": false
    }
  ],
  "primaryEmail": "stephan@platocoffee.co.za",
  "emailConfidence": 95
}
```

---

### STEP 5: Generate Career Summary

**Input:** Web Research Results, Company Domain Research

**Logic:**
```typescript
async function generateCareerSummary(webResults: any[], companyData: any[]) {
  // Extract from LinkedIn
  const linkedinProfile = webResults.find(r => r.platform === 'linkedin');
  
  // Extract from company website
  const companyBio = companyData.find(r => r.title.includes('leadership'));
  
  // Use Claude to synthesize
  const prompt = `
    Based on this evidence:
    - LinkedIn profile: ${linkedinProfile?.snippet}
    - Company bio: ${companyBio?.content}
    - Other mentions: ${webResults.map(r => r.snippet).join('\n')}
    
    Generate a career summary including:
    - Current role and responsibilities
    - Previous roles and industries
    - Leadership experience
    - Technical influence (if any)
    - Public influence (articles, speaking, etc.)
    - Topics discussed
    
    Mark each item as FACT (from LinkedIn/company site) or INFERENCE (deduced).
  `;
  
  const summary = await claude.generate(prompt);
  storeEvidence('career_summary', summary);
  return summary;
}
```

**Store:**
```json
{
  "careerSummary": {
    "currentRole": {
      "title": "CEO and Co-Founder",
      "company": "Plato Coffee",
      "startDate": "2010 (approx)",
      "type": "FACT",
      "source": "LinkedIn + company website"
    },
    "previousRoles": [
      {
        "title": "Not publicly detailed",
        "type": "INFERENCE",
        "reasoning": "Pre-founding career not mentioned in public sources"
      }
    ],
    "industryExperience": "Retail/Franchise/F&B",
    "leadershipExperience": "Founder, scaled company from 0 to 140+ locations",
    "publicInfluence": {
      "articles": [],
      "speakingEngagements": [],
      "mediaAppearances": []
    },
    "technicalInfluence": "Low - no GitHub, technical writing, or speaking",
    "commercialInfluence": "High - founder of growing franchise business"
  }
}
```

---

### STEP 6: Calculate Intelligence Scores

**Input:** All previous research data

**Logic:**
```typescript
async function calculateScores(profile: any) {
  // Decision Maker Score (0-100)
  // Factors: Is CEO/founder? Level of authority? Technology decision mention?
  const decisionMakerScore = evaluateDecisionMaking(profile);
  
  // Influence Score (0-100)
  // Factors: Public speaking? Articles? LinkedIn followers? Media?
  const influenceScore = evaluatePublicInfluence(profile);
  
  // Technical Influence (0-100)
  // Factors: GitHub? Technical writing? Speaking at tech conferences?
  const technicalInfluence = evaluateTechnicalInfluence(profile);
  
  // Commercial Influence (0-100)
  // Factors: Business growth? Investor? Board positions?
  const commercialInfluence = evaluateCommercialInfluence(profile);
  
  // HaloITSM Relevance (0-100)
  // Factors: ITSM role? Ops role? IT mention? Service management interest?
  const haloItsmRelevance = evaluateHaloRelevance(profile);
  
  // Buying Relevance (0-100)
  // Factors: Budget authority? Growth signals? Tech spending signals?
  const buyingRelevance = evaluateBuyingRelevance(profile);
  
  // Confidence Score (0-100)
  // How confident are we in all the above?
  const confidenceScore = evaluateResearchConfidence(profile);
  
  return {
    decisionMakerScore,
    influenceScore,
    technicalInfluence,
    commercialInfluence,
    haloItsmRelevance,
    buyingRelevance,
    confidenceScore
  };
}
```

**Store:**
```json
{
  "decisionMakerScore": 95,
  "influenceScore": 62,
  "technicalInfluence": 35,
  "commercialInfluence": 88,
  "haloItsmRelevance": 78,
  "buyingRelevance": 89,
  "confidenceScore": 87
}
```

---

### STEP 7: Generate Contact Briefing

**Input:** All research data + scores

**Logic:**
```typescript
async function generateBriefing(profile: any, evidence: any[]) {
  const prompt = `
    You are a sales intelligence analyst. Generate a contact briefing based on this research:
    
    FACTS (verified):
    ${evidence.filter(e => e.type === 'FACT').map(e => `- ${e.value}`).join('\n')}
    
    INFERENCES (deduced):
    ${evidence.filter(e => e.type === 'INFERENCE').map(e => `- ${e.inference} (${e.confidence})`).join('\n')}
    
    Generate a briefing that includes:
    1. Executive Summary (2-3 sentences)
    2. Current Role & Responsibilities
    3. Likely Priorities (3-5 items)
    4. Public Interests & Influences
    5. Technology & Business Interests
    6. Potential Pain Points (specific to their company/role)
    7. Conversation Starters (3-4 thoughtful questions)
    8. Outreach Angle (how to position HaloITSM)
    9. Discovery Questions (5-7 for qualification call)
    
    Make recommendations EXPLAINABLE - every suggestion should reference the evidence.
  `;
  
  const briefing = await claude.generate(prompt);
  storeEvidence('briefing', briefing);
  return briefing;
}
```

**Store:**
```json
{
  "briefing": {
    "executiveSummary": "Founder and CEO of rapidly expanding franchise operation (140+ locations). Strategic thinker focused on operational consistency and technology enablement.",
    "currentRole": "CEO and Co-Founder of Plato Coffee",
    "responsibilities": [
      "Strategic direction and expansion planning",
      "Technology and operations decisions",
      "Franchise partner management and support",
      "Risk management across multi-location network"
    ],
    "likelyPriorities": [
      "Maintaining operational consistency across 140+ locations",
      "Supporting franchisees with tools and processes",
      "Managing technology across distributed network",
      "Scaling support infrastructure efficiently"
    ],
    "publicInterests": ["Franchise models", "Retail innovation", "Operational efficiency"],
    "technologyInterests": ["POS systems", "Cloud infrastructure", "Franchise support tools"],
    "businessInterests": ["Expansion strategy", "Franchise support", "Multi-location management"],
    "potentialPainPoints": [
      "Scaling IT support across 140+ locations with limited centralized IT staff",
      "Ensuring consistent service levels between corporate and franchisee operations",
      "Managing technology diversity across locations (different capabilities, tools, processes)",
      "Tracking and resolving incidents in a distributed, franchise-based structure"
    ],
    "conversationStarters": [
      "With 140+ locations, how do you currently handle IT service requests from franchisees?",
      "What's been your biggest operational challenge as you've scaled?",
      "How do you ensure service consistency when partners are managing their own operations?"
    ],
    "outreachAngle": "Position HaloITSM as the platform that gives franchisees self-service capability while providing corporate visibility and control. Focus on: reducing support burden on central IT, empowering franchisees, and maintaining compliance/SLA standards.",
    "discoveryQuestions": [
      "What percentage of support issues could franchisees resolve themselves with better tools?",
      "How do you currently track SLA compliance and incident resolution across locations?",
      "What's the biggest gap in your current approach to supporting 140+ partners?"
    ]
  }
}
```

---

## EVIDENCE MANAGEMENT

### Evidence vs. Inference Model

**FACTS** (Stored as-is):
- Name, title, company from LinkedIn
- Company size from official website
- Email from verified Hunter lookup
- Dates from public sources
- Articles/speaking engagements from direct URL

**INFERENCES** (Stored with reasoning):
- Decision-maker status (inferred from role + company structure)
- Pain points (inferred from company size + business model)
- Priorities (inferred from public statements + industry trends)
- Conversation starters (synthesized from evidence)

**Every inference must:**
1. Reference supporting facts
2. Include confidence level
3. Explain the reasoning
4. Point to source URLs

---

## UI COMPONENT: Contact Intelligence Briefing

```tsx
// components/contacts/ContactIntelligenceBriefing.tsx

export default function ContactIntelligenceBriefing({ contact, profile }: Props) {
  return (
    <div className="space-y-6">
      {/* Header: Key Scores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCard
          title="Decision Maker"
          score={profile.decisionMakerScore}
          label={scoreLabel(profile.decisionMakerScore)}
        />
        <ScoreCard
          title="Influence"
          score={profile.influenceScore}
          label={scoreLabel(profile.influenceScore)}
        />
        <ScoreCard
          title="HaloITSM Relevance"
          score={profile.haloItsmRelevance}
          label={scoreLabel(profile.haloItsmRelevance)}
        />
        <ScoreCard
          title="Buying Relevance"
          score={profile.buyingRelevance}
          label={scoreLabel(profile.buyingRelevance)}
        />
      </div>

      {/* Executive Summary */}
      <Card>
        <CardHeader>Executive Summary</CardHeader>
        <CardContent>{profile.briefing.executiveSummary}</CardContent>
      </Card>

      {/* Current Role + Responsibilities */}
      <Card>
        <CardHeader>Role & Responsibilities</CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-xs text-slate-500">ROLE</p>
            <p className="text-sm font-semibold">{profile.briefing.currentRole}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-2">RESPONSIBILITIES</p>
            <ul className="space-y-1">
              {profile.briefing.responsibilities.map((r, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2">
                  <span className="text-blue-400">•</span>{r}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Likely Priorities */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="text-amber-900">Likely Priorities</CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {profile.briefing.likelyPriorities.map((p, i) => (
              <li key={i} className="text-sm text-amber-900 flex gap-2">
                <span>🎯</span>{p}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Potential Pain Points */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="text-red-900">⚠️ Potential Pain Points</CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {profile.briefing.potentialPainPoints.map((p, i) => (
              <li key={i} className="text-sm text-red-900">
                <p className="font-semibold">{p.split(':')[0]}:</p>
                <p className="ml-2">{p.split(':')[1] || p}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Conversation Starters */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="text-green-900">💬 Conversation Starters</CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {profile.briefing.conversationStarters.map((q, i) => (
              <li key={i} className="text-sm text-green-900">
                "{q}"
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Outreach Angle */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="text-blue-900">🎯 Outreach Angle</CardHeader>
        <CardContent className="text-sm text-blue-900">
          {profile.briefing.outreachAngle}
        </CardContent>
      </Card>

      {/* Discovery Questions */}
      <Card>
        <CardHeader>Discovery Call Questions</CardHeader>
        <CardContent>
          <ol className="space-y-2 list-decimal list-inside">
            {profile.briefing.discoveryQuestions.map((q, i) => (
              <li key={i} className="text-sm text-slate-700">{q}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Evidence Sources */}
      <Card>
        <CardHeader>Evidence Sources</CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">KEY FACTS</p>
            <ul className="space-y-1">
              {profile.evidence.facts.map((f, i) => (
                <li key={i} className="text-xs text-slate-700">
                  <span className="font-semibold">{f.type}:</span> {f.value}
                  <a href={f.source} className="ml-2 text-blue-600 hover:underline">[source]</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">KEY INFERENCES</p>
            <ul className="space-y-2">
              {profile.evidence.inferences.map((inf, i) => (
                <li key={i} className="text-xs text-slate-600 bg-slate-100 p-2 rounded">
                  <p className="font-semibold text-slate-900">{inf.inference}</p>
                  <p className="text-slate-600 mt-1">Reasoning: {inf.reasoning}</p>
                  <p className="text-slate-500 text-[10px] mt-1">Confidence: {inf.confidence}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">SOURCES CONSULTED</p>
            <ul className="space-y-1">
              {profile.evidence.sources.map((s, i) => (
                <li key={i} className="text-xs">
                  <a href={s.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    {s.platform.toUpperCase()}: {s.title}
                  </a>
                  <p className="text-slate-500 text-[10px] mt-0.5">Relevance: {s.relevance}</p>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Refresh Controls */}
      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
        <div className="text-xs text-slate-600">
          Last researched: {format(profile.lastRefreshAt, 'MMM d, yyyy h:mm a')}
          <br />
          Next refresh: {format(profile.nextRefreshAt, 'MMM d, yyyy')}
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700"
        >
          🔄 Refresh Intelligence
        </button>
      </div>
    </div>
  );
}
```

---

## IMPLEMENTATION ROADMAP

### Phase 1: MVP (Weeks 1-2)
- [ ] Data model for ContactIntelligenceProfile
- [ ] Step 1-4 (domain → email)
- [ ] POST /api/contacts/[id]/intelligence/research endpoint
- [ ] Basic UI briefing display

### Phase 2: Intelligence (Weeks 3-4)
- [ ] Step 5-7 (career summary → briefing generation)
- [ ] Evidence tracking & indexing
- [ ] GET /api/contacts/[id]/intelligence/profile endpoint
- [ ] Evidence sources display

### Phase 3: Polish (Weeks 5+)
- [ ] Auto-enrichment on contact creation
- [ ] Background queue for bulk research
- [ ] Smart refresh intervals
- [ ] User configuration options

---

## SUCCESS METRICS

- Research completion rate (% of contacts fully researched)
- Average research time (should be <1 min per contact)
- Evidence quality (% of inferences with >2 supporting sources)
- Sales impact (deals influenced by briefing recommendations)
- Confidence scores (average profile confidence >85%)

