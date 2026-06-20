'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { prospects } from '@/lib/api';

interface Prospect {
  id: string;
  lead_id: string;
  company_name?: string;
  company_website?: string;
  industry?: string;
  employees?: number;
  annual_revenue?: string;
  technology_stack?: any;
  strategic_intent?: string;
  budget?: string;
  contact_data?: any;
  research_notes?: string;
  executive_brief?: string;
  brief_generated_at?: string;
}

export default function ProspectPage() {
  const router = useRouter();
  const params = useParams();
  const prospectId = params.id as string;

  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [formData, setFormData] = useState<Partial<Prospect>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchProspect();
  }, [router]);

  const fetchProspect = async () => {
    try {
      const response = await prospects.get(prospectId);
      setProspect(response.data);
      setFormData(response.data);
    } catch (err) {
      console.error('Failed to fetch prospect:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await prospects.update(prospectId, formData);
      setProspect(formData as Prospect);
      alert('Prospect updated successfully');
    } catch (err) {
      alert('Failed to update prospect');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading prospect...</div>;
  }

  if (!prospect) {
    return <div className="p-8">Prospect not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Prospect Profile</h1>
          <Link href="/leads" className="text-blue-600 hover:text-blue-700">
            Back to Leads
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Company Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Company Name</label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Website</label>
                  <input
                    type="text"
                    name="company_website"
                    value={formData.company_website || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Industry</label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Employees</label>
                    <input
                      type="number"
                      name="employees"
                      value={formData.employees || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Annual Revenue</label>
                    <input
                      type="text"
                      name="annual_revenue"
                      value={formData.annual_revenue || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Budget</label>
                    <input
                      type="text"
                      name="budget"
                      value={formData.budget || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Strategic Intent</label>
                  <textarea
                    name="strategic_intent"
                    value={formData.strategic_intent || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Research Notes</label>
                  <textarea
                    name="research_notes"
                    value={formData.research_notes || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  {saving ? 'Saving...' : 'Save Prospect'}
                </button>
              </div>
            </div>
          </div>

          <div>
            {formData.executive_brief && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Executive Brief</h3>
                <div className="prose prose-sm">
                  {formData.executive_brief}
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Generated: {formData.brief_generated_at}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
