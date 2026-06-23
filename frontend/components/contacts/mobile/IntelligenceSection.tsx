'use client';

import { useState } from 'react';

interface IntelligenceSectionProps {
  title: string;
  icon: string;
  items: string[];
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

/**
 * Expandable intelligence section for mobile
 * One section open at a time (collapsible)
 * Smooth expand/collapse animation
 */
export default function IntelligenceSection({
  title,
  icon,
  items,
  isOpen = false,
  onToggle,
}: IntelligenceSectionProps) {
  const [open, setOpen] = useState(isOpen);

  const handleToggle = () => {
    const newState = !open;
    setOpen(newState);
    onToggle?.(newState);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header - Always Visible */}
      <button
        onClick={handleToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors active:bg-slate-100"
      >
        <div className="flex items-center gap-3 flex-1 text-left">
          <span className="text-xl">{icon}</span>
          <div>
            <p className="font-semibold text-slate-900">{title}</p>
            {!open && items.length > 0 && (
              <p className="text-xs text-slate-500 mt-0.5">
                {items.length} item{items.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        <span
          className={`text-xl transition-transform duration-300 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
        >
          ▼
        </span>
      </button>

      {/* Content - Expandable */}
      {open && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 space-y-2 animate-in fade-in slide-in-from-top-2">
          {items.length > 0 ? (
            <ul className="space-y-2">
              {items.map((item, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 text-sm text-slate-700 animate-in fade-in slide-in-from-left-2"
                  style={{
                    animationDelay: `${idx * 50}ms`,
                  }}
                >
                  <span className="text-blue-500 font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 italic">No items available</p>
          )}
        </div>
      )}
    </div>
  );
}
