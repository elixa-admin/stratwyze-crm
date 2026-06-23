'use client';

import { useState } from 'react';

interface ActionBarProps {
  email: string;
  onCopyEmail: () => void;
  onCall: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

/**
 * Sticky mobile action bar (bottom of screen)
 * 3 equal-width buttons: Copy Email, Call, Refresh
 * 72px height with safe area support
 */
export default function ActionBar({
  email,
  onCopyEmail,
  onCall,
  onRefresh,
  isRefreshing = false,
}: ActionBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    onCopyEmail();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg safe-area-inset-bottom">
      <div className="grid grid-cols-3 gap-2 p-3 h-20">
        {/* Copy Email Button */}
        <button
          onClick={handleCopyEmail}
          className={`rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            copied
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:scale-95'
          }`}
        >
          {copied ? '✓' : '📧'}
          <span className="hidden sm:inline">Email</span>
        </button>

        {/* Call Button */}
        <button
          onClick={onCall}
          className="rounded-lg bg-green-600 text-white font-semibold text-sm hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          📞
          <span className="hidden sm:inline">Call</span>
        </button>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            isRefreshing
              ? 'bg-blue-100 text-blue-700 cursor-wait'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
          }`}
        >
          {isRefreshing ? (
            <>
              <span className="animate-spin">⟳</span>
              <span className="hidden sm:inline">Updating</span>
            </>
          ) : (
            <>
              ⟳
              <span className="hidden sm:inline">Refresh</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
