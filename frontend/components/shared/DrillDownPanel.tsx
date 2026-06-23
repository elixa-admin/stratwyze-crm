'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { formatCurrency } from '@/lib/format';

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  account?: { name: string };
  createdAt: string;
  dueDate?: string;
}

interface DrillDownConfig {
  title: string;
  subtitle: string;
  deals: Deal[];
  accentColor: string;
  emptyMessage: string;
}

interface DrillDownPanelProps {
  config: DrillDownConfig | null;
  onClose: () => void;
}

const STAGE_COLORS: Record<string, string> = {
  Prospecting: 'bg-blue-100 text-blue-700',
  Qualification: 'bg-indigo-100 text-indigo-700',
  Proposal: 'bg-amber-100 text-amber-700',
  Negotiation: 'bg-orange-100 text-orange-700',
  'Closed Won': 'bg-emerald-100 text-emerald-700',
  'Closed Lost': 'bg-red-100 text-red-700',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function DrillDownPanel({ config, onClose }: DrillDownPanelProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!config) return null;

  const totalValue = config.deals.reduce((s, d) => s + d.value, 0);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={onClose} />

      {/* Slide-over panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className={`px-6 py-5 border-b border-slate-100 bg-gradient-to-r ${config.accentColor}`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{config.title}</h2>
              <p className="text-sm text-slate-600 mt-0.5">{config.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-white/60 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Summary */}
          <div className="flex gap-4 mt-3">
            <div className="bg-white/70 rounded-lg px-3 py-2">
              <p className="text-xs text-slate-500">Deals</p>
              <p className="text-lg font-bold text-slate-900">{config.deals.length}</p>
            </div>
            <div className="bg-white/70 rounded-lg px-3 py-2">
              <p className="text-xs text-slate-500">Total Value</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>

        {/* Deal list */}
        <div className="flex-1 overflow-y-auto">
          {config.deals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
                  <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-600">{config.emptyMessage}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {config.deals.map(deal => (
                <Link
                  key={deal.id}
                  href={`/deals/${deal.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-700">
                      {deal.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 truncate transition-colors">
                      {deal.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {deal.account?.name || 'No account'} · {timeAgo(deal.createdAt)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-slate-900">{formatCurrency(deal.value)}</p>
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${STAGE_COLORS[deal.stage] || 'bg-slate-100 text-slate-600'}`}>
                      {deal.stage}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between">
          <Link href="/pipeline" onClick={onClose} className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View full pipeline →
          </Link>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </div>
      </div>
    </>
  );
}
