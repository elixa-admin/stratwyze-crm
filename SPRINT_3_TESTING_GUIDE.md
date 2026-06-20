# Sprint 3 Testing Guide — Beautiful Dashboard & Kanban Board

**Status:** ✅ Ready for Testing  
**Features:** Kanban pipeline board + CEO dashboard metrics  
**Servers:** Running on localhost:8000 (backend) and localhost:3000 (frontend)

---

## **QUICK START (5 minutes)**

### Step 1: Create Test Data
```bash
# This populates the Kanban board with sample opportunities
curl -X POST http://localhost:8000/api/demo/create-test-data
```

### Step 2: Log In
Navigate to:
```
http://localhost:3000/login
```
Use any test credentials (or create an account first if needed)

### Step 3: View the Dashboard
```
http://localhost:3000/dashboard
```

You'll see two tabs:
- **📊 Metrics** — CEO dashboard with KPI cards
- **📋 Pipeline** — Beautiful Kanban board

---

## **WHAT YOU'RE TESTING**

### ✅ CEO Metrics Dashboard
4 key metric cards:
- **Total Pipeline** — Sum of all deals weighted by probability (in $)
- **Win Rate** — Percentage of closed deals that were won
- **Forecast** — Sum of all open opportunities
- **Deals Created** — Number of deals created this month

Below: Pipeline breakdown by stage (Discovery, Proposal, Negotiation, Won, Lost)

### ✅ Kanban Pipeline Board
5 stage columns with deal cards:
- **Discovery** (Blue) — Early-stage opportunities
- **Proposal** (Yellow) — Proposal sent, awaiting response
- **Negotiation** (Orange) — Active negotiations
- **Closed Won** (Green) — Closed deals
- **Closed Lost** (Red) — Lost opportunities

**Each card shows:**
- Company/deal name (large)
- Deal value ($) in bold blue
- Win probability as a progress bar
- Close date (if set)

**Drag & Drop:** You can drag cards between stages (though it may not persist to backend yet)

---

## **TEST CHECKLIST**

- [ ] Login page works
- [ ] Dashboard loads (no errors in console)
- [ ] Metrics tab shows 4 cards with numbers
- [ ] Pipeline tab shows 5 stage columns
- [ ] Sample opportunities appear in the correct stages
- [ ] Deal values and probabilities display correctly
- [ ] Cards look professional (colors, spacing, shadows)
- [ ] Navigation tabs switch views smoothly
- [ ] Desktop layout looks polished

---

## **FEEDBACK QUESTIONS**

After testing, please answer:

1. **Visual Polish** — Does the Kanban board look like a premium app? (1-10)
2. **Dashboard Metrics** — Are the numbers useful? (1-10)
3. **Navigation** — Is it easy to switch between views?
4. **Colors** — Do the stage colors help distinguish pipelines visually?
5. **Missing** — What's the #1 thing that needs improvement?

---

## **TECHNICAL NOTES**

### Sample Data
The test data endpoint creates 5 sample opportunities:
- 2 in Discovery stage
- 2 in Proposal stage
- 1 in Closed Won stage

Total pipeline value: ~$500k
Average probability: ~51%

### API Endpoints (For Reference)
```
GET  /api/opportunities          → List all opportunities by stage
POST /api/opportunities          → Create new opportunity
PATCH /api/opportunities/{id}    → Update opportunity (move stage, change probability)

GET  /api/dashboard/metrics      → Get all KPI metrics
POST /api/demo/create-test-data  → Create sample opportunities for testing
```

### Color Coding
```
Discovery:   Blue (#2563EB)    — Early stage, high probability of loss
Proposal:    Yellow (#F59E0B)  — Formal proposal sent
Negotiation: Orange (#FB923C)  — Active deal management
Closed Won:  Green (#10B981)   — Successful close
Closed Lost: Red (#EF4444)     — Lost deal
```

---

## **KNOWN LIMITATIONS (MVP)**

- Drag & drop cards don't persist to backend yet (frontend only)
- No detailed opportunity/deal view yet (click doesn't do anything)
- Mobile responsiveness deferred to Wave 2
- No animations yet (keep it simple for now)
- Test data endpoint doesn't check for duplicates on multiple calls

---

## **NEXT STEPS AFTER TESTING**

Once you've tested and given feedback:
1. We'll refine the design based on your feedback
2. Wire up drag-drop to actually update the backend
3. Add opportunity detail pages
4. Prepare for Wave 2 (proposals, advanced analytics)

---

**Ready to test?** Go to `http://localhost:3000/dashboard` 🚀

