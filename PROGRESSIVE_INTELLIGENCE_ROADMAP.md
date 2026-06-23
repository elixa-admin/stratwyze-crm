# Progressive Sales Intelligence Engine
## Waves 25-28: Sales Cycle-Driven Profile Enrichment

**Vision:** Build a living prospect profile that deepens and becomes more sophisticated as the deal progresses through each sales stage. At each stage, different data sources unlock, sales agent inputs enrich the profile, and AI synthesizes insights specific to that stage's decisions.

---

## Architecture Overview

```
PROSPECT PROFILE (grows richer at each stage)
├── Company Data (foundational, enriches as you go)
├── Market Intelligence (early) → Financial Intelligence (mid) → Competitive Intel (late)
├── Contact Profiles (initial → enriched with meeting learnings)
└── Opportunity Context (evolves from "unknown" → "highly specific")

SALES AGENT INPUTS (fed at each stage)
├── Meeting Notes & Transcripts
├── Discovered Requirements
├── Incumbent Platform Details
├── Budget Signals & Constraints
└── Strategic Objectives & Priorities

AI SYNTHESIS (stage-specific)
├── Prospecting → Buying Signal Summary
├── Qualification → Fit Assessment + Competitive Threats
├── Solutioning → Tailored Differentiation Strategy
├── Proposal → Hyper-personalized Messaging
└── Negotiation → Objection Mapping + Win Strategy
```

---

## Stage-by-Stage Intelligence Gathering

### **WAVE 25: Prospecting Stage Intelligence**
**Goal:** Build initial company/prospect profile from public sources

**Data Sources Activated:**
- Google: Company overview, about page, services, news
- Company website: Blog, case studies, team bios, tech stack mentions
- LinkedIn: Company page (headcount, growth), employee insights
- SerpAPI: 6 parallel searches (already implemented in Wave 22)

**Enrichment Points:**
- Company snapshot (industry, HQ, size, revenue range)
- Service offerings & positioning
- Recent news (funding, launches, partnerships)
- Leadership team (CEO, CTO, CFO inferred)
- Technology hints (job postings for "cloud engineer", etc.)

**Sales Agent Input:**
- Manual notes on initial interest (inbound vs. outbound, source)
- First contact name & role
- Initial pain point hypothesis

**AI Output:**
- Buyer Intent Score (Wave 22 ✅)
- Research-based org structure guess
- Suggested first contact approach
- 5 discovery questions pre-call

**Database Schema:**
```
OpportunityProfile.prospectingIntelligence = {
  companyResearch: { ... },        // From SerpAPI
  buyerIntentBreakdown: { ... },   // From Wave 22
  suggestedApproach: string,
  discoveryQuestions: string[],
  agentNotes: string
}
```

---

### **WAVE 26: Pre-Meeting / Discovery Stage Intelligence**
**Goal:** Deepen financial and strategic understanding before/after discovery call

**Data Sources Activated:**
- Financial Reports: SEC filings (if US), annual reports, earnings transcripts
- Industry Reports: Gartner, Forrester on their sector + IT spending trends
- Strategic Signals: Press releases, investor presentations, patent filings
- Regulatory Filings: If public, track capex budgets, IT mentions
- LinkedIn Recruiter: Track IT hiring trends (engineering, ops roles)
- Competitor Intelligence: Who they're buying from (job posts, case studies)

**Enrichment Points:**
- Confirmed revenue & growth trajectory
- IT budget clues (hiring, partnerships, vendor announcements)
- Strategic priorities (digital transformation, cloud migration, etc.)
- Published roadmaps or strategic statements
- Regulatory constraints (industry-specific)

**Sales Agent Input (captured post-discovery call):**
- Attendees & their roles
- Confirmed requirements (agent/license count, integrations needed)
- Current platform(s) & pain points with each
- Budget allocated & approval timeline
- Decision criteria & decision makers
- Next steps agreed

**AI Output:**
- **Fit Assessment:** How well do our capabilities match their stated needs?
- **Competitive Threat Analysis:** Who are they likely comparing us to? Why might they choose competitor X?
- **Budget Realism Check:** Is the stated budget aligned with scope? Red flags?
- **Decision Process Timeline:** When must we move to stay in consideration?
- **Risk Assessment:** Cultural fit, technical readiness, change appetite

**Database Schema:**
```
OpportunityProfile.discoveryIntelligence = {
  financialContext: {
    revenue: number,
    ytdGrowth: number,
    itBudgetEstimate: number,
    capexTrend: string
  },
  strategicContext: {
    publishedPriorities: string[],
    industryTailwinds: string[],
    regulatoryConstraints: string[]
  },
  agentDiscovery: {
    attendees: Contact[],
    requirements: string[],
    incumbentPlatforms: string[],
    budgetConfirmed: number,
    timeline: string,
    decisionCriteria: string[]
  },
  aiSynthesis: {
    fitScore: number,
    competitiveThreats: string[],
    budgetRealismFlag: string,
    decisionTimelineRisk: string,
    nextBestAction: string
  }
}
```

---

### **WAVE 27: Qualification / Solutioning Intelligence**
**Goal:** Competitive differentiation & customized positioning

**Data Sources Activated:**
- Competitive Intelligence: What competitor platforms do they mention?
- Use-case Benchmarks: Gartner reports on incident mgmt, change mgmt, etc.
- Platform Comparison: Feature parity analysis vs. incumbent
- Cost Models: Analyze their budget against industry benchmarks
- Technical Debt Signals: From discovery, infer what they're struggling with

**Enrichment Points:**
- Detailed incumbent comparison (cost, features, pain points)
- Specific use-case gaps (incident SLA failures → HaloITSM incident module)
- ROI opportunity areas (where we save them money/time)
- Change management risk (culture, technical readiness)

**Sales Agent Input:**
- Demo feedback ("loved the self-service portal", "concerned about API")
- Technical requirements discovered in deeper conversations
- Champion's specific pain point (what keeps them up at night?)
- Risk factors (change resistance, budget politics, competing initiatives)
- Competitive moves (heard they're talking to Freshservice)

**AI Output:**
- **Personalized Positioning:** "You mentioned incident SLA breaches — HaloITSM's AI-driven escalation prevents 40% of those"
- **Objection Pre-emption:** "They'll ask about feature X. Here's how to position Y as superior for their use case."
- **Win/Loss Signals:** "Based on their budget, team size, and pain points, they're 72% likely to close if we move fast."
- **Competitive War Card:** "If Freshservice comes in, here's the specific angle they'll use and how to counter."

**Database Schema:**
```
OpportunityProfile.qualificationIntelligence = {
  competitiveContext: {
    knownIncumbent: string,
    competitorInEvaluation: string[],
    incumbentCost: number,
    incumbentPainPoints: string[]
  },
  useCaseFit: {
    topPainPoint: string,
    ourSolutionAngle: string,
    roiOpportunity: string,
    changeManagementRisk: string
  },
  agentLearnings: {
    championPainPoint: string,
    demoFeedback: string[],
    technicalConcerns: string[],
    competitiveIntel: string,
    riskFactors: string[]
  },
  aiSynthesis: {
    personalizedPositioning: string[],
    objectionPreemption: {
      objection: string,
      rebuttal: string
    }[],
    winProbabilityScore: number,
    competitiveWarCard: string,
    proposalTheme: string
  }
}
```

---

### **WAVE 28: Proposal & Negotiation Intelligence**
**Goal:** Hyper-personalized proposal & negotiation strategy

**Data Sources Activated:**
- Deal-specific: All prior intelligence synthesized
- Negotiation History: What worked with similar prospects?
- Pricing Benchmarks: What do similar-sized orgs pay?
- Legal/Compliance: Any regulatory hurdles in their industry?

**Enrichment Points:**
- Pricing sensitivity (are they penny-pinching or budget-constrained?)
- Deal structure (annual vs. multi-year, module phasing?)
- Commercial terms they care about (SLAs, support hours, etc.)

**Sales Agent Input:**
- Proposal reviewed internally (CFO concerns? Technical objections?)
- Negotiation moves (asked for 20% discount, wants custom integrations)
- Stalled signals (quiet, slow to respond, no decision date set)
- Accelerator signals (excitement, internal alignment, budget approved)

**AI Output:**
- **Proposal Personalization:** Generate exec summary referencing their specific pain points & ROI
- **Negotiation Playbook:** "If they push on price, counter with value angle X (SLA improvement = $500k savings)"
- **Stall/Accelerator Signals:** "No response in 5 days = stall risk. Suggest executive business review."
- **Win Conditions:** "Close if: decision made by [date], CFO approves [budget], we include [feature]"

**Database Schema:**
```
DealStageWorkflow.proposalIntelligence = {
  proposalPersonalization: {
    executiveSummary: string,        // personalized to their pain points
    roiCallout: string,
    comparisonVsIncumbent: string,
    implementationTimeline: string
  },
  negotiationStrategy: {
    likelyObjections: {
      objection: string,
      counterArg: string,
      concession: string
    }[],
    priceFlexibility: "low" | "medium" | "high",
    dealStructureOptions: string[],
    closeDate: Date,
    winConditions: string[]
  },
  dealHealthSignals: {
    momentum: "accelerating" | "stable" | "stalled",
    riskFlags: string[],
    nextMilestone: string,
    daysInStage: number
  }
}
```

---

## Implementation Phases

### **Phase 1: Foundations (Waves 25-26) — 10 weeks**
1. Wire stage-triggered intelligence refresh into deal lifecycle
2. Add sales agent input forms at each stage (call notes, requirements, incumbent details)
3. Build stage-specific AI synthesis endpoints
4. Update OpportunityProfile sidebar to show stage-specific insights

### **Phase 2: Competitive Intelligence (Wave 27) — 6 weeks**
1. Competitive war card database (incumbent comparisons, ROI models)
2. Personalized positioning engine
3. Objection pre-emption cards

### **Phase 3: Negotiation & Close (Wave 28) — 6 weeks**
1. Deal health scoring (momentum + risk flags)
2. Negotiation playbooks
3. Stall/accelerator detection & automation

---

## Key Enablers (Already Built)
- ✅ Company research with SerpAPI (Wave 22 foundation)
- ✅ Buyer intent scoring (Wave 22)
- ✅ Contact intelligence (Wave 21)
- ✅ OpportunityProfile model with extensible Json fields
- ✅ Deal stage progression with gates
- ✅ AI integration (Claude Haiku/Sonnet for synthesis)

---

## User Experience Flow

**Sales Rep Journey:**

1. **Prospecting:** "Here's what we learned about {Company}"
   - Research summary
   - Buyer intent score
   - Suggested discovery questions
   - Suggested first contact

2. **Pre-Meeting:** "Here's what we know going into this call"
   - Financial context (revenue, growth, IT spend)
   - Strategic priorities (from press releases, reports)
   - Suggested talking points

3. **Discovery (post-call):** "Capture what you learned"
   - Form: Attendees, requirements, incumbent, budget, timeline
   - AI synthesizes fit, competitive threats, risk
   - Suggested next steps

4. **Qualification:** "Here's how to position against {Incumbent}"
   - Personalized positioning for their specific pain point
   - Competitive comparison
   - Demo feedback synthesis
   - Win probability score

5. **Proposal:** "Here's your personalized proposal outline"
   - Exec summary personalized to their pain points
   - ROI focused on what matters to them
   - Pricing aligned with their deal structure preference

6. **Negotiation:** "Here's your negotiation playbook"
   - Expected objections + counters
   - Stall/accelerator signals
   - Win conditions checklist

---

## Success Metrics

- **Deal velocity:** Days to close (shortened by 20%?)
- **Win rate:** Higher close rates (better informed positioning)
- **Sales efficiency:** Time spent researching vs. selling
- **Forecast accuracy:** Better pipeline predictability (better signals)

---

## Not Included

- Dark mode (parked until later)
- Complex admin consoles (keep it simple for reps)
- Overly complex AI models (keep execution cost low)

---

## Next Step

Once Wave 22-24 ship and stabilize, we have two paths:

**Path A (Recommended):** Start Wave 25 immediately
- Focus on prospecting + pre-meeting intelligence
- Build the foundation for all subsequent stages
- High impact for early deals

**Path B:** Stabilize current features first
- Let Wave 22-24 soak for 2-3 weeks
- Gather user feedback
- Then launch Wave 25

---

## Estimated Timeline

- **Waves 25-28:** 22 weeks total
- **Cost per wave:** 20-30k tokens
- **Expected launch:** Q3-Q4 2026

This is a major product differentiator — positioning Stratwyze as the "AI-powered deal accelerator" in the ITSM sales space.
