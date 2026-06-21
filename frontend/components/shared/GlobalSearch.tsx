'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface LocalResult {
  type: 'contact' | 'account' | 'deal';
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

interface WebResult {
  title: string;
  url: string;
  snippet: string;
}

const LOCAL_DATA: LocalResult[] = [
  { type: 'contact', id: '1', title: 'Sarah Johnson', subtitle: 'VP of Sales · Acme Corp', href: '/contacts/1' },
  { type: 'contact', id: '2', title: 'John Smith', subtitle: 'CFO · Global Inc', href: '/contacts/2' },
  { type: 'contact', id: '3', title: 'Emily Davis', subtitle: 'Director of IT · TechStart', href: '/contacts/3' },
  { type: 'contact', id: '4', title: 'Michael Chen', subtitle: 'CEO · Fortune500', href: '/contacts/4' },
  { type: 'account', id: '1', title: 'Acme Corporation', subtitle: 'Technology · $850K ARR', href: '/accounts/1' },
  { type: 'account', id: '2', title: 'Global Industries', subtitle: 'Manufacturing · $1.2M ARR', href: '/accounts/2' },
  { type: 'account', id: '3', title: 'TechStart Inc', subtitle: 'SaaS · $220K ARR', href: '/accounts/3' },
  { type: 'deal', id: '1', title: 'Enterprise Implementation', subtitle: 'Proposal · $250K', href: '/dashboard' },
  { type: 'deal', id: '2', title: 'Annual Renewal + Expansion', subtitle: 'Negotiation · $115K', href: '/dashboard' },
];

const TYPE_ICONS: Record<string, string> = {
  contact: 'C',
  account: 'A',
  deal: 'D',
};

const TYPE_LABELS: Record<string, string> = {
  contact: 'Contact',
  account: 'Account',
  deal: 'Deal',
};

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [localResults, setLocalResults] = useState<LocalResult[]>([]);
  const [webResults, setWebResults] = useState<WebResult[]>([]);
  const [webLoading, setWebLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchLocal = useCallback((q: string) => {
    if (!q.trim()) return setLocalResults([]);
    const lower = q.toLowerCase();
    setLocalResults(
      LOCAL_DATA.filter(
        (r) =>
          r.title.toLowerCase().includes(lower) ||
          r.subtitle.toLowerCase().includes(lower)
      ).slice(0, 5)
    );
  }, []);

  const searchWeb = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 3) return;
    setWebLoading(true);
    try {
      const res = await fetch(`/api/research?q=${encodeURIComponent(q)}&type=company`);
      const data = await res.json();
      if (data.results) {
        setWebResults(data.results.slice(0, 3));
      }
    } catch {
      // silently skip web results on error
    } finally {
      setWebLoading(false);
    }
  }, []);

  useEffect(() => {
    searchLocal(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length >= 3) {
      debounceRef.current = setTimeout(() => searchWeb(query), 600);
    } else {
      setWebResults([]);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, searchLocal, searchWeb]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allResults = [
    ...localResults,
    ...webResults.map((r) => ({ type: 'web' as const, id: r.url, title: r.title, subtitle: r.snippet, href: r.url })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, allResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      const result = allResults[activeIndex];
      if (result) {
        if (result.type === 'web') {
          window.open(result.href, '_blank');
        } else {
          window.location.href = result.href;
        }
      }
    }
  };

  const hasResults = localResults.length > 0 || webResults.length > 0 || webLoading;
  const showDropdown = open && query.length > 0 && (hasResults || query.length >= 2);

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIndex(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search contacts, accounts, deals..."
          className="w-full pl-9 pr-4 py-2.5 text-sm font-400 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:bg-white transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setLocalResults([]); setWebResults([]); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
          >
            ✕
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl border border-slate-200 shadow-lg z-50 overflow-hidden">
          {localResults.length > 0 && (
            <div>
              <p className="px-4 py-2 text-xs font-700 uppercase text-slate-400 border-b border-slate-100">In Your CRM</p>
              {localResults.map((result, idx) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.href}
                  onClick={() => { setOpen(false); setQuery(''); }}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 ${
                    activeIndex === idx ? 'bg-blue-50' : ''
                  }`}
                >
                  <span className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500 flex-shrink-0">{TYPE_ICONS[result.type] ?? 'X'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-500 text-slate-900 truncate">{result.title}</p>
                    <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded flex-shrink-0">
                    {TYPE_LABELS[result.type]}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {webLoading && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-slate-500 border-t border-slate-100">
              <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />
              Searching the web...
            </div>
          )}

          {webResults.length > 0 && !webLoading && (
            <div>
              <p className="px-4 py-2 text-xs font-700 uppercase text-slate-400 border-b border-slate-100">Web Results</p>
              {webResults.map((result, idx) => {
                const globalIdx = localResults.length + idx;
                return (
                  <a
                    key={result.url}
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => { setOpen(false); }}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 ${
                      activeIndex === globalIdx ? 'bg-blue-50' : ''
                    }`}
                  >
                    <span className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-500 text-slate-900 truncate">{result.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{result.snippet}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}

          {!webLoading && localResults.length === 0 && webResults.length === 0 && query.length >= 2 && (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-slate-500">No results found for <span className="font-500 text-slate-900">&ldquo;{query}&rdquo;</span></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
