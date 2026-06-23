'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';

interface ActivityQuickButtonsProps {
  dealId: string;
  onActivityAdded?: () => void;
}

const QUICK_ACTIONS = [
  { id: 'call', label: 'Call outcome', icon: '☎️' },
  { id: 'email', label: 'Email sent', icon: '✉️' },
  { id: 'meeting', label: 'Meeting booked', icon: '📅' },
  { id: 'decision', label: 'Decision pending', icon: '⏳' },
];

export default function ActivityQuickButtons({ dealId, onActivityAdded }: ActivityQuickButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleQuickAction = async (actionId: string, label: string) => {
    setLoading(actionId);
    try {
      await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteContent: label,
        }),
      });
      toast(`Activity logged: ${label}`, 'success');
      onActivityAdded?.();
    } catch (err) {
      toast('Failed to log activity', 'error');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Log</h3>
      <div className="grid grid-cols-2 gap-2">
        {QUICK_ACTIONS.map(action => (
          <button
            key={action.id}
            onClick={() => handleQuickAction(action.id, action.label)}
            disabled={loading === action.id}
            className="px-3 py-2.5 text-xs font-medium text-slate-700 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-400 mt-3">Logged as activity on this deal</p>
    </div>
  );
}
