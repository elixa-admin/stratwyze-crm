'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const teamMembers = [
    { id: '1', name: 'Anthony Alverado', email: 'anthony@stratwyze.com', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@stratwyze.com', role: 'Sales Manager', status: 'Active' },
    { id: '3', name: 'Michael Chen', email: 'michael@stratwyze.com', role: 'Sales Rep', status: 'Active' },
    { id: '4', name: 'Emily Davis', email: 'emily@stratwyze.com', role: 'Sales Rep', status: 'Inactive' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage workspace configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-3 font-500 border-b-2 transition-all ${
            activeTab === 'general'
              ? 'text-slate-900 border-blue-500'
              : 'text-slate-600 border-transparent hover:text-slate-900'
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`px-4 py-3 font-500 border-b-2 transition-all ${
            activeTab === 'team'
              ? 'text-slate-900 border-blue-500'
              : 'text-slate-600 border-transparent hover:text-slate-900'
          }`}
        >
          Team
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-3 font-500 border-b-2 transition-all ${
            activeTab === 'billing'
              ? 'text-slate-900 border-blue-500'
              : 'text-slate-600 border-transparent hover:text-slate-900'
          }`}
        >
          Billing
        </button>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6 max-w-2xl">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Workspace</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-500 text-slate-900 mb-2">Workspace Name</label>
                <input type="text" value="Stratwyze Sales" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-500 text-slate-900 mb-2">Email Domain</label>
                <input type="text" value="stratwyze.com" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm" />
              </div>
              <button className="px-4 py-2.5 rounded-lg text-sm font-600 bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-sm">
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Preferences</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-slate-900">Enable email notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-slate-900">Enable deal reminders</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-slate-900">Weekly activity digest</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Team Management */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900">Team Members</h2>
            <button className="px-4 py-2.5 rounded-lg text-sm font-600 bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-sm">
              + Invite Member
            </button>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-6 py-4 font-600 text-sm text-slate-900">Name</th>
                  <th className="text-left px-6 py-4 font-600 text-sm text-slate-900">Email</th>
                  <th className="text-left px-6 py-4 font-600 text-sm text-slate-900">Role</th>
                  <th className="text-left px-6 py-4 font-600 text-sm text-slate-900">Status</th>
                  <th className="text-right px-6 py-4 font-600 text-sm text-slate-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-500 text-slate-900">{member.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{member.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{member.role}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-600 px-2 py-1 rounded ${
                        member.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm font-500 text-blue-600 hover:text-blue-700">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Billing */}
      {activeTab === 'billing' && (
        <div className="space-y-6 max-w-2xl">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Current Plan</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div>
                  <p className="font-600 text-slate-900">Professional Plan</p>
                  <p className="text-sm text-slate-600">Up to 20 team members</p>
                </div>
                <p className="text-2xl font-bold text-slate-900">$299/mo</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Renews on January 15, 2027</p>
              </div>
              <button className="px-4 py-2.5 rounded-lg text-sm font-600 bg-slate-100 hover:bg-slate-200 text-slate-900 transition-all">
                Change Plan
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Billing History</h2>
            <div className="space-y-3">
              {[
                { date: 'Dec 15, 2024', amount: '$299.00', status: 'Paid' },
                { date: 'Nov 15, 2024', amount: '$299.00', status: 'Paid' },
                { date: 'Oct 15, 2024', amount: '$299.00', status: 'Paid' },
              ].map((invoice, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-200 last:border-b-0">
                  <div>
                    <p className="font-500 text-slate-900">{invoice.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-600 text-slate-900">{invoice.amount}</span>
                    <span className="text-xs font-600 px-2 py-1 rounded bg-green-50 text-green-700">{invoice.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
