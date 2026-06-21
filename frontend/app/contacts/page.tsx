'use client';

import Link from 'next/link';

const MOCK_CONTACTS = [
  { id: '1', name: 'Sarah Johnson', title: 'VP of Sales', company: 'Acme Corp', email: 'sarah.johnson@acme.com', avatar: 'SJ' },
  { id: '2', name: 'John Smith', title: 'CFO', company: 'Global Inc', email: 'j.smith@globalinc.com', avatar: 'JS' },
  { id: '3', name: 'Emily Davis', title: 'Director of IT', company: 'TechStart', email: 'emily.davis@techstart.io', avatar: 'ED' },
  { id: '4', name: 'Michael Chen', title: 'CEO', company: 'Fortune500', email: 'mchen@fortune500.com', avatar: 'MC' },
];

export default function ContactsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Contacts</h1>
          <p className="text-slate-600 mt-1">Manage your business relationships</p>
        </div>
        <button className="px-4 py-2.5 rounded-lg text-sm font-600 bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-sm">
          + Add Contact
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search contacts..."
          className="flex-1 px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select className="px-3 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Companies</option>
          <option>Acme Corp</option>
          <option>Global Inc</option>
          <option>TechStart</option>
        </select>
      </div>

      {/* Contacts List */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-4 font-600 text-sm text-slate-900">Name</th>
              <th className="text-left px-6 py-4 font-600 text-sm text-slate-900">Title</th>
              <th className="text-left px-6 py-4 font-600 text-sm text-slate-900">Company</th>
              <th className="text-left px-6 py-4 font-600 text-sm text-slate-900">Email</th>
              <th className="text-right px-6 py-4 font-600 text-sm text-slate-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CONTACTS.map((contact) => (
              <tr key={contact.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                      {contact.avatar}
                    </div>
                    <span className="font-500 text-slate-900">{contact.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{contact.title}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{contact.company}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{contact.email}</td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/contacts/${contact.id}`}
                    className="text-sm font-500 text-blue-600 hover:text-blue-700"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
