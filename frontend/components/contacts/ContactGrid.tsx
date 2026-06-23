'use client';

import { useState, useMemo } from 'react';
import ContactGridRow from './ContactGridRow';
import { toast } from '@/lib/toast';

type FilterOption = 'all' | 'high' | 'nostale' | 'old';

interface Contact {
  id: string;
  name: string;
  title?: string;
  company?: string;
  email?: string;
  intelligenceProfile?: {
    decisionMakerScore?: number;
    buyingRelevance?: number;
    researchCompletedAt?: string;
  } | null;
}

interface ContactGridProps {
  contacts: Contact[];
  onContactClick?: (contactId: string) => void;
  onRefresh?: (contactId: string) => void;
}

export default function ContactGrid({
  contacts,
  onContactClick,
  onRefresh,
}: ContactGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterOption>('all');
  const [sortBy, setSortBy] = useState<'dm' | 'br' | 'name' | 'updated'>('dm');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter and sort contacts
  const filtered = useMemo(() => {
    let result = contacts;

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.company?.toLowerCase().includes(term) ||
          c.email?.toLowerCase().includes(term)
      );
    }

    // Apply filter
    if (filter === 'high') {
      result = result.filter(
        (c) =>
          (c.intelligenceProfile?.decisionMakerScore || 0) >= 75 ||
          (c.intelligenceProfile?.buyingRelevance || 0) >= 75
      );
    } else if (filter === 'nostale') {
      result = result.filter((c) => !c.intelligenceProfile?.researchCompletedAt);
    } else if (filter === 'old') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      result = result.filter((c) => {
        const updated = c.intelligenceProfile?.researchCompletedAt;
        return updated && new Date(updated) < sevenDaysAgo;
      });
    }

    // Sort
    result.sort((a, b) => {
      let aVal: any, bVal: any;

      if (sortBy === 'dm') {
        aVal = a.intelligenceProfile?.decisionMakerScore || 0;
        bVal = b.intelligenceProfile?.decisionMakerScore || 0;
      } else if (sortBy === 'br') {
        aVal = a.intelligenceProfile?.buyingRelevance || 0;
        bVal = b.intelligenceProfile?.buyingRelevance || 0;
      } else if (sortBy === 'name') {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (sortBy === 'updated') {
        aVal = new Date(a.intelligenceProfile?.researchCompletedAt || 0).getTime();
        bVal = new Date(b.intelligenceProfile?.researchCompletedAt || 0).getTime();
      }

      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortAsc ? comparison : -comparison;
    });

    return result;
  }, [contacts, searchTerm, filter, sortBy, sortAsc]);

  const handleRefresh = async (contactId: string) => {
    try {
      const res = await fetch(`/api/contacts/${contactId}/intelligence/research`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to refresh');
      toast('Intelligence refreshing...', 'info');
      onRefresh?.(contactId);
    } catch {
      toast('Failed to refresh intelligence', 'error');
    }
  };

  return (
    <div className="h-full bg-white rounded-lg border border-slate-200 p-4 flex flex-col">
      {/* Header */}
      <div className="space-y-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>

        {/* Search & Filter Bar */}
        <div className="flex gap-4 items-center flex-wrap">
          <input
            type="text"
            placeholder="Search contacts, company, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[250px] px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterOption)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Contacts</option>
            <option value="high">High Score (75+)</option>
            <option value="nostale">No Intel Yet</option>
            <option value="old">Stale (7+ days)</option>
          </select>

          <span className="text-sm text-slate-500">
            {filtered.length} of {contacts.length}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          {/* Header */}
          <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
            <tr>
              <th
                onClick={() => {
                  setSortBy('name');
                  setSortAsc(sortBy === 'name' ? !sortAsc : false);
                }}
                className="px-4 py-3 text-left font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
              >
                Name {sortBy === 'name' && (sortAsc ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Title</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Company</th>
              <th
                onClick={() => {
                  setSortBy('dm');
                  setSortAsc(sortBy === 'dm' ? !sortAsc : false);
                }}
                className="px-4 py-3 text-left font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
              >
                Decision Maker {sortBy === 'dm' && (sortAsc ? '↑' : '↓')}
              </th>
              <th
                onClick={() => {
                  setSortBy('br');
                  setSortAsc(sortBy === 'br' ? !sortAsc : false);
                }}
                className="px-4 py-3 text-left font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
              >
                Buying Relevance {sortBy === 'br' && (sortAsc ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
              <th
                onClick={() => {
                  setSortBy('updated');
                  setSortAsc(sortBy === 'updated' ? !sortAsc : false);
                }}
                className="px-4 py-3 text-left font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
              >
                Updated {sortBy === 'updated' && (sortAsc ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((contact) => (
                <ContactGridRow
                  key={contact.id}
                  contact={contact}
                  onRowClick={onContactClick}
                  onRefresh={() => handleRefresh(contact.id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  No contacts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
