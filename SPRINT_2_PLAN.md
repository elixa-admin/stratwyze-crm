# Sprint 2: AI Research Engine

**Status:** Ready to Execute  
**Timeline:** 5-7 days  
**Budget:** 40-45k tokens  
**Tavily API Key:** ✅ Configured  

---

## **CORE FEATURES**

### 1. Tavily API Integration (6k)
- Fetch company website from lead email/domain
- Parse: founding year, team size, product description
- Extract: recent news, funding rounds
- API: `POST /api/leads/{id}/research` (async)

### 2. Technology Stack Detection (5k)
- Detect tools used by analyzing website tech signatures
- Store in `prospects.tech_stack` (JSON field)
- Display tech list in prospect profile
- Used for competitive positioning

### 3. Executive Brief Generation (10k)
- Claude Opus API integration
- Multi-section brief:
  - Company Overview (business model, size, funding)
  - Competitive Landscape (main competitors)
  - Pain Points (industry + product analysis)
  - Opportunity (why they need Stratwyze)
  - Recommended Pitch Angles (3-5 options)
- Store in new `Briefs` table
- Display in prospect profile
- **Editable:** User can modify prompt and regenerate
- API: `POST /api/leads/{id}/generate-brief`

### 4. Research UI (8k)
- "Research" button on lead card (blue, prominent)
- Status indicator (pending → in-progress → complete)
- Loading spinner during async operations
- Brief display section (expandable, collapsible)
- Error messages with graceful fallbacks

### 5. Brief Display & Editing (6k)
- Rich text display in prospect profile
- Edit brief content directly
- "Regenerate" button with custom prompt option
- Copy-to-clipboard functionality
- Read-only view mode for executives

### 6. Async Job Handling (6k)
- Background task queue (simple polling for MVP)
- API: `GET /api/leads/{id}/research-status`
- Progress updates to UI (WebSocket later, polling now)
- Retry logic for failed requests
- Timeout handling (30s default)

### 7. Error Handling (3k)
- Tavily timeout → show manual entry form
- Claude fail → show template brief
- Network errors → retry with exponential backoff
- Graceful degradation (app works even if AI fails)

---

## **DATABASE SCHEMA CHANGES**

```sql
-- New table for briefs
CREATE TABLE briefs (
    id UUID PRIMARY KEY,
    lead_id UUID NOT NULL,
    content TEXT NOT NULL,
    generated_at TIMESTAMP,
    model_version VARCHAR(50),
    FOREIGN KEY (lead_id) REFERENCES leads(id)
);

-- Extend prospects table
ALTER TABLE prospects ADD COLUMN tech_stack JSONB;
ALTER TABLE prospects ADD COLUMN research_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE prospects ADD COLUMN last_researched_at TIMESTAMP;
```

---

## **API ENDPOINTS**

```
POST /api/leads/{id}/research
├─ Start async research job
├─ Response: { job_id, status: "pending" }
└─ Triggers: Tavily fetch → tech detection → brief generation

GET /api/leads/{id}/research-status
├─ Check research job progress
└─ Response: { status, progress, brief_content (if complete) }

GET /api/leads/{id}/brief
├─ Fetch completed brief
└─ Response: { brief_id, content, generated_at }

PATCH /api/briefs/{id}
├─ Edit brief content
├─ Body: { content, custom_prompt (optional) }
└─ If custom_prompt: regenerate with new parameters

POST /api/briefs/{id}/regenerate
├─ Regenerate brief with optional custom prompt
└─ Response: { job_id, status: "in-progress" }
```

---

## **ACCEPTANCE CRITERIA**

- [ ] Click "Research" on a lead → Tavily API called successfully
- [ ] Research status updates in real-time (pending → complete)
- [ ] Brief displays in prospect profile within 30 seconds
- [ ] Brief is editable (user can modify and regenerate)
- [ ] Tech stack populated and displayed
- [ ] If Tavily times out → show manual entry fallback
- [ ] If Claude fails → show template brief
- [ ] Research data persists across sessions
- [ ] Multiple concurrent research jobs work (no conflicts)

---

## **TECH DETAILS**

**Async Approach:** 
- Simple approach for MVP: REST polling (5s interval)
- Future: WebSocket for real-time updates
- Background task: Python async queue or simple job table

**Database:** 
- Add `briefs` table
- Extend `prospects` with `tech_stack`, `research_status`

**Dependencies:**
- `tavily-python` (already in requirements.txt)
- `anthropic` (already in requirements.txt)
- `httpx` (already in requirements.txt)

**API Keys:**
- `TAVILY_API_KEY` ✅ Configured
- `ANTHROPIC_API_KEY` (assumed already set)

---

## **IMPLEMENTATION SEQUENCE**

1. **Database migrations** (add Briefs table, extend Prospects)
2. **Tavily API wrapper** (fetch company data, parse results)
3. **Tech stack detector** (analyze website tech)
4. **Claude brief generator** (craft multi-section prompt, handle streaming)
5. **Async job system** (queue, status tracking, polling)
6. **Backend API routes** (research, status, brief endpoints)
7. **Frontend UI** (Research button, status indicator, brief display)
8. **Error handling & logging** (graceful fallbacks, detailed logs)
9. **Testing & QA** (end-to-end flow, edge cases)

---

## **KNOWN LIMITATIONS (MVP)**

- No email/PDF export yet (Sprint 4)
- No proposal templates yet (Sprint 4)
- Polling-based status (not WebSocket)
- Single-model brief generation (not customizable prompts in first version)
- No multi-language support

---

## **SUCCESS METRICS**

✅ Research completes in <30 seconds for 80% of companies  
✅ Brief displays with proper formatting  
✅ No API timeout errors (graceful fallbacks)  
✅ Tech stack detected and displayed  
✅ Brief regeneration works with custom prompts  

---

**Status:** Ready to build  
**Approval:** CEO signed off ✅  
**Next Step:** Begin implementation
