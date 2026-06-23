'use client';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  cta?: {
    label: string;
    onClick: () => void;
  };
  secondaryCta?: {
    label: string;
    onClick: () => void;
  };
}

const DefaultIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-300">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="9" y1="9" x2="15" y2="9" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);

export default function EmptyState({
  icon,
  title,
  description,
  cta,
  secondaryCta,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-5">
        {icon || <DefaultIcon />}
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 text-center max-w-sm mb-6">{description}</p>

      <div className="flex items-center gap-2">
        {cta && (
          <button
            onClick={cta.onClick}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            {cta.label}
          </button>
        )}
        {secondaryCta && (
          <button
            onClick={secondaryCta.onClick}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            {secondaryCta.label}
          </button>
        )}
      </div>
    </div>
  );
}
