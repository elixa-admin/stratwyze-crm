'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';

interface Account {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  headquarters?: string;
  employees?: number;
  annualRevenue?: number;
}

interface AccountEditorModalProps {
  isOpen: boolean;
  account: Account;
  onClose: () => void;
  onSaved?: (updated: any) => void;
}

export default function AccountEditorModal({ isOpen, account, onClose, onSaved }: AccountEditorModalProps) {
  const [formData, setFormData] = useState({
    name: account.name,
    website: account.website || '',
    industry: account.industry || '',
    headquarters: account.headquarters || '',
    employees: account.employees || '',
    annualRevenue: account.annualRevenue || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'employees' || name === 'annualRevenue' ? (value ? parseFloat(value) : '') : value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast('Company name is required', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/accounts/${account.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          website: formData.website || null,
          industry: formData.industry || null,
          headquarters: formData.headquarters || null,
          employees: formData.employees ? parseFloat(String(formData.employees)) : null,
          annualRevenue: formData.annualRevenue ? parseFloat(String(formData.annualRevenue)) : null,
        }),
      });

      if (!res.ok) throw new Error('Failed to save');

      const data = await res.json();
      toast('Account updated', 'success');
      onSaved?.(data.account);
      onClose();
    } catch (err) {
      toast('Failed to save account', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Edit Account</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Company Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Acme Corp"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Website</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="https://acme.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Industry</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., SaaS, Finance, Healthcare"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Headquarters</label>
            <input
              type="text"
              name="headquarters"
              value={formData.headquarters}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., San Francisco, CA"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Employees</label>
              <input
                type="number"
                name="employees"
                value={formData.employees}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Annual Revenue</label>
              <input
                type="number"
                name="annualRevenue"
                value={formData.annualRevenue}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="5000000"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-3 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
