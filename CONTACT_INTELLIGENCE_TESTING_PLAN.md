# Contact Intelligence Research — Testing & Verification Plan

**Objective:** Verify that Steps 1-7 of the contact intelligence research pipeline work end-to-end with real data, real external APIs, and produce accurate, evidence-backed briefings.

**Priority:** Functionality first. No mobile UI work proceeds until core research is solid.

---

## Testing Strategy

### Phase 1: Unit Tests (API Endpoints)
Test each step independently to isolate failures.

### Phase 2: Integration Tests (Full Pipeline)
Test Steps 1-7 end-to-end with real contacts.

### Phase 3: Real-World Validation
Test with various contact types and edge cases.

---

## Phase 1: Unit Tests — Individual Steps

### Step 1: Domain Resolution
**Test:** POST `/api/contacts/[id]/intelligence/research` starts, Step 1 completes

**What to verify:**
- [ ] Domain extracted from account website URL
- [ ] Domain extracted from company name if no website
- [ ] Domain confidence score set correctly (100 for URL, 80 for search)
- [ ] Domain stored in `contactIntelligenceProfile.companyDomain`
- [ ] Evidence record created for domain fact

**Test case:**
```
Contact: "John Doe" at "Plato Coffee"
Account Website: "https://platocoffee.co.za"
Expected: companyDomain = "platocoffee.co.za", confidence = 100
```

**How to test:**
1. Create a test contact with company + website
2. Call POST `/api/contacts/[id]/intelligence/research`
3. Wait 5 seconds, then GET `/api/contacts/[id]/intelligence/profile`
4. Verify `profile.companyDomain` is set

---

### Step 2: Company Web Research (Firecrawl)
**Test:** Step 2 crawls 8+ pages from company domain

**What to verify:**
- [ ] Firecrawl API credentials work (no 401/403)
- [ ] Pages crawled: homepage, about, team, leadership, news, blog, careers, etc.
- [ ] Content extracted (title, markdown, confidence)
- [ ] Crawl results stored in `companyResearchData.sources[]`
- [ ] Evidence records created for each page
- [ ] No duplicate URLs crawled

**Test case:**
```
Domain: "platocoffee.co.za"
Expected pages crawled:
  ✓ https://platocoffee.co.za/
  ✓ https://platocoffee.co.za/about
  ✓ https://platocoffee.co.za/team
  ✓ https://platocoffee.co.za/leadership
  ... (8+ total)
```

**How to test:**
1. Use contact from Step 1 test
2. Wait for Step 2 to complete (check `researchProgress.step2_company_web`)
3. Verify GET `/api/contacts/[id]/intelligence/profile` returns `companyResearchData.sources`
4. Spot-check: do sources have content? Do titles match expected pages?

**Potential issues:**
- ❌ Firecrawl 401: API key expired or invalid
- ❌ Firecrawl rate limiting: hitting request limits
- ❌ Domain not crawlable: private domain, blocked by robots.txt
- ❌ Content extraction failed: pages return 404 or are blocked

---

### Step 3: Individual Research (SerpAPI)
**Test:** Step 3 searches for person across 8 sources

**What to verify:**
- [ ] SerpAPI credentials work (no 401)
- [ ] 8 search queries generated correctly
- [ ] Search results returned (not empty)
- [ ] Results stored in `webResearchData.sources[]`
- [ ] Results scored for relevance (high/medium/low)
- [ ] Duplicate URLs deduplicated
- [ ] LinkedIn found (if person has profile)

**Test case:**
```
Name: "Stephan Bredell"
Company: "Plato Coffee"
Domain: "platocoffee.co.za"

Expected searches:
  1. "Stephan Bredell" "Plato Coffee"
  2. site:linkedin.com "Stephan Bredell"
  3. site:github.com "Stephan Bredell"
  4. site:medium.com "Stephan Bredell"
  5. site:platocoffee.co.za "Stephan Bredell"
  6. "Stephan Bredell" speaker
  7. "Stephan Bredell" author
  8. (additional)

Expected result: Find LinkedIn profile, company website mentions
```

**How to test:**
1. Wait for Step 3 completion
2. GET `/api/contacts/[id]/intelligence/profile` → check `webResearchData.sources`
3. Verify sources include LinkedIn (if person has profile)
4. Verify result count > 0
5. Spot-check: are results actually about this person?

**Potential issues:**
- ❌ SerpAPI 401: API key expired
- ❌ No results found: person too obscure or no online presence
- ❌ LinkedIn not found: person not on LinkedIn (OK, not a failure)
- ❌ Results irrelevant: name too common, multiple matches

---

### Step 4: Email Finding (Hunter → Apollo)
**Test:** Step 4 generates candidates and validates with Hunter

**What to verify:**
- [ ] 5 email candidates generated from name + domain
- [ ] Hunter API returns match (if email exists at domain)
- [ ] Email confidence score set (high 80+, medium 50-79, low <50)
- [ ] Apollo fallback used if Hunter returns nothing
- [ ] Email stored in `primaryEmail` + `emailConfidence`
- [ ] Email validation status tracked

**Test case:**
```
Name: "Stephan Bredell"
Domain: "platocoffee.co.za"

Generated candidates:
  1. stephan@platocoffee.co.za (most likely)
  2. stephan.bredell@platocoffee.co.za
  3. sbredell@platocoffee.co.za
  4. stephanb@platocoffee.co.za
  5. s.bredell@platocoffee.co.za

Expected: Hunter finds stephan@platocoffee.co.za (high confidence)
```

**How to test:**
1. Wait for Step 4 completion
2. GET `/api/contacts/[id]/intelligence/profile` → check `contact.email`, `profile.emailConfidence`
3. Verify email matches one of the candidates
4. Verify confidence score is reasonable (0-100)
5. Test with multiple contacts (some with email, some without)

**Potential issues:**
- ❌ Hunter 401: API key expired
- ❌ Apollo 401: API key expired
- ❌ No email found: person not at company email domain (OK, not critical)
- ❌ Multiple matches: Hunter returns wrong email

---

### Step 5: Career Summary (Claude Haiku)
**Test:** Step 5 synthesizes career history

**What to verify:**
- [ ] Career summary generated (not empty)
- [ ] Current role extracted correctly
- [ ] Previous roles listed (if found in sources)
- [ ] Facts marked as FACT or INFERENCE
- [ ] Industry experience identified
- [ ] Leadership/influence signals captured

**Test case:**
```
Input: Company content + web search results about Stephan
Expected output:
{
  currentRole: {
    title: "CEO and Co-Founder",
    company: "Plato Coffee",
    type: "FACT",
    source: "Company website"
  },
  previousRoles: [...],
  industryExperience: "Retail/Franchise",
  leadershipExperience: "Scaled company to 140+ locations",
  ...
}
```

**How to test:**
1. Wait for Step 5 completion
2. GET `/api/contacts/[id]/intelligence/profile` → check `careerSummary`
3. Verify currentRole matches known title
4. Verify FACT vs INFERENCE labeling is reasonable
5. Spot-check: does summary match what we know about person?

**Potential issues:**
- ❌ Claude API 401: API key/auth failed
- ❌ Empty response: prompt too vague or insufficient context
- ❌ Hallucination: Claude invents roles that don't exist
- ❌ Mislabeling: marks INFERENCE as FACT (bad)

---

### Step 6: Intelligence Scores (Claude Haiku)
**Test:** Step 6 calculates 6 scores (0-100)

**What to verify:**
- [ ] All 6 scores returned: decisionMaker, influence, technical, commercial, haloItsm, buying, confidence
- [ ] Scores in valid range (0-100)
- [ ] Scores are reasonable (CEO should have high decision maker score)
- [ ] Reasoning provided for each score
- [ ] Confidence score reflects data quality

**Test case:**
```
Input: Stephan (CEO, founder, retail franchise)
Expected scores:
  decisionMakerScore: 90+ (CEO)
  influenceScore: 60-70 (founder, but not mega-famous)
  technicalInfluence: 30-40 (no tech signals found)
  commercialInfluence: 85+ (founded/scaled company)
  haloItsmRelevance: 70+ (operations, multi-location = ITSM need)
  buyingRelevance: 85+ (decision maker + pain signals)
  confidenceScore: 80+ (good research data)
```

**How to test:**
1. Wait for Step 6 completion
2. GET `/api/contacts/[id]/intelligence/profile` → check profile scores
3. Verify all 6 scores are present and in 0-100 range
4. Spot-check: do scores make sense for this person's role?
5. Test with multiple contact types (exec, sales rep, engineer, etc.)

**Potential issues:**
- ❌ Claude API failure: no response
- ❌ Invalid JSON: parsing fails
- ❌ Unrealistic scores: all 50s, all 100s (not differentiated)
- ❌ Missing scores: only 5 returned instead of 6

---

### Step 7: Contact Briefing (Claude Sonnet)
**Test:** Step 7 generates actionable sales briefing

**What to verify:**
- [ ] Briefing generated (all sections present)
- [ ] Executive summary is 2-3 sentences
- [ ] Current role filled
- [ ] Responsibilities realistic (3-5 items)
- [ ] Likely priorities specific to company/role
- [ ] Pain points specific to company (not generic)
- [ ] Conversation starters are thoughtful questions
- [ ] Outreach angle is actionable
- [ ] Discovery questions are qualification-focused

**Test case:**
```
Input: Stephan at Plato Coffee (CEO, 140+ locations, franchise model)
Expected briefing sample:
{
  executiveSummary: "Founder and CEO of rapidly expanding franchise operation...",
  currentRole: "CEO and Co-Founder",
  responsibilities: [
    "Strategic expansion planning",
    "Technology and operations decisions",
    "Franchise partner support",
    "Risk management across multi-location network"
  ],
  likelyPriorities: [
    "Maintaining operational consistency across 140+ locations",
    "Supporting franchisees with tools and processes",
    "Managing technology across distributed network",
    "Scaling support infrastructure efficiently"
  ],
  potentialPainPoints: [
    "Scaling IT support across 140+ locations with limited central IT staff",
    "Ensuring consistent service levels between corporate and franchisee ops",
    ...
  ],
  conversationStarters: [
    "With 140+ locations, how do you currently handle IT service requests from franchisees?",
    "What's been your biggest operational challenge as you've scaled?",
    ...
  ],
  outreachAngle: "Position HaloITSM as the platform that gives franchisees self-service capability...",
  discoveryQuestions: [
    "What percentage of support issues could franchisees resolve themselves?",
    "How do you currently track SLA compliance across locations?",
    ...
  ]
}
```

**How to test:**
1. Wait for Step 7 completion
2. GET `/api/contacts/[id]/intelligence/profile` → check `briefing`
3. Verify all sections present
4. Read through briefing: does it make sense for this person?
5. Spot-check: are pain points specific (not generic)?
6. Spot-check: would these conversation starters actually be useful?

**Potential issues:**
- ❌ Claude API failure: timeout or error
- ❌ Invalid JSON: briefing not parseable
- ❌ Generic content: could apply to any CEO (not specific)
- ❌ Hallucination: invents false pain points
- ❌ Missing sections: only 4/8 fields returned

---

## Phase 2: Integration Tests — Full Pipeline

### Test Suite: Real Contacts

**Test Contact 1: "Stephan Bredell" at "Plato Coffee"**
```
Status: Known good case — CEO, company website exists, should find email
Expected outcome: All 7 steps succeed, email found, briefing generated
```

**Test Contact 2: "Unknown Person" at "Random Company"**
```
Status: Edge case — person may not have online presence
Expected outcome: Steps 1-4 may fail gracefully, graceful degradation
```

**Test Contact 3: "Your Own Name" at "Your Company"**
```
Status: Real-world case — uses your actual contact
Expected outcome: Full pipeline succeeds
```

**How to run:**
1. Create test contacts in database
2. POST `/api/contacts/[id]/intelligence/research` for each
3. Poll GET `/api/contacts/[id]/intelligence/profile` every 10s for 5 minutes
4. Track which steps complete, which fail
5. Document results:
   - Step completion time
   - Data quality (email confidence, score ranges, etc.)
   - Any errors or warnings in server logs

---

## Phase 3: Real-World Validation

### What to Check

**Data Quality:**
- [ ] Emails are valid (format correct, confidence reasonable)
- [ ] Briefings are specific (not generic, tied to company/role)
- [ ] Pain points are actionable (could pitch against them)
- [ ] Conversation starters are thoughtful (not generic interview questions)

**Evidence Quality:**
- [ ] Facts have sources (all traced back to URLs)
- [ ] Inferences have reasoning (not magic)
- [ ] Sources are credible (LinkedIn, company website, news, not random blogs)

**Error Handling:**
- [ ] What happens with no website? (fallback to search)
- [ ] What happens with no email found? (show candidates, let user pick)
- [ ] What happens with failed API call? (retry, fallback to cache, error message)
- [ ] What happens with invalid data? (graceful degradation, clear error)

---

## Test Execution Checklist

**Before testing:**
- [ ] All 3 API keys present in .env.local: `FIRECRAWL_API_KEY`, `HUNTER_API_KEY`, `APOLLO_API_KEY`, `SERPAPI_KEY`
- [ ] Vercel env vars updated (for production testing)
- [ ] Database connection working
- [ ] Server running and accessible

**During testing:**
- [ ] Monitor server logs for errors
- [ ] Check API quota usage (Firecrawl, Hunter, SerpAPI)
- [ ] Time each step (goal: <60s total, <1.5s for hero)
- [ ] Document any failures with: contact name, step number, error message, timestamp

**After testing:**
- [ ] Summarize results: X/Y contacts successful
- [ ] List any blockers or issues found
- [ ] Document edge cases discovered
- [ ] Clean up test data from database

---

## Success Criteria

✅ **All steps complete without error** for at least 3 test contacts
✅ **Email found** (or candidates available) for contacts with online presence
✅ **Briefing generated** is specific to person/company (not generic)
✅ **Evidence trail** exists for all facts and inferences
✅ **Performance** meets targets: <60s total, <1.5s for email visible
✅ **Graceful degradation** when external APIs fail (fallback, error message, don't crash)
✅ **No hallucinations** in Claude outputs (all claims traceable to sources)
✅ **Offline caching** works (research persists, can view without internet)

---

## Known Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| **Firecrawl quota exceeded** | Use free tier, monitor usage, batch requests |
| **Hunter API failure** | Apollo fallback, show email candidates, let user confirm |
| **SerpAPI blocks requests** | Stagger requests, use backoff, log for monitoring |
| **Claude hallucination** | Require evidence links, mark INFERENCE vs FACT, review outputs |
| **Network timeout** | Retry with backoff (2s → 8s), cache fallback, clear error message |
| **Invalid email** | Validate format, show confidence score, let user override |

---

## Next Steps After Testing

1. **If all tests pass:** ✅ Move to Wave 29 (or next priority)
2. **If some tests fail:** 🔧 Debug failures, fix root causes, re-test
3. **If critical failure:** 🛑 Address blockers (e.g., API key issues) before proceeding

---

## Testing Timeline

- **Day 1:** Run Phase 1 unit tests (Steps 1-7 individually)
- **Day 2:** Run Phase 2 integration tests (full pipeline, 3 contacts)
- **Day 3:** Phase 3 validation (data quality, edge cases, docs)
- **Day 4:** Fix any issues found, re-test
- **Day 5:** Sign-off on functionality, proceed to next wave

