'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Dashboard from '@/components/Dashboard';
import KanbanBoard from '@/components/KanbanBoard';

export default function DashboardPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [view, setView] = useState<'metrics' | 'pipeline'>('metrics');

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
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              Stratwyze
            </Link>
            <div className="flex gap-1">
              <Link href="/dashboard" className="px-4 py-2 rounded-lg text-gray-600 hover:bg-blue-50 font-medium transition">
                Dashboard
              </Link>
              <Link href="/leads" className="px-4 py-2 rounded-lg text-gray-600 hover:bg-blue-50 font-medium transition">
                Leads
              </Link>
              <Link href="/analytics" className="px-4 py-2 rounded-lg text-gray-600 hover:bg-blue-50 font-medium transition">
                Analytics
              </Link>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* View Tabs - Modern Button Style */}
      <div className="bg-gray-50 border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-3">
          <button
            onClick={() => setView('metrics')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              view === 'metrics'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            📊 Metrics
          </button>
          <button
            onClick={() => setView('pipeline')}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
              view === 'pipeline'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            📋 Pipeline
          </button>
        </div>
      </div>

      {/* Content */}
      {view === 'metrics' && <Dashboard />}
      {view === 'pipeline' && <KanbanBoard />}
    </div>
  );
}
