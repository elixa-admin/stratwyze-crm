# Wave 1 Execution Decisions — Approved

**Date:** 2026-06-20  
**Approved By:** CEO  
**Status:** Ready to Execute

---

## **CONFIRMED DECISIONS**

✅ **API Choice:** Tavily (web scraping + news, free tier, good quality)

✅ **Brief UX:** Editable (user can modify prompt + regenerate)

✅ **Proposal Integration:** NOW (Sprint 2-3) — not waiting for Sprint 4

✅ **Multi-user Access:** YES, required from launch (agent/manager/exec roles)

✅ **Analytics Depth:** MVP (5-7 KPIs: pipeline value, win rate, forecast, deals, cycle length)

✅ **Deployment:** Staging Week 1 → Production Week 2

---

## **SPRINT 2 SCOPE CONFIRMED**

### Tasks (44k tokens)

1. **Tavily API + Web Scraping** (6k)
   - Fetch company URL from lead
   - Parse founding, team, product info
   - Cache results

2. **Tech Stack Detection** (5k)
   - Detect tools used (from website tech signatures)
   - Store in `prospects.tech_stack` (JSON)
   - Display on prospect profile

3. **Claude API Brief Generation** (10k)
   - Prompt engineering for multi-section brief:
     - Company Overview
     - Competitive Landscape
     - Pain Points
     - Opportunity (why they need Stratwyze)
     - Recommended Pitch Angles (3-5 options)
   - Store in `Briefs` table
   - Support editable prompts (user can customize)

4. **Research UI + Status** (8k)
   - "Research" button on lead card
   - Status indicator (pending/in-progress/complete)
   - Loading spinner
   - Error messages (graceful fallbacks)

5. **Brief Display & Edit** (6k)
   - Rich text display in prospect profile
   - Edit brief content
   - Regenerate button
   - Export to PDF

6. **Async Job Handling** (6k)
   - Background task queue (or simple polling)
   - API: `POST /api/leads/{id}/research` (start job)
   - API: `GET /api/leads/{id}/research-status` (check progress)
   - Notifications when complete

7. **Error Handling** (3k)
   - Tavily timeout → manual entry fallback
   - Claude fail → template brief
   - Graceful degradation

**Buffer:** 11k for unknowns

---

## **SPRINT 3 SCOPE CONFIRMED**

### Tasks (55-56k tokens)

1. **Opportunity Creation** (5k)
   - Convert lead → opportunity
   - Form: company name, deal value ($), probability (%), close date
   - Store in `Opportunities` table
   - Link to `Deals` (pipeline stages)

2. **Pipeline Stages Schema** (4k)
   - Define 5 stages: Discovery, Proposal, Negotiation, Closed Won, Closed Lost
   - Add to DB, foreign key to opportunities
   - Stage change = activity log entry

3. **Kanban Board UI** (10k)
   - React component with 5 stage columns
   - Drag-drop cards between stages
   - Color-coded (blue, yellow, orange, green, red)
   - Card shows: company, deal value, probability, last activity
   - Click card → detail view
   - Responsive (mobile-friendly)

4. **Activity Tracking** (6k)
   - Log every stage change
   - User add notes/comments to deals
   - Timeline view
   - Who, when, what changed

5. **CEO Dashboard** (12k)
   - **Pipeline metrics:**
     - Total pipeline value (sum of deals × probability)
     - By-stage breakdown (bar chart)
     - Win rate % (won / won + lost)
     - Sales forecast (value-weighted)
   - **Performance metrics:**
     - Deals created this month
     - Deals closed this month
     - Average deal size
     - Sales cycle length
   - **Recent activity:** Last 10 events
   - Charts via Recharts library

6. **Deal Detail Page** (7k)
   - Full opportunity view
   - Edit value, probability, close date
   - Activity timeline
   - Comment on deal
   - Related brief (link to executive brief from Sprint 2)

7. **Role-Based Access** (8k)
   - Agent: sees only own deals
   - Manager: sees team deals
   - Executive: sees all + dashboard
   - Filter/show based on `user.role` + `opportunity.assigned_agent`

8. **Error Handling** (4k)
   - Drag errors (invalid stage)
   - Data validation
   - Graceful failures

---

## **PROPOSAL INTEGRATION (Sprint 2-3)**

### What's Happening

We're integrating proposal generation **within Sprints 2-3**, not waiting for Sprint 4.

**Timeline:**
- **Sprint 2:** Add "Generate Proposal" button (UI placeholder)
- **Sprint 3:** Wire up to Claude API + Stratwyze's template

**Implementation:**
1. Upload/store Stratwyze's proposal template (docstring or file)
2. Claude API call: fill template with company data + brief info
3. Generate proposal outline (sections: problem, solution, ROI, next steps)
4. Store draft in `Proposals` table
5. Display in opportunity detail view
6. Edit + export to PDF

**Not included:** Email sending, signature tracking (that's Sprint 4)

**Scope Impact:** Add ~8k tokens to Sprint 3 (total 64k, not 56k)
- May need to defer one task OR extend to 11 days instead of 10

---

## **DEPLOYMENT PLAN**

### Week 1 (Days 1-7)
- **Days 1-3:** Sprint 2 development (research engine)
- **Day 3-4:** Deploy Sprint 2 to staging URL
  - Run smoke tests (research button works, brief generates)
  - CEO reviews brief quality
- **Days 4-7:** Sprint 3 development (pipeline + dashboard)
- **Day 7:** Deploy Sprint 3 to staging URL
  - Kanban board works, dashboard loads

### Week 2 (Days 8-14)
- **Days 8-10:** Testing, bug fixes, refinement
- **Day 10-11:** Staging verification, load testing
- **Day 11:** Production deployment
  - Migrate DB schema (opportunities, briefs, proposals)
  - Deploy frontend + backend
  - Verify health checks
- **Days 12-14:** Monitor, document, retrospective

### Staging URL
```
https://stratwyze-crm-staging.vercel.app
```

### Production URL
```
https://stratwyze-crm.vercel.app
```

---

## **TOKEN BUDGET**

| Sprint | Plan | Actual | Remaining |
|--------|------|--------|-----------|
| 1 | 50k | 114k | 46k |
| 2 | 55k | ~44-55k | ~1-46k |
| 3 | 55k | ~56-64k | (need Sprint 2 clarity) |
| **Total** | 160k | ~214-233k | **Over budget or tight** |

**Note:** Sprint 1 overrun (114k vs 50k) means Sprints 2-3 must be more efficient. Proposal integration adds complexity. May need to defer some features or use higher-token models strategically.

---

## **API KEYS NEEDED**

Before Sprint 2 starts, confirm you have:

- [ ] **Tavily API key** (https://tavily.com) — free tier available
- [ ] **Anthropic API key** (already have?)
- [ ] **Stratwyze proposal template** — in what format? (Word doc, PDF, plain text?)

---

## **DECISION GATES STATUS**

### Before Sprint 2 ✅ APPROVED
- [x] CEO approves AI-first approach
- [x] Tavily API chosen
- [x] Brief editability confirmed
- [x] Proposal integration timing (now)
- [x] Multi-user access required
- [ ] Tavily API key obtained (ACTION ITEM)
- [ ] Proposal template provided (ACTION ITEM)

### Before Sprint 3 (will check after Sprint 2)
- [ ] Sprint 2 deployed to staging successfully
- [ ] CEO reviews brief generation quality
- [ ] Kanban UI mockups approved (if using custom design)

### Before Production
- [ ] Sprint 3 deployed to staging
- [ ] Load testing complete (dashboard <2 sec)
- [ ] DB backup created
- [ ] Rollback plan tested

---

## **READY TO PROCEED?**

Once you confirm:
1. Tavily API key obtained
2. Stratwyze proposal template provided (format?)
3. Go ahead signal

**We can start Sprint 2 immediately** → `/execute-sprint-build 2 /path`

---

**Status:** ✅ READY FOR EXECUTION  
**Next Action:** Provide API key + template, then greenlight Sprint 2

