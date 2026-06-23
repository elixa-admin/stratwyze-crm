'use client';

import { DESIGN_TOKENS } from '@/lib/design-tokens';

type AccentColor = keyof typeof DESIGN_TOKENS.accents;

interface GradientCardProps {
  accentColor?: AccentColor;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function GradientCard({
  accentColor = 'blue',
  title,
  subtitle,
  children,
  footer,
  onClick,
  className = '',
}: GradientCardProps) {
  const accent = DESIGN_TOKENS.accents[accentColor];
  const gradientClass = Object.values(DESIGN_TOKENS.gradients)[
    Object.keys(DESIGN_TOKENS.accents).indexOf(accentColor) %
    Object.keys(DESIGN_TOKENS.gradients).length
  ];

  return (
    <div
      onClick={onClick}
      className={`${gradientClass} ${accent.bar} rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 p-5 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      {/* Content */}
      <div className="mb-3">{children}</div>

      {/* Footer */}
      {footer && <div className="pt-3 border-t border-slate-100 text-xs">{footer}</div>}
    </div>
  );
}
