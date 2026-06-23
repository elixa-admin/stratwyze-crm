'use client';

import { useState } from 'react';
import {
  calculateWinProbability,
  getDealSizeColor,
  formatDealValue,
  calculateDaysInStage,
  getWinProbabilityBadge,
} from '@/lib/deals/kanban';

interface DealCardProps {
  deal: {
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
  };
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick?: () => void;
}

/**
 * Deal card for Kanban board
 * Shows deal name, value, win probability, and days in stage
 */
export default function DealCard({
  deal,
  isDragging = false,
  onDragStart,
  onDragEnd,
  onClick,
}: DealCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  const winProbability = calculateWinProbability(
    deal.primaryContact?.intelligenceProfile?.decisionMakerScore,
    deal.primaryContact?.intelligenceProfile?.buyingRelevance
  );

  const daysInStage = calculateDaysInStage(deal.stageWorkflow?.stageHistory);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
      className={`bg-white rounded-lg border-2 border-slate-200 p-3 cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-slate-900 line-clamp-2">
            {deal.title}
          </h3>
          {deal.account && (
            <p className="text-xs text-slate-500 mt-0.5">{deal.account.name}</p>
          )}
        </div>
      </div>

      {/* Deal Value Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-slate-900">
            {formatDealValue(deal.value)}
          </span>
          <span className="text-xs text-slate-500">{daysInStage}d in stage</span>
        </div>
        <div className="w-full bg-slate-200 rounded h-2">
          <div
            className={`h-2 rounded transition-all ${getDealSizeColor(deal.value)}`}
            style={{ width: `${Math.min((deal.value / 500000) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Win Probability */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getWinProbabilityBadge(winProbability)}</span>
          <span className="text-sm font-semibold text-slate-900">{winProbability}%</span>
        </div>
        {deal.primaryContact && (
          <span className="text-xs text-slate-500 truncate">
            {deal.primaryContact.name}
          </span>
        )}
      </div>

      {/* Contact Preview (on hover) */}
      {showPreview && deal.primaryContact?.intelligenceProfile && (
        <div className="mt-2 pt-2 border-t border-slate-100 bg-slate-50 -mx-3 -mb-3 px-3 py-2 rounded-b-lg text-xs">
          <div className="flex gap-2 text-slate-600">
            <span>DM: {deal.primaryContact.intelligenceProfile.decisionMakerScore}%</span>
            <span>BR: {deal.primaryContact.intelligenceProfile.buyingRelevance}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
