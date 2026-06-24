'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Task {
  id: string;
  content: string;
  dealId: string;
  dueDate?: string | null;
  completed: boolean;
  source?: string | null;
}

interface Deal {
  id: string;
  title: string;
  stage: string;
  value: number;
}

export default function DashboardHome() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  useEffect(() => {
    // Fetch all deals to get their tasks
    Promise.all([
      fetch('/api/deals/list').then(r => r.json()).catch(() => ({ deals: [] })),
    ]).then(async ([dealsRes]) => {
      if (dealsRes.deals) {
        setDeals(dealsRes.deals);
        // Fetch tasks for each deal and aggregate
        const allTasks: Task[] = [];
        for (const deal of dealsRes.deals) {
          const tasksRes = await fetch(`/api/deals/tasks?dealId=${deal.id}`)
            .then(r => r.json())
            .catch(() => ({ tasks: [] }));
          if (tasksRes.tasks) {
            allTasks.push(...tasksRes.tasks);
          }
        }
        setTasks(allTasks);
      }
      setTasksLoading(false);
    });
  }, []);

  const openTasks = tasks.filter(t => !t.completed).sort((a, b) => {
    if (!a.dueDate || !b.dueDate) return 0;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const isOverdue = (dueDate: string | null | undefined) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const isDueToday = (dueDate: string | null | undefined) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    return due.toDateString() === today.toDateString();
  };

  const getDealName = (dealId: string) => {
    return deals.find(d => d.id === dealId)?.title ?? 'Unknown Deal';
  };

  return (
    <div className="space-y-6">
      {/* CTA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/deals/new" className="group">
          <div className="bg-white rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 hover:shadow-md transition-all p-6 text-center cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mx-auto mb-3 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-600">
                <polyline points="12 5 12 19M5 12h14"/>
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Create Deal</h3>
            <p className="text-xs text-slate-500">Start a new opportunity</p>
          </div>
        </Link>

        <Link href="/pipeline" className="group">
          <div className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all p-6 text-center cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center mx-auto mb-3 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-600">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Pipeline</h3>
            <p className="text-xs text-slate-500">View all deals by stage</p>
          </div>
        </Link>

        <Link href="/accounts" className="group">
          <div className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all p-6 text-center cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center mx-auto mb-3 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-600">
                <circle cx="12" cy="8" r="4"/>
                <path d="M6 20c0-2.667 2.686-4 6-4s6 1.333 6 4"/>
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Accounts</h3>
            <p className="text-xs text-slate-500">Manage companies & contacts</p>
          </div>
        </Link>

        <Link href="/competitive-intel" className="group">
          <div className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all p-6 text-center cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center mx-auto mb-3 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-600">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="19" cy="12" r="1"/>
                <circle cx="5" cy="12" r="1"/>
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Competitive Intel</h3>
            <p className="text-xs text-slate-500">Battle cards & intel</p>
          </div>
        </Link>
      </div>

      {/* My Tasks This Week */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">My Tasks This Week</h2>
            <p className="text-xs text-slate-500 mt-0.5">{openTasks.length} due action{openTasks.length !== 1 ? 's' : ''}</p>
          </div>
          <Link href="/tasks" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            View all →
          </Link>
        </div>

        {tasksLoading ? (
          <div className="px-6 py-8 text-center text-sm text-slate-400">Loading tasks…</div>
        ) : openTasks.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-slate-600 font-medium">No tasks due this week</p>
            <p className="text-xs text-slate-400 mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
            {openTasks.slice(0, 6).map(task => {
              const overdue = isOverdue(task.dueDate);
              const today = isDueToday(task.dueDate);
              return (
                <Link key={task.id} href={`/deals/${task.dealId}`} className="px-6 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 group">
                  <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 transition-all ${overdue ? 'border-red-300 bg-red-50' : today ? 'border-amber-300 bg-amber-50' : 'border-slate-300'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium group-hover:text-blue-600 transition-colors ${overdue ? 'text-red-700' : 'text-slate-900'}`}>
                      {task.content}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{getDealName(task.dealId)}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    {task.dueDate && (
                      <span className={`text-xs font-medium px-2 py-1 rounded ${overdue ? 'bg-red-100 text-red-700' : today ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                        {overdue ? 'Overdue' : today ? 'Today' : new Date(task.dueDate).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
            {openTasks.length > 6 && (
              <div className="px-6 py-3 text-center">
                <Link href="/tasks" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  View {openTasks.length - 6} more tasks
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Metrics Section */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-4">Pipeline Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Pipeline', value: deals.reduce((sum, d) => sum + d.value, 0), currency: true },
            { label: 'Open Deals', value: deals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage)).length },
            { label: 'In Proposal', value: deals.filter(d => d.stage === 'Proposal').length },
            { label: 'Tasks Pending', value: openTasks.length },
          ].map((metric, i) => (
            <div key={i} className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-slate-900">
                {metric.currency ? `R${(metric.value / 1_000_000).toFixed(1)}M` : metric.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
