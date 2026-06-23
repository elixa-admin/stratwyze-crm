# Waves 27-29: Mobile-First Intelligence UI
## Progressive Enhancement for Field Sales Reps

**Vision:** Sales reps on the road access rich contact intelligence instantly, without friction. Every intelligence screen works flawlessly on mobile (≤768px viewport).

**Context:**
- Wave 22-26: Full Contact Intelligence Agent (desktop-centric)
- Wave 27-29: Mobile optimization + field-specific UX
- Users: Sales reps in meetings, calls, driving to appointments
- Network: LTE/5G (not always connected) + variable latency
- Goal: 95% of intelligence accessible in <3 seconds on mobile

---

## UX Principles for Mobile Sales

### 1. **Thumb-Friendly Interaction**
- Touch targets ≥48px × 48px minimum
- CTA buttons at bottom-of-screen (natural thumb zone)
- Avoid small pills, close buttons, tap-to-reveal interactions
- Swipe gestures only for secondary actions

### 2. **Information Scent (Hierarchy)**
- Hero card: decision maker score + contact name + primary email
- Expandable sections (not tabs) for detailed intel
- Progressive disclosure: summary → details → evidence
- No horizontal scrolling ever

### 3. **Offline-First Design**
- Cache last researched profile locally
- Show cached intelligence with "Last updated 2 hours ago" badge
- Spinner when refreshing (not blocking)
- Graceful degradation if offline

### 4. **Speed Over Beauty**
- Typography size fixed (no zooming needed)
- Hero intel loads first, evidence loads lazily
- Skeleton loaders for async sections
- Estimated 2-3s to see decision maker score + email

### 5. **Field Rep Context**
- One-handed operation (right-hand scrolling default)
- Copyable fields (email, phone, LinkedIn) with single tap
- Quick-dial phone button (green, prominent)
- Quick-copy email button (gray, secondary)

---

## Mobile Component Architecture

### Hero Card (Above the Fold)
```
┌─────────────────────────────────┐
│ ⬅ Back | Contact Name      ☆    │
├─────────────────────────────────┤
│                                 │
│  Decision Maker: 92/100  🔴     │
│  Buying Relevance: 89/100 🟢    │
│                                 │
│  stephan@platocoffee.co.za      │
│  📋 Copy Email  📞 Call         │
│                                 │
│  CEO and Co-Founder             │
│  Plato Coffee                   │
│                                 │
└─────────────────────────────────┘
```

**What loads first (critical):**
- Contact name
- Decision Maker + Buying Relevance scores (color-coded)
- Primary email with copy/call buttons
- Current title + company

**Load time: <1.5s**

---

### Expandable Intelligence Sections

```
┌─────────────────────────────────┐
│ ► 5 Likely Priorities           │  ← Collapsed
│   Tap to expand                 │
├─────────────────────────────────┤
│ ▼ Contact Briefing (Expanded)   │
│                                 │
│   Scaling operations across     │
│   140+ franchise locations.     │
│   Needs centralized IT support. │
│                                 │
│   [Read Full Briefing >]        │
├─────────────────────────────────┤
│ ► Pain Points (5)               │
│   Tap to expand                 │
├─────────────────────────────────┤
│ ► Conversation Starters (3)     │
│   Tap to expand                 │
├─────────────────────────────────┤
│ ► Evidence Sources (12)         │
│   Tap to expand                 │
└─────────────────────────────────┘
```

**Each section:**
- Collapsed by default (save space)
- Summary headline (1-2 lines) visible
- Tap to expand smoothly
- Snappy collapse/expand animation
- Collapse others when one opens (one-at-a-time)

---

### Full Briefing Sheet (Modal/Slide-Up)

When user taps "Read Full Briefing":

```
┌─────────────────────────────────┐
│ ⬅ Back                     ☆    │  ← Dismissible
├─────────────────────────────────┤
│ Briefing for Stephan Bredell    │
├─────────────────────────────────┤
│                                 │
│ Executive Summary               │
│ Founder and strategic           │
│ decision-maker at rapidly       │
│ expanding retail franchise...   │
│                                 │
│ Current Role & Responsibilities │
│ • Strategic expansion planning  │
│ • Technology decisions          │
│ • Franchise partner support     │
│                                 │
│ Likely Priorities               │
│ • Operational consistency       │
│ • Support infrastructure        │
│ • Technology modernization      │
│                                 │
│ [Conversation Starters >]       │
│ [Discovery Questions >]         │
│ [Outreach Angle >]              │
│                                 │
└─────────────────────────────────┘
```

**Behavior:**
- Slide up from bottom (iOS-native feel)
- Swipe down to dismiss
- Scrolls vertically within modal
- Back button at top dismisses

---

### Quick Actions (Bottom Bar)

Persistent footer on mobile:

```
┌─────────────────────────────────┐
│ Contact Intelligence (scrollable)
│                                 │
│                                 │
├─────────────────────────────────┤
│ 📧 COPY EMAIL  📞 CALL  ⟳ REFRESH │  ← Sticky footer
└─────────────────────────────────┘
```

**Buttons:**
- **COPY EMAIL:** Copies to clipboard, shows "Copied!" toast (2s)
- **CALL:** Opens Phone app with number pre-filled
- **REFRESH:** Spins, refetches latest intelligence, shows toast

**Spacing:**
- 3 buttons, equal width
- 16px padding top/bottom
- 8px padding left/right per button
- Always visible (fixed to bottom)

---

## Mobile-Specific Features

### 1. **Offline Cache**
```typescript
// lib/contact-intelligence/mobile-cache.ts
export function cacheProfile(profile: IntelligenceProfile) {
  localStorage.setItem(
    `profile_${contactId}`,
    JSON.stringify({ profile, cachedAt: Date.now() })
  );
}

export function getCachedProfile(contactId: string) {
  const cached = localStorage.getItem(`profile_${contactId}`);
  if (!cached) return null;
  const { profile, cachedAt } = JSON.parse(cached);
  const hoursSince = (Date.now() - cachedAt) / 3600000;
  return {
    profile,
    isStale: hoursSince > 2,
    cachedAt: new Date(cachedAt),
  };
}
```

### 2. **Native Share**
```typescript
if (navigator.share) {
  // iOS/Android native share
  navigator.share({
    title: `${contact.name} - ${contact.company}`,
    text: briefing.executiveSummary,
    url: window.location.href,
  });
} else {
  // Fallback: copy to clipboard
}
```

### 3. **Quick Dial / Quick Email**
```typescript
// Call
window.location.href = `tel:${contact.phone}`;

// Email
window.location.href = `mailto:${contact.email}?subject=Following up...`;
```

### 4. **Swipe-to-Dismiss**
```typescript
// Pan gesture: swipe down to dismiss briefing modal
// Use react-use-gesture + framer-motion
onPan={(event, info) => {
  if (info.offset.y > 100) {
    dismissModal();
  }
}}
```

---

## Implementation Roadmap

### Wave 27: Mobile Hero Card + Caching (1 week, 18k tokens)

**What:**
- Responsive hero card (mobile-optimized)
- Offline cache with localStorage
- Sticky bottom action bar
- Copy email + Call buttons

**Components:**
- `components/contacts/mobile/HeroCard.tsx` — decision scores, email, action buttons
- `components/contacts/mobile/ActionBar.tsx` — sticky footer with quick actions
- `lib/contact-intelligence/mobile-cache.ts` — offline caching logic
- `hooks/useMobileIntelligence.ts` — hero card data fetching

**Acceptance Criteria:**
- ✅ Hero card renders in <1.5s on 4G
- ✅ Copy email button works, shows toast
- ✅ Call button opens Phone app
- ✅ Works offline with cached data
- ✅ 48px touch targets minimum

---

### Wave 28: Expandable Sections + Briefing Modal (1 week, 20k tokens)

**What:**
- Collapsible intelligence sections (priorities, pain points, etc.)
- Full briefing slide-up modal
- Swipe-to-dismiss gesture
- Lazy-loaded evidence

**Components:**
- `components/contacts/mobile/IntelligenceSection.tsx` — collapsible with smooth animation
- `components/contacts/mobile/BriefingModal.tsx` — slide-up modal with swipe support
- `components/contacts/mobile/EvidenceList.tsx` — lazy-loaded evidence sources

**Acceptance Criteria:**
- ✅ Sections expand/collapse smoothly
- ✅ Only one section open at a time
- ✅ Modal slides up from bottom
- ✅ Swipe down dismisses modal
- ✅ Evidence lazy-loads as user scrolls

---

### Wave 29: Mobile Optimization + Native Features (1 week, 22k tokens)

**What:**
- Native share buttons (iOS/Android)
- PWA install prompt
- Refresh button with retry logic
- Responsive typography (fluid scaling)
- Dark mode for low-light field use

**Components:**
- `components/contacts/mobile/ShareButton.tsx` — navigator.share wrapper
- `hooks/useRefreshIntelligence.ts` — retry logic, exponential backoff
- `lib/mobile-typography.ts` — fluid scaling based on viewport
- `styles/mobile-dark-mode.css` — field-rep-friendly dark theme

**Features:**
- Native iOS share → AirDrop to colleagues
- Native Android share → Messages, Slack
- Refresh button shows 3-dot spinner while loading
- Exponential backoff: fail → retry after 2s → retry after 8s → show error
- Dark mode toggle (or auto-detect device preference)

**Acceptance Criteria:**
- ✅ Share button opens native share on iOS/Android
- ✅ Refresh retries on network failure
- ✅ Typography readable at arm's length in sunlight
- ✅ Dark mode reduces eye strain on field calls
- ✅ Works as PWA (installable to home screen)

---

## Mobile-Specific Interactions

### Copy Email (Toast Flow)
```
1. User taps "📧 COPY EMAIL"
2. Email copied to clipboard
3. Toast: "Email copied!" (2s auto-dismiss)
4. Button stays in original state
```

### Call Contact (Deep Link)
```
1. User taps "📞 CALL"
2. Phone app opens with number dialed
3. After call, user returns to CRM
```

### Refresh Intelligence (Retry Flow)
```
1. User taps "⟳ REFRESH"
2. Button shows spinning icon
3. Request sent to /api/contacts/[id]/intelligence/profile
4. On success: update display, toast "Updated!"
5. On error: retry after 2s (show spinner)
6. After 2nd retry fail: show error toast, disable button
```

### Expand Section (Collapse Others)
```
1. User taps "► 5 Likely Priorities"
2. Smooth expand animation (200ms)
3. Auto-collapse any open section
4. Content appears with staggered reveal (list items fade in)
```

---

## Responsive Breakpoints

```css
/* Mobile First */
@media (max-width: 768px) {
  /* Mobile optimizations */
  --button-height: 56px;  /* Thumb-friendly */
  --action-bar-height: 72px;
  --padding-base: 16px;
}

@media (min-width: 769px) {
  /* Tablet+ (iPad, desktop) */
  --button-height: 44px;
  --action-bar-height: 56px;
  --padding-base: 24px;
  
  /* Briefing modal becomes side panel */
  /* Action bar moves to top-right */
}
```

---

## Performance Targets (Mobile)

| Metric | Target | Method |
|--------|--------|--------|
| First paint | <1.5s | Hero card pre-loads on page transition |
| Time to email visible | <1.5s | Email loads in hero, cached locally |
| Tap to action | <200ms | Use native tap feedback, no delay |
| Scroll FPS | 60fps | Virtualize long lists, reduce animations |
| Cache hit (offline) | >80% | Auto-cache on every profile view |
| Network retry time | <10s total | Exponential backoff (2s → 8s) |

---

## Mobile Navigation Pattern

```
Sales Pipeline
    ↓
Deal Card (tap)
    ↓
Deal Detail Page
    ↓
Contacts Section
    ↓
Contact Card (tap)
    ↓
Contact Intelligence Screen ← YOU ARE HERE
    ├─ Hero Card (instant)
    ├─ Action Bar (sticky bottom)
    ├─ Expandable Sections
    ├─ Briefing Modal (tap to open)
    └─ Evidence List (lazy-loaded)
    
    ← Swipe back or tap Back button to return
```

---

## Accessibility (WCAG AA on Mobile)

- ✅ Touch targets ≥48px
- ✅ Color contrast ≥4.5:1
- ✅ Semantic HTML (buttons are `<button>`, not `<div>`)
- ✅ ARIA labels on action buttons
- ✅ Focus visible on all interactive elements
- ✅ Reduced motion respected (`prefers-reduced-motion`)

---

## Timeline & Token Budget

| Wave | Focus | Duration | Tokens | Cumulative |
|------|-------|----------|--------|-----------|
| 27 | Hero Card + Cache | 1 week | 18k | 18k |
| 28 | Sections + Modal | 1 week | 20k | 38k |
| 29 | Polish + Native | 1 week | 22k | 60k |

**Total: 3 weeks, 60k tokens**

---

## Success Metrics

- 📊 Mobile traffic >40% of total visits
- ⚡ Mobile LCP (Largest Contentful Paint) <2.5s
- 👆 Touch target tap success rate >98%
- 🔄 Offline cache hit rate >75%
- ⭐ Mobile app store rating >4.5 stars
- 📞 Quick-call button usage >35% of reps

---

## After Wave 29: Natural Next Steps

1. **Wave 30:** AI-powered meeting notes integration (voice → intelligence sync)
2. **Wave 31:** Deal stage transitions (mobile pipeline Kanban)
3. **Wave 32:** Team collaboration (share intel, comment on profiles)
4. **Wave 33:** Mobile CRM sync (offline-first data replication)
