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
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              Stratwyze CRM
            </Link>
            <div className="flex gap-4">
              <Link href="/leads" className="text-gray-600 hover:text-gray-900 font-medium">
                Leads
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
                Dashboard
              </Link>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* View Tabs */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          <button
            onClick={() => setView('metrics')}
            className={`py-4 font-semibold border-b-2 transition-colors ${
              view === 'metrics'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            📊 Metrics
          </button>
          <button
            onClick={() => setView('pipeline')}
            className={`py-4 font-semibold border-b-2 transition-colors ${
              view === 'pipeline'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
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
