'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from '@/lib/toast';

interface DealQuickActionsProps {
  dealId: string;
  dealTitle: string;
  onArchived?: () => void;
  onDeleted?: () => void;
  onDuplicated?: (newDealId: string) => void;
}

export default function DealQuickActions({ dealId, dealTitle, onArchived, onDeleted, onDuplicated }: DealQuickActionsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleArchive = async () => {
    setLoading(true);
    try {
      await fetch(`/api/deals/${dealId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ archived: true }) });
      toast(`"${dealTitle}" archived`, 'success');
      setOpen(false);
      onArchived?.();
    } catch (err) {
      toast('Failed to archive deal', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/deals/${dealId}/duplicate`, { method: 'POST' });
      const data = await res.json();
      if (data.deal) {
        toast(`"${dealTitle}" duplicated`, 'success');
        setOpen(false);
        onDuplicated?.(data.deal.id);
      } else {
        toast('Failed to duplicate deal', 'error');
      }
    } catch (err) {
      toast('Failed to duplicate deal', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${dealTitle}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      await fetch(`/api/deals/${dealId}`, { method: 'DELETE' });
      toast(`"${dealTitle}" deleted`, 'success');
      setOpen(false);
      onDeleted?.();
    } catch (err) {
      toast('Failed to delete deal', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-slate-600"
        disabled={loading}
        title="Quick actions"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg border border-slate-200 shadow-lg z-50 min-w-48 overflow-hidden">
          <button
            onClick={handleDuplicate}
            disabled={loading}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.356-2A8.002 8.002 0 0019.408 9m0 0H15" />
            </svg>
            Duplicate
          </button>

          <button
            onClick={handleArchive}
            disabled={loading}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 6H5" />
              <path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2m3 0v10a2 2 0 01-2 2H8a2 2 0 01-2-2V6" />
            </svg>
            Archive
          </button>

          <div className="border-t border-slate-100" />

          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 6H5" /><path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2m3 0v10a2 2 0 01-2 2H8a2 2 0 01-2-2V6" />
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
