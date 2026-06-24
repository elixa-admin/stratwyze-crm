'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import PageHeader from '@/components/shared/PageHeader';
import { toast } from '@/lib/toast';

interface Task {
  id: string;
  content: string;
  dealId: string;
  dueDate?: string | null;
  completed: boolean;
  source?: string | null;
  createdAt: string;
}

interface Deal {
  id: string;
  title: string;
  stage: string;
  value: number;
}

type FilterTab = 'open' | 'completed' | 'overdue';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<FilterTab>('open');

  useEffect(() => {
    Promise.all([
      fetch('/api/deals/list').then(r => r.json()).catch(() => ({ deals: [] })),
    ]).then(async ([dealsRes]) => {
      if (dealsRes.deals) {
        setDeals(dealsRes.deals);
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
      setLoading(false);
    });
  }, []);

  const toggleTask = async (task: Task) => {
    const newCompleted = !task.completed;
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: newCompleted } : t));
    const res = await fetch(`/api/deals/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: newCompleted }),
    });
    if (!res.ok) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: task.completed } : t));
      toast('Failed to update task', 'error');
    }
  };

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

  const getDealName = (dealId: string) => deals.find(d => d.id === dealId)?.title ?? 'Unknown';

  const filteredTasks = tasks.filter(t => {
    if (filterTab === 'completed') return t.completed;
    if (filterTab === 'overdue') return !t.completed && isOverdue(t.dueDate);
    return !t.completed;
  }).sort((a, b) => {
    if (!a.dueDate || !b.dueDate) return 0;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const overdueTasks = tasks.filter(t => !t.completed && isOverdue(t.dueDate));

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Tasks' }]} />
      <div className="space-y-6">
        <PageHeader title="Tasks" subtitle="All action items across your deals" />

        {/* Filter tabs */}
        <div className="flex gap-2 border-b border-slate-200">
          {[
            { id: 'open' as FilterTab, label: 'Open', count: tasks.filter(t => !t.completed).length },
            { id: 'overdue' as FilterTab, label: 'Overdue', count: overdueTasks.length },
            { id: 'completed' as FilterTab, label: 'Completed', count: tasks.filter(t => t.completed).length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
                filterTab === tab.id
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              {tab.label}
              <span className="w-5 h-5 rounded-full bg-slate-100 text-xs font-semibold flex items-center justify-center">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Task list */}
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading tasks…</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 font-medium">
              {filterTab === 'completed' ? 'No completed tasks yet' : filterTab === 'overdue' ? 'No overdue tasks' : 'No open tasks'}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              {filterTab === 'completed' ? 'Complete some tasks to see them here' : 'All caught up!'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-50">
            {filteredTasks.map(task => {
              const overdue = isOverdue(task.dueDate);
              const today = isDueToday(task.dueDate);
              return (
                <div
                  key={task.id}
                  className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group"
                >
                  <button
                    onClick={() => toggleTask(task)}
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all flex items-center justify-center ${
                      task.completed
                        ? 'bg-emerald-600 border-emerald-600'
                        : overdue
                        ? 'border-red-300 hover:border-red-500'
                        : 'border-slate-300 hover:border-blue-400'
                    }`}
                  >
                    {task.completed && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <Link href={`/deals/${task.dealId}`} className="hover:text-blue-600 transition-colors">
                      <p className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.content}
                      </p>
                    </Link>
                    <Link href={`/deals/${task.dealId}`} className="text-xs text-slate-500 hover:text-blue-600 transition-colors">
                      {getDealName(task.dealId)}
                    </Link>
                    {task.source === 'debrief' && (
                      <span className="inline-block mt-1 text-xs text-indigo-600 font-medium">AI</span>
                    )}
                  </div>

                  <div className="flex-shrink-0 text-right">
                    {task.dueDate && (
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded ${
                          task.completed
                            ? 'bg-slate-100 text-slate-500'
                            : overdue
                            ? 'bg-red-100 text-red-700'
                            : today
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {task.completed ? 'Done' : overdue ? 'Overdue' : today ? 'Today' : new Date(task.dueDate).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
