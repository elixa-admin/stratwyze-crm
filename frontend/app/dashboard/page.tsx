'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Dashboard from '@/components/Dashboard';
import KanbanBoard from '@/components/pipeline/KanbanBoard';
import GlobalSearch from '@/components/shared/GlobalSearch';

export default function DashboardPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [view, setView] = useState<'metrics' | 'pipeline'>('metrics');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (!authenticated) {
    return <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-slate-600">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Premium Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen bg-slate-800 border-r border-slate-700 z-40 transition-all duration-300 ${
        sidebarOpen ? 'w-80' : 'w-0'
      } overflow-hidden md:relative md:w-80`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 h-16 px-6 border-b border-slate-700">
            <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg text-white font-bold">
              ⚡
            </div>
            <span className="text-base font-bold text-white">Stratwyze</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {[
              { href: '/dashboard', label: 'Home', emoji: '🏠' },
              { href: '/dashboard', label: 'Dashboard', emoji: '📊' },
              { href: '/pipeline', label: 'Pipeline', emoji: '⚡' },
              { href: '/contacts', label: 'Contacts', emoji: '👥' },
              { href: "/analytics", label: "Reports", emoji: "📈" },
              { href: "/accounts", label: "Accounts", emoji: "🏛️" },
              { href: "/calendar", label: "Calendar", emoji: "📅" },
              { href: "/documents", label: "Documents", emoji: "📄" },
              { href: "/settings", label: "Settings", emoji: "⚙️" },
            ].map((item) => (
              <Link href={item.href} key={item.label}>
                <div className="flex items-center gap-3 px-3 py-3 rounded-md text-sm font-500 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-150 cursor-pointer">
                  <span className="text-lg">{item.emoji}</span>
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-700 p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-sm font-500 text-slate-300 hover:text-white hover:bg-red-500/10 transition-all duration-150"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Premium Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/50 h-16">
          <div className="flex items-center justify-between h-full px-6 gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 text-lg"
            >
              ☰
            </button>

            <GlobalSearch />

            <div className="flex items-center gap-3">
              <button className="px-4 py-2.5 rounded-lg text-sm font-600 bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-sm">
                Create
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                A
              </div>
            </div>
          </div>
        </header>

        {/* View Selector */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex gap-3">
            <button
              onClick={() => setView('metrics')}
              className={`px-6 py-2.5 rounded-lg font-600 transition-all ${
                view === 'metrics'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              📊 Metrics
            </button>
            <button
              onClick={() => setView('pipeline')}
              className={`px-6 py-2.5 rounded-lg font-600 transition-all ${
                view === 'pipeline'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              ⚡ Pipeline
            </button>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          {view === 'metrics' && <Dashboard />}
          {view === 'pipeline' && <KanbanBoard />}
        </main>
      </div>
    </div>
  );
}
