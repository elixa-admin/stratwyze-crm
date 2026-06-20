'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { leads } from '@/lib/api';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  title?: string;
  status: string;
  created_at: string;
}

export default function LeadsPage() {
  const router = useRouter();
  const [leadsData, setLeadsData] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [researchingId, setResearchingId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchLeads();
  }, [router]);

  const fetchLeads = async () => {
    try {
      const response = await leads.list();
      setLeadsData(response.data);
      setFilteredLeads(response.data);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (status: string) => {
    setStatusFilter(status);
    filterLeads(leadsData, status, searchTerm);
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    filterLeads(leadsData, statusFilter, query);
  };

  const filterLeads = (data: Lead[], status: string, query: string) => {
    let filtered = data;

    if (status !== 'all') {
      filtered = filtered.filter(lead => lead.status === status);
    }

    if (query) {
      filtered = filtered.filter(lead =>
        `${lead.first_name} ${lead.last_name} ${lead.email}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
    }

    setFilteredLeads(filtered);
  };

  const handleResearch = async (leadId: string) => {
    setResearchingId(leadId);
    try {
      await fetch(`http://localhost:8000/api/leads/${leadId}/research`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setTimeout(() => setResearchingId(null), 1500);
    } catch (err) {
      console.error('Research failed:', err);
      setResearchingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-600">Leads</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <Link href="/leads/new">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
              New Lead
            </button>
          </Link>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => handleFilter('all')}
            className={`px-4 py-2 rounded ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => handleFilter('new')}
            className={`px-4 py-2 rounded ${statusFilter === 'new' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            New
          </button>
          <button
            onClick={() => handleFilter('qualified')}
            className={`px-4 py-2 rounded ${statusFilter === 'qualified' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            Qualified
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading leads...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">No leads found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{lead.first_name} {lead.last_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.title || '—'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${lead.status === 'new' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => handleResearch(lead.id)}
                        disabled={researchingId === lead.id}
                        className={`px-2 py-1 rounded text-white font-semibold ${researchingId === lead.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700'}`}
                      >
                        {researchingId === lead.id ? '🔄' : '🔍'}
                      </button>
                      <Link href={`/prospects/${lead.id}`} className="text-blue-600 hover:text-blue-700">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
