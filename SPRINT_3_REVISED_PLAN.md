# Sprint 3 REVISED: Design-First Pipeline & Dashboard

**Focus:** Beautiful UI/UX over advanced features  
**Timeline:** 5-7 days  
**Budget:** 50-55k tokens  
**Theme:** "Make it look like Stripe / Linear, not a generic CRM"

---

## **CORE DELIVERABLES**

### 1. Gorgeous Kanban Pipeline Board (20k)
**The main event — your sales team lives here**

**Design Goals:**
- Smooth drag-drop animations (not janky)
- 5 stage columns: Discovery, Proposal, Negotiation, Closed Won, Closed Lost
- Beautiful deal cards with:
  - Company name + logo placeholder
  - Deal value ($50K, $500K, etc.) in large, bold text
  - Win probability (0-100%) as a progress bar
  - 2-3 key metrics (owner, close date, last activity)
  - Color-coded stage badges
- Responsive: Works great on desktop, good on tablet
- Empty state messaging ("No deals yet")
- Smooth transitions when moving between stages

**Tech Stack:**
- React component with dnd-kit (better than react-beautiful-dnd)
- Tailwind CSS with custom animations
- Recharts for small inline charts (optional, in cards)

**Visual Polish:**
- Cards have subtle shadows, hover lift effect
- Stage columns have light background color
- Deal values displayed prominently
- Avatar placeholders for assignee
- Smooth loading spinner while updating

---

### 2. Executive Dashboard Redesign (15k)
**KPI metrics presented beautifully, not just as tables**

**Layout:**
- Top row: 4 metric cards
  - Total Pipeline Value ($)
  - Win Rate (%)
  - Forecast (weighted value)
  - Deals This Month
- Middle: Two-column layout
  - Left: Pipeline by stage (bar chart, colorful)
  - Right: Sales cycle trend (line chart, last 90 days)
- Bottom: Recent activity feed (last 10 deals, clean timeline)

**Design:**
- Large, readable numbers (40-50px font)
- Color-coded by metric (green=good, orange=warning, blue=info)
- Subtle icons next to labels
- Responsive: Stacks vertically on mobile
- Loading skeleton while data fetches

---

### 3. Navigation & Layout Overhaul (8k)
**Make the app feel intuitive and premium**

**Sidebar Navigation:**
- Clean, minimalist design
- Icons + labels for: Dashboard, Leads, Pipeline, Research
- Active page highlighted
- Collapsible on mobile
- Company logo at top
- User menu at bottom (profile, settings, logout)

**Top Navigation:**
- Breadcrumb trail (Home > Leads > John Smith)
- Search bar (search leads/deals)
- User avatar + notification icon

**Page Layouts:**
- Consistent max-width and padding
- Clear page titles with subtitle
- Consistent spacing between sections

---

### 4. Visual Design System (7k)
**Consistency across the entire app**

**Color Palette:**
- Primary: Blue (#2563EB)
- Success: Green (#10B981)
- Warning: Amber (#F59E0B)
- Error: Red (#EF4444)
- Neutral: Grays (#F3F4F6 to #1F2937)

**Typography:**
- Headings: Inter Bold (24px, 20px, 18px, 16px)
- Body: Inter Regular (14px, 14px base)
- Mono: Jetbrains Mono (for data, IDs)

**Components:**
- Button styles (primary, secondary, ghost)
- Card layouts (consistent padding, shadows, borders)
- Form inputs (focused state, error state, disabled state)
- Badges (status, priority, tags)
- Loading spinners, empty states

**Spacing:**
- 8px, 16px, 24px, 32px grid
- Consistent margins/padding throughout

---

### 5. Responsive Design (4k)
**Desktop-first, mobile-friendly fallback**

**Breakpoints:**
- Desktop: Full Kanban (1200px+)
- Tablet: 2 columns (768px - 1199px)
- Mobile: Single column (< 768px)

**Mobile-Specific:**
- Kanban becomes horizontal scroll (cards narrow, readable)
- Dashboard stacks vertically
- Sidebar collapses to hamburger
- Touch-friendly buttons (min 44px height)

---

### 6. Micro-Interactions & Polish (4k)
**The little things that make apps feel premium**

**Animations:**
- Smooth hover effects on cards (lift up, shadow grow)
- Drag-drop spring physics (satisfying)
- Skeleton loading while data fetches
- Toast notifications for actions (deal moved, brief generated)
- Page transitions (fade-in, not instant)

**Feedback:**
- Button clicks provide visual feedback
- Form validation shows inline error messages
- Loading states prevent double-clicks
- Success/error toasts on major actions

---

## **FEATURES DEFERRED TO WAVE 2**

❌ Proposal generation (moved to Sprint 4-5)  
❌ Email integration (moved to Sprint 5)  
❌ Advanced analytics/reporting (moved to Sprint 5)  
❌ PDF export (moved to Sprint 4)  
❌ Bulk actions (moved to Wave 2)  

---

## **WHAT WE'RE KEEPING (MVP)**

✅ Research button & brief generation (Sprint 2)  
✅ Opportunity creation from leads  
✅ Drag-drop pipeline management  
✅ CEO dashboard with basic metrics  
✅ Activity tracking (who moved what, when)  
✅ Role-based views (agent/manager/exec)  
✅ Responsive design (desktop + mobile)  

---

## **DESIGN INSPIRATION**

- **Kanban:** Trello (simplicity) + Linear (polish) + Stripe (color)
- **Dashboard:** Stripe Dashboard (metric cards) + Vercel (clean charts)
- **Navigation:** Linear (sidebar) + GitHub (breadcrumbs)

---

## **TECHNICAL APPROACH**

**Frontend Stack:**
- React 18 with hooks
- Tailwind CSS (no CSS-in-JS)
- dnd-kit for drag-drop
- Recharts for charts
- Headless UI for accessible components

**Animation Library:**
- Framer Motion (smooth animations)
- Tailwind transitions (simple, performant)

**No Need For:**
- Figma mockups (we're building in-code, iterating fast)
- Design review process (you'll see live updates)

---

## **ACCEPTANCE CRITERIA**

- [ ] Kanban board looks like Stripe/Linear (smooth, beautiful)
- [ ] Dashboard metrics display clearly with good visual hierarchy
- [ ] All navigation works (sidebar, breadcrumbs, search)
- [ ] Responsive: desktop, tablet, mobile all work well
- [ ] Animations smooth (no janky transitions)
- [ ] Empty states have helpful messaging
- [ ] Forms consistent across app
- [ ] Color palette applied consistently

---

## **IMPLEMENTATION SEQUENCE**

1. **Design System** (colors, typography, components)
2. **Layout Foundation** (sidebar, top nav, page templates)
3. **Kanban Board** (stages, cards, drag-drop)
4. **Dashboard** (metric cards, charts, activity feed)
5. **Responsive Design** (mobile breakpoints, touch-friendly)
6. **Micro-interactions** (animations, feedback, polish)
7. **Integration** (wire up to Sprint 2 research data)
8. **Testing & Polish** (edge cases, loading states)

---

## **WHAT SUCCESS LOOKS LIKE**

✅ Your CRM looks premium (not like a generic CRUD app)  
✅ Sales team wants to use it daily  
✅ Kanban board is smooth and satisfying  
✅ Dashboard gives CEO real visibility (and looks good)  
✅ Navigation is intuitive (no confusion)  
✅ Works on all devices (mobile-first mindset)  

---

## **TOKEN BUDGET**

| Component | Tokens | Notes |
|-----------|--------|-------|
| Kanban Board | 20k | Most effort here |
| Dashboard UI | 15k | Charts + cards |
| Navigation | 8k | Sidebar + breadcrumbs |
| Design System | 7k | Colors, type, components |
| Responsive | 4k | Mobile breakpoints |
| Polish | 4k | Animations, feedback |
| **TOTAL** | **58k** | **Over by 3-8k** |

**Note:** Over budget by ~3-8k. Can compress by:
- Simpler chart library (Recharts → basic SVG)
- Fewer animations (focus on key interactions)
- Defer mobile polish to later sprint

---

## **READY TO BUILD?**

This Sprint 3 will make Stratwyze CRM **look and feel professional**. It won't have proposals yet, but it'll be beautiful.

**Approve to start?** Or would you like to adjust the scope?

