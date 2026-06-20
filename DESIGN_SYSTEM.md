# Stratwyze CRM — Design System

**Version:** 1.0  
**Status:** Active  
**Last Updated:** 2026-06-20

---

## 📐 **DESIGN PRINCIPLES**

### 1. **Professional & Trustworthy**
- Clean, minimal aesthetic
- Clear visual hierarchy
- Consistent branding
- Premium feel without over-design

### 2. **Intuitive & Learnable**
- Familiar UI patterns (SaaS standards)
- Clear affordances (buttons look clickable)
- Logical information architecture
- Minimal cognitive load

### 3. **Fast & Responsive**
- Smooth interactions (Aceternity/Magic UI inspiration)
- No lag or jank
- Mobile-first responsive design
- Accessible (WCAG AA standard)

### 4. **Data-Driven**
- Visual clarity for metrics (Tremor inspiration)
- Easy data scanning
- Color-coded status indicators
- Readable typography

---

## 🎨 **COLOR PALETTE**

### **Primary Brand Colors**
```
Primary Blue:      #2563EB (RGB: 37, 99, 235)
Primary Blue Dark: #1E40AF (RGB: 30, 64, 175)
Primary Blue Light: #DBEAFE (RGB: 219, 238, 254)
Primary Blue Lightest: #EFF6FF (RGB: 239, 245, 255)
```

### **Semantic Colors**
```
Success/Green:     #10B981 (RGB: 16, 185, 129)
Warning/Amber:     #F59E0B (RGB: 245, 158, 11)
Danger/Red:        #EF4444 (RGB: 239, 68, 68)
Info/Indigo:       #6366F1 (RGB: 99, 102, 241)
```

### **Neutral Grays**
```
Gray-900/Darkest:  #111827 (RGB: 17, 24, 39)  — Text/Headers
Gray-800/Dark:     #1F2937 (RGB: 31, 41, 55)  — Text/Subheadings
Gray-700:          #374151 (RGB: 55, 65, 81)  — Text/Body
Gray-600:          #4B5563 (RGB: 75, 85, 99)  — Labels/Hints
Gray-500:          #6B7280 (RGB: 107, 114, 128) — Borders
Gray-400:          #9CA3AF (RGB: 156, 163, 175) — Disabled
Gray-300:          #D1D5DB (RGB: 209, 213, 219) — Subtle borders
Gray-200:          #E5E7EB (RGB: 229, 231, 235) — Hover backgrounds
Gray-100:          #F3F4F6 (RGB: 243, 244, 246) — Light backgrounds
Gray-50:           #F9FAFB (RGB: 249, 250, 251)  — Lightest bg
White:             #FFFFFF (RGB: 255, 255, 255)
```

### **Usage Guidelines**
| Element | Color | Reference |
|---------|-------|-----------|
| Primary Buttons | Primary Blue (#2563EB) | Tremor, shadcn/ui |
| Links | Primary Blue | Standard SaaS |
| Success Status | Green (#10B981) | Universal |
| Warning Status | Amber (#F59E0B) | Standard |
| Error Status | Red (#EF4444) | Standard |
| Disabled State | Gray-400 (#9CA3AF) | Accessible |
| Borders | Gray-300 (#D1D5DB) | Subtle |
| Backgrounds | White or Gray-50 | Clean |

---

## 🔤 **TYPOGRAPHY**

### **Font Families**
```
Headlines: Inter Bold, fallback: -apple-system, BlinkMacSystemFont, sans-serif
Body: Inter Regular, fallback: -apple-system, BlinkMacSystemFont, sans-serif
Mono: Jetbrains Mono, fallback: monospace (for code/IDs)
```

### **Font Sizes & Weights**

| Use Case | Size | Weight | Line Height |
|----------|------|--------|-------------|
| Page Title | 36px | 700 (Bold) | 44px |
| Section Title | 24px | 700 (Bold) | 32px |
| Subsection | 20px | 600 (Semibold) | 28px |
| Card Title | 18px | 600 (Semibold) | 26px |
| Body Text | 14px | 400 (Regular) | 21px |
| Small Text | 12px | 400 (Regular) | 18px |
| Label | 12px | 500 (Medium) | 16px |
| Code/Mono | 13px | 400 (Regular) | 20px |

### **Examples**
```html
<!-- Page Title -->
<h1 class="text-4xl font-bold">Dashboard</h1>

<!-- Section Title -->
<h2 class="text-2xl font-bold">Sales Pipeline</h2>

<!-- Card Title -->
<h3 class="text-lg font-semibold">Total Pipeline Value</h3>

<!-- Body Text -->
<p class="text-sm text-gray-600">Revenue forecast for next 3 months</p>

<!-- Label -->
<label class="text-xs font-medium uppercase text-gray-700">Stage</label>
```

---

## 📏 **SPACING SYSTEM**

Using **8px base unit** (TailwindCSS default):

```
8px    → p-2, m-2, gap-2
16px   → p-4, m-4, gap-4
24px   → p-6, m-6, gap-6
32px   → p-8, m-8, gap-8
48px   → p-12, m-12, gap-12
64px   → p-16, m-16, gap-16
```

### **Common Spacing Patterns**

| Component | Padding | Margin | Gap |
|-----------|---------|--------|-----|
| Button | 12px x 16px | 8px | — |
| Card | 24px | 16px | — |
| Form Field | 12px x 16px | 16px | — |
| List Item | 12px x 16px | 8px | — |
| Section | 32px | — | 24px |
| Column Gap | — | — | 24px |
| Row Gap | — | — | 16px |

---

## 🔘 **COMPONENTS**

### **Buttons**

#### Primary Button
```jsx
<button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition shadow-lg hover:shadow-xl">
  Create Account
</button>
```
**Use for:** Main call-to-action, primary actions  
**States:** Normal, Hover (darker), Focus (ring), Disabled (opacity)

#### Secondary Button
```jsx
<button class="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg transition">
  Cancel
</button>
```
**Use for:** Secondary actions, less important actions

#### Ghost Button
```jsx
<button class="text-blue-600 hover:bg-blue-50 font-semibold py-3 px-4 rounded-lg transition">
  Learn More
</button>
```
**Use for:** Tertiary actions, links

### **Form Elements**

#### Input Field
```jsx
<input 
  type="email"
  placeholder="you@company.com"
  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
/>
```
**States:** Normal, Focus (blue ring), Error (red border), Disabled (gray)

#### Label
```jsx
<label class="block text-sm font-semibold text-gray-700 mb-2">
  Email Address
</label>
```

### **Cards**

#### Metric Card
```jsx
<div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
  <p class="text-gray-600 text-sm font-semibold uppercase">Total Pipeline</p>
  <p class="text-3xl font-bold text-blue-600 mt-2">$500K</p>
  <p class="text-xs text-gray-500 mt-2">Weighted by probability</p>
</div>
```
**Use for:** KPI metrics, dashboards

#### Deal Card
```jsx
<div class="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow cursor-move border border-gray-200">
  <h3 class="font-semibold text-gray-900">Acme Corp CRM</h3>
  <p class="text-xl font-bold text-blue-600 mt-2">$50K</p>
  <div class="mt-3 flex justify-between text-xs text-gray-600">
    <span>Probability</span>
    <span>30%</span>
  </div>
</div>
```
**Use for:** Kanban cards, list items

### **Navigation**

#### Sidebar
```jsx
<nav class="bg-white border-r border-gray-200 w-64 p-6">
  <a href="/dashboard" class="block text-gray-600 hover:text-gray-900 font-medium">Dashboard</a>
</nav>
```

#### Breadcrumbs
```jsx
<nav class="flex gap-2 text-sm text-gray-600">
  <a href="/" class="hover:text-gray-900">Home</a>
  <span>/</span>
  <a href="/leads" class="hover:text-gray-900">Leads</a>
  <span>/</span>
  <span class="text-gray-900">John Doe</span>
</nav>
```

---

## ✨ **ANIMATIONS & TRANSITIONS**

### **Hover Effects**
```css
/* Subtle lift */
.card:hover {
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  transform: translateY(-2px);
  transition: all 150ms ease-out;
}

/* Button hover */
.button:hover {
  background-color: var(--darker);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  transition: all 100ms ease-out;
}
```

### **Loading States**
```jsx
<div class="animate-spin">⏳</div>
// or use Framer Motion for advanced animations
```

### **Transitions**
- **Button clicks:** 100ms
- **Page transitions:** 150ms
- **Hover effects:** 150ms
- **Modals:** 200ms

---

## 📱 **RESPONSIVE DESIGN**

### **Breakpoints (TailwindCSS)**
```
sm: 640px   (tablets)
md: 768px   (small laptops)
lg: 1024px  (laptops)
xl: 1280px  (large screens)
2xl: 1536px (extra large)
```

### **Mobile-First Approach**
```jsx
// Mobile default
<div class="text-center md:text-left">
  Mobile centered, desktop left-aligned
</div>

// Hide on mobile, show on desktop
<div class="hidden md:block">
  Desktop only
</div>
```

---

## ♿ **ACCESSIBILITY**

### **Color Contrast**
- Text on background: Minimum 4.5:1 ratio
- Large text (18px+): Minimum 3:1 ratio
- All colors: Test with contrast checker

### **Focus States**
```css
input:focus {
  outline: 2px solid #2563EB;
  outline-offset: 2px;
}
```

### **ARIA Labels**
```jsx
<button aria-label="Close dialog">×</button>
<img alt="Company logo" src="logo.png" />
```

### **Keyboard Navigation**
- Tab order makes sense
- All interactive elements keyboard accessible
- No keyboard traps

---

## 🎯 **DESIGN REFERENCES**

See `DESIGN_INSPIRATION_SOURCES.md` for:
- shadcn/ui — Component inspiration
- Tremor — Dashboard inspiration
- Aceternity UI — Animation inspiration
- SaaS UI Design — SaaS pattern reference
- Awwwards — Visual inspiration

---

## 📋 **COMPONENT CHECKLIST**

When creating a new component, ensure:
- [ ] Uses correct color from palette
- [ ] Uses correct typography scale
- [ ] Consistent spacing (8px grid)
- [ ] Rounded corners (8px default)
- [ ] Hover state defined
- [ ] Focus state defined (for interactive)
- [ ] Works on mobile (responsive)
- [ ] Accessible (WCAG AA)
- [ ] Matches design system
- [ ] No custom colors or sizes

---

## 🔄 **MAINTAINING CONSISTENCY**

1. **Before building:** Check if similar component exists
2. **While building:** Reference this design system
3. **After building:** Have design reviewed
4. **Regularly:** Audit codebase for non-compliant components

---

**Design System Owner:** Design Team  
**Last Reviewed:** 2026-06-20  
**Next Review:** 2026-07-20
