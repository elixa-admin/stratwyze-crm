'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GradientCard from './shared/GradientCard';
import { formatCurrency } from '@/lib/format';
import { DESIGN_TOKENS, STAGE_COLORS } from '@/lib/design-tokens';

interface DashboardMetrics {
  totalDeals: number;
  totalValue: number;
  dealsByStage: Record<string, number>;
  valueByStage: Record<string, number>;
  followUpsDue: number;
  recentActivities: Array<{
    id: string;
    type: string;
    deal: string;
    account: string;
    timestamp: string;
  }>;
}

const IconTrendingUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconAlertCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 h-24" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 h-48" />
        <div className="bg-white rounded-xl border border-slate-200 p-6 h-48" />
      </div>
    </div>
  );
}

export default function DashboardV2() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const dealsRes = await fetch('/api/deals');

        if (!dealsRes.ok) throw new Error('Failed to fetch deals');

        const dealsData = await dealsRes.json();
        const deals = dealsData.deals || [];

        // Calculate metrics
        const totalValue = deals.reduce((sum: number, deal: any) => sum + (deal.value || 0), 0);
        const dealsByStage: Record<string, number> = {};
        const valueByStage: Record<string, number> = {};

        deals.forEach((deal: any) => {
          const stage = deal.stage || 'Unknown';
          dealsByStage[stage] = (dealsByStage[stage] || 0) + 1;
          valueByStage[stage] = (valueByStage[stage] || 0) + (deal.value || 0);
        });

        const followUpsDue = deals.filter((d: any) => d.dueDate && new Date(d.dueDate) <= new Date()).length;

        setMetrics({
          totalDeals: deals.length,
          totalValue,
          dealsByStage,
          valueByStage,
          followUpsDue,
          recentActivities: [],
        });
      } catch (err) {
        console.error('Failed to fetch dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (!metrics) return <div className="text-center py-12 text-slate-500">Failed to load dashboard</div>;

  const STAGES = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const maxValue = Math.max(...STAGES.map(s => metrics.dealsByStage[s] || 0));

  return (
    <div className="space-y-6">
      {/* Top metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GradientCard accentColor="blue" title="My Deals" subtitle="Active opportunities">
          <div className="text-3xl font-bold text-slate-900">{metrics.totalDeals}</div>
          <p className="text-sm text-slate-600 mt-1">
            {formatCurrency(metrics.totalValue)}
          </p>
        </GradientCard>

        <GradientCard accentColor="emerald" title="Closed Won" subtitle="This quarter">
          <div className="text-3xl font-bold text-emerald-600">{metrics.dealsByStage['Closed Won'] || 0}</div>
          <p className="text-sm text-slate-600 mt-1">
            {formatCurrency(metrics.valueByStage['Closed Won'] || 0)}
          </p>
        </GradientCard>

        <GradientCard accentColor="amber" title="In Progress" subtitle="Proposal + Negotiation">
          <div className="text-3xl font-bold text-amber-600">
            {(metrics.dealsByStage['Proposal'] || 0) + (metrics.dealsByStage['Negotiation'] || 0)}
          </div>
          <p className="text-sm text-slate-600 mt-1">
            {formatCurrency(
              (metrics.valueByStage['Proposal'] || 0) + (metrics.valueByStage['Negotiation'] || 0)
            )}
          </p>
        </GradientCard>

        <GradientCard
          accentColor={metrics.followUpsDue > 0 ? 'red' : 'teal'}
          title="Follow-ups Due"
          subtitle={metrics.followUpsDue > 0 ? 'Action needed' : 'All caught up'}
        >
          <div className={`text-3xl font-bold ${metrics.followUpsDue > 0 ? 'text-red-600' : 'text-teal-600'}`}>
            {metrics.followUpsDue}
          </div>
          <Link href="/pipeline" className="text-xs text-blue-600 hover:text-blue-700 mt-2 inline-block">
            View pipeline →
          </Link>
        </GradientCard>
      </div>

      {/* Pipeline health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GradientCard accentColor="blue" title="Pipeline Health" subtitle="Deals by stage">
          <div className="space-y-3">
            {STAGES.map(stage => {
              const count = metrics.dealsByStage[stage] || 0;
              const value = metrics.valueByStage[stage] || 0;
              const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0;
              const accentColor = STAGE_COLORS[stage] || 'slate';

              return (
                <div key={stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700">{stage}</span>
                    <span className="text-xs text-slate-500">
                      {count} deal{count !== 1 ? 's' : ''} · {formatCurrency(value)}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${DESIGN_TOKENS.accents[accentColor].bar.replace('border-l-4', 'bg-')}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GradientCard>

        {/* Quick actions */}
        <GradientCard accentColor="teal" title="Quick Actions" subtitle="Next steps">
          <div className="space-y-2">
            <Link
              href="/pipeline"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition-colors text-sm text-slate-700"
            >
              <IconTrendingUp />
              View pipeline
            </Link>
            <button
              onClick={() => window.dispatchEvent(new Event('openNewDealModal'))}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition-colors text-sm text-slate-700 text-left"
            >
              <span className="text-lg">+</span>
              Create new deal
            </button>
            {metrics.followUpsDue > 0 && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 border border-red-100">
                <IconAlertCircle />
                <span className="text-xs text-red-700 font-medium">{metrics.followUpsDue} follow-ups due</span>
              </div>
            )}
          </div>
        </GradientCard>
      </div>
    </div>
  );
}
