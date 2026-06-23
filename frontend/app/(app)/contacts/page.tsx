'use client';

import { useEffect, useState } from 'react';
import ContactGrid from '@/components/contacts/ContactGrid';
import { useRouter } from 'next/navigation';

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

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('/api/contacts/grid');
        if (!res.ok) throw new Error('Failed to fetch contacts');
        const data = await res.json();
        setContacts(data.contacts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load contacts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3 text-center">
          <p className="text-red-900 font-semibold">Failed to load contacts</p>
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <ContactGrid
        contacts={contacts}
        onContactClick={(id) => router.push(`/contacts/${id}`)}
        onRefresh={(id) => {
          // Refresh intelligence for this contact
          console.log('Refreshing intelligence for contact:', id);
        }}
      />
    </div>
  );
}
