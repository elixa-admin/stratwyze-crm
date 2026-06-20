# Stratwyze CRM — Project Instructions

## Project Overview

**Name:** Stratwyze CRM  
**Purpose:** AI-native sales platform for Stratwyze Solutions. Manage lead-to-close workflows with AI research, qualification, and proposal generation.  
**Tech Stack:** Next.js 14 (frontend) + FastAPI (backend) + PostgreSQL + Claude API  
**Team:** Solo + HITL scaling to 2–5x with agentic AI  

## Architecture

```
stratwyze-crm/
├── frontend/          Next.js 14 + TypeScript + TailwindCSS
├── backend/           FastAPI + Python + SQLAlchemy
├── database/          PostgreSQL schema + migrations
├── docs/              Architecture, API, agent specs
└── .claude/           Config + instructions (this file)
```

## Core Workflows

1. **Lead Capture** → Create lead, assign to sales agent
2. **Lead Research** → AI auto-fetches company data, tech stack, news
3. **Executive Brief** → Claude generates prospect brief (Sprint 2)
4. **Opportunity Pipeline** → Lead → Qualification → Discovery → Proposal → Negotiation → Closed
5. **Proposal Generation** → AI drafts proposal using company data + pain points (Sprint 3)
6. **CEO Dashboard** → Pipeline analytics, win rate, forecast (Sprint 3)

## Key Models

- **User** — Sales agent or executive
- **Organization** — Customer company
- **Lead** — Initial contact entry
- **Prospect** — Lead + research data
- **Opportunity** — Lead qualified to opportunity
- **Deal** — Opportunity with pipeline stage
- **Activity** — Stage changes, notes, attachments
- **Proposal** — Generated document with terms, pricing

## Database

PostgreSQL with Prisma ORM.  
Schema: users, orgs, leads, prospects, opportunities, deals, stages, activities, proposals.  
See `database/schema.sql` for full definition.

## AI Integration Points

- **Lead Research** (Sprint 2): Tavily API + web scraping → company data
- **Executive Brief** (Sprint 2): Claude API → markdown brief
- **Proposal Generation** (Sprint 3): Claude API + knowledge base → formatted proposal

## Development Phases

**Sprint 1 (50k tokens):** Foundation — Auth, lead CRUD, database, basic UI  
**Sprint 2 (55k tokens):** AI Research — Company research, brief generation  
**Sprint 3 (55k tokens):** Pipeline & Proposals — Opportunities, deals, dashboards, proposal drafting  

**Token Budget:** 160k per sprint (80% stop at 128k)

## Model Routing

| Task | Model | Tier | Why |
|------|-------|------|-----|
| Setup, CRUD, boilerplate | Haiku | Light | Simple, repeatable |
| Forms, UI, components | Sonnet | Medium | Moderate complexity |
| Agents, research, proposals | Opus | Heavy | Complex reasoning, AI integration |

## Skills & Commands

```bash
/branch [sprint-name]    # Create traceable branch
/commit                  # Stage + create conventional commit
/plan                    # Break task into checklist
/implement               # Build per plan
/verify                  # Test in browser
```

## Next Steps

1. Initialize Next.js frontend (Task 1)
2. Initialize FastAPI backend (Task 1)
3. Create database schema (Task 2)
4. Build auth system (Task 3)
5. Continue through Sprint 1 tasks

## References

- CEO Dashboard: `/Users/brandondienar/Documents/Codex/Projects/AISP/CEO_DASHBOARD.html`
- AISP Framework: `/Users/brandondienar/Documents/Codex/Projects/AISP/`
- Tech Stack Details: See architecture section above
