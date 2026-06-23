'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GradientCard from './shared/GradientCard';
import DrillDownPanel from './shared/DrillDownPanel';
import { formatCurrency } from '@/lib/format';

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  account?: { name: string };
  createdAt: string;
  dueDate?: string;
}

interface DashboardMetrics {
  deals: Deal[];
  totalDeals: number;
  totalValue: number;
  dealsByStage: Record<string, number>;
  valueByStage: Record<string, number>;
  followUpsDue: number;
  inProgress: number;
  inProgressValue: number;
  closedWon: number;
  closedWonValue: number;
}

const IconAlertCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 h-28" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 h-60" />
        <div className="bg-white rounded-xl border border-slate-200 p-6 h-60" />
      </div>
    </div>
  );
}

interface DrillConfig {
  title: string;
  subtitle: string;
  deals: Deal[];
  accentColor: string;
  emptyMessage: string;
}

export default function DashboardV2() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDrill, setActiveDrill] = useState<DrillConfig | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/deals');
        if (!res.ok) throw new Error('Failed to fetch deals');
        const data = await res.json();
        const deals: Deal[] = data.deals || [];

        const dealsByStage: Record<string, number> = {};
        const valueByStage: Record<string, number> = {};
        deals.forEach((deal) => {
          const stage = deal.stage || 'Unknown';
          dealsByStage[stage] = (dealsByStage[stage] || 0) + 1;
          valueByStage[stage] = (valueByStage[stage] || 0) + (deal.value || 0);
        });

        const inProgressDeals = deals.filter(d => d.stage === 'Proposal' || d.stage === 'Negotiation');
        const followUpsDue = deals.filter(d => d.dueDate && new Date(d.dueDate) <= new Date()).length;

        setMetrics({
          deals,
          totalDeals: deals.length,
          totalValue: deals.reduce((s, d) => s + (d.value || 0), 0),
          dealsByStage,
          valueByStage,
          followUpsDue,
          inProgress: inProgressDeals.length,
          inProgressValue: inProgressDeals.reduce((s, d) => s + d.value, 0),
          closedWon: dealsByStage['Closed Won'] || 0,
          closedWonValue: valueByStage['Closed Won'] || 0,
        });
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (!metrics) return <div className="text-center py-12 text-slate-500">Failed to load dashboard</div>;

  const STAGES = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const maxCount = Math.max(...STAGES.map(s => metrics.dealsByStage[s] || 0), 1);

  const BAR_COLORS: Record<string, string> = {
    Prospecting: 'bg-blue-400',
    Qualification: 'bg-indigo-500',
    Proposal: 'bg-amber-400',
    Negotiation: 'bg-orange-500',
    'Closed Won': 'bg-emerald-500',
    'Closed Lost': 'bg-red-400',
  };

  const drillAll = (): DrillConfig => ({
    title: 'All Active Deals',
    subtitle: `${metrics.totalDeals} deal${metrics.totalDeals !== 1 ? 's' : ''} in pipeline`,
    deals: metrics.deals.filter(d => d.stage !== 'Closed Lost'),
    accentColor: 'from-blue-50 to-indigo-50',
    emptyMessage: 'No active deals yet. Create your first deal.',
  });

  const drillWon = (): DrillConfig => ({
    title: 'Closed Won Deals',
    subtitle: `${metrics.closedWon} deal${metrics.closedWon !== 1 ? 's' : ''} closed`,
    deals: metrics.deals.filter(d => d.stage === 'Closed Won'),
    accentColor: 'from-emerald-50 to-teal-50',
    emptyMessage: 'No closed won deals yet.',
  });

  const drillInProgress = (): DrillConfig => ({
    title: 'Deals In Progress',
    subtitle: 'Proposal + Negotiation stage',
    deals: metrics.deals.filter(d => d.stage === 'Proposal' || d.stage === 'Negotiation'),
    accentColor: 'from-amber-50 to-orange-50',
    emptyMessage: 'No deals in Proposal or Negotiation yet.',
  });

  const drillFollowups = (): DrillConfig => ({
    title: 'Follow-ups Due',
    subtitle: 'Overdue or due today',
    deals: metrics.deals.filter(d => d.dueDate && new Date(d.dueDate) <= new Date()),
    accentColor: 'from-red-50 to-rose-50',
    emptyMessage: "You're all caught up — no follow-ups overdue!",
  });

  const drillStage = (stage: string): DrillConfig => ({
    title: `${stage} Stage`,
    subtitle: `${metrics.dealsByStage[stage] || 0} deal${(metrics.dealsByStage[stage] || 0) !== 1 ? 's' : ''}`,
    deals: metrics.deals.filter(d => d.stage === stage),
    accentColor: 'from-slate-50 to-blue-50',
    emptyMessage: `No deals in ${stage} stage.`,
  });

  return (
    <div className="space-y-6">
      {/* Clickable metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GradientCard
          accentColor="blue"
          title="Total Pipeline"
          subtitle="Click to drill down"
          onClick={() => setActiveDrill(drillAll())}
          className="cursor-pointer"
        >
          <div className="text-3xl font-bold text-slate-900">{metrics.totalDeals}</div>
          <p className="text-sm text-slate-600 mt-1">{formatCurrency(metrics.totalValue)}</p>
          <p className="text-xs text-blue-500 mt-2">View all deals →</p>
        </GradientCard>

        <GradientCard
          accentColor="emerald"
          title="Closed Won"
          subtitle="Click to drill down"
          onClick={() => setActiveDrill(drillWon())}
          className="cursor-pointer"
        >
          <div className="text-3xl font-bold text-emerald-600">{metrics.closedWon}</div>
          <p className="text-sm text-slate-600 mt-1">{formatCurrency(metrics.closedWonValue)}</p>
          <p className="text-xs text-emerald-500 mt-2">View won deals →</p>
        </GradientCard>

        <GradientCard
          accentColor="amber"
          title="In Progress"
          subtitle="Proposal + Negotiation"
          onClick={() => setActiveDrill(drillInProgress())}
          className="cursor-pointer"
        >
          <div className="text-3xl font-bold text-amber-600">{metrics.inProgress}</div>
          <p className="text-sm text-slate-600 mt-1">{formatCurrency(metrics.inProgressValue)}</p>
          <p className="text-xs text-amber-500 mt-2">View active deals →</p>
        </GradientCard>

        <GradientCard
          accentColor={metrics.followUpsDue > 0 ? 'red' : 'teal'}
          title="Follow-ups Due"
          subtitle={metrics.followUpsDue > 0 ? 'Action needed!' : 'All caught up'}
          onClick={() => setActiveDrill(drillFollowups())}
          className="cursor-pointer"
        >
          <div className={`text-3xl font-bold ${metrics.followUpsDue > 0 ? 'text-red-600' : 'text-teal-600'}`}>
            {metrics.followUpsDue}
          </div>
          {metrics.followUpsDue > 0 && (
            <div className="flex items-center gap-1 mt-2 text-xs text-red-500">
              <IconAlertCircle /> <span>Overdue items</span>
            </div>
          )}
          <p className={`text-xs mt-1 ${metrics.followUpsDue > 0 ? 'text-red-400' : 'text-teal-400'}`}>
            {metrics.followUpsDue > 0 ? 'View overdue →' : 'All on track →'}
          </p>
        </GradientCard>
      </div>

      {/* Pipeline health + Recent deals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Pipeline by Stage</h3>
          <div className="space-y-3">
            {STAGES.map(stage => {
              const count = metrics.dealsByStage[stage] || 0;
              const value = metrics.valueByStage[stage] || 0;
              const pct = Math.round((count / maxCount) * 100);
              return (
                <button
                  key={stage}
                  onClick={() => setActiveDrill(drillStage(stage))}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700">{stage}</span>
                    <span className="text-xs text-slate-500">{count} deal{count !== 1 ? 's' : ''} · {formatCurrency(value)}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${BAR_COLORS[stage] || 'bg-blue-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Recent Deals</h3>
            <Link href="/pipeline" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </Link>
          </div>
          {metrics.deals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">No deals yet</p>
              <button
                onClick={() => window.dispatchEvent(new Event('openNewDealModal'))}
                className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                + Create your first deal
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {metrics.deals.slice(0, 5).map(deal => (
                <Link
                  key={deal.id}
                  href={`/deals/${deal.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-700">{deal.title.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600">{deal.title}</p>
                    <p className="text-xs text-slate-500">{deal.account?.name || 'No account'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{formatCurrency(deal.value)}</p>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      deal.stage === 'Closed Won' ? 'bg-emerald-100 text-emerald-700' :
                      deal.stage === 'Proposal' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{deal.stage}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => window.dispatchEvent(new Event('openNewDealModal'))}
              className="flex-1 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              + New Deal
            </button>
            <button
              onClick={() => window.dispatchEvent(new Event('openCreateAccountModal'))}
              className="flex-1 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              + New Account
            </button>
          </div>
        </div>
      </div>

      {/* Drill-down panel */}
      <DrillDownPanel
        config={activeDrill}
        onClose={() => setActiveDrill(null)}
      />
    </div>
  );
}
