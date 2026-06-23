'use client';

import { DESIGN_TOKENS } from '@/lib/design-tokens';

type AccentColor = keyof typeof DESIGN_TOKENS.accents;

interface StatusBadgeProps {
  label: string;
  color: AccentColor;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
}

export default function StatusBadge({
  label,
  color,
  icon,
  size = 'sm',
}: StatusBadgeProps) {
  const accent = DESIGN_TOKENS.accents[color];
  const sizeClass = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all ${sizeClass} ${accent.badge}`}
    >
      {icon}
      {label}
    </span>
  );
}
