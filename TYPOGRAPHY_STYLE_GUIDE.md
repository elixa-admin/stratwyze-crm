# Typography & Font Sizing Style Guide
## Standardized Throughout Stratwyze CRM

**Goal:** Ensure consistent font sizing and hierarchy across all pages and components.

---

## Typography Scale

### Headings

| Level | Usage | Tailwind Class | Example |
|-------|-------|---|---|
| **H1** | Page titles (Deals, Accounts, Dashboard) | `text-3xl font-bold text-slate-900` | "Deals Pipeline" |
| **H2** | Major section headers (within cards, modals) | `text-lg font-bold text-slate-900` | "Company Intelligence" |
| **H3** | Subsection headers (card titles, form sections) | `text-base font-semibold text-slate-900` | "Opportunity Profile" |
| **Card Title** | Card/panel headers | `text-sm font-bold text-slate-900 uppercase tracking-wide` | "COMPANY INTEL" |
| **Card Subtitle** | Secondary card headers | `text-xs font-semibold text-slate-600 uppercase tracking-wide` | "RECENT NEWS" |

### Body Text

| Level | Usage | Tailwind Class | Example |
|-------|-------|---|---|
| **Body Large** | Intro paragraphs, important text | `text-base leading-relaxed text-slate-700` | Opening statements, brief copy |
| **Body Standard** | Main body text, descriptions | `text-sm leading-relaxed text-slate-700` | Win statements, company snapshots |
| **Body Small** | Secondary text, descriptions | `text-xs leading-relaxed text-slate-600` | Metadata, captions, helper text |

### Labels & Highlights

| Element | Usage | Tailwind Class | Example |
|---------|-------|---|---|
| **Label** | Form labels, metadata tags | `text-xs font-semibold text-slate-600` | "Revenue", "Employees" |
| **Label Bold** | Required indicators, status | `text-xs font-bold text-slate-900` | "Required *", "ACTIVE" |
| **Highlight** | Important values, key stats | `text-sm font-semibold text-slate-900` | Company revenue figures |
| **Stat** | Large numbers (dashboard, summary) | `text-2xl font-bold text-slate-900` | Deal pipeline total |
| **Stat Label** | Label for stats | `text-xs font-semibold text-slate-500 uppercase tracking-wide` | "Total Pipeline" |

### Special Elements

| Element | Usage | Tailwind Class |
|---------|-------|---|
| **List Items** | Bulleted/numbered lists | `text-sm text-slate-700 leading-relaxed` |
| **List Items (Small)** | Dense lists, secondary info | `text-xs text-slate-600 leading-relaxed` |
| **Badge** | Pills, tags, status badges | `text-xs font-semibold` |
| **Button** | Button text | `text-sm font-semibold` |
| **Links** | Hyperlinks | `text-sm text-blue-600 hover:text-blue-700 hover:underline` |
| **Error** | Error messages | `text-xs font-medium text-red-600` |
| **Success** | Success messages | `text-xs font-medium text-emerald-600` |
| **Warning** | Warning messages | `text-xs font-medium text-amber-600` |

---

## Spacing Coordination

Always pair typography with consistent spacing for **vertical rhythm**:

```tsx
// SECTION-LEVEL spacing (large visual breaks)
<div className="p-6 space-y-6">
  <h2 className="text-lg font-bold text-slate-900">Section Title</h2>
  {/* 6 units between major sections */}
</div>

// CARD-LEVEL spacing (content grouping)
<div className="p-4 space-y-4">
  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Card Title</h3>
  {/* 4 units between card items */}
</div>

// ITEM-LEVEL spacing (individual elements)
<ul className="space-y-2">
  <li className="text-sm text-slate-700">Item one</li>
  <li className="text-sm text-slate-700">Item two</li>
  {/* 2 units between list items */}
</ul>

// DENSE spacing (minimal, inline)
<div className="space-y-1">
  <p className="text-xs text-slate-500">Metadata</p>
  {/* 1 unit between dense elements */}
</div>
```

---

## Implementation

### Use the Typography Constants (Recommended)

```tsx
import { TYPOGRAPHY, SPACING_TYPOGRAPHY } from '@/lib/typography';

export default function MyComponent() {
  return (
    <div className={SPACING_TYPOGRAPHY.SECTION}>
      <h1 className={TYPOGRAPHY.PAGE_TITLE}>My Page</h1>
      
      <div className={SPACING_TYPOGRAPHY.CARD}>
        <h2 className={TYPOGRAPHY.CARD_TITLE}>Card Header</h2>
        <p className={TYPOGRAPHY.BODY}>Card content goes here.</p>
      </div>
    </div>
  );
}
```

### Or Use Inline Classes (If Not Refactored Yet)

Apply classes from the scale above directly to elements.

---

## Examples by Component

### Deal Card

```tsx
<div className="p-4 space-y-2 border border-slate-200 rounded-lg">
  <h3 className="text-sm font-bold text-slate-900">Deal Title</h3>
  <p className="text-xs text-slate-600">Company Name</p>
  <p className="text-lg font-bold text-slate-900">R250,000</p>
</div>
```

**Typography mapping:**
- Title → `text-sm font-bold` (CARD_TITLE equivalent)
- Subtitle → `text-xs text-slate-600` (LABEL equivalent)
- Value → `text-lg font-bold` (STAT equivalent)

---

### Brief Section (LinkedIn Insights, Discovery Questions, Risks)

```tsx
<div className="p-4 space-y-4 border border-slate-200 rounded-lg bg-blue-50">
  {/* Section Header */}
  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">LinkedIn Insights</h3>
  
  {/* Body Content */}
  <ul className="space-y-2">
    <li className="text-sm text-slate-700 leading-relaxed">Followers: 500-2000</li>
    <li className="text-sm text-slate-700 leading-relaxed">Growth: Rapid location expansion</li>
  </ul>
  
  {/* Call-out */}
  <p className="text-xs text-slate-600 italic">Notable hires: No specific key hires mentioned</p>
</div>
```

**Typography mapping:**
- Section header → `text-sm font-bold uppercase` (CARD_TITLE)
- List items → `text-sm leading-relaxed` (LIST_ITEM)
- Secondary text → `text-xs text-slate-600` (LABEL or BODY_SM)

---

### Opening/Win Statements (Competitive Brief)

```tsx
<div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Opening Statement</p>
  <p className="text-sm leading-relaxed text-slate-900">Long-form text describing the opening...</p>
</div>
```

**Typography mapping:**
- Header → `text-xs font-semibold uppercase` (CARD_SUBTITLE)
- Body → `text-sm leading-relaxed` (BODY)

---

### Red Flags & Risks

```tsx
<div className="p-4 border border-red-200 rounded-lg bg-red-50">
  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
    <span>⚠️</span> Red Flags & Risks
  </h3>
  <ul className="space-y-2">
    <li className="text-sm text-red-700 flex gap-2 leading-relaxed">
      <span className="text-red-400 flex-shrink-0">•</span>
      <span>Risk description goes here</span>
    </li>
  </ul>
</div>
```

**Typography mapping:**
- Header → `text-sm font-bold uppercase` (CARD_TITLE)
- Risk items → `text-sm leading-relaxed` (LIST_ITEM, colored red)

---

## Color + Typography Combinations (Quick Reference)

| Component | Text Size | Font Weight | Color Class | Example Location |
|-----------|-----------|------------|-------------|-------------------|
| Page Title | `text-3xl` | bold | `text-slate-900` | "Deals", "Accounts" |
| Section Header | `text-lg` | bold | `text-slate-900` | Card titles in sidebars |
| Card Header | `text-sm` | bold | `text-slate-900` uppercase | "COMPANY INTEL", "RISKS" |
| Body Text | `text-sm` | normal | `text-slate-700` | Brief content, descriptions |
| Secondary Text | `text-xs` | normal | `text-slate-600` | Metadata, captions |
| Highlight Value | `text-sm` | semibold | `text-slate-900` | Revenue figures, stats |
| Error/Warning | `text-xs` | medium | `text-red-600` / `text-amber-600` | Error messages |

---

## Migration Checklist

As components are refactored to use the standard typography:

- [ ] OpportunityProfileSidebar
- [ ] NewDealModal (Brief Display)
- [ ] Deal Detail Page (All sections)
- [ ] Contacts Page
- [ ] Accounts Page
- [ ] Dashboard
- [ ] Pipeline Kanban
- [ ] Activity Feed

---

## Notes

1. **Always include `leading-relaxed`** on body text for readability (default 1.5 line height)
2. **Use `uppercase tracking-wide`** on small headers for visual distinction
3. **Pair spacing with typography** — section headers get `space-y-6` around them
4. **Color & size work together** — don't just use size, coordinate with color/weight
5. **Reserve `text-3xl` for page titles only** — overuse dilutes hierarchy
6. **Icons next to text** — align with margin-top for vertical centering

---

## Files

- `lib/typography.ts` — Constants for all typography classes
- This guide — Reference for when to apply what

When adding new components, reference this guide and use the constants from `typography.ts`.
