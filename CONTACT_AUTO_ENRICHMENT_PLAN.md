# Contact Auto-Enrichment Implementation Plan
## Automatic Intelligence Gathering Without Manual Button Clicks

**Problem:** Sales reps must manually click "Run Contact Intelligence" for each contact, adding friction.

**Solution:** Auto-run intelligence in background based on smart pre-qualification rules.

---

## Architecture

### Pre-Qualification Rules

Contacts are scored 0-100. Score ≥30 triggers auto-enrichment.

| Rule | Points | Condition | Example |
|------|--------|-----------|---------|
| **Executive Role** | +40 | CEO, CTO, CFO, VP, Director, Founder | "CEO and Co-Founder" |
| **Primary Contact** | +30 | First contact for account | Contact marked as primary |
| **Recent Deal Activity** | +20 | Account has deals created <30 days ago | Fresh prospect |
| **No Existing Intel** | +25 | Contact has no intelligence data yet | New contact |
| **Stale Intelligence** | +15 | Last researched >7 days ago | Time to refresh |
| **Email Available** | +5 | Email on file | Can search LinkedIn/web |
| **LinkedIn Profile** | +5 | LinkedIn URL found | Direct research source |

### Priority Tiers

- **High (≥60 points):** Auto-enrich immediately, refresh every 7 days
  - Executives at accounts with active deals
  - Primary contacts with stale intel
- **Medium (35-59 points):** Auto-enrich on page load, refresh every 14 days
  - Non-executive decision-makers
  - Secondary contacts at high-value accounts
- **Low (<35 points):** Manual enrichment only
  - Junior staff, consultants, gatekeepers
  - Low-engagement contacts

### Example Scoring

**Contact: Stephan Bredell, CEO and Co-Founder at Plato Coffee**
```
Executive Role (CEO)         +40  ✓
Primary Contact              +30  ✓
Recent Deal Activity         +20  ✓ (Deal created 23 Jun 2026)
No Existing Intel            +25  ✓
Email Available              +5   ✗
LinkedIn Profile             +5   ✓
─────────────────────────────────
TOTAL SCORE:                125  → Capped at 100
PRIORITY:                   HIGH
ACTION:                     Auto-enrich on page load
```

---

## Implementation Steps

### Step 1: Update Contact Detail Page

**File:** `app/(app)/contacts/[id]/page.tsx`

```tsx
'use client';

import { useContactAutoEnrichment } from '@/lib/useContactAutoEnrichment';

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  const [contact, setContact] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);

  // Auto-enrichment hook
  const { isEnriching, hasAutoRun, autoEnrichmentQualification, manualRefresh } =
    useContactAutoEnrichment({
      contact,
      account,
      onEnrichmentStart: () => console.log('Auto-enriching...'),
      onEnrichmentComplete: (data) => {
        setContact(prev => ({
          ...prev,
          intelligenceData: data.contact.intelligenceData,
          lastResearchedAt: new Date(),
        }));
      },
      onEnrichmentError: (err) => toast(err.message, 'error'),
    });

  return (
    <div>
      {/* Existing header & content... */}

      {/* Intelligence Section */}
      <div className="space-y-4">
        {/* Show auto-enrichment status if running */}
        {isEnriching && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Researching contact intelligence...</p>
              <p className="text-xs text-blue-700 mt-1">{autoEnrichmentQualification?.reason}</p>
            </div>
          </div>
        )}

        {/* Intelligence Data Display */}
        {contact?.intelligenceData && !isEnriching && (
          <div className="border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Contact Intelligence</h3>
              <div className="flex items-center gap-2">
                {hasAutoRun && (
                  <span className="text-xs text-emerald-600 flex items-center gap-1">
                    <span>✓</span> Auto-researched
                  </span>
                )}
                <button
                  onClick={manualRefresh}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Display intelligence data... */}
            <div className="space-y-3">
              {contact.intelligenceData.background && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1">Background</p>
                  <p className="text-sm text-slate-700">{contact.intelligenceData.background}</p>
                </div>
              )}
              {/* ... more intelligence fields ... */}
            </div>
          </div>
        )}

        {/* No Intelligence Yet */}
        {!contact?.intelligenceData && !isEnriching && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
            <p className="text-sm text-slate-600 mb-3">No intelligence data yet.</p>
            <button
              onClick={manualRefresh}
              disabled={isEnriching}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              ★ Run Contact Intelligence
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Step 2: Update Contact Card Display

Show auto-enrichment status in contacts list:

```tsx
// In Contacts List (app/(app)/contacts/page.tsx)
<div className="flex items-center gap-2">
  {contact.intelligenceData?.confidence === 'High' ? (
    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
      ★ {contact.intelligenceData.decisionRole}
    </span>
  ) : (
    <span className="text-xs text-slate-400">—</span>
  )}
  {contact.lastResearchedAt && (
    <span className="text-[10px] text-slate-400">
      ⟳ {new Date(contact.lastResearchedAt).toLocaleDateString()}
    </span>
  )}
</div>
```

### Step 3: Account Page Integration

When viewing account details, show which contacts were auto-enriched:

```tsx
// In Account detail page
const contactsToDisplay = contacts.map(c => {
  const qualification = preQualifyContact(c, account);
  return {
    ...c,
    autoEnrichmentStatus: qualification.shouldAutoEnrich ? qualification.priority : 'manual',
    autoEnrichmentReason: qualification.reason,
  };
});

// Sort auto-enrich contacts first
contactsToDisplay.sort((a, b) => {
  const priorityOrder = { high: 0, medium: 1, low: 2, manual: 3 };
  return (priorityOrder[a.autoEnrichmentStatus] ?? 3) - (priorityOrder[b.autoEnrichmentStatus] ?? 3);
});
```

---

## User Experience Flow

### Current Flow (Manual)
```
User visits contact page
  → No intelligence shown
  → User clicks "Run Contact Intelligence" button
  → Wait 5-10 seconds
  → Intelligence appears
```

### New Flow (Auto-Enriched)
```
User visits contact page
  → System pre-qualifies contact (instant)
  → If qualifies: 🔍 "Researching..." spinner appears
  → Intelligence populates in background
  → User sees ✓ "Auto-researched" badge
  
If contact doesn't qualify:
  → No auto-run
  → Manual "Run Contact Intelligence" button still available
```

---

## Configuration & User Control

### System Defaults (in ENRICHMENT_CONFIG)

```typescript
{
  AUTO_RUN_ON_PAGE_LOAD: true,           // Auto-run when page loads
  AUTO_RUN_FOR_PRIORITIES: ['high', 'medium'], // Run for high/medium, skip low
  BACKGROUND_QUEUE_ENABLED: true,        // Process multiple contacts in background
  BATCH_SIZE: 5,                         // Process 5 at a time
  MAX_CONCURRENT: 3,                     // Max 3 simultaneous requests
  SHOW_ENRICHING_STATE: true,            // Show "Researching..." UI
  SHOW_CONFIDENCE_SCORE: true,           // Display confidence % on results
}
```

### User Preferences (Future Enhancement)

Allow reps to configure:
- ☑ "Auto-enrich high-priority contacts"
- ☑ "Auto-enrich medium-priority contacts"
- ☐ "Auto-enrich all contacts"
- ⚙ "Refresh stale intelligence (>7 days)"

---

## API Changes

### No new endpoints required

Uses existing `POST /api/contacts/[id]/intelligence` endpoint, just called automatically.

### Contact table updates

When auto-enriched, API response should include:
```json
{
  "contact": {
    "id": "...",
    "intelligenceData": { /* ... */ },
    "lastResearchedAt": "2026-06-23T...",
    "autoEnrichedAt": "2026-06-23T..." // NEW: timestamp of auto-run
  }
}
```

---

## Benefits

✅ **Zero friction** — No manual button clicks needed  
✅ **Smart prioritization** — Focuses on high-value contacts first  
✅ **Automatic refreshes** — Stale intelligence gets updated  
✅ **Transparent** — User sees what's being researched and why  
✅ **Configurable** — Can tune thresholds and priorities  
✅ **Scalable** — Background queue handles multiple contacts  

---

## Rollout Strategy

### Phase 1: Auto-enrich HIGH priority only
- Executives at accounts with active deals
- Primary contacts

### Phase 2: Add MEDIUM priority
- After Phase 1 stabilizes for 1 week
- Non-executive decision-makers
- Secondary contacts at high-value accounts

### Phase 3: User controls
- Settings page for reps to configure preferences
- Option to disable auto-enrichment per contact

---

## Monitoring & Success Metrics

Track:
- % of contacts auto-enriched on first visit
- Average time from page load to intelligence available
- Rep satisfaction (manual clicks eliminated?)
- Quality score of auto-run intelligence vs. manual
- Rate limiting issues (are we hitting API limits?)

---

## Notes

- **Caching:** Don't re-run if researched <7 days ago (configurable)
- **Rate limiting:** Batch process at 2s intervals to avoid throttling
- **Error handling:** If auto-run fails, still show manual button
- **Privacy:** All searches use existing SerpAPI/Claude keys, no new data collection
- **Performance:** Use `useEffect` with deps to avoid re-running on every render

---

## Files to Update

- `lib/contact-auto-enrichment.ts` ✓ Created
- `lib/useContactAutoEnrichment.ts` ✓ Created
- `app/(app)/contacts/[id]/page.tsx` — Hook up auto-enrichment
- `app/(app)/contacts/page.tsx` — Show auto-enrichment status in list
- `app/(app)/accounts/[id]/page.tsx` — Show which contacts auto-enriched
- Settings page (future) — User configuration options

---

## Next Steps

1. **Immediate:** Integrate hook into contact detail page
2. **Week 1:** Test with Phase 1 (high priority only)
3. **Week 2:** Add Phase 2 (medium priority)
4. **Week 3:** User testing & feedback
5. **Week 4:** Settings page for user control
