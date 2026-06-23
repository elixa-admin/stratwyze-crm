'use client';

import HealthCard from './HealthCard';
import { calculateDaysInStage } from '@/lib/deals/kanban';

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  primaryContact?: {
    intelligenceProfile?: {
      decisionMakerScore?: number;
      buyingRelevance?: number;
    } | null;
  } | null;
  stageWorkflow?: { stageHistory?: any[] } | null;
}

interface DealHealthDashboardProps {
  deals: Deal[];
  onDealClick?: (dealId: string) => void;
}

export default function DealHealthDashboard({ deals, onDealClick }: DealHealthDashboardProps) {
  // Sort by health score (lowest first = at risk)
  const sorted = [...deals].sort((a, b) => {
    const aScore = ((a.primaryContact?.intelligenceProfile?.decisionMakerScore || 0) +
      (a.primaryContact?.intelligenceProfile?.buyingRelevance || 0)) / 2;
    const bScore = ((b.primaryContact?.intelligenceProfile?.decisionMakerScore || 0) +
      (b.primaryContact?.intelligenceProfile?.buyingRelevance || 0)) / 2;
    return aScore - bScore;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Deal Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((deal) => (
            <HealthCard
              key={deal.id}
              deal={deal}
              daysInStage={calculateDaysInStage(deal.stageWorkflow?.stageHistory)}
              onClick={() => onDealClick?.(deal.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
