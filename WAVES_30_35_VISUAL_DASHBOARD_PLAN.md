# Waves 30-35: High-Impact Visual Dashboard Suite
## Sales Intelligence UI — Pipeline, Contacts, Activity, Health, Actions

**Budget:** 50k tokens  
**Timeline:** 5 weeks (10k tokens per week)  
**Priority:** Tier 1 (38k) then Tier 2 (12k)  
**Goal:** Maximum sales rep engagement and visibility into deals + contacts

---

## Wave 30: Deal Pipeline Kanban (16k tokens, 2 weeks)

### What It Does
Sales reps see all deals in a visual Kanban board with intelligence scores visible on each card.

**Columns:** Prospecting | Qualification | Proposal | Negotiation | (Won/Lost)

**Card shows:**
- Deal name
- Company name
- Deal amount (color-coded by size)
- Win probability (decision maker score + buying relevance avg)
- Days in stage
- Next owner/action

### Components to Build
```typescript
// components/deals/DealPipeline.tsx (Main container)
// components/deals/PipelineColumn.tsx (Kanban column)
// components/deals/DealCard.tsx (Draggable card with intelligence)
// components/deals/CardDragContext.tsx (Drag-drop logic)
// lib/deals/kanban.ts (Utility functions)
```

### Key Features
✅ Drag-drop deals between columns (updates stage in database)
✅ Deal cards show: name, company, amount, win%, days in stage
✅ Color coding: 🟢 high win%, 🟡 medium, 🔴 low
✅ Click card → slide-in deal brief with intelligence
✅ Search/filter deals by company or contact name
✅ Mobile: swipeable columns (horizontal scroll)
✅ Real-time stage updates (optimistic + server sync)

### Database Queries Needed
```typescript
// Get all deals grouped by stage
SELECT stage, COUNT(*) FROM Deal 
  WHERE accountId = ? AND stage IN (...)
  GROUP BY stage

// Get deal with intelligence
SELECT d.*, 
       c.decisionMakerScore, c.buyingRelevance
FROM Deal d
LEFT JOIN Contact c ON d.contactId = c.id
WHERE d.id = ?
```

### UI Mockup
```
┌──────────────────────────────────────────────────────────────┐
│ Pipeline                                     Search contacts ◉ │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│ Prospecting  │ Qualification│  Proposal    │  Negotiation     │
│ (5)          │ (3)          │ (2)          │ (1)              │
│              │              │              │                  │
│ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐    │
│ │ Acme Inc │ │ │ TechCorp │ │ │ GlobalCo │ │ │ MegaCorp │    │
│ │ $50k ┃██░│ │ │ $150k ┃██│ │ │ $200k ┃██│ │ │ $500k ┃██│    │
│ │ Win: 52% │ │ │ Win: 78% │ │ │ Win: 85% │ │ │ Win: 90% │    │
│ │ 2 days   │ │ │ 5 days   │ │ │ 3 days   │ │ │ 1 day    │    │
│ └──────────┘ │ └──────────┘ │ └──────────┘ │ └──────────┘    │
│              │              │              │                  │
│ ┌──────────┐ │ ┌──────────┐ │              │                  │
│ │ StartupX │ │ │ FinTech  │ │              │                  │
│ │ $30k ┃░░░│ │ │ $100k ┃█░│ │              │                  │
│ │ Win: 45% │ │ │ Win: 62% │ │              │                  │
│ │ 7 days   │ │ │ 2 days   │ │              │                  │
│ └──────────┘ │ └──────────┘ │              │                  │
│              │              │              │                  │
└──────────────┴──────────────┴──────────────┴──────────────────┘
```

**Cards are draggable:** Drag Acme Inc from Prospecting → Qualification updates database + stage automatically

---

## Wave 31: Contact Intelligence Grid (12k tokens, 1.5 weeks)

### What It Does
Sales reps see all contacts in a searchable, sortable table with intelligence scores visible.

**Columns:** Name | Title | Company | Decision Maker% | Buying Relevance% | Email | Last Updated | Actions

### Components to Build
```typescript
// components/contacts/ContactGrid.tsx (Main table)
// components/contacts/ContactGridRow.tsx (Table row)
// components/contacts/GridFilter.tsx (Filter by score, status)
// components/contacts/GridSort.tsx (Sort by any column)
// lib/contacts/grid.ts (Query + sorting logic)
```

### Key Features
✅ Sort by any column (name, score, company, last updated)
✅ Filter: high score only, no intel, stale intel (>7 days)
✅ Inline actions: copy email, call, refresh intelligence
✅ Quick preview: hover → show briefing summary (tooltip)
✅ Click row → full intelligence sidebar
✅ Mobile: responsive columns, horizontal scroll for actions
✅ Search: find contacts by name, company, email
✅ Pagination: load 50 at a time, lazy-load more

### Database Queries Needed
```typescript
// Get all contacts with intelligence scores
SELECT c.*, 
       ci.decisionMakerScore, ci.buyingRelevance,
       a.name as accountName,
       ci.researchCompletedAt
FROM Contact c
LEFT JOIN Account a ON c.accountId = a.id
LEFT JOIN ContactIntelligenceProfile ci ON c.id = ci.contactId
WHERE c.accountId = ? OR c.accountId IS NULL
ORDER BY ci.buyingRelevance DESC NULLS LAST
LIMIT 50
```

### UI Mockup
```
┌──────────────────────────────────────────────────────────────┐
│ Contacts                    Filter: ▼ All  Search: _____ 🔍   │
├─────────────┬──────────┬───────────┬──────┬────────┬──────────┤
│ Name        │ Title    │ Company   │ DM%  │ Buying │ Actions  │
├─────────────┼──────────┼───────────┼──────┼────────┼──────────┤
│ Stephan B.  │ CEO      │ Plato     │ 🟢92 │ 🟢 89  │ 📧 📞 ⟳ │
│ John Smith  │ CTO      │ TechCorp  │ 🟢85 │ 🟢 82  │ 📧 📞 ⟳ │
│ Sarah Lee   │ VP Sales │ GlobalCo  │ 🟡62 │ 🟢 78  │ 📧 📞 ⟳ │
│ Mike Chen   │ PM       │ StartupX  │ ⚪45 │ ⚪ 50  │ 📧 🔍 ⟳ │
│ Lisa Wang   │ CFO      │ FinTech   │ 🟢88 │ 🟢 85  │ 📧 📞 ⟳ │
└─────────────┴──────────┴───────────┴──────┴────────┴──────────┘
```

**Hover on row** → tooltip shows briefing summary + latest activity
**Click row** → full intelligence sidebar slides in
**Click 📧** → copy email (toast "Copied!")
**Click 📞** → open phone app
**Click ⟳** → refresh intelligence

---

## Wave 32: Activity Timeline (10k tokens, 1.5 weeks)

### What It Does
Sales reps see a visual timeline of all activities (calls, emails, meetings, intelligence updates) for each deal/contact.

**Event types:** 📞 Call | 📧 Email | 📅 Meeting | 🔍 Intelligence | 📝 Note

### Components to Build
```typescript
// components/activity/ActivityTimeline.tsx (Main timeline)
// components/activity/TimelineEvent.tsx (Individual event card)
// components/activity/EventFilter.tsx (Filter by type)
// lib/activity/timeline.ts (Query + formatting)
```

### Key Features
✅ Chronological timeline (newest first)
✅ Event types color-coded: call (blue), email (green), meeting (purple), intelligence (orange), note (gray)
✅ Each event shows: timestamp, type, summary, attendees/recipient
✅ Filter by type (show only calls, only emails, etc.)
✅ Mobile: vertical cards (easier than side-by-side on small screens)
✅ Click event → expand for full details
✅ Add note: "Called today, interested in pilot" → persists to timeline

### Database Queries Needed
```typescript
// Get timeline for a deal/contact
SELECT 
  'call' as type, createdAt, duration, notes, userId FROM Call
  WHERE dealId = ? OR contactId = ?
UNION ALL
SELECT 
  'email' as type, sentAt, subject, body, userId FROM Email
  WHERE dealId = ? OR contactId = ?
UNION ALL
SELECT 
  'meeting' as type, startTime, title, attendees, userId FROM Meeting
  WHERE dealId = ? OR contactId = ?
UNION ALL
SELECT 
  'intelligence' as type, researchCompletedAt, 'Intelligence Updated', scores, userId FROM ContactIntelligenceProfile
  WHERE contactId = ?
ORDER BY createdAt DESC
```

### UI Mockup
```
Timeline: Stephan Bredell @ Plato Coffee

Today 2:34 PM
┌──────────────────────────────────┐
│ 🔍 Intelligence Updated          │
│ Decision Maker: 92/100           │
│ Buying Relevance: 89/100         │
│ 18 evidence sources found        │
└──────────────────────────────────┘

Yesterday 11:02 AM
┌──────────────────────────────────┐
│ 📞 Call                          │
│ Duration: 32 minutes             │
│ With: Stephan Bredell, John Smith│
│ Notes: "Strong interest in pilot" │
└──────────────────────────────────┘

2 days ago 3:45 PM
┌──────────────────────────────────┐
│ 📧 Email Sent                    │
│ To: stephan@platocoffee.co.za    │
│ Subject: HaloITSM Demo Scheduled │
└──────────────────────────────────┘

3 days ago 9:15 AM
┌──────────────────────────────────┐
│ 📅 Meeting                       │
│ Discovery Call                   │
│ With: Stephan, John, Sarah (ops) │
└──────────────────────────────────┘
```

---

## Wave 33: Deal Health Dashboard (8k tokens, 1 week)

### What It Does
Sales reps see at-a-glance health indicators for each deal (win probability, velocity, risk alerts).

**Cards show:**
- Deal name + company
- Win probability score (large, color-coded)
- Days in current stage (velocity indicator)
- Next milestone
- Risk flags (stale intel, no contact info, overdue follow-up)

### Components to Build
```typescript
// components/deals/DealHealthDashboard.tsx (Grid of health cards)
// components/deals/HealthCard.tsx (Individual deal health)
// components/deals/RiskAlerts.tsx (Flags for deal issues)
// lib/deals/health.ts (Scoring logic)
```

### Key Features
✅ Health score: 0-100 (🟢 >70, 🟡 40-70, 🔴 <40)
✅ Deal velocity: "10 days in Qualification" → if >30 days, flag as slow
✅ Risk alerts: "No contact intel", "Email bounce", "No activity 7+ days"
✅ Next milestone countdown: "Due: Send proposal in 3 days"
✅ Click card → open full deal + timeline
✅ Mobile: cards stack vertically

### Scoring Logic
```typescript
healthScore = (
  (decisionMakerScore * 0.3) +           // 30% from DM score
  (buyingRelevance * 0.3) +              // 30% from buying relevance
  (100 - daysInStage) * 0.2 +            // 20% from velocity (newer is better)
  (hasRecentActivity ? 20 : 0)           // 20% from activity
) / 100
```

### UI Mockup
```
Deal Health Dashboard

┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Acme Inc         │ │ TechCorp         │ │ GlobalCo         │
│ Win: 52/100 🟡   │ │ Win: 78/100 🟢   │ │ Win: 85/100 🟢   │
│ Stage: Prospect  │ │ Stage: Qual      │ │ Stage: Proposal  │
│ 2 days           │ │ 5 days           │ │ 3 days           │
│ ⚠️ No activity   │ │ ✓ On track       │ │ ✓ On track       │
│ 5 days           │ │                  │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

---

## Wave 34: Quick Actions Hub (6k tokens, 1 week)

### What It Does
Floating action cards that suggest next steps based on deal/contact status.

**Types of actions:**
- "Research Jane Smith" (contact no intel)
- "Send proposal to TechCorp" (overdue)
- "Call Stephan about pilot" (next step)
- "Follow up with GlobalCo" (stale activity)

### Components to Build
```typescript
// components/actions/QuickActionsHub.tsx (Floating hub)
// components/actions/ActionCard.tsx (Individual action)
// lib/actions/suggestions.ts (Logic to generate actions)
```

### Key Features
✅ Floating action hub (bottom-right corner, non-intrusive)
✅ Show top 5 suggested actions
✅ Actions sorted by urgency
✅ Click action → perform it (research, call, email, etc.)
✅ Dismiss action (don't show again for 24h)
✅ Mobile: expandable card at bottom

### Action Generation Logic
```typescript
suggestedActions = [
  ...contactsWithoutIntel.map(c => ({
    type: 'research',
    priority: 'high',
    text: `Research ${c.name}`,
    contact: c
  })),
  ...overdueFollowUps.map(d => ({
    type: 'followup',
    priority: 'high',
    text: `Follow up: ${d.company}`,
    deal: d
  })),
  ...nextMilestones.map(d => ({
    type: 'action',
    priority: 'medium',
    text: `${d.nextAction} - ${d.company}`,
    deal: d
  }))
].sort((a, b) => priorityScore(b) - priorityScore(a))
 .slice(0, 5)
```

### UI Mockup
```
┌─────────────────────────────┐
│ ✨ Next Best Actions        │
├─────────────────────────────┤
│ 🔍 Research Jane Smith      │
│    TechCorp                 │
│    HIGH PRIORITY            │
├─────────────────────────────┤
│ 📧 Send proposal to Acme    │
│    Overdue (3 days)         │
│    HIGH PRIORITY            │
├─────────────────────────────┤
│ 📞 Call Stephan re: pilot   │
│    Plato Coffee             │
│    MEDIUM                   │
├─────────────────────────────┤
│ 💬 Note: GlobalCo pricing   │
│    MEDIUM                   │
├─────────────────────────────┤
│ 📅 Sched demo with FinTech  │
│    DUE SOON                 │
└─────────────────────────────┘
```

---

## Implementation Roadmap

| Wave | Component | Tokens | Duration | Status |
|------|-----------|--------|----------|--------|
| 30 | Deal Pipeline Kanban | 16k | 2 wks | 📋 Ready |
| 31 | Contact Intelligence Grid | 12k | 1.5 wks | 📋 Ready |
| 32 | Activity Timeline | 10k | 1.5 wks | 📋 Ready |
| 33 | Deal Health Dashboard | 8k | 1 wk | 📋 Ready |
| 34 | Quick Actions Hub | 6k | 1 wk | 📋 Ready |
| **Total** | **5 components** | **50k** | **5 weeks** | **✅** |

---

## Database Changes Needed

### New Tables
```sql
-- Activity log (calls, emails, meetings, notes)
CREATE TABLE Activity (
  id UUID PRIMARY KEY,
  type ENUM('call', 'email', 'meeting', 'note'),
  dealId UUID REFERENCES Deal(id),
  contactId UUID REFERENCES Contact(id),
  userId UUID REFERENCES User(id),
  createdAt TIMESTAMP,
  duration INT, -- for calls
  subject STRING, -- for emails
  attendees JSON, -- for meetings
  notes TEXT,
  metadata JSON
);

-- Deal health scores (cached, refreshed daily)
CREATE TABLE DealHealthScore (
  dealId UUID PRIMARY KEY REFERENCES Deal(id),
  healthScore INT,
  riskFlags JSON,
  lastCalculatedAt TIMESTAMP
);
```

### Existing Table Updates
```sql
-- Add to Deal
ALTER TABLE Deal ADD COLUMN nextMilestone STRING;
ALTER TABLE Deal ADD COLUMN nextMilestoneDate DATE;

-- Add to Contact (already has intelligenceProfileId)
-- No changes needed
```

---

## Mobile Optimization Strategy

Each component optimized for mobile:
- **Kanban:** Horizontal swipe between columns
- **Grid:** Sticky header, horizontal scroll for actions
- **Timeline:** Vertical cards (easier than horizontal)
- **Health:** Cards stack 1 per row
- **Actions:** Expandable floating card at bottom

---

## Success Metrics

After implementing all 5:
- ✅ Sales reps spend <5 min/day in admin
- ✅ Pipeline visibility at a glance
- ✅ Contact intelligence surfaced (no digging)
- ✅ Activity tracking automatic (no manual logging)
- ✅ Risk alerts prevent deals slipping
- ✅ Next actions suggested (no guessing)

---

## Dependency Map

```
Wave 30 (Kanban)
  ↓ Uses Deal data

Wave 31 (Grid)
  ↓ Uses Contact + Intelligence data

Wave 32 (Timeline)
  ↓ Uses Activity + Deal + Contact data
  ↓ Triggered by Kanban/Grid interactions

Wave 33 (Health Dashboard)
  ↓ Uses Deal + Intelligence data
  ↓ Feeds Risk Alerts to Actions

Wave 34 (Quick Actions)
  ↓ Consumes Health + Activity data
  ↓ Integrates with all above
```

**Implementation order is sequential:** 30 → 31 → 32 → 33 → 34

Each wave builds on prior data structures but can run in parallel if database schema is finalized first.

---

## Ready to Build?

**Timeline:** 5 weeks, 50k tokens
**Impact:** Sales rep engagement ⬆️⬆️⬆️, visibility ⬆️⬆️⬆️, time-to-action ⬇️⬇️⬇️

Confirm, and I'll start Wave 30 (Deal Pipeline Kanban) immediately.
