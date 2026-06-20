# 🚀 Stratwyze CRM — Ready to Use

## **Access URLs**

| Component | URL | Purpose |
|-----------|-----|---------|
| **Dashboard** | http://localhost:3000 | Main CRM application |
| **API** | http://localhost:8000 | Backend API |
| **API Docs** | http://localhost:8000/docs | Interactive API documentation |

---

## **Getting Started**

1. **Open your browser** and go to: **http://localhost:3000**

2. **Login or Create Account:**
   - Sign up with email and password
   - You'll need an organization ID (ask your team for this, or create one in the database)
   - Once logged in, you'll see the dashboard

3. **What You Can Do:**
   - ✅ Create leads
   - ✅ View lead list with search and filter
   - ✅ Edit prospect company information
   - ✅ See executive dashboard (once Sprint 2 is complete)

---

## **Server Status**

Both servers are running in the background on your machine:

```
Backend:  http://localhost:8000  (Uvicorn + FastAPI)
Frontend: http://localhost:3000  (Next.js)
```

**To check if servers are running:**
```bash
ps aux | grep -E "uvicorn|next dev" | grep -v grep
```

**To view logs:**
```bash
tail -f /tmp/backend.log   # Backend logs
tail -f /tmp/frontend.log  # Frontend logs
```

**To stop the servers:**
```bash
pkill -f "uvicorn|next dev"
```

**To restart the servers:**
```bash
cd /Users/brandondienar/Documents/Codex/Projects/AISP/stratwyze-crm
/usr/bin/python3 -m uvicorn backend/main:app --reload --host 0.0.0.0 --port 8000 &
cd frontend && npm run dev &
```

---

## **Project Structure**

```
/Users/brandondienar/Documents/Codex/Projects/AISP/stratwyze-crm/
├── backend/          Backend API (FastAPI + Python)
├── frontend/         Frontend (Next.js + React)
├── database/         Database schema
├── docs/             Documentation
└── SPRINTS_1-3_PLAN.md   Development roadmap
```

---

## **Next Steps**

**Sprint 2** (AI Research & Executive Briefs) is ready to build when you are.

Contact your development team to proceed with:
- Automatic company research (Tavily API)
- Technology stack detection
- Executive brief generation using Claude API

---

**Built with:** Next.js 14 + FastAPI + PostgreSQL/SQLite  
**Status:** Sprint 1 ✅ Complete | Sprint 2 🔄 Ready | Sprint 3 📋 Planned

Enjoy your Stratwyze CRM! 🎉
