'use client';

import { useState } from 'react';
import DealCard from './DealCard';

interface ColumnDeal {
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

interface PipelineColumnProps {
  stage: { id: string; label: string };
  deals: ColumnDeal[];
  dealCount: number;
  columnValue: number;
  isOver?: boolean;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onCardDragStart?: (dealId: string) => void;
  onCardDragEnd?: () => void;
  onCardClick?: (dealId: string) => void;
}

/**
 * Kanban column for a single deal stage
 * Droppable area for cards with deal count and total value
 */
export default function PipelineColumn({
  stage,
  deals,
  dealCount,
  columnValue,
  isOver = false,
  onDragOver,
  onDragLeave,
  onDrop,
  onCardDragStart,
  onCardDragEnd,
  onCardClick,
}: PipelineColumnProps) {
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

  const handleCardDragStart = (dealId: string) => {
    setDraggedDealId(dealId);
    onCardDragStart?.(dealId);
  };

  const handleCardDragEnd = () => {
    setDraggedDealId(null);
    onCardDragEnd?.();
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-lg border border-slate-200">
      {/* Column Header */}
      <div className="bg-white border-b border-slate-200 p-4 rounded-t-lg">
        <h2 className="text-lg font-bold text-slate-900">{stage.label}</h2>
        <div className="flex items-center justify-between mt-2 text-sm text-slate-600">
          <span>{dealCount} deal{dealCount !== 1 ? 's' : ''}</span>
          <span className="font-semibold text-slate-900">{formatValue(columnValue)}</span>
        </div>
      </div>

      {/* Droppable Area */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`flex-1 p-4 space-y-3 overflow-y-auto transition-colors ${
          isOver ? 'bg-blue-50 border-l-4 border-blue-500' : ''
        }`}
      >
        {deals.length > 0 ? (
          deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              isDragging={draggedDealId === deal.id}
              onDragStart={() => handleCardDragStart(deal.id)}
              onDragEnd={handleCardDragEnd}
              onClick={() => onCardClick?.(deal.id)}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-slate-400">
            <p className="text-sm">No deals</p>
          </div>
        )}
      </div>
    </div>
  );
}
