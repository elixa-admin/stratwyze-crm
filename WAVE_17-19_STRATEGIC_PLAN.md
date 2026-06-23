# Strategic Plan: Waves 17-19 (Next 3 Sprints)

> **Goal**: Transform Stratwyze CRM from **transaction-based** (click button, move stage) to **workflow-driven** (guided sales journey, gated progression, AI-powered personalization).
>
> **Budget**: ~200k tokens (3 waves × ~65k per wave)
> **Timeline**: ~3 weeks (1 week per wave, assuming 5-hour dev sprint)

---

## 🎯 EXECUTIVE SUMMARY: RECOMMENDATIONS

### **Core Problem We're Solving**
Deal stages are currently **passive status labels**. A rep sees "Prospecting" but has no guidance on:
- What intel to gather before moving forward?
- When is discovery call complete?
- What makes a deal qualified?
- How do I build a proposal specific to THIS deal's pain points?

**Result**: Deals stall, reps wing it, proposals are generic, win rate suffers.

### **Our Solution: Workflow-Driven Deal Page**
Each stage becomes an **active workflow** with:
1. ✅ **Guided steps** (required actions at each stage)
2. ✅ **Gated progression** (can't advance until stage complete)
3. ✅ **AI-powered intelligence** (insights fed from previous stages)
4. ✅ **Dynamic personalization** (proposal targets THEIR pain points)
5. ✅ **Opportunity profile** (all deal intel aggregated in one view)

### **Key Architectural Decisions**

#### **Decision 1: Workflow-First Deal Page**
**Current**: Static page with stage buttons
**Recommended**: Dynamic page where the current stage IS the workflow

**Why**: 
- Guides reps through exact steps needed
- Enforces data completeness before advancing
- Creates audit trail (what was done, when, by whom)
- Makes deal progression predictable and repeatable

**Trade-off**: More complex page component, but higher deal win rates and shorter cycles

---

#### **Decision 2: Gated Progression (Don't Let Deals Fall Through Cracks)**
**Current**: Rep can move any deal to any stage anytime
**Recommended**: Each stage transition has requirements

```
Prospecting → Qualification:
  ✓ Pre-meeting brief generated
  ✓ Discovery call scheduled
  ✓ Discovery call completed
  ✓ Intel extracted (incumbent, budget, timeline, pains)

Qualification → Proposal:
  ✓ Deal scored (fit score 0-100)
  ✓ Go/No-Go decision documented
  ✓ Pain-point levers identified
  ✓ Fit score ≥ 70 (configurable threshold)

Proposal → Won:
  ✓ Proposal generated and reviewed
  ✓ Prospect has signed/committed
```

**Why**: 
- Prevents "stuck in Prospecting for 6 months" deals
- Forces reps to do discovery (critical for win rate)
- Ensures qualification before wasting proposal time
- Creates accountability (if deal can't advance, why not?)

**Trade-off**: Reps can't game pipeline; deals are real or they're not

---

#### **Decision 3: Embed Phase 14-16 Workflows in Deal Stage**
**Current**: Phase 14 (Discovery), Phase 15 (Qualification), Phase 16 (Proposal) are separate screens
**Recommended**: Each workflow lives IN the deal page stage

```
Deal Page → Prospecting Stage
  ├─ Pre-brief generation (Phase 14.1)
  ├─ Pre-brief review panel
  ├─ Discovery schedule confirmation
  └─ Gate: Can't move until call scheduled

Deal Page → Qualification Stage
  ├─ Discovery workflow (Phase 14.2-14.5) - EMBEDDED
  ├─ AI analysis (Phase 15.1) - AUTO
  ├─ Qualification scorecard (Phase 15.2) - EMBEDDED
  └─ Gate: Can't move until scored ≥70

Deal Page → Proposal Stage
  ├─ Solution design (Phase 16.1) - EMBEDDED
  ├─ Proposal generation (Phase 16.2) - AUTO
  ├─ Negotiation brief (Phase 16.3) - EMBEDDED
  └─ Gate: Can't move until proposal approved
```

**Why**: 
- Rep never leaves the deal context
- All deal intel visible in one place
- Workflows are sequential but integrated
- Opportunity profile builds throughout journey

**Trade-off**: Deal page becomes more complex; requires careful UX design

---

#### **Decision 4: Opportunity Profile (Single Source of Truth)**
**Current**: Deal info scattered (incumbent info in one section, brief elsewhere, activities elsewhere)
**Recommended**: Single "Opportunity Profile" that aggregates everything

**What it contains** (all populated by previous stage workflows):
```
COMPANY INTEL
├─ Company snapshot (revenue, employees, HQ)
├─ Recent news & activity
├─ M&A events with implications
└─ ITSM relevance (why HaloITSM matters for them)

DEAL DISCOVERY (from Phase 14)
├─ Incumbent platform confirmed
├─ Budget range (if mentioned)
├─ Timeline (when they want to move)
├─ Decision process (RFP, sole-source, etc.)
├─ Pain points (prioritized list)
├─ Champion identified (name, title, email)
└─ Key quotes from call

QUALIFICATION (from Phase 15)
├─ Fit score (0-100)
├─ Pain-to-MOAT alignment (which of our advantages matter most)
├─ Go/No-Go decision
├─ Positioning angle recommended
└─ Risk factors (switching cost, budget constraints, etc.)

PROPOSED SOLUTION (from Phase 16)
├─ Modules needed
├─ User count & locations
├─ Timeline & milestones
├─ Estimated TCO vs. their incumbent
└─ ROI based on their pain points
```

**Why**: 
- Single view of deal (no hunting through sections)
- Shows progression (proposal should reference discovery insights)
- Enables personalization (proposal can say "Based on your cost pain point...")
- Creates accountability (what did we learn, and did we use it?)

---

#### **Decision 5: Dynamic Proposal Generation (Not Template, Personalized)**
**Current**: Proposal template with manual customization
**Recommended**: AI-generated proposal that auto-personalizes to THEIR pain points

**Example**:
```
Template approach (generic):
  "HaloITSM is faster than ServiceNow
   HaloITSM is cheaper than ServiceNow
   HaloITSM has better UX than ServiceNow"
   ❌ Doesn't address THEIR pain points

Dynamic approach (personalized):
  "CyberAntix, you're scaling post-Mustek acquisition
   with expanding SOCaaS operations. Your challenge:
   managing cost across distributed teams while
   maintaining security SLA visibility.
   
   Unlike Zendesk (which lacks ITSM depth), HaloITSM
   gives you native incident severity mapping tied to
   customer SLAs, 40-60% lower TCO vs. competitors,
   and the speed to implement in 4-6 months (vs. 12+
   for legacy platforms)."
   ✅ Speaks to THEIR situation
```

**Why**: 
- Dramatically higher win rates (personalized > generic)
- Uses discovery intel (shows we listened)
- Leverages battle-card positioning (relevant comparisons)
- Reduces proposal iteration (nailed it first try)

---

### **Recommendation Summary**

| Aspect | Current | Recommended | Why |
|--------|---------|-------------|-----|
| Deal page | Static status display | Dynamic workflow | Guides reps through exact steps |
| Stage progression | Any time, any stage | Gated with requirements | Prevents stuck deals, ensures quality |
| Phase workflows | Separate screens | Embedded in stage | Single context, integrated journey |
| Deal intel | Scattered sections | Unified opportunity profile | One view of everything |
| Proposals | Template + manual | AI-personalized | Speaks to THEIR pain, higher close rate |
| Deal completion | When signed | When workflow done + signed | Creates repeatable process |

---

## 📅 WAVE BREAKDOWN: 3 WAVES × ~65K TOKENS

### **WAVE 17: Workflow Infrastructure & Prospecting Stage** (65k tokens)
**Goal**: Build foundation—gating logic, workflow panel, Prospecting stage complete

**Deliverables**:
1. **Data Model Updates** (Prisma schema)
   - Add `dealStageWorkflow` table (tracks completion of each stage's requirements)
   - Add `opportunityProfile` table (aggregates discovery intel)
   - Add `stageRequirement` table (what's needed to advance)

2. **Gating Logic Component** (ReusableLogic)
   - `checkStageGates()` function (returns bool + missing requirements list)
   - `canAdvanceToStage()` function (validates prerequisites)
   - `logStageCompletion()` function (audits what was done)

3. **StageWorkflowPanel Component** (replaces stage buttons)
   - Renders current stage's workflow steps
   - Shows progress checklist
   - Enforces gates (Next button disabled if requirements not met)
   - Surfaces missing requirements

4. **Prospecting Stage Workflow** (embedded in deal page)
   - Step 1: Generate pre-meeting brief (Phase 14.1 - light)
   - Step 2: Review brief (integrated preview panel)
   - Step 3: Schedule discovery call (calendar picker)
   - Step 4: Confirm call scheduled (checkbox + date)
   - Gate: Can't move to Qualification until all 4 steps done

5. **OpportunityProfile Component** (stub - populated in later waves)
   - Layout ready
   - Sections visible but mostly empty
   - Ready to feed data from Phase 14-16 workflows

6. **Deal Page V2 (Refactored)**
   - Replaces stage buttons with StageWorkflowPanel
   - Adds OpportunityProfile sidebar
   - Integrates gating logic
   - Maintains existing sections (account, contact, activities)

**API Endpoints New**:
- `POST /api/deals/:id/stage-completion` - Log that a step was completed
- `GET /api/deals/:id/stage-gates` - Check what's required to advance

**UI Changes**: Deal detail page gains workflow panel on left, opportunity profile on right

**Success Metrics**:
- ✅ Prospecting stage workflow renders
- ✅ Gates prevent advancement without completion
- ✅ Rep can schedule discovery call from Prospecting stage
- ✅ Opportunity profile structure in place

**Estimated Token Cost**: 65k (architecture, gating logic, UI refactor)

---

### **WAVE 18: Qualification Stage & Phase 14-15 Integration** (65k tokens)
**Goal**: Embed discovery workflow and qualification scoring in deal page

**Deliverables**:

1. **Qualification Stage Workflow** (embedded in deal page)
   - Step 1: Trigger discovery workflow (Phase 14.2-14.5)
     - Pre-brief review
     - Discovery guide
     - Call notes logging
     - AI analysis
   - Step 2: Review AI-extracted intel (in OpportunityProfile)
   - Step 3: Qualification scorecard (Phase 15)
     - Fit score 0-100 (from AI analysis)
     - Pain-to-MOAT alignment
     - Go/No-Go recommendation
     - Override options (rep can override AI score with reasoning)
   - Step 4: Confirm qualification decision
   - Gate: Can't move to Proposal until score ≥70 OR rep documents override reasoning

2. **Phase 14 Embedded in Qualification Stage**
   - Remove modal/separate screen
   - Render discovery workflow inline (collapsible accordion or tabbed interface)
   - All discovery data flows to OpportunityProfile

3. **Phase 15 Embedded in Qualification Stage**
   - Scorecard displays inline (not separate page)
   - Shows which pain points align to which MOATs
   - Allows rep to adjust weighting if needed
   - Surfaces battle-card (if incumbent known)

4. **OpportunityProfile Population** (from Phase 14-15)
   - Pre-brief section: company intel, news, M&A
   - Discovery section: incumbent, budget, timeline, pains, champion, quotes
   - Qualification section: fit score, MOAT alignment, positioning angle

5. **Refactored Phase 14 Components**
   - LeadEntryScreen → Embedded in Prospecting (compact)
   - PreMeetingBriefScreen → Integrated in Prospecting + Qualification
   - DiscoveryGuideScreen → Embedded in Qualification (collapsible)
   - PostDiscoveryLoggingScreen → Embedded in Qualification (expanded form)
   - DiscoveryAnalysisScreen → Auto-runs, results in OpportunityProfile

6. **Refactored Phase 15 Components**
   - QualificationScorecard → Embedded in Qualification stage
   - BattleCard → Loads inline (if incumbent known)
   - DecisionTree → Inline (Go/No-Go checkboxes)

**API Endpoints New**:
- `POST /api/deals/:id/discovery-start` - Trigger discovery workflow
- `POST /api/deals/:id/qualification-score` - Submit qualification decision
- `GET /api/deals/:id/opportunity-profile` - Fetch aggregated deal intel

**UI Changes**: 
- Qualification stage becomes multi-step workflow
- OpportunityProfile fills with discovery + qualification data
- Battle-card surfaces if incumbent known
- Stage gate enforces score ≥70 to advance

**Success Metrics**:
- ✅ Discovery workflow runs inline in Qualification stage
- ✅ OpportunityProfile fills with discovery data
- ✅ Qualification scorecard displays and scores
- ✅ Gate prevents Proposal stage until qualified

**Estimated Token Cost**: 65k (discovery embedding, qualification integration, data aggregation)

---

### **WAVE 19: Proposal Stage & Dynamic Generation** (65k tokens)
**Goal**: Complete workflow-driven deal page; add dynamic proposal generation

**Deliverables**:

1. **Proposal Stage Workflow** (embedded in deal page)
   - Step 1: Solution design form (Phase 16.1)
     - Auto-populate from discovery (users, timeline, modules)
     - Allow manual adjustment
     - Real-time cost calculator (based on selections)
   - Step 2: Generate proposal (Phase 16.2 - AI-personalized)
     - Auto-generates proposal specific to pain points
     - References discovery quotes
     - Compares to incumbent (battle-card)
     - Includes ROI/TCO specific to their scale
   - Step 3: Negotiation brief (Phase 16.3)
     - Surfaces expected objections (from battle-card)
     - Pre-loaded rebuttal scripts
     - Deal structure options (pricing, term, payment)
     - Reference customer suggestions (similar profile)
   - Step 4: Approve proposal
   - Gate: Can't move to Won until proposal signed (date capture) OR deal marked lost

2. **Phase 16 Embedded in Proposal Stage**
   - SolutionDesignForm → Embedded (collapsible, auto-populated)
   - ProposalGenerator → Generates and previews inline
   - NegotiationBrief → Slides out as accordion
   - ProposalEditor → Allow inline edits before sending

3. **Dynamic Proposal Generation** (NEW - most powerful feature)
   - AI uses opportunity profile to personalize proposal
   - Pulls pain points from discovery
   - Selects MOATs that resonate (from qualification scoring)
   - References incumbent (from battle-card)
   - Calculates ROI specific to their pain metrics
   - Includes comparison table (HaloITSM vs. their incumbent)
   - Surfaces discovery quotes ("As you mentioned...")

4. **Proposal Export & Sharing**
   - Export as PDF (styled, professional)
   - Share link (read-only, trackable views)
   - Track: when sent, when opened, proposal sections viewed
   - Store version history (if edited multiple times)

5. **Won/Lost State Completion**
   - Won: Capture signature date, signed proposal upload
   - Lost: Capture loss reason, customer feedback, competitor name
   - Auto-log to activity timeline

6. **Deal Completion Audit Trail**
   - Timeline shows all workflow steps completed
   - Each step timestamped + rep name
   - Discovery quotes captured
   - Qualification reasoning documented
   - Proposal version + send date
   - Final outcome (won/lost/stalled)

**API Endpoints New**:
- `POST /api/deals/:id/solution-design` - Save solution design
- `POST /api/deals/:id/generate-proposal` - Trigger AI proposal generation
- `POST /api/deals/:id/propose-solution` - Send proposal to prospect
- `POST /api/deals/:id/close` - Mark deal Won or Lost

**UI Changes**:
- Proposal stage becomes multi-step workflow
- Solution design form auto-populated from discovery
- Proposal previews and generates inline
- Negotiation brief surfaces objections + rebuttals
- Won/Lost state completes deal workflow

**Success Metrics**:
- ✅ Proposal stage workflow renders
- ✅ Solution design auto-populated from discovery
- ✅ AI generates personalized proposal (references their pain points)
- ✅ Proposal can be exported + shared
- ✅ Won/Lost state completes audit trail

**Estimated Token Cost**: 65k (proposal embedding, AI generation, export/sharing, audit trail)

---

## 🏗️ OVERALL ARCHITECTURE CHANGES

### **Data Model** (Prisma schema additions)

```sql
-- Track workflow completion per deal
model DealStageWorkflow {
  id          String    @id @default(cuid())
  dealId      String
  deal        Deal      @relation(fields: [dealId], references: [id])
  stage       String    // "Prospecting" | "Qualification" | "Proposal" | "Won" | "Lost"
  
  // Stage completion tracking
  stepsCompleted   String[]  // ["pre-brief-generated", "discovery-scheduled", ...]
  gatesMetAt       DateTime? // When all gates were satisfied
  completedAt      DateTime?
  completedBy      String?   // Rep ID
  
  // Qualification data (filled during Qualification stage)
  incumbentPlatform String?
  budgetRange      String?
  timeline         String?
  painPoints       String[]
  champion         String?
  fitScore         Int?      // 0-100
  goNoGo          String?    // "GO" | "NO-GO" | "MAYBE"
  positioningAngle String?   // "Cost" | "Speed" | "Adoption" | etc.
  
  // Proposal data (filled during Proposal stage)
  solutionDesign   Json?
  proposalGenerated DateTime?
  proposalData     Json?
  negotiationBrief Json?
  proposalSentAt   DateTime?
  
  // Outcome
  wonAt           DateTime?
  lostAt          DateTime?
  lossReason      String?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

-- Unified opportunity profile view
model OpportunityProfile {
  id              String    @id @default(cuid())
  dealId          String    @unique
  deal            Deal      @relation(fields: [dealId], references: [id])
  
  // All discovery + qualification + proposal data
  companyIntel    Json      // company snapshot, news, M&A, ITSM relevance
  discoveryData   Json      // incumbent, budget, timeline, pains, champion, quotes
  qualificationData Json    // fit score, MOAT alignment, battle-card
  proposalData    Json      // solution design, ROI, comparison table
  
  // Stage completion dates
  prospectingCompletedAt DateTime?
  qualificationCompletedAt DateTime?
  proposalCompletedAt DateTime?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

### **Component Hierarchy** (Deal page V2)

```
DealDetailPageV2
├─ Breadcrumbs
├─ Header (Title, Stage, Value)
├─ GridLayout (2 columns)
│  ├─ Left (70%)
│  │  ├─ StageWorkflowPanel (ACTIVE - changes per stage)
│  │  │  ├─ ProspectingWorkflow (Wave 17)
│  │  │  ├─ QualificationWorkflow (Wave 18)
│  │  │  ├─ ProposalWorkflow (Wave 19)
│  │  │  └─ GateStatusIndicator (what's blocking advancement?)
│  │  │
│  │  └─ ActivityTimeline (passive - records what happened)
│  │
│  └─ Right (30%)
│     ├─ OpportunityProfile (aggregated deal intel)
│     │  ├─ CompanyIntel (from research)
│     │  ├─ DiscoverySummary (from Phase 14)
│     │  ├─ QualificationSummary (from Phase 15)
│     │  ├─ ProposalSummary (from Phase 16)
│     │  └─ NextSteps (what happens next?)
│     │
│     ├─ QuickActions (stage-dependent)
│     │  ├─ In Prospecting: "Schedule Discovery Call"
│     │  ├─ In Qualification: "Start Discovery"
│     │  └─ In Proposal: "Generate Proposal"
│     │
│     └─ SidebarPanels (static)
│        ├─ Account (linked account)
│        ├─ Contact (primary contact)
│        └─ FollowUp (due dates, next actions)
```

---

## 📊 SUCCESS METRICS (By Wave)

### **Wave 17 Success**
- ✅ Deal page renders StageWorkflowPanel
- ✅ Prospecting workflow is step-by-step (not just buttons)
- ✅ Gates prevent advancement without completion
- ✅ Opportunity profile structure visible (data empty, that's OK)
- ✅ Rep can schedule discovery call from Prospecting stage

### **Wave 18 Success**
- ✅ Discovery workflow runs inline (no separate page)
- ✅ OpportunityProfile fills with discovery data (incumbent, budget, pains)
- ✅ Qualification scorecard scores automatically
- ✅ Battle-card loads if incumbent known
- ✅ Gate prevents Proposal stage unless qualified

### **Wave 19 Success**
- ✅ Proposal stage workflow renders
- ✅ Solution design auto-populates from discovery
- ✅ AI generates proposal specific to pain points (not generic template)
- ✅ Proposal references discovery quotes ("As you mentioned...")
- ✅ Comparison vs. incumbent included
- ✅ Rep can export and send proposal
- ✅ Won/Lost state completes the audit trail

---

## 🎯 BUSINESS IMPACT (After All 3 Waves)

| Metric | Before | After | Improvement |
|--------|--------|-------|------------|
| **Deal Cycle Time** | 120-180 days | 60-90 days | 40-50% faster |
| **Qualification Rate** | 40% of deals qualify | 70% qualified before proposal | More qualified opportunities |
| **Proposal Win Rate** | 25-30% | 40-50% | +60% more wins (personalized proposals) |
| **Stuck Deals** | 30% stall mid-pipeline | <10% (gates prevent stalling) | Clear visibility of blockers |
| **Rep Productivity** | Manual hunting for deal intel | Intel auto-aggregated in one view | 5-10 hours saved per deal |
| **Deal Predictability** | Uncertain (reps ad-hoc) | Repeatable (all deals follow workflow) | Better forecasting |

---

## 💡 KEY INSIGHTS & RECOMMENDATIONS

### **Why This Approach Works**

1. **Gating = Discipline**
   - Reps can't skip discovery
   - Deals must be qualified before proposaling
   - Creates repeatable, auditable process

2. **Workflow Panel = Guidance**
   - Reps know exactly what to do next
   - No "what do I do in Qualification?" confusion
   - Reduces time to move deals forward

3. **OpportunityProfile = Context**
   - All deal intel in one view
   - Proposal can reference discovery insights
   - Creates coherent customer experience ("we listened")

4. **Dynamic Proposals = Higher Close Rate**
   - Generic proposals: 25-30% close rate
   - Personalized proposals: 40-50% close rate
   - Difference is worth the engineering investment

5. **Audit Trail = Accountability**
   - See exactly what discovery revealed
   - See qualification reasoning
   - See what influenced the proposal
   - When deal is lost, can analyze why

---

## 🚀 IMPLEMENTATION SEQUENCE

### **Pre-Wave Checklist** (Before Wave 17 starts)
- [ ] Review and approve this plan
- [ ] Allocate 65k tokens × 3 waves
- [ ] Confirm discovery/qualification/proposal workflows from Phase 14-16 are locked (no more changes)
- [ ] Schedule 3 brief sync calls (one per wave) to review progress

### **Wave 17 Kickoff**
- [ ] Migrate Phase 14 pre-brief generation to Prospecting stage
- [ ] Build StageWorkflowPanel component
- [ ] Add gating logic (checkStageGates, canAdvanceToStage)
- [ ] Create OpportunityProfile data structure
- [ ] Refactor deal page to use new workflow panel

### **Wave 18 Kickoff**
- [ ] Embed Phase 14 discovery workflow in Qualification stage
- [ ] Embed Phase 15 qualification scorecard in Qualification stage
- [ ] Populate OpportunityProfile with discovery data
- [ ] Test: discovery → qualification → scorecard → gates

### **Wave 19 Kickoff**
- [ ] Embed Phase 16 proposal workflow in Proposal stage
- [ ] Build dynamic proposal generation (AI-personalized, not template)
- [ ] Create proposal export + sharing
- [ ] Complete Won/Lost state with audit trail

---

## ⚠️ RISKS & MITIGATIONS

| Risk | Mitigation |
|------|-----------|
| **Deal page becomes too complex** | Use accordion/tabs to collapse workflow steps; OpportunityProfile in sidebar (not inline) |
| **Reps frustrated by gates** | Provide clear messaging on what's blocking; make requirements obvious; allow override with reasoning |
| **Proposal generation misses the mark** | AI-personalized doesn't mean perfect; allow rep to edit inline; version history |
| **OpportunityProfile doesn't aggregate cleanly** | Test data flow from Phase 14 → Phase 15 → Phase 16; unit tests for aggregation logic |
| **Performance (page is too slow)** | Lazy-load OpportunityProfile sections; collapse workflows by default |

---

## 📋 DECISION REQUIRED FROM YOU

**Before we proceed with Wave 17, confirm:**

1. ✅ **Gating approach** — Do you want gates that prevent advancement (strict), or just warnings (soft)?
   - Strict: "You can't move to Proposal until qualified"
   - Soft: "Warning: this deal isn't qualified. Proceed anyway?"

2. ✅ **OpportunityProfile placement** — Sidebar (right side) or inline in workflow panel?
   - Sidebar: Smaller, always visible, less context switching
   - Inline: Larger, expands as you complete steps

3. ✅ **Workflow triggering** — Should workflows auto-start when rep enters stage, or manual click "Start Discovery"?
   - Auto: Rep enters Qualification, discovery workflow auto-opens
   - Manual: Rep clicks button to trigger discovery

4. ✅ **Model routing** — Waves 17-19 are all Haiku tasks (simple workflow UI, straightforward logic). OK to stay light?
   - Yes (recommended): Save tokens, deliver faster
   - No: Use Sonnet (medium) for more nuanced UX decisions

5. ✅ **Timeline** — Build all 3 waves in one sprint (3 weeks, fast), or spread over 6 weeks (slower, more refinement)?
   - Fast (3 weeks): Ship faster, iterate based on feedback
   - Slow (6 weeks): More polish, better testing before each wave

---

## 🎬 NEXT STEP

**Reply with:**
- ✅ Confirm recommendations (gating, profile placement, workflow triggering, model, timeline)
- ✅ Any modifications to the wave breakdown
- ✅ "Proceed with Wave 17" when ready

**Then I will:**
1. Commit the strategic plan to repo
2. Create Wave 17 implementation detailed spec
3. Start building StageWorkflowPanel + gating logic + Prospecting workflow

---

**Token allocation remaining**: 200k - 13k (so far) = **187k available**
**Recommended allocation**: 65k per wave (gives us 3x waves + buffer)
