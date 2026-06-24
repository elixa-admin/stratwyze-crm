# Waves 35-38: Guided Sales Stage Workflow
## The "Sales Rep GPS" — Step-by-Step Deal Progression

**Vision:** Sales reps never guess what to do next. At every stage, they see:
- What they need to accomplish in THIS stage
- What they've already done
- When they're ready to advance
- What to do next

**Context:**
- Waves 30-34: Dashboard visibility (where are deals?)
- Waves 35-38: **Workflow guidance (what to do with them?)**

---

## Wave 35: Stage Progress Card (12k tokens, 1.5 weeks)

### What It Does
Shows a deal in one stage with:
- Stage name + days in stage
- Required actions (checklist)
- Completed actions (checkmarks)
- Activity log from THIS stage only
- "Ready to advance?" indicator

### Components to Build

```typescript
// components/deals/StageProgressCard.tsx
- Shows current stage (highlighted)
- Required activities for stage
- Completed activities (checkmarks)
- Days in current stage
- Readiness indicator (% complete)
- "Move to next stage" button (conditional)

// components/deals/StageChecklist.tsx
- List of required actions
- Toggle checkboxes as completed
- Shows activity linking (when this was done)
- Color-coded by status (pending/in-progress/done)

// components/deals/StageSummary.tsx
- Quick view: What needs to happen in THIS stage
- Sample conversation starters for stage
- Typical timeline (how long should this stage take?)
```

### Database Changes
```sql
-- Add to DealStageWorkflow
ALTER TABLE DealStageWorkflow ADD COLUMN (
  stageRequirements JSON,     -- {actions: [{id, title, completed, dueDate}]}
  stageNotes TEXT,            -- notes specific to current stage
  readinessScore INT          -- 0-100: how ready to advance?
);

-- Example stageRequirements:
{
  "actions": [
    {
      "id": "contact_found",
      "title": "Find primary contact",
      "required": true,
      "completed": true,
      "completedAt": "2026-06-23T10:30:00Z"
    },
    {
      "id": "initial_contact",
      "title": "First call/email sent",
      "required": true,
      "completed": true,
      "completedAt": "2026-06-23T15:45:00Z"
    },
    {
      "id": "fit_assessment",
      "title": "Documented fit assessment",
      "required": true,
      "completed": false,
      "completedAt": null
    }
  ],
  "readinessScore": 67  -- 2 of 3 required actions done
}
```

### API Endpoints

```
GET /api/deals/[id]/stage-progress
- Returns current stage + requirements + activities
- Includes readiness score

PATCH /api/deals/[id]/stage-requirements
- Mark action as complete
- Update stageNotes

POST /api/deals/[id]/stage-advance
- Validate all required actions completed
- Move to next stage
- Log transition + reset requirements for new stage
```

### UI Mockup

```
┌─────────────────────────────────────────────┐
│ Stage Progress: Qualification (5 days)      │
├─────────────────────────────────────────────┤
│                                             │
│ 🎯 Readiness: 67% (2 of 3 required)        │
│                                             │
│ ☑ Find primary contact                     │
│   ✓ John Smith (john@vodacom.co.za)       │
│   Completed Jun 23, 10:30 AM               │
│                                             │
│ ☑ First call/email                         │
│   ✓ Initial call (32 min)                  │
│   Completed Jun 23, 3:45 PM                │
│   Logged as: Call outcome                  │
│                                             │
│ ☐ Fit assessment                           │
│   ⚠ Still needed: Document fit findings    │
│   Due: Jun 25 (2 days remaining)          │
│                                             │
│ Recent Activity (in this stage):           │
│ 📞 Call: Discovery call with John - Jun 23│
│ 📧 Email: Sent follow-up questions - Jun 24│
│                                             │
│ ┌───────────────────────────────────┐     │
│ │ ☑ All required actions complete?  │     │
│ │ ✓ Ready to move to Proposal       │     │
│ │                                   │     │
│ │ [Advance to Proposal Stage]       │     │
│ └───────────────────────────────────┘     │
└─────────────────────────────────────────────┘
```

### Stage Definitions (Config)

```typescript
// lib/deals/stage-definitions.ts

const STAGE_DEFINITIONS = {
  Prospecting: {
    durationExpected: 7,  // days
    description: "Identify and qualify prospect",
    requiredActions: [
      {
        id: "contact_found",
        title: "Find primary contact",
        prompt: "Who is your main contact at this company?",
        linkedActivities: ["contact_added"],
      },
      {
        id: "initial_contact",
        title: "First outreach (call or email)",
        prompt: "Have you reached out yet?",
        linkedActivities: ["call", "email"],
      },
      {
        id: "fit_assessment",
        title: "Assess fit for our solution",
        prompt: "Does this company fit our target market?",
        linkedActivities: ["note"],
      },
    ],
    conversationStarters: [
      "What's your biggest operational challenge?",
      "How many locations do you operate?",
      "What's your tech stack for [domain]?",
    ],
    successCriteria: "Contact identified, initial outreach sent, fit assessed",
  },

  Qualification: {
    durationExpected: 14,
    description: "Understand needs, budget, and timeline",
    requiredActions: [
      {
        id: "discovery_call",
        title: "Discovery call scheduled & completed",
        prompt: "Have you had your discovery call?",
        linkedActivities: ["meeting", "call"],
      },
      {
        id: "pain_points",
        title: "Document 3+ pain points",
        prompt: "What are their main challenges?",
        linkedActivities: ["note"],
      },
      {
        id: "budget_confirmed",
        title: "Budget range confirmed",
        prompt: "What's their budget?",
        linkedActivities: ["note"],
      },
      {
        id: "timeline_identified",
        title: "Decision timeline identified",
        prompt: "When do they need a solution?",
        linkedActivities: ["note"],
      },
    ],
    conversationStarters: [
      "Walk me through your current process",
      "What's blocking you from solving this?",
      "When would you like to implement?",
    ],
    successCriteria: "Discovery completed, pain points documented, budget & timeline known",
  },

  Proposal: {
    durationExpected: 7,
    description: "Build and present solution",
    requiredActions: [
      {
        id: "solution_design",
        title: "Solution designed for their needs",
        prompt: "Have you designed the solution?",
        linkedActivities: ["note"],
      },
      {
        id: "proposal_sent",
        title: "Proposal document sent",
        prompt: "When did you send it?",
        linkedActivities: ["email"],
      },
      {
        id: "demo_scheduled",
        title: "Demo or presentation scheduled",
        prompt: "Have you scheduled a demo?",
        linkedActivities: ["meeting"],
      },
    ],
    successCriteria: "Solution designed, proposal sent, demo scheduled",
  },

  Negotiation: {
    durationExpected: 14,
    description: "Close objections and finalize terms",
    requiredActions: [
      {
        id: "objections_addressed",
        title: "Address/overcome objections",
        prompt: "What objections came up?",
        linkedActivities: ["call", "note"],
      },
      {
        id: "contract_ready",
        title: "Contract prepared and reviewed",
        prompt: "Is the contract ready?",
        linkedActivities: ["note"],
      },
      {
        id: "executive_buy_in",
        title: "Executive sign-off confirmed",
        prompt: "Who needs to approve?",
        linkedActivities: ["call", "meeting"],
      },
    ],
    successCriteria: "Objections cleared, contract ready, executive approval obtained",
  },
};
```

---

## Wave 36: Stage Templates & Customization (10k tokens, 1 week)

### What It Does
Allows teams to customize stage requirements per:
- Industry (retail vs SaaS vs enterprise)
- Deal size ($10k vs $500k)
- Sales process (fast-track vs complex)

### Components

```typescript
// components/deals/StageTemplate.tsx
- Show stage template matching this deal
- Allow override for specific deal
- Show team defaults vs deal-specific

// components/templates/TemplateBuilder.tsx
- Admin UI to create stage templates
- Set required actions per stage
- Define conversation starters
- Set expected durations

// hooks/useStageTemplate.ts
- Get appropriate template for deal
- Apply/override template
- Track which template used
```

### Features
- ✅ Default template (all deals start here)
- ✅ Industry templates (retail, SaaS, enterprise)
- ✅ Deal-size templates (SMB, mid-market, enterprise)
- ✅ Per-team customization
- ✅ Override per-deal basis

### Database
```sql
ALTER TABLE DealStageWorkflow ADD COLUMN templateId STRING;

CREATE TABLE SalesStageTemplate (
  id STRING PRIMARY KEY,
  name STRING,
  description TEXT,
  teamId STRING,
  industry STRING,  -- retail, saas, enterprise, etc.
  dealSizeRange STRING,  -- small, medium, large
  stages JSON,  -- {Prospecting: {...}, Qualification: {...}}
  createdAt DATETIME,
  updatedAt DATETIME
);
```

---

## Wave 37: Readiness & Auto-Advance (8k tokens, 1 week)

### What It Does
Intelligently determines when a deal is ready to move forward based on:
- Required actions completed
- Time in stage
- Activity level
- Deal intelligence scores
- Sales rep confidence

### Smart Features

```
🚀 AUTO-READINESS CALCULATION:

readinessScore = (
  actionsCompleted / actionsRequired * 40 +  -- 40% from checklist
  daysInStage / expectedDuration * 20 +      -- 20% from time
  activityCount / expectedCount * 20 +       -- 20% from activity
  decisionMakerScore / 100 * 20              -- 20% from intel
) / 100

GREEN (90+): Ready to advance, go ahead
YELLOW (60-89): Can advance, but missing some signals
RED (<60): Not ready yet, keep working this stage
```

### Components

```typescript
// components/deals/ReadinessIndicator.tsx
- Shows readiness score (0-100)
- Shows what's missing
- Suggests actions to increase readiness
- "When should I advance?" timeline

// hooks/useStageReadiness.ts
- Calculate readiness score
- Suggest next actions
- Estimate when ready to advance
```

### Prompts for Sales Rep

```
🟢 You're ready to advance! (92% readiness)
├─ ✓ All required actions complete
├─ ✓ 14 days in Qualification (expected: 14 days)
├─ ✓ 5 activities logged
└─ ✓ Decision Maker Score: 85%

Recommendation: Advance to Proposal

────────────────────────────────

🟡 Almost there... (74% readiness)
├─ ✓ 3 of 4 required actions
├─ ⚠ Only 5 days in stage (expected: 14)
├─ ✓ 8 activities logged
└─ ✓ Decision Maker Score: 78%

Missing: "Executive sign-off confirmed"
Action: Schedule call with CFO

Estimated ready: Jun 29 (5 days)

────────────────────────────────

🔴 Keep working this stage (48% readiness)
├─ ○ 2 of 4 required actions
├─ ✓ 2 days in stage (expected: 14)
├─ ✓ 3 activities logged
└─ ○ Decision Maker Score: 52%

Missing: 
- "Budget range confirmed"
- "Timeline identified"

Next actions: Call to clarify budget & timeline

Estimated ready: Jul 8 (14 days)
```

---

## Wave 38: Deal Progression Analytics (10k tokens, 1.5 weeks)

### What It Does
Shows sales manager:
- Deal health by stage
- How long deals spend in each stage
- Bottleneck identification
- Predicted close dates
- Rep productivity metrics

### Dashboards

```
SALES MANAGER VIEW:

📊 Pipeline Health by Stage
├─ Prospecting: 12 deals, avg 4.2 days, 85% complete
├─ Qualification: 8 deals, avg 9.1 days (SLOW), 72% complete
├─ Proposal: 5 deals, avg 5.3 days, 91% complete
├─ Negotiation: 3 deals, avg 7.8 days, 68% complete
└─ Won: 2 deals

🐌 BOTTLENECK ALERT:
Qualification stage taking 2x longer than expected
8 deals stuck, avg 9 days in stage
Action: Help reps complete discovery calls

📈 Close Rate by Rep:
├─ John: 67% (Qualification → Won)
├─ Sarah: 82% (Qualification → Won)
└─ Mike: 54% (Proposal → Won) ⚠️

⏰ Predicted Close Dates:
├─ TechCorp: Jul 15 (Proposal stage, 92% ready)
├─ Vodacom: Jul 22 (Negotiation, 68% ready)
└─ GlobalCo: Jul 8 (Qualification, 74% ready)
```

### Components

```typescript
// components/analytics/StageHealthChart.tsx
- Bar chart: deals per stage, avg duration, completion %

// components/analytics/BottleneckAlert.tsx
- Show slowest stages
- Suggest interventions

// components/analytics/PredictedCloses.tsx
- Forecast close dates
- Show pipeline value by date

// components/analytics/RepProductivity.tsx
- Deal win rate by rep
- Average stage duration by rep
- Activity levels
```

---

## Wave 39 (Optional): AI-Powered Next Step Suggestions (10k tokens)

### What It Does
Claude generates suggested next steps based on:
- Deal stage
- Contact intelligence
- Company size/industry
- Recent activity
- Similar successful deals

### Example

```
🤖 AI Suggests Next Steps:

Based on: Vodacom in Qualification, 180+ days old, retail company

Suggested Actions:
1. Schedule discovery call with CFO (not just operations)
   Why: Previous Vodacom deal required CFO approval
   When: This week
   How: "Heard retail has tight budgets - want to discuss investment model?"

2. Send ROI calculator
   Why: Large enterprises respond to numbers
   When: After discovery call
   How: Customized for 140+ locations

3. Get internal champion identified
   Why: No single decision maker noted yet
   When: On call with CFO
   How: "Who else needs to sign off on IT decisions?"

Probability: 71% likely to advance if you do these 3 things
```

---

## Implementation Roadmap

| Wave | Focus | Tokens | Duration | Builds On |
|------|-------|--------|----------|-----------|
| 35 | Stage Progress Card | 12k | 1.5 wks | Wave 22-26 (intel) |
| 36 | Stage Templates | 10k | 1 wk | Wave 35 |
| 37 | Readiness Scoring | 8k | 1 wk | Wave 35-36 |
| 38 | Progression Analytics | 10k | 1.5 wks | Wave 35-37 |
| 39 | AI Next Steps (opt) | 10k | 1.5 wks | All above |
| **TOTAL** | **Full Workflow** | **50k** | **6 weeks** | **Complete** |

---

## Database Schema Summary

### New/Modified Tables

```sql
-- Extend DealStageWorkflow
ALTER TABLE DealStageWorkflow ADD (
  stageRequirements JSON,      -- required actions + completion
  readinessScore INT,          -- 0-100 readiness to advance
  stageNotes TEXT,             -- stage-specific notes
  templateId STRING,           -- which template applied
  expectedDueDate DATE         -- when should complete stage
);

-- New: Stage Templates
CREATE TABLE SalesStageTemplate (
  id, name, description, teamId, industry, dealSizeRange,
  stages JSON, createdAt, updatedAt
);

-- New: Stage Progression Metrics
CREATE TABLE StageDurationMetric (
  id, stageId, repId, avgDays, minDays, maxDays, 
  closedCount, createdAt
);
```

---

## Success Metrics (Post-Wave 38)

After implementing all 4 waves:

- ✅ Sales reps know exactly what to do in each stage
- ✅ Deal advancement is data-driven (not random)
- ✅ Pipeline bottlenecks visible to managers
- ✅ Predicted close dates accurate (within 2 days)
- ✅ New reps onboard 50% faster (guided workflow)
- ✅ Deal velocity increases 30% (less guessing)
- ✅ Close rate improves (better deal qualification)

---

## User Stories

### For Sales Reps:
```
"I open a deal and see EXACTLY what I need to do today"
"When I complete an action, it auto-updates the checklist"
"I know when I'm ready to move to next stage"
"I see conversation starters based on what stage I'm in"
```

### For Sales Managers:
```
"I see which deals are at risk (bottleneck alerts)"
"I know which reps need coaching (stage duration analysis)"
"I can predict closes 4 weeks out (readiness scoring)"
"I can see rep productivity at a glance"
```

### For Executives:
```
"Pipeline health by stage is always visible"
"Revenue forecast is tied to deal progression"
"I know when bottlenecks are slowing growth"
```

---

## Ready to Build?

**Recommendation:** Start with **Wave 35 (Stage Progress Card)** — it's the foundation that everything else builds on.

Waves 36-38 layer on top without rework.
Wave 39 (AI suggestions) is bonus.

Should I start Wave 35?
