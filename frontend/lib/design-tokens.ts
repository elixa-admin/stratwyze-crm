// Design tokens for professional, polished UI
// Based on Opsiqa's gradient + accent color system

export const DESIGN_TOKENS = {
  // Primary gradients (backgrounds)
  gradients: {
    blueToWhite: 'bg-gradient-to-br from-blue-50 to-white',
    tealToWhite: 'bg-gradient-to-br from-teal-50 to-white',
    emeraldToWhite: 'bg-gradient-to-br from-emerald-50 to-white',
    amberToWhite: 'bg-gradient-to-br from-amber-50 to-white',
    purpleToWhite: 'bg-gradient-to-br from-purple-50 to-white',
    slateToWhite: 'bg-gradient-to-br from-slate-50 to-white',
  },

  // Accent colors for left border bars
  accents: {
    blue: {
      bar: 'border-l-4 border-l-blue-500',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-700',
    },
    teal: {
      bar: 'border-l-4 border-l-teal-500',
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      badge: 'bg-teal-100 text-teal-700',
    },
    emerald: {
      bar: 'border-l-4 border-l-emerald-500',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-700',
    },
    amber: {
      bar: 'border-l-4 border-l-amber-500',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      badge: 'bg-amber-100 text-amber-700',
    },
    orange: {
      bar: 'border-l-4 border-l-orange-500',
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      badge: 'bg-orange-100 text-orange-700',
    },
    purple: {
      bar: 'border-l-4 border-l-purple-500',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      badge: 'bg-purple-100 text-purple-700',
    },
    red: {
      bar: 'border-l-4 border-l-red-500',
      bg: 'bg-red-50',
      text: 'text-red-700',
      badge: 'bg-red-100 text-red-700',
    },
  },

  // Status indicators
  status: {
    success: { icon: '✓', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    warning: { icon: '!', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    error: { icon: '✕', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    info: { icon: 'ℹ', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    pending: { icon: '⟳', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
  },

  // Typography
  typography: {
    h1: 'text-4xl font-bold text-slate-900',
    h2: 'text-2xl font-semibold text-slate-900',
    h3: 'text-xl font-semibold text-slate-900',
    h4: 'text-lg font-semibold text-slate-900',
    body: 'text-sm text-slate-700',
    caption: 'text-xs text-slate-500',
  },

  // Card styles with gradient + accent
  cards: {
    elevated: 'bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow',
    gradient: 'rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all',
  },
};

// Map stage names to colors
export const STAGE_COLORS: Record<string, keyof typeof DESIGN_TOKENS.accents> = {
  'Prospecting': 'blue',
  'Qualification': 'blue',
  'Proposal': 'amber',
  'Negotiation': 'orange',
  'Closed Won': 'emerald',
  'Closed Lost': 'red',
};

// Map priorities to colors
export const PRIORITY_COLORS: Record<string, keyof typeof DESIGN_TOKENS.accents> = {
  'low': 'blue',
  'medium': 'amber',
  'high': 'orange',
  'critical': 'red',
};
