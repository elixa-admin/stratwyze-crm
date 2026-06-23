'use client';

import { useEffect, useState } from 'react';
import DealPipeline from '@/components/deals/DealPipeline';
import { useRouter } from 'next/navigation';

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  account: { name: string } | null;
  primaryContact: {
    name: string;
    intelligenceProfile?: {
      decisionMakerScore?: number;
      buyingRelevance?: number;
    } | null;
  } | null;
  stageWorkflow?: {
    stageHistory?: any[];
  } | null;
}

/**
 * Deal Pipeline Page
 * Displays Kanban board of all deals grouped by stage
 */
export default function DealsPage() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch deals on mount
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await fetch('/api/deals', {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to fetch deals');
        const data = await res.json();
        setDeals(data.deals || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deals');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const handleDealClick = (dealId: string) => {
    router.push(`/deals/${dealId}`);
  };

  const handleStageChange = (dealId: string, newStage: string) => {
    // Update local state
    setDeals((prevDeals) =>
      prevDeals.map((deal) =>
        deal.id === dealId ? { ...deal, stage: newStage } : deal
      )
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Loading pipeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3 text-center">
          <p className="text-red-900 font-semibold">Failed to load pipeline</p>
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
      <DealPipeline
        deals={deals}
        onDealClick={handleDealClick}
        onStageChange={handleStageChange}
      />
    </div>
  );
}
