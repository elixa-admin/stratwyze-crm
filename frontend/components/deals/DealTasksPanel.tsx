'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/lib/toast';

interface Task {
  id: string;
  content: string;
  dueDate?: string | null;
  assignedTo?: string | null;
  completed: boolean;
  completedAt?: string | null;
  source?: string | null;
  createdAt: string;
}

function dueBadge(dueDate: string | null | undefined): { label: string; cls: string } | null {
  if (!dueDate) return null;
  const d = new Date(dueDate);
  const now = new Date();
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { label: 'Overdue', cls: 'bg-red-50 text-red-600' };
  if (diffDays === 0) return { label: 'Today', cls: 'bg-amber-50 text-amber-700' };
  if (diffDays === 1) return { label: 'Tomorrow', cls: 'bg-amber-50 text-amber-600' };
  if (diffDays <= 3) return { label: `${diffDays}d`, cls: 'bg-blue-50 text-blue-600' };
  return { label: d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }), cls: 'bg-slate-100 text-slate-500' };
}

export default function DealTasksPanel({ dealId }: { dealId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/deals/tasks?dealId=${dealId}`)
      .then(r => r.json())
      .then(d => setTasks(d.tasks ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [dealId]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (task: Task) => {
    const next = !task.completed;
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: next } : t));
    const res = await fetch(`/api/deals/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: next }),
    });
    if (!res.ok) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: task.completed } : t));
      toast('Failed to update task', 'error');
    }
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    const res = await fetch(`/api/deals/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      load();
      toast('Failed to delete task', 'error');
    }
  };

  const addTask = async () => {
    if (!newContent.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch('/api/deals/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, content: newContent.trim(), dueDate: newDueDate || null }),
      });
      if (!res.ok) throw new Error();
      const { task } = await res.json();
      setTasks(prev => [task, ...prev]);
      setNewContent('');
      setNewDueDate('');
      setAdding(false);
      toast('Task added', 'success');
    } catch {
      toast('Failed to add task', 'error');
    } finally {
      setSaving(false);
    }
  };

  const open = tasks.filter(t => !t.completed);
  const done = tasks.filter(t => t.completed);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-600">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
          <p className="text-sm font-semibold text-slate-900">Action Items</p>
          {open.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              {open.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setAdding(a => !a)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          {adding ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="px-5 py-4 bg-blue-50 border-b border-blue-100 space-y-3">
          <input
            type="text"
            autoFocus
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="e.g. Send pricing breakdown to CFO"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={newDueDate}
              onChange={e => setNewDueDate(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-600"
            />
            <button
              onClick={addTask}
              disabled={!newContent.trim() || saving}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-all"
            >
              {saving ? 'Saving…' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="px-5 py-8 text-center text-xs text-slate-400">Loading…</div>
      ) : tasks.length === 0 ? (
        <div className="px-5 py-6 text-center space-y-1">
          <p className="text-sm text-slate-500">No action items yet</p>
          <p className="text-xs text-slate-400">Use AI Debrief to auto-extract them from call notes</p>
        </div>
      ) : (
        <div>
          {/* Open tasks */}
          {open.length > 0 && (
            <div className="divide-y divide-slate-50">
              {open.map(task => {
                const badge = dueBadge(task.dueDate);
                return (
                  <div key={task.id} className="flex items-start gap-3 px-5 py-3.5 group hover:bg-slate-50 transition-colors">
                    <button
                      onClick={() => toggle(task)}
                      className="w-5 h-5 rounded-full border-2 border-slate-300 hover:border-blue-500 flex-shrink-0 mt-0.5 transition-colors"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800">{task.content}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {task.source === 'debrief' && (
                          <span className="text-xs text-indigo-500 font-medium">AI</span>
                        )}
                        {badge && (
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${badge.cls}`}>{badge.label}</span>
                        )}
                        {task.assignedTo && task.assignedTo !== 'rep' && (
                          <span className="text-xs text-slate-400">→ {task.assignedTo}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all flex-shrink-0 p-0.5"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Completed tasks (collapsed count) */}
          {done.length > 0 && (
            <div className="border-t border-slate-100 px-5 py-3">
              <p className="text-xs text-slate-400">{done.length} completed action item{done.length !== 1 ? 's' : ''}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
