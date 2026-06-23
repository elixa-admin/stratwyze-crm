# Contact Intelligence Agent — External Service Integration Checklist

I've built the complete infrastructure for the Contact Intelligence Agent. **All code compiles and type-checks.** Now I need specific details for integrating the external services to complete Steps 2-4.

---

## WHAT'S BUILT ✅

**Database & API:** 
- ✅ ContactIntelligenceProfile & ContactIntelligenceEvidence tables
- ✅ POST /api/contacts/[id]/intelligence/research (triggers workflow)
- ✅ GET /api/contacts/[id]/intelligence/profile (fetches profiles)
- ✅ Research utility functions
- ✅ React hook for triggering & polling research

**Steps 1-4 Infrastructure (placeholder implementations ready):**
- ✅ Step 1: Domain resolution (can work without external APIs)
- ⏳ Step 2: Company web research (needs Firecrawl)
- ⏳ Step 3: Individual research (needs web search)
- ⏳ Step 4: Email finding (needs Hunter validation)

---

## WHAT I NEED FROM YOU

### 1. **Web Search (Step 3: Research Individual)**

**Current status:** Using SerpAPI from Wave 22. Confirm:
- [ ] Do you want to continue using **SerpAPI** for individual web searches?
  - If YES: I'll reuse the existing SerpAPI integration from `lib/market-data.ts`
  - If NO: What alternative? (Google Custom Search, Serper, DuckDuckGo API, etc.)

**Answer needed:** YES (use SerpAPI) / NO (specify alternative)

---

### 2. **Website Crawling (Step 2: Company Web Research)**

**Current status:** Needs integration. Choose ONE:

**Option A: Firecrawl (Recommended)**
- [ ] Do you have a **Firecrawl API key**?
  - If YES: Paste it below (or confirm it's already in .env.local as `FIRECRAWL_API_KEY`)
  - If NO: Would you like me to implement Firecrawl? (Free tier: 300 credits/mo)

**Option B: Alternative Crawler**
- [ ] If not Firecrawl, which tool?
  - Puppeteer (headless browser, local)
  - Playwright (headless browser, local)
  - Cheerio (HTML parsing, lightweight)
  - Other: _________

**Answer needed:** 
- [ ] Firecrawl API key: `_______________` OR
- [ ] Alternative tool: `_______________`

---

### 3. **Email Validation (Step 4: Find & Validate Email)**

**Current status:** Needs integration. Choose ONE:

**Option A: Hunter.io (Recommended)**
- [ ] Do you have a **Hunter API key**?
  - If YES: Paste it below (or confirm it's in .env.local as `HUNTER_API_KEY`)
  - If NO: Free tier exists? Would you want it set up?

**Option B: Alternative Email Finder**
- [ ] If not Hunter, which tool?
  - RocketReach (paid)
  - Apollo.io (free tier available)
  - EmailFinder (free)
  - Clearbit (high accuracy, paid)
  - Other: _________

**Answer needed:**
- [ ] Hunter API key: `_______________` OR
- [ ] Alternative tool: `_______________`

---

### 4. **Background Job Processing (Optional)**

**Question:** How should research run in the background?

- [ ] **Option A: Synchronous** (endpoint waits for full research, ~45-60s timeout)
  - Simpler, no queue needed
  - User sees final result on one page load

- [ ] **Option B: Async with Queue** (endpoint returns immediately, research happens in background)
  - More scalable
  - Needs: Bull (Redis queue), bun, or similar
  - User polls for progress

**Recommendation:** Option A for MVP (simpler). Move to Option B if research gets too slow.

**Answer needed:** Option A / Option B

---

### 5. **Auto-Enrichment Strategy (Optional)**

**Question:** Should contacts auto-research or require manual trigger?

- [ ] **Option A: Manual Only**
  - User clicks "Research Intelligence" button
  - Simple, no surprises
  
- [ ] **Option B: Auto on Contact View**
  - Auto-runs when sales rep opens contact page
  - No button needed
  - Requires smart caching (don't re-run if <7 days old)

- [ ] **Option C: Auto on Contact Creation**
  - Auto-runs immediately after contact is created
  - Requires async/queue (can't block deal creation)

**Recommendation:** Option A (manual) for MVP. Easy to upgrade later.

**Answer needed:** Option A / Option B / Option C

---

## IMMEDIATE NEXT STEPS

**Once I have answers to the 5 questions above:**

1. I'll integrate Firecrawl (or alternative) → Step 2 complete
2. I'll verify SerpAPI integration → Step 3 complete
3. I'll integrate Hunter (or alternative) → Step 4 complete
4. I'll build the React UI component to display briefings
5. I'll implement Steps 5-7 (career summary, scores, briefing generation)
6. Full end-to-end test
7. Deploy to production

**Estimated timeline with your inputs:** 
- Step 2-4 integration: 2-3 hours
- Steps 5-7 + UI: 3-4 hours
- Testing & deployment: 1-2 hours
- **Total: 6-9 hours to fully working Contact Intelligence Agent**

---

## QUICK REFERENCE: What Each Step Does

| Step | Input | External Service | Output |
|------|-------|------------------|--------|
| 1 | Company name / website | None | `company_domain` |
| 2 | company_domain | **Firecrawl** (or alt) | `companyResearchData` (homepage, about, team, news, etc.) |
| 3 | Contact name + company | **SerpAPI** (or alt) | `webResearchData` (LinkedIn, GitHub, Medium, etc.) |
| 4 | Contact name + company_domain | **Hunter** (or alt) | `emailCandidates` + validation |
| 5 | All of above | Claude (in-house) | `careerSummary` |
| 6 | All of above | Claude (in-house) | Intelligence scores (0-100 on 6 dimensions) |
| 7 | All of above | Claude (in-house) | Contact briefing (sales-ready insights) |

---

## ANSWER FORMAT

Please reply with:

```
1. Web Search: YES (use SerpAPI) / NO (use: _______)
2. Website Crawling: Firecrawl API key: _______ OR Alternative: _______
3. Email Validation: Hunter API key: _______ OR Alternative: _______
4. Background Processing: Option A / Option B
5. Auto-Enrichment: Option A / Option B / Option C
```

That's all I need to complete the integration!
