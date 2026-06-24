import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  badge?: string;
}

export default function PageHeader({ title, subtitle, action, badge }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl px-8 py-5 mb-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight truncate">{title}</h1>
            {badge && (
              <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-sm text-blue-100 mt-0.5 truncate">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}
