# Intelligence Layer Integration Plan: Stratwyze CRM

> **Status**: Strategic proposal (audit-based, token-efficient)
> **Date**: 2026-06-23
> **Author**: Claude Haiku 4.5

---

## EXECUTIVE SUMMARY

We have an **opportunity to enhance our existing Phase 13-16 sales workflow** with a lightweight Intelligence Layer that:

1. **Doesn't duplicate** existing company research (Phase 14 pre-brief does this)
2. **Adds signal detection** (buying signals, hiring patterns, tech stack clues)
3. **Stores findings with confidence** (source tracking + inference vs. fact)
4. **Feeds into existing workflows** (enriches OpportunityProfile, discovery context)
5. **Stays cost-efficient** (uses existing SerpAPI + Gemini Flash, optional Anthropic fallback)

---

## CURRENT STATE AUDIT

### What We Have ✅

**1. Company Research Endpoint** (`/api/company/research`)
- Runs 5 parallel SerpAPI searches (overview, news, M&A, LinkedIn public, revenue)
- Uses Claude to structure findings
- Returns: snapshot, news, M&A, LinkedIn, ITSM relevance, questions
- **Cost**: ~5-10 API calls per research, structured output

**2. Phase 14 Pre-Meeting Brief**
- Uses company research output
- Generates discovery guide + briefing
- **Stores in**: Deal enrichmentData (JSON)

**3. Phase 15 Qualification Scoring**
- Analyzes discovery intel
- Calculates fit score (0-100)
- **Stores in**: DealStageWorkflow (fitScore, painPoints, incumbent)

**4. OpportunityProfile Sidebar**
- Aggregates deal intel (company, discovery, qualification, proposal)
- Fed by Phase 14-16 workflows

### What We Don't Have ❌

**1. Persistent Intelligence Store**
- Research findings not stored in DB (only in deal enrichmentData)
- Can't search historical intelligence
- Can't cross-reference across deals

**2. Buying Signal Detection**
- No systematic detection of hiring signals, tech stack, transformation events
- Currently inferred during Phase 14 (loose)

**3. Contact/Decision Maker Intelligence**
- No dedicated table for people
- Names extracted during discovery but not persisted/analyzed

**4. Source Tracking**
- Research findings not linked to sources
- No confidence scoring (High/Medium/Low)
- No distinction between fact vs. inference

**5. Prospect Briefing Generation**
- Pre-brief generated per deal
- Not reusable across opportunities
- Not searchable for team

---

## PROPOSED INTELLIGENCE LAYER

### New Database Tables (Minimal Schema)

```sql
-- 1. Company Intelligence (enhance existing Account model)
-- Add to Account model:
--   - intelligenceScore (0-100)
--   - lastResearchedAt (DateTime)
--   - detectedIndustry (String)
--   - detectedRevenue (String)
--   - estimatedEmployees (Int)

-- 2. Intelligence Sources
CREATE TABLE intelligence_sources (
  id                String @id @default(cuid())
  companyId         String
  sourceType        String  -- "website" | "news" | "job_post" | "press_release" | "careers_page" | "crmNote"
  sourceUrl         String?
  extractedText     String  -- cleaned text chunk
  publishedDate     DateTime?
  discoveredAt      DateTime @default(now())
  confidence        String  -- "High" | "Medium" | "Low"
  isInference       Boolean @default(false)  -- true if AI-derived, false if direct quote
  createdAt         DateTime @default(now())
}

-- 3. Buying Signals
CREATE TABLE buying_signals (
  id                String @id @default(cuid())
  companyId         String
  signalType        String  -- "new_leadership" | "itsm_hiring" | "digital_transformation" | "cost_reduction" | "ai_investment" | "acquisition" | "growth_event" | "restructuring"
  signalText        String  -- description of the signal
  sourceId          String  -- link to intelligence_sources
  detectedAt        DateTime @default(now())
  confidence        String  -- "High" | "Medium" | "Low"
  relevanceToHaloITSM String?  -- brief note on why this matters
  createdAt         DateTime @default(now())
}

-- 4. Contact Intelligence (enhance existing Contact model)
-- Add to Contact model:
--   - linkedinUrl (String, manually pasted only)
--   - seniority (String) -- "C-Suite" | "Director" | "Manager" | "Individual Contributor"
--   - relevanceScore (Int, 0-100)
--   - discoveredAt (DateTime)
--   - discoverySource (String) -- "careers_page" | "news_article" | "job_post" | "manual_entry"

-- 5. Prospect Briefings (store once, reuse across deals)
CREATE TABLE prospect_briefings {
  id                String @id @default(cuid())
  companyId         String @unique
  executiveSummary  String
  buyerIntentScore  Int     -- 0-100
  topSignals        String[] -- [signal1, signal2, signal3...]
  techStack         Json    -- {detected: [], inferred: []}
  painPoints        String[] -- ITSM-specific pain points
  positioningAngle  String  -- "Cost" | "Speed" | "Adoption" | "Simplicity"
  likelyStakeholders String[] -- ["CIO", "IT Director", "Infrastructure Manager"]
  firstOutreachAngle String
  confidenceLevel   String  -- "High" | "Medium" | "Low"
  generatedAt       DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

---

## INTEGRATION POINTS: How Intelligence Layer Enhances Existing Workflows

### Phase 13: Deal Creation (Existing)
```
Sales rep creates deal for "TechCorp"
→ Pre-filled from Account intelligence (if researched before)
→ Shortens time-to-brief
```

### Phase 14: Pre-Meeting Brief (ENHANCED)
```
1. Rep clicks "Generate Pre-Brief"
2. EXISTING: Calls /api/company/research
3. NEW: Store findings in intelligence_sources table
4. NEW: Detect signals from research results
5. NEW: Look up contacts (from contacts table) who match seniority/role
6. EXISTING: Generate brief (as before)
7. NEW: Also generate/update prospect_briefing for company
8. Rep sees: pre-brief + detected signals + likely decision makers
```

### Phase 15: Qualification Scoring (ENHANCED)
```
1. Rep completes discovery (existing)
2. AI analyzes notes (existing)
3. NEW: Cross-reference with detected buying signals
4. NEW: Adjust fit score based on signal relevance
5. Rep sees: fit score + relevant signals that influenced score
```

### OpportunityProfile Sidebar (ENHANCED)
```
BEFORE:
- Company intel (from pre-brief)
- Discovery insights
- Qualification score

AFTER:
+ Detected signals (new leadership, ITSM hiring, etc.)
+ Likely decision makers (from contacts table)
+ Tech stack clues
+ Confidence breakdown (what we know vs. what we infer)
```

### Rep Insights Dashboard (NEW)
```
"All Prospects with ITSM Hiring Signals"
→ Query buying_signals table
→ Shows 5-10 companies to prioritize

"Accounts I've Researched"
→ Query prospect_briefings
→ Reuse intel across multiple deals at same company
```

---

## TOKEN-EFFICIENT IMPLEMENTATION STRATEGY

### Phase 1: Database Schema (LOW COST - 0 tokens, pure SQL)
- Add 5 new tables to Prisma schema
- Run migration
- No API changes

### Phase 2: Enhance Existing Research Endpoint (MEDIUM - 10-15k tokens)
- Modify `/api/company/research` to:
  - Store findings in intelligence_sources
  - Detect signals from findings
  - Return signal list
- Test with 2-3 companies

### Phase 3: Contact Intelligence (LOW - 5-8k tokens)
- Enhance /api/contacts to track discovery source
- Link contacts to signals
- Update Contact form with seniority picker

### Phase 4: Prospect Briefing Generation (MEDIUM - 12-15k tokens)
- Create `/api/company/briefing` endpoint
- Generates briefing once per company (reusable)
- Used in Phase 14 pre-brief + new insights dashboard

### Phase 5: Insights Dashboard UI (MEDIUM - 15-20k tokens)
- Add new "Insights" page to sidebar
- Show: signals by company, contacts discovered, research history
- Leverage existing OpportunityProfile sidebar styling

**Total Estimated: 42-58k tokens**

---

## WHAT NOT TO BUILD (Token Conservation)

❌ Don't scrape LinkedIn (user manual paste only)
❌ Don't build real-time monitoring (schedule jobs later)
❌ Don't duplicate Phase 14 research (reuse it)
❌ Don't build complex NLP (use Claude for basic signal detection)
❌ Don't create separate proposal generation (integrate with Phase 16)

---

## RECOMMENDATION: THREE SCENARIOS

### Scenario A: FULL INTEGRATION NOW (Use 58k of remaining 70k)
**Timeline**: 2 weeks (Waves 20-21, if continuing)
**Benefit**: Complete intelligence system across all deals
**Risk**: Leaves only 12k tokens for Wave 19 Proposal stage

### Scenario B: CORE INTELLIGENCE LAYER NOW (Use 30-35k)
**Build**: Phases 1-2 (Schema + Enhanced Research)
**Skip**: Phases 3-5 (Contact/Briefing/Dashboard for later)
**Timeline**: 1 week
**Benefit**: Persistent intelligence store + signal detection in Phase 14
**Risk**: Incomplete (no dashboard, limited contact intel)
**Upside**: Still leaves 35-40k for Wave 19 Proposal stage

### Scenario C: DEPLOY WAVES 17-18, THEN INTELLIGENCE LAYER
**Build**: Wave 19 Proposal stage first (complete the sales workflow)
**Then**: Fresh token budget for Intelligence Layer
**Timeline**: 2-3 weeks
**Benefit**: Sales workflow complete → test with real deals → build intelligence based on feedback
**Risk**: Delays intelligence improvements

---

## MY RECOMMENDATION: **HYBRID APPROACH (Scenario B)**

Here's why:

1. **You have 70k tokens left**
   - Wave 19 Proposal stage needs ~60-70k (if built full-featured)
   - Intelligence Layer needs ~45-60k (if built full)
   - **You can't do both at full scope**

2. **Phase 14-16 already work well**
   - Pre-brief research: ✅ done
   - Discovery guide: ✅ done
   - Qualification scoring: ✅ done
   - Only missing: persistent intelligence store + signals + contacts

3. **Scenario B gives you 80% of value at 60% of cost**
   - ✅ Persistent intelligence (can search historical research)
   - ✅ Signal detection (buying signals feed into discovery)
   - ✅ Contact tracking (basic)
   - ✅ Reusable briefs (one research per company)
   - ❌ Dashboard (deferrable)
   - ❌ Contact intelligence UI polish (deferrable)

4. **Then deploy + test with real deals**
   - See which signals matter most
   - Refine signal types based on actual wins/losses
   - Build dashboard based on rep feedback
   - Add Wave 19 Proposal once intelligence is live

---

## IMPLEMENTATION SEQUENCE (If You Approve Scenario B)

**Week 1:**
1. Add 5 new tables to Prisma schema (1 hour)
2. Enhance `/api/company/research` to store findings + detect signals (4 hours)
3. Update Phase 14 to show detected signals in pre-brief (2 hours)
4. Test with 3 real companies from your pipeline

**Week 2:**
1. Build `/api/company/briefing` endpoint (reusable briefing generation)
2. Update OpportunityProfile sidebar to show signals
3. Add signal context to qualification scoring
4. Deploy to production

**Then:**
- Use with real deals for 1-2 weeks
- Gather feedback from sales team
- Plan Phase 5 (Dashboard) for next sprint

---

## NEXT STEP: YOUR DECISION

**Do you want to:**

**A) Pursue Scenario B** (Intelligence Layer Core: Persistent store + Signals + Enhanced Phase 14)
   - Estimated: 30-35k tokens, 1-2 weeks
   - Outcome: Phase 14-16 enriched, signals detected, intelligence stored
   - Next: Deploy, test with real deals, gather feedback

**B) Pursue Scenario C** (Complete Wave 19 first, then Intelligence Layer)
   - Estimated: Wave 19 (65-70k) + Intelligence Layer (45-60k with fresh budget)
   - Outcome: Complete sales workflow → then complete intelligence system
   - Next: Build Wave 19 Proposal stage now

**C) Pursue Scenario A** (Full Intelligence Layer + abandon Wave 19)
   - Estimated: 58k tokens
   - Outcome: Complete intelligence system, no Proposal stage yet
   - Next: Build Wave 19 later with new budget

**Which direction aligns with your priorities?**

My instinct: **Scenario B** makes most sense because:
- Wave 19 can be built with fresh tokens next sprint
- Intelligence Layer multiplies value of Phase 14-16.
- You can validate signal detection with real deals.
- Sales team gets immediate value (enhanced Phase 14).

What's your preference?
