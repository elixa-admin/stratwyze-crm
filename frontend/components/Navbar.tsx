'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold">
            Stratwyze CRM
          </Link>

          <div className="hidden md:flex gap-6">
            <Link href="/dashboard" className="hover:text-blue-200 transition">
              Dashboard
            </Link>
            <Link href="/leads" className="hover:text-blue-200 transition">
              Leads
            </Link>
            <Link href="/opportunities" className="hover:text-blue-200 transition">
              Opportunities
            </Link>
            <Link href="/deals" className="hover:text-blue-200 transition">
              Deals
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
