'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/format';

interface LocalResult {
  type: 'account' | 'deal';
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

const TYPE_COLORS: Record<string, string> = {
  deal:    'bg-blue-50 text-blue-600',
  account: 'bg-emerald-50 text-emerald-600',
};
const TYPE_LABELS: Record<string, string> = {
  deal: 'Deal',
  account: 'Account',
};
const TYPE_LETTERS: Record<string, string> = {
  deal: 'D',
  account: 'A',
};

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [allItems, setAllItems] = useState<LocalResult[]>([]);
  const [results, setResults] = useState<LocalResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load real data from API on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/deals').then(r => r.json()).catch(() => ({ deals: [] })),
      fetch('/api/accounts').then(r => r.json()).catch(() => ({ accounts: [] })),
    ]).then(([dealsData, accountsData]) => {
      const deals: LocalResult[] = (dealsData.deals ?? []).map((d: any) => ({
        type: 'deal' as const,
        id: d.id,
        title: d.title,
        subtitle: `${d.stage} · ${formatCurrency(d.value)}`,
        href: `/deals/${d.id}`,
      }));
      const accounts: LocalResult[] = (accountsData.accounts ?? []).map((a: any) => ({
        type: 'account' as const,
        id: a.id,
        title: a.name,
        subtitle: [a.industry, a.annualRevenue ? formatCurrency(a.annualRevenue) : null].filter(Boolean).join(' · ') || 'Account',
        href: `/accounts/${a.id}`,
      }));
      setAllItems([...deals, ...accounts]);
    });
  }, []);

  // Re-fetch when a deal/account is created
  useEffect(() => {
    const refresh = () => {
      Promise.all([
        fetch('/api/deals').then(r => r.json()).catch(() => ({ deals: [] })),
        fetch('/api/accounts').then(r => r.json()).catch(() => ({ accounts: [] })),
      ]).then(([dealsData, accountsData]) => {
        const deals: LocalResult[] = (dealsData.deals ?? []).map((d: any) => ({
          type: 'deal' as const,
          id: d.id,
          title: d.title,
          subtitle: `${d.stage} · ${formatCurrency(d.value)}`,
          href: `/deals/${d.id}`,
        }));
        const accounts: LocalResult[] = (accountsData.accounts ?? []).map((a: any) => ({
          type: 'account' as const,
          id: a.id,
          title: a.name,
          subtitle: [a.industry, a.annualRevenue ? formatCurrency(a.annualRevenue) : null].filter(Boolean).join(' · ') || 'Account',
          href: `/accounts/${a.id}`,
        }));
        setAllItems([...deals, ...accounts]);
      });
    };
    window.addEventListener('dealCreated', refresh);
    window.addEventListener('accountCreated', refresh);
    return () => {
      window.removeEventListener('dealCreated', refresh);
      window.removeEventListener('accountCreated', refresh);
    };
  }, []);

  // Filter on query change
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const lower = query.toLowerCase();
    setResults(
      allItems.filter(r =>
        r.title.toLowerCase().includes(lower) ||
        r.subtitle.toLowerCase().includes(lower)
      ).slice(0, 7)
    );
  }, [query, allItems]);

  // Keyboard shortcut: ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Escape') { setOpen(false); setQuery(''); inputRef.current?.blur(); }
    else if (e.key === 'Enter' && activeIndex >= 0) {
      const r = results[activeIndex];
      if (r) { window.location.href = r.href; setOpen(false); setQuery(''); }
    }
  };

  const grouped = results.reduce((acc: Record<string, LocalResult[]>, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  const showDropdown = open && query.length >= 1;
  let flatIndex = -1;

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setActiveIndex(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search deals & accounts…"
          className="w-full pl-9 pr-16 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none">
          <span className="text-xs">⌘</span>K
        </kbd>
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
          >
            ✕
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full mt-1.5 left-0 right-0 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
          {results.length > 0 ? (
            <>
              {(['deal', 'account'] as const).map(type => {
                const group = grouped[type];
                if (!group?.length) return null;
                return (
                  <div key={type}>
                    <p className="px-4 pt-3 pb-1.5 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                      {TYPE_LABELS[type]}s
                    </p>
                    {group.map(r => {
                      flatIndex++;
                      const idx = flatIndex;
                      return (
                        <Link
                          key={`${r.type}-${r.id}`}
                          href={r.href}
                          onClick={() => { setOpen(false); setQuery(''); }}
                          className={`flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors ${activeIndex === idx ? 'bg-blue-50' : ''}`}
                        >
                          <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${TYPE_COLORS[r.type]}`}>
                            {TYPE_LETTERS[r.type]}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{r.title}</p>
                            <p className="text-xs text-slate-500 truncate">{r.subtitle}</p>
                          </div>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 flex-shrink-0">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
              <div className="border-t border-slate-100 px-4 py-2 text-[10px] text-slate-400">
                ↑↓ navigate · Enter select · Esc close
              </div>
            </>
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-slate-500">
                No results for <span className="font-medium text-slate-800">&ldquo;{query}&rdquo;</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Try a deal title or account name</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
