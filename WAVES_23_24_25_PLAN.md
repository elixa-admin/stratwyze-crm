# Waves 23–25 Detailed Implementation Plan
## Progressive Sales Intelligence Engine: Phase 1

**Vision:** Build the foundation of stage-driven prospect intelligence enrichment. Each wave adds a new stage's worth of data gathering, sales agent input, and AI synthesis.

**Focus Priority:** Functionality > AI capability > theme elevation (no dark mode)

---

## WAVE 23: Prospecting Stage Intelligence
**Duration:** 2 weeks | **Tokens:** ~22k | **Goal:** Build initial intelligence gathering from public research

### Deliverables

#### 1. Sales Agent Input Form (Prospecting)
**Component:** `ProspectingAgentInputForm.tsx`
- Triggered when deal enters "Prospecting" stage
- Fields:
  - `outreachSource` (dropdown: inbound/outbound/referral/event)
  - `firstContactName` (text)
  - `firstContactRole` (dropdown: CEO/CTO/CFO/VP IT/IT Manager/Other)
  - `initialPainPointHypothesis` (textarea)
  - `urgencySignals` (multi-select: hiring growth/news/website mentions/other)
- Save to `DealStageWorkflow.prospectingAgentInput`
- Show when deal transitions to Prospecting OR on demand

#### 2. Prospecting Intelligence Card (OpportunityProfile Sidebar)
**Component:** `ProspectingIntelligenceCard.tsx`
- Auto-populate after company research (Wave 22 already gives us research data)
- Display sections:
  - **Buyer Intent** (from Wave 22 — buyer intent score, signals)
  - **Company Snapshot** (industry, HQ, employee range, revenue estimate)
  - **Service Offerings** (from research)
  - **Research Sources** (count: how many sources found this data)
  - **Discovery Questions** (5 auto-generated from research + pain point hypothesis)
  - **Suggested First Contact** (from leadership inference + role matching)
  - **Key Actions** (schedule discovery call, send welcome email with research)

#### 3. AI Synthesis: Discovery Questions Generator
**Endpoint:** `POST /api/deals/[id]/intelligence/prospecting`
**Input:** 
- `companyResearch` (from Wave 22)
- `buyerIntentBreakdown` (from Wave 22)
- `agentInput` (outreach source, pain hypothesis)
- `accountContext` (industry, size, etc.)

**Output:**
```typescript
interface ProspectingIntelligence {
  buyerIntentScore: number;
  buyerIntentLabel: 'Burning' | 'Hot' | 'Warm' | 'Cold';
  companySnapshot: { /* from research */ };
  inferredLeadership: {
    title: string;
    relevance: string;
    likelyName?: string;
  }[];
  discoveryQuestions: string[]; // 5 questions tailored to industry + pain point
  researchConfidence: 'High' | 'Medium' | 'Low';
  suggestedApproach: string; // "For a {industry} company at {size} with {pain point}, lead with..."
}
```

**Claude Prompt:**
```
You are a sales intelligence analyst. Based on this company research and buyer intent signals, 
generate 5 discovery questions that would help qualify this prospect. 
Questions should be specific to their industry ({industry}), size ({employees}), 
and apparent pain point ({painHypothesis}).

Also suggest the first contact role most likely to influence platform selection 
(usually CTO for platform eval, CFO for budget, IT Manager for ops).

Return JSON with discoveryQuestions[] and suggestedContactRole.
```

#### 4. Database Schema Update
```prisma
model DealStageWorkflow {
  // ... existing fields ...
  
  prospectingAgentInput Json? // {outreachSource, firstContactName, initialPainHypothesis}
  prospectingIntelligence Json? // {buyerIntentScore, discoveryQuestions, suggestedContactRole}
}
```

#### 5. UI Integration
- **Where:** Deal detail page, OpportunityProfile sidebar
- **Trigger:** Auto-populate when deal created + research runs
- **Manual trigger:** Refresh button on card to re-run synthesis with new agent input

### Testing Checklist
- [ ] Create new deal with company research
- [ ] Buyer Intent Card shows on sidebar (from Wave 22)
- [ ] Prospecting Agent Input form appears when stage = Prospecting
- [ ] Submit agent input → saves to DB
- [ ] Prospecting Intelligence Card shows discovery questions
- [ ] Discovery questions are contextual to company + pain point
- [ ] Suggested contact role makes sense for the company

### Success Metrics
- Discovery questions are used by sales rep (measure via CRM note entry)
- Time to first discovery call shortened (measure from deal creation to first call)
- Sales rep satisfaction with discovery questions (form feedback)

---

## WAVE 24: Pre-Meeting / Discovery Stage Intelligence
**Duration:** 2 weeks | **Tokens:** ~25k | **Goal:** Deepen financial + strategic understanding during/after discovery call

### Deliverables

#### 1. Discovery Call Debrief Form
**Component:** `DiscoveryDebriefForm.tsx`
- Appears after discovery call (manually triggered or auto-suggested after stage transition)
- Sections:

**Call Details:**
- `callDate` (date)
- `attendees` (multi-select contacts + roles)
- `callDuration` (minutes)
- `callNotes` (textarea — for notes/transcript paste)

**Discovery Learnings:**
- `confirmedRequirements` (multi-select: incident mgmt / change mgmt / asset mgmt / service portal / problem mgmt / knowledge mgmt / hr service / project mgmt)
- `agentLicenseCountEstimate` (number)
- `currentPlatform` (text — incumbent)
- `incumbentPainPoints` (multi-select: slow SLA processing / manual escalations / poor portal UX / limited reporting / expensive / other)
- `confirmedBudgetRange` (dropdown: <100k / 100-250k / 250-500k / 500k-1m / 1m+)
- `budgetApprovalTimeline` (text: when budget can be approved)
- `decisionProcessSteps` (textarea: VP IT → CFO → Board? Any other gates?)
- `likelyDecisionMakers` (multi-select contacts)
- `nextMeetingNeeded` (boolean)
- `nextMeetingFocus` (text if true)

**Competitive Intel:**
- `competitors_considering` (multi-select: ServiceNow / Jira Service Management / Freshservice / BMC Helix / Other)
- `whyConsidering` (text: what gaps are they looking to fill?)

**Risk Assessment:**
- `internalChampion` (select contact who will drive internally)
- `technicalReadiness` ('High' | 'Medium' | 'Low')
- `changeAppeititeSetting` ('High' | 'Medium' | 'Low')
- `otherCompetingPriorities` (text: what else is fighting for budget/attention?)

#### 2. Discovery Intelligence Card (OpportunityProfile Sidebar)
**Component:** `DiscoveryIntelligenceCard.tsx`
- Shows after discovery call debrief submitted
- Displays:
  - **Call Summary** (date, attendees, duration)
  - **Confirmed Requirements** (modules they need)
  - **Current Setup** (incumbent platform + pain points)
  - **Budget Confirmed** (R[amount], approval timeline)
  - **Decision Process** (who, in what order)
  - **Risk Flags** (low technical readiness? competing priorities?)
  - **AI Synthesis: Fit Score** (0-100 based on requirements match)
  - **AI Synthesis: Competitive Threats** (if ServiceNow in eval, that's high risk)
  - **Next Actions** (send requirements summary, schedule technical discovery, etc.)

#### 3. AI Synthesis: Fit Assessment + Competitive Analysis
**Endpoint:** `POST /api/deals/[id]/intelligence/discovery`
**Input:**
- `discoveryDebrief` (form data from above)
- `prospectingIntelligence` (from Wave 23)
- `companyContext` (from Wave 22)

**Output:**
```typescript
interface DiscoveryIntelligence {
  callSummary: {
    date: Date;
    attendees: {name: string; role: string}[];
    duration: number;
  };
  confirmedContext: {
    requirements: string[];
    agentCount: number;
    incumbentPlatform: string;
    incumbentPainPoints: string[];
    budgetConfirmed: number;
    decisionTimeline: string;
  };
  fitAssessment: {
    fitScore: number; // 0-100
    fitRationale: string; // "Score is high because you need incident + change, which are our core modules"
    missingCapabilities: string[]; // if any
    overlyBroadRequirements: string[]; // if any (feature creep risk)
  };
  competitiveContext: {
    competitorsInEvaluation: string[];
    likelyCompetitiveAngles: string[]; // "ServiceNow will emphasize enterprise scale"
    ourCounterPosition: string[]; // "We position on speed + ease + cost for mid-market"
    riskLevel: 'High' | 'Medium' | 'Low';
  };
  decisionRiskFactors: {
    technicalReadiness: string; // "Low — no cloud infrastructure yet. Implementation will be complex."
    changeAppetite: string; // "Medium — some resistance from ops team, but champion (John) is driving change"
    competingPriorities: string; // "Budget also being requested for vendor platform migration — timing risk"
    timeline: string; // "Decision needed by Q3, 90 days to decide"
  };
  nextBestActions: string[]; // ["Schedule technical architect call", "Send ROI comparison for their setup"]
}
```

**Claude Prompt:**
```
You are a deal analyst. Based on this discovery call debrief, assess how well our solution fits this prospect.

They need: {requirements}
Incumbent: {incumbent} → Pain: {pain}
Budget: {budget}, Timeline: {timeline}
Competitors in eval: {competitors}

Provide:
1. Fit score (0-100) + rationale
2. Competitive risk assessment — if they're looking at ServiceNow, emphasize our advantages in speed/cost/mid-market focus
3. Risk factors — low technical readiness? Change resistance? Competing budget priorities?
4. Next best actions to keep this deal moving

Return JSON with fitScore, fitRationale, competitiveContext, riskFactors, nextBestActions[].
```

#### 4. Database Schema Update
```prisma
model DealStageWorkflow {
  // ... existing fields ...
  
  discoveryDebriefInput Json? // {callDate, attendees, requirements, incumbent, budget, ...}
  discoveryIntelligence Json? // {fitScore, fitRationale, competitiveContext, riskFactors}
}
```

#### 5. Dashboard / Activity Feed Integration
- Show "Discovery Debrief Submitted" in deal activity timeline
- Pin top discovery insights to deal header (Fit Score, Competitive Risk, Next Action)

### Testing Checklist
- [ ] Deal in Discovery stage → Debrief form appears
- [ ] Submit form with comprehensive discovery data
- [ ] DiscoveryIntelligenceCard populates on sidebar
- [ ] Fit score is calculated and displayed
- [ ] Competitive risk warnings appear if competitor is in eval
- [ ] Next best actions are contextual and actionable
- [ ] If high risk factor (low tech readiness), warning is highlighted

### Success Metrics
- Fit score correlates with actual close rate (validate after 20 deals)
- Sales reps use competitive risk warnings in follow-up calls (measure via notes)
- Time to decision shortened (opportunity created → decision made timeline)

---

## WAVE 25: Qualification / Solutioning Stage Intelligence
**Duration:** 2.5 weeks | **Tokens:** ~28k | **Goal:** Competitive differentiation + personalized positioning

### Deliverables

#### 1. Demo Feedback Form
**Component:** `DemoFeedbackForm.tsx`
- Appears after demo/technical discovery
- Fields:
  - `demoDate` (date)
  - `attendees` (text: who attended from their side)
  - `demoFeedback` (textarea: what did they like? concerns?)
  - `featureInterest` (multi-select: which modules got most engagement?)
  - `competitiveComments` (text: did they mention other tools? "Freshservice doesn't have this…")
  - `technicalConcerns` (multi-select: API / scalability / integrations / reporting / other)
  - `nextStepsProposed` (text: what did you propose? timeline?)
  - `championSentiment` (dropdown: 'Very Positive' / 'Positive' / 'Neutral' / 'Concerned')
  - `competitorMovements` (text: did you learn anything about competitive moves?)

#### 2. Qualification Intelligence Card (OpportunityProfile)
**Component:** `QualificationIntelligenceCard.tsx`
- Displays:
  - **Demo Summary** (what resonated, what concerned them)
  - **Competitive Positioning** (vs. incumbent + other eval'd tools)
  - **Personalized Value Prop** (customized to THEIR pain points + requirements)
  - **Objection Pre-emption** ("They'll ask about integration costs — here's the counter")
  - **Win Probability Score** (0-100)
  - **Recommendation** (proceed to proposal, need more discovery, high risk)

#### 3. AI Synthesis: Personalized Positioning + Objection Pre-emption
**Endpoint:** `POST /api/deals/[id]/intelligence/qualification`
**Input:**
- `demoFeedback` (form data)
- `discoveryIntelligence` (from Wave 24)
- `prospectingIntelligence` (from Wave 23)

**Output:**
```typescript
interface QualificationIntelligence {
  demoSummary: {
    date: Date;
    attendees: string;
    highestEngagementModules: string[];
    keyFeedback: string;
    championSentiment: 'Very Positive' | 'Positive' | 'Neutral' | 'Concerned';
  };
  competitivePositioning: {
    incumbent: string;
    incumbentWeaknesses: string[]; // ["slow incident SLA processing", "poor self-service UX"]
    ourStrengths: string[]; // ["AI-driven escalation", "portal adoption optimization"]
    competitors: {
      name: string;
      ourAdvantage: string; // "We're 3x cheaper and 6 months faster to deploy than ServiceNow"
    }[];
  };
  personalizedValueProposition: string; // "For {company}, the ROI is in incident SLA reduction (40% less breaches) + self-service adoption (reducing 30% of manually logged tickets)"
  
  objectionPreemption: {
    likelyObjection: string; // "Integration with Cherwell will be complex"
    rebuttal: string; // "We have pre-built integrations for Cherwell. Typical integration takes 2 weeks."
    evidence: string; // "similar-sized company did it in 10 days"
  }[];
  
  winProbability: {
    score: number; // 0-100
    rationale: string;
    daysToDecision: number;
    riskFactors: string[]; // ["Competitor X in eval", "CFO needs CFO approval", "Budget tight"]
  };
  
  nextBestActions: string[];
}
```

**Claude Prompt:**
```
You are a sales strategist. Based on their demo feedback, discovery learnings, and competitive context,
generate a personalized positioning strategy for this prospect.

Their pain points: {painPoints}
Incumbent they're leaving: {incumbent}
What worked in demo: {demoFeedback}
Competitors they're considering: {competitors}

Provide:
1. Personalized value prop — specific to THEIR setup, sized ARR loss, not generic "we're fast"
2. 3-5 likely objections + rebuttals (draw from competitor weaknesses)
3. Win probability score (consider tech readiness, budget approval, competing priorities, champion sentiment)
4. Next best actions to move toward proposal

Return JSON with personalizedValueProposition, objectionPreemption[], winProbability.
```

#### 4. Competitive War Card Library
**New Component:** `CompetitiveWarCardModal.tsx`
- Displays when sales rep clicks "Competitive Context" on card
- Shows:
  - Incumbent strengths (why they chose it originally)
  - Incumbent weaknesses (why they're looking to replace)
  - **Our competitive angles:** Speed, cost, ease, AI automation, mid-market focus
  - **Case studies:** [Show 2-3 case studies of similar companies moving from incumbent]
  - **Pricing comparison:** [Simple comparison of cost for their agent count]

#### 5. Solutioning Workflow Integration
**Update existing:** `SolutioningWorkflow.tsx` (from Wave 20)
- Add "Qualification Intelligence" section at top
- Show win probability score, competitive threat level
- Suggest modules based on their stated requirements (from discovery debrief)
- Show personalized positioning as inspiration for proposal design

#### 6. Deal Health Scoring
**New Calculation:**
```
DealHealthScore = (fitScore × 0.3) + (championSentiment × 0.2) + (winProbability × 0.3) + (daysToDecision × 0.2)

Display on deal card in pipeline as color: 
  Green (>75) = Strong, proceed
  Amber (50-75) = Proceed with caution, address risks
  Red (<50) = Reconsider, may not close
```

#### 7. Database Schema Update
```prisma
model DealStageWorkflow {
  // ... existing fields ...
  
  demoFeedbackInput Json? // {demoDate, feedback, concerns, sentiment}
  qualificationIntelligence Json? // {competitivePositioning, personalizedValueProp, objectionPreemption, winProbability}
  dealHealthScore: Int? // 0-100
}
```

#### 8. UI Enhancements
- **Deal Card (Pipeline Kanban):** Show deal health badge + win probability %
- **Deal Header:** Show "Competitive Threat: ServiceNow (High)" if detected
- **OpportunityProfile Sidebar:** Reorder to show Qualification Intel prominently
- **Sidebar Alert:** "Win probability 42% — 3 risk factors. Address before proposal." (if low score)

### Testing Checklist
- [ ] Submit demo feedback → QualificationIntelligenceCard populates
- [ ] Win probability score is displayed
- [ ] Objection pre-emption cards show competitive-specific counters
- [ ] Personalized value prop references their specific pain points (not generic)
- [ ] Deal health score colors pipeline cards correctly
- [ ] Competitive war card modal works and shows useful comparison
- [ ] Solutioning workflow shows suggested modules from their requirements
- [ ] Win probability threshold alerts (if <50, show warning)

### Success Metrics
- Win probability score correlates with actual close rate (validate after 30 deals)
- Sales reps cite objection rebuttals in follow-up calls (measure via notes)
- Deals with high deal health scores close faster than low scores
- Time from qualification to proposal shortened (should be <2 weeks with good intel)

---

## WAVES 23-25 Summary

| Wave | Focus | Sales Agent Touch Points | AI Synthesis | Key Metric |
|------|-------|---------|---|---|
| **23** | Prospecting research + initial contact | Source, pain hypothesis, contact name | Discovery questions, suggested approach | Questions used in first call |
| **24** | Discovery call debrief | Call notes, requirements, budget, competitors | Fit score, competitive risk, next actions | Fit score predicts close rate |
| **25** | Demo feedback + positioning | Demo reaction, objections, champion sentiment | Win probability, personalized value prop, objections | Win prob predicts close |

---

## Token Budget Per Wave

| Wave | Research | Development | Testing | Total |
|------|----------|-------------|---------|-------|
| **23** | 3k | 15k | 4k | **22k** |
| **24** | 3k | 18k | 4k | **25k** |
| **25** | 4k | 20k | 4k | **28k** |
| **Total (23-25)** | 10k | 53k | 12k | **75k** |

**Sprint budget:** 200k  
**Waves 20-22 used:** ~90k  
**Waves 23-25 estimated:** ~75k  
**Remaining for contingency:** ~35k ✅

---

## Development Order

### Week 1-2 (Wave 23)
1. Monday: Schema update + database migration
2. Tuesday-Wednesday: ProspectingAgentInputForm + Discovery questions generator
3. Thursday: ProspectingIntelligenceCard component
4. Friday: Testing + integration with OpportunityProfile sidebar
5. **Ship Friday EOD**

### Week 3-4 (Wave 24)
1. Monday: DiscoveryDebriefForm component
2. Tuesday: Fit Assessment AI synthesis endpoint
3. Wednesday-Thursday: DiscoveryIntelligenceCard component + integration
4. Friday: Testing + competitive risk warnings
5. **Ship Friday EOD**

### Week 5-7 (Wave 25)
1. Monday: DemoFeedbackForm component
2. Tuesday-Wednesday: Personalized positioning + objection AI synthesis
3. Thursday: QualificationIntelligenceCard + War Card modal
4. Friday Week 6: Solutioning workflow integration + deal health scoring
5. Monday-Friday Week 7: Testing, edge cases, refinement
6. **Ship Friday Week 7 EOD**

---

## Risk Mitigation

**Risk:** AI synthesis gets expensive (too many API calls)  
**Mitigation:** Cache synthesis results; only re-run if form inputs change

**Risk:** Sales reps don't use forms (friction)  
**Mitigation:** Auto-suggest form when deal stage changes; make forms 2-min to complete

**Risk:** Data quality issues (bad debrief notes)  
**Mitigation:** Validation on key fields (budget, requirements); flag missing data

**Risk:** Win probability doesn't correlate with actual closes  
**Mitigation:** Track prediction accuracy after 20 deals; adjust scoring formula

---

## Success Criteria (All 3 Waves Complete)

- ✅ Sales reps using debrief forms for >80% of deals
- ✅ Win probability score correlates with close rate (R² > 0.6)
- ✅ Average deal cycle time reduced by 15%
- ✅ Reps report "felt more prepared going into calls" (qualitative feedback)
- ✅ No performance regressions in deal creation or pipeline views
- ✅ All components load in <2 seconds even with complex data

---

## Deployment Strategy

- **Wave 23:** Ship with beta label; optional for reps to use
- **Wave 24:** Upgrade beta to standard feature; encourage adoption
- **Wave 25:** Make all forms part of standard workflow; gates progression

---

## Go-Live Checklist (Per Wave)

- [ ] Database migration successful + verified
- [ ] All AI endpoints tested (happy path + edge cases)
- [ ] Components render without TypeScript errors
- [ ] OpportunityProfile sidebar shows new intelligence
- [ ] Deal cards update in pipeline (if health score added)
- [ ] Sales reps trained on new forms (1-page guide)
- [ ] Deployed to production + monitoring alerts set
- [ ] First 5 deals use new features; feedback collected
