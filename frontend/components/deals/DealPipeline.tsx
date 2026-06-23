'use client';

import { useState, useEffect } from 'react';
import PipelineColumn from './PipelineColumn';
import { DEAL_STAGES } from '@/lib/deals/kanban';
import { toast } from '@/lib/toast';

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

interface DealPipelineProps {
  deals: Deal[];
  onDealClick?: (dealId: string) => void;
  onStageChange?: (dealId: string, newStage: string) => void;
}

/**
 * Deal Pipeline Kanban Board
 * Drag-drop deals between stages with real-time intelligence scores
 */
export default function DealPipeline({
  deals,
  onDealClick,
  onStageChange,
}: DealPipelineProps) {
  const [dealsByStage, setDealsByStage] = useState<Record<string, Deal[]>>({});
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [draggedOverStage, setDraggedOverStage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Organize deals by stage
  useEffect(() => {
    const organized: Record<string, Deal[]> = {};
    DEAL_STAGES.forEach((stage) => {
      organized[stage.id] = [];
    });
    deals.forEach((deal) => {
      if (organized[deal.stage]) {
        organized[deal.stage].push(deal);
      }
    });
    setDealsByStage(organized);
  }, [deals]);

  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal);
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
    setDraggedOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      setDraggedOverStage(null);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetStage: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedDeal) return;
    if (draggedDeal.stage === targetStage) {
      setDraggedOverStage(null);
      return;
    }

    setIsUpdating(true);
    try {
      // Optimistic update
      const newDealsByStage = { ...dealsByStage };
      newDealsByStage[draggedDeal.stage] = newDealsByStage[draggedDeal.stage].filter(
        (d) => d.id !== draggedDeal.id
      );
      newDealsByStage[targetStage] = [
        ...newDealsByStage[targetStage],
        { ...draggedDeal, stage: targetStage },
      ];
      setDealsByStage(newDealsByStage);

      // API call
      const res = await fetch(`/api/deals/${draggedDeal.id}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: targetStage }),
      });

      if (!res.ok) throw new Error('Failed to update deal stage');

      toast(`${draggedDeal.title} moved to ${targetStage}`, 'success');
      onStageChange?.(draggedDeal.id, targetStage);
    } catch (error) {
      toast('Failed to move deal', 'error');
      // Revert optimistic update
      setDealsByStage(dealsByStage);
    } finally {
      setIsUpdating(false);
      setDraggedOverStage(null);
      setDraggedDeal(null);
    }
  };

  // Calculate totals per stage
  const stageTotals = DEAL_STAGES.map((stage) => {
    const stageDealsList = dealsByStage[stage.id] || [];
    const totalValue = stageDealsList.reduce((sum, deal) => sum + deal.value, 0);
    return {
      stage: stage.id,
      count: stageDealsList.length,
      value: totalValue,
    };
  });

  return (
    <div className="h-full bg-white rounded-lg border border-slate-200 p-4">
      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Deal Pipeline</h1>
        <input
          type="text"
          placeholder="Search deals..."
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          disabled={isUpdating}
        />
      </div>

      {/* Pipeline Columns */}
      <div className="grid grid-cols-6 gap-4 h-[calc(100vh-250px)]">
        {DEAL_STAGES.map((stage) => (
          <PipelineColumn
            key={stage.id}
            stage={stage}
            deals={dealsByStage[stage.id] || []}
            dealCount={
              stageTotals.find((st) => st.stage === stage.id)?.count || 0
            }
            columnValue={
              stageTotals.find((st) => st.stage === stage.id)?.value || 0
            }
            isOver={draggedOverStage === stage.id && !!draggedDeal}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
            onCardDragStart={(dealId) => {
              const deal = deals.find((d) => d.id === dealId);
              if (deal) handleDragStart(deal);
            }}
            onCardDragEnd={handleDragEnd}
            onCardClick={onDealClick}
          />
        ))}
      </div>

      {/* Loading State */}
      {isUpdating && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
}
