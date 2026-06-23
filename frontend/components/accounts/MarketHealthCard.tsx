'use client';

import { useState } from 'react';
import type { MarketHealthData } from '@/lib/market-data';

interface MarketHealthCardProps {
  accountId: string;
  accountName: string;
  initialData?: MarketHealthData | null;
  ticker?: string | null;
  isListed?: boolean;
}

const HEALTH_STYLES = {
  green:  { bar: 'bg-emerald-500', badge: 'bg-emerald-50 border-emerald-200 text-emerald-800', dot: 'bg-emerald-500' },
  amber:  { bar: 'bg-amber-400',   badge: 'bg-amber-50 border-amber-200 text-amber-800',       dot: 'bg-amber-400'  },
  red:    { bar: 'bg-red-500',     badge: 'bg-red-50 border-red-200 text-red-700',             dot: 'bg-red-500'    },
};

const SENTIMENT_ICONS: Record<string, string> = {
  positive: '↑', neutral: '→', caution: '↓', risk: '↓↓',
};

export default function MarketHealthCard({
  accountId,
  accountName: _accountName,
  initialData,
  ticker,
  isListed,
}: MarketHealthCardProps) {
  const [data, setData] = useState<MarketHealthData | null>(initialData ?? null);
  const [tickerInput, setTickerInput] = useState(ticker ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showContext, setShowContext] = useState(false);

  const fetch = async (forceRefresh = false) => {
    if (!tickerInput.trim()) { setError('Enter a JSE ticker first'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await window.fetch(`/api/accounts/${accountId}/market-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: tickerInput.trim().toUpperCase(), forceRefresh }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed');
      setData(json.marketData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const s = data ? HEALTH_STYLES[data.healthColor] : null;
  const q = data?.quote;

  if (!isListed && !data) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-slate-400 text-base">📈</span>
          <h3 className="text-sm font-semibold text-slate-700">Market Intelligence</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold ml-auto">JSE</span>
        </div>
        <p className="text-xs text-slate-500 mb-3">Enter the JSE ticker to enable live market health tracking for this account.</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={tickerInput}
            onChange={e => setTickerInput(e.target.value.toUpperCase())}
            placeholder="e.g. NPN, SBK, MTN"
            maxLength={6}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-400 focus:outline-none uppercase"
          />
          <button
            onClick={() => fetch()}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? '…' : 'Track'}
          </button>
        </div>
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      </div>
    );
  }

  if (!data || data.source === 'unavailable') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-slate-400 text-base">📈</span>
          <h3 className="text-sm font-semibold text-slate-700">Market Intelligence</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold ml-auto">JSE · {tickerInput || ticker}</span>
        </div>
        <p className="text-xs text-slate-500 mb-3">{data?.salesContext || 'Market data unavailable. Verify the ticker and try again.'}</p>
        <button onClick={() => fetch(true)} disabled={loading} className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
          {loading ? 'Refreshing…' : '↺ Refresh'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">Market Intelligence</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${s!.badge}`}>
                {data.healthLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {data.symbol} · JSE · <span className="font-mono">{q?.currency ?? 'ZAR'}</span>
              {(data as any).fromCache === false && <span className="ml-1 text-emerald-600">· live</span>}
            </p>
          </div>
          <button onClick={() => fetch(true)} disabled={loading} className="text-xs text-slate-400 hover:text-slate-600 mt-0.5" title="Refresh">
            {loading ? '…' : '↺'}
          </button>
        </div>

        {/* Price row */}
        {q && (
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-2xl font-semibold text-slate-900">
              {q.price.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-sm font-semibold ${q.percentChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {q.percentChange >= 0 ? '+' : ''}{q.percentChange.toFixed(2)}%
            </span>
            <span className={`text-sm ${q.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              ({q.change >= 0 ? '+' : ''}{q.change.toFixed(2)})
            </span>
          </div>
        )}

        {/* Health score bar */}
        <div className="mb-1 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${s!.bar} transition-all`} style={{ width: `${data.healthScore}%` }} />
          </div>
          <span className="text-xs font-semibold text-slate-600 tabular-nums">{data.healthScore}/100</span>
        </div>

        {/* 52-week range */}
        {q && (
          <div className="mt-2 mb-1">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>{q.fiftyTwoWeekLow.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}</span>
              <span className="text-slate-500 font-semibold">52-week range</span>
              <span>{q.fiftyTwoWeekHigh.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="relative h-1.5 bg-slate-100 rounded-full">
              <div className={`absolute w-2.5 h-2.5 rounded-full border-2 border-white ${s!.dot} -top-0.5 -translate-x-1/2`}
                style={{ left: `${data.rangePosition}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Signals */}
      {data.signals.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 space-y-1.5">
          {data.signals.map((sig, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className={`font-bold w-4 text-center ${
                sig.sentiment === 'positive' ? 'text-emerald-600' :
                sig.sentiment === 'risk' ? 'text-red-600' :
                sig.sentiment === 'caution' ? 'text-amber-600' : 'text-slate-400'
              }`}>{SENTIMENT_ICONS[sig.sentiment]}</span>
              <span className="text-slate-600">{sig.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Sales context */}
      <div className="px-5 py-3 border-t border-slate-100">
        <button
          onClick={() => setShowContext(!showContext)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          {showContext ? '▾' : '▸'} Sales intelligence note
        </button>
        {showContext && (
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">{data.salesContext}</p>
        )}
      </div>

      {/* Footer */}
      {q && (
        <div className="px-5 py-2 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Open', value: q.open.toLocaleString('en-ZA', { maximumFractionDigits: 2 }) },
            { label: 'Vol', value: q.volume > 1_000_000 ? `${(q.volume/1_000_000).toFixed(1)}M` : q.volume > 1000 ? `${(q.volume/1000).toFixed(0)}K` : String(q.volume) },
            { label: 'Source', value: data.source === 'twelvedata' ? 'Twelvedata' : 'Alpha Vantage' },
          ].map(item => (
            <div key={item.label}>
              <p className="text-[10px] text-slate-400">{item.label}</p>
              <p className="text-xs font-semibold text-slate-700">{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
