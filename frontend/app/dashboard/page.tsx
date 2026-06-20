'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Stratwyze CRM</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Leads</h2>
            <p className="text-4xl font-bold text-blue-600">0</p>
            <Link href="/leads" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
              View Leads →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Opportunities</h2>
            <p className="text-4xl font-bold text-green-600">0</p>
            <Link href="/opportunities" className="text-green-600 hover:text-green-700 mt-4 inline-block">
              View Opportunities →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Deals</h2>
            <p className="text-4xl font-bold text-purple-600">$0</p>
            <Link href="/deals" className="text-purple-600 hover:text-purple-700 mt-4 inline-block">
              View Deals →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/leads/new">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">
                Create New Lead
              </button>
            </Link>
            <Link href="/proposals/new">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg">
                Generate Proposal
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
