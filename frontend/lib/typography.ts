// Standardized Typography System
// Used throughout the application for consistent font sizing and hierarchy

export const TYPOGRAPHY = {
  // Page & Section Titles
  PAGE_TITLE: 'text-3xl font-bold text-slate-900', // H1: Main page title
  SECTION_TITLE: 'text-lg font-bold text-slate-900', // H2: Major sections
  SUBSECTION_TITLE: 'text-base font-semibold text-slate-900', // H3: Subsections

  // Card/Panel Headers
  CARD_TITLE: 'text-sm font-bold text-slate-900 uppercase tracking-wide', // Card headers
  CARD_SUBTITLE: 'text-xs font-semibold text-slate-600 uppercase tracking-wide', // Secondary card headers

  // Body Text
  BODY_LG: 'text-base leading-relaxed text-slate-700', // Large body (intro paragraphs)
  BODY: 'text-sm leading-relaxed text-slate-700', // Standard body text
  BODY_SM: 'text-xs leading-relaxed text-slate-600', // Small body (descriptions)

  // Emphasis & Highlights
  LABEL: 'text-xs font-semibold text-slate-600', // Form labels, metadata
  LABEL_BOLD: 'text-xs font-bold text-slate-900', // Bold labels (required, status)
  HIGHLIGHT: 'text-sm font-semibold text-slate-900', // Highlighted text
  STAT: 'text-2xl font-bold text-slate-900', // Large statistics
  STAT_LABEL: 'text-xs font-semibold text-slate-500 uppercase tracking-wide', // Stat labels

  // Lists & Bullets
  LIST_ITEM: 'text-sm text-slate-700 leading-relaxed', // List items
  LIST_ITEM_SM: 'text-xs text-slate-600 leading-relaxed', // Small list items

  // Special Cases
  BADGE_TEXT: 'text-xs font-semibold', // Badge/pill text
  BUTTON_TEXT: 'text-sm font-semibold', // Button text
  LINK: 'text-sm text-blue-600 hover:text-blue-700 hover:underline', // Links
  ERROR: 'text-xs font-medium text-red-600', // Error messages
  SUCCESS: 'text-xs font-medium text-emerald-600', // Success messages
  WARNING: 'text-xs font-medium text-amber-600', // Warning messages
};

// Spacing paired with typography for consistent vertical rhythm
export const SPACING_TYPOGRAPHY = {
  // Section spacing (large, visual breaks)
  SECTION: 'space-y-6', // Between major sections
  SECTION_PADDING: 'p-6', // Inside major sections

  // Card spacing (medium, content grouping)
  CARD: 'space-y-4', // Inside cards
  CARD_PADDING: 'p-4', // Card padding

  // Element spacing (small, individual items)
  ITEM: 'space-y-2', // Between list items or form fields
  ITEM_PADDING: 'p-2', // Small padding

  // Dense spacing (minimal, inline)
  DENSE: 'space-y-1', // Tight spacing for secondary info
  DENSE_PADDING: 'p-1', // Minimal padding
};

// Usage in React:
// <h1 className={TYPOGRAPHY.PAGE_TITLE}>Deals</h1>
// <div className={TYPOGRAPHY.CARD_TITLE}>Company Snapshot</div>
// <p className={TYPOGRAPHY.BODY}>This is a standard paragraph.</p>
// <ul className={SPACING_TYPOGRAPHY.ITEM}>
//   <li className={TYPOGRAPHY.LIST_ITEM}>Item one</li>
//   <li className={TYPOGRAPHY.LIST_ITEM}>Item two</li>
// </ul>
