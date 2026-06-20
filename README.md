# Stratwyze CRM

AI-native sales platform for lead-to-close workflows, built for Stratwyze Solutions.

## Quick Start

```bash
# Frontend
cd frontend
npm install
npm run dev  # http://localhost:3000

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload  # http://localhost:8000
```

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [AI Agents](./docs/AGENTS.md)
- [Project Instructions](./.claude/CLAUDE.md)

## Sprint Plan

See `SPRINTS_1-3_PLAN.md` for detailed breakdown.

## Stack

- **Frontend:** Next.js 14 + TypeScript + TailwindCSS + shadcn/ui
- **Backend:** FastAPI + Python + SQLAlchemy
- **Database:** PostgreSQL + Prisma
- **AI:** Claude API + Tavily Search
