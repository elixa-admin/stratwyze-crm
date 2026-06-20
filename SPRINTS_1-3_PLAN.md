# Stratwyze CRM — Sprints 1–3 Plan

**Project:** Stratwyze CRM (AI-native sales platform)  
**Team:** Solo (CEO/developer) + HITL scaling to 2–5x  
**Token Budget:** 160,000 total (80% stop at 128,000)  
**Timeline:** ~2 weeks per sprint × 3 = 6 weeks  

---

## **SPRINT 1: Foundation ✅ COMPLETE**

**Completed Tasks (50k tokens):**

1. ✅ Initialize Next.js + FastAPI projects
   - Set up folder structure, git init, package.json, requirements.txt
   
2. ✅ Create database schema + SQLAlchemy ORM
   - PostgreSQL schema for users, orgs, leads, prospects, opportunities, deals, activities, proposals
   - SQLAlchemy models with relationships
   
3. ✅ Implement auth system (JWT + login UI)
   - FastAPI signup/login/logout endpoints
   - Next.js login/signup pages
   - httpOnly cookie-based JWT authentication
   
4. ✅ Build Lead CRUD API + database ops
   - FastAPI endpoints: list, get, create, update, delete
   - Filtering by status and organization
   - Pagination support
   
5. ✅ Create lead list UI + filtering
   - Next.js lead list page with search
   - Filter by status dropdown
   - Table view with data display
   
6. ✅ Build prospect profile page
   - Editable prospect fields (company, industry, revenue, budget)
   - Support for research data display
   - Save functionality
   
7. ✅ Set up basic UI layout + navigation
   - Navbar component with links
   - Dashboard with quick action buttons
   - TailwindCSS styling
   
8. ✅ Implement error handling + logging
   - FastAPI error middleware
   - Structured logging to file and console
   - HTTP request/response logging

**Deliverables:**
- 5 git commits with atomic, conventional messages
- 16 core files created (auth, models, routes, UI pages)
- Database schema ready for migration
- Auth flow fully functional
- Basic CRUD operations for leads

**Tokens Used:** ~114,000 / 160,000  
**Remaining:** 46,000 for Sprints 2–3

---

## **SPRINT 2: AI Research & Executive Brief (Planned)**

**Autonomy:** HiL (human-in-loop) for all AI tasks  
**Model Tier:** Sonnet (forms/UI), Opus (AI agents)  
**Est. Tokens:** 55,000

**Tasks:**

| # | Task | Autonomy | Tier | Model | Tokens |
|---|------|----------|------|-------|--------|
| 1 | Set up Tavily + web scraping API | HiL | B | Sonnet | 8k |
| 2 | Build company research workflow | HiL | B | Sonnet | 9k |
| 3 | Implement tech stack detection | HiL | B | Sonnet | 7k |
| 4 | Create executive brief generation (Claude API) | Senior | B | Opus | 12k |
| 5 | Build brief display UI | HiL | B | Sonnet | 6k |
| 6 | Create lead research trigger button | HiL | B | Sonnet | 7k |
| 7 | Error handling + retry logic | Autonomous | A | Haiku | 4k |

**Key Features:**
- Auto-fetch company data from website
- Technology stack detection (Clearbit, StackShare)
- News/media research (Tavily)
- Stock price lookup (if public)
- Claude API generates executive brief
- Display brief in prospect profile
- One-click "Research" button on leads

**Output:** SPRINTS_2_PLAN.md with detailed breakdown

---

## **SPRINT 3: Sales Pipeline & Dashboard (Planned)**

**Autonomy:** HiL (pipeline UI), Senior (dashboard analytics)  
**Model Tier:** Sonnet (UI), Opus (analytics)  
**Est. Tokens:** 55,000

**Tasks:**

| # | Task | Autonomy | Tier | Model | Tokens |
|---|------|----------|------|-------|--------|
| 1 | Create opportunity from lead | HiL | B | Sonnet | 6k |
| 2 | Define deal pipeline stages | HiL | B | Sonnet | 5k |
| 3 | Build Kanban pipeline UI (drag-drop) | HiL | B | Sonnet | 8k |
| 4 | Implement deal logging + activity tracking | HiL | B | Sonnet | 6k |
| 5 | Design executive CEO dashboard | HiL | B | Sonnet | 7k |
| 6 | Build pipeline analytics (value, win rate, forecast) | Senior | B | Opus | 10k |
| 7 | Create proposal template + generation UI | HiL | B | Sonnet | 8k |
| 8 | Implement multi-user permissions & role-based views | Senior | A | Opus | 8k |

**Key Features:**
- Opportunity creation from lead
- Deal pipeline with 5 stages (Discovery, Proposal, Negotiation, Closed Won/Lost)
- Kanban board view (drag stages)
- Activity log (stage changes, notes, calls)
- CEO dashboard showing:
  - Pipeline value by stage
  - Win rate %
  - Sales forecast
  - Stage breakdown
- Proposal generation UI (placeholder for Stratwyze template)
- Role-based access (agent, manager, executive)

**Output:** SPRINTS_3_PLAN.md with detailed breakdown

---

## **Token Budget Summary**

| Sprint | Est. Tokens | Used | Remaining |
|--------|------------|------|-----------|
| 1 | 50k | 114k | 46k |
| 2 | 55k | — | — |
| 3 | 55k | — | — |
| **Total** | **160k** | **114k** | **46k** |

*Note: Sprint 1 used ~114k due to comprehensive setup. Sprints 2–3 will be more focused.*

---

## **Sprint Execution Checklist**

**Before Each Sprint:**
- [ ] Review SPRINTS_N_PLAN.md
- [ ] Create git branch: `/branch sprint-N`
- [ ] Update .claude/settings.json with token targets

**During Each Sprint:**
- [ ] Run `/implement` for each task
- [ ] Commit after each task: `/commit`
- [ ] Update task status (pending → in_progress → completed)

**After Each Sprint:**
- [ ] Run all tests and verify functionality
- [ ] Create PR for code review
- [ ] Update SPRINTS_1-3_PLAN.md with completion status
- [ ] Run `/compact` to clean up context

---

## **Next Step**

CEO approval required to proceed with Sprint 2.

Confirm when ready to start AI research integration (Tavily, web scraping, Claude executive briefs).

**Approval Gate:** _______________  (CEO signature)
