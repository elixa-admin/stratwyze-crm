'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/format';
import { toast } from '@/lib/toast';
import ContactPanel from '@/components/shared/ContactPanel';
import FollowUpScheduling from '@/components/shared/FollowUpScheduling';
import DealClosureSection from '@/components/shared/DealClosureSection';
import SaveAsTemplateModal from '@/components/shared/SaveAsTemplateModal';
import CompetitiveBriefDisplay from '@/components/shared/CompetitiveBriefDisplay';
import CompanyIntelligencePanel from '@/components/shared/CompanyIntelligencePanel';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import StageProgressCard from '@/components/deals/StageProgressCard';
import StageCTACard from '@/components/deals/StageCTACard';
import DealTasksPanel from '@/components/deals/DealTasksPanel';
import { calculateDaysInStage } from '@/lib/deals/kanban';
import GenerateProposalModal from '@/components/proposals/GenerateProposalModal';
import EmailComposeModal from '@/components/email/EmailComposeModal';

interface Activity {
  id: string;
  type: string;
  content: string;
  metadata?: any;
  createdAt: string;
}

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  role?: string;
}

interface Deal {
  id: string;
  title: string;
  value: number;
  currency: string;
  stage: 'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  notes?: string;
  archived?: boolean;
  dueDate?: string;
  nextAction?: string;
  source?: string;
  closureReason?: string;
  lossReason?: string;
  accountId?: string;
  account?: { id: string; name: string; industry?: string; annualRevenue?: number; headquarters?: string };
  primaryContactId?: string;
  primaryContact?: Contact;
  incumbentPlatform?: string;
  incumbentProvider?: string;
  enrichmentData?: any;
  competitiveBrief?: any;
  stageWorkflow?: { stageHistory?: any[] };
  activities?: Activity[];
  createdAt: string;
  updatedAt: string;
}

const STAGES: Deal['stage'][] = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

const STAGE_ACCENT: Record<string, { bar: string; badge: string }> = {
  Prospecting:   { bar: 'bg-slate-400',   badge: 'bg-slate-100 text-slate-700' },
  Qualification: { bar: 'bg-blue-500',    badge: 'bg-blue-100 text-blue-700' },
  Proposal:      { bar: 'bg-amber-500',   badge: 'bg-amber-100 text-amber-700' },
  Negotiation:   { bar: 'bg-purple-500',  badge: 'bg-purple-100 text-purple-700' },
  'Closed Won':  { bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
  'Closed Lost': { bar: 'bg-red-500',     badge: 'bg-red-100 text-red-700' },
};

const ACTIVITY_ICONS: Record<string, JSX.Element> = {
  note: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  stage_change: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  created: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  ),
  debrief: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
    </svg>
  ),
  call: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.08 1.18 2 2 0 012.07 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
    </svg>
  ),
  email: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  meeting: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

function CollapseSection({ title, badge, defaultOpen = false, children }: {
  title: string; badge?: string; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">{title}</span>
          {badge && <span className="text-xs text-slate-500 font-normal">{badge}</span>}
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && <div className="border-t border-slate-100">{children}</div>}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-48" />
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="h-7 bg-slate-200 rounded w-2/3" />
        <div className="h-3 bg-slate-100 rounded w-32" />
        <div className="flex gap-1 mt-4">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="flex-1 h-8 bg-slate-100 rounded" />)}
        </div>
      </div>
    </div>
  );
}

type SidebarTab = 'tasks' | 'contact' | 'info';

export default function DealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editStage, setEditStage] = useState<Deal['stage']>('Prospecting');
  const [noteInput, setNoteInput] = useState('');
  const [postingNote, setPostingNote] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [taskRefreshKey, setTaskRefreshKey] = useState(0);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('tasks');
  const noteRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch(`/api/deals/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.deal) {
          setDeal(data.deal);
          setEditTitle(data.deal.title);
          setEditValue(String(data.deal.value));
          setEditStage(data.deal.stage);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!deal) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/deals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, value: parseFloat(editValue), stage: editStage }),
      });
      const data = await res.json();
      if (data.deal) { setDeal(data.deal); setDirty(false); toast('Changes saved', 'success'); }
    } finally {
      setSaving(false);
    }
  };

  const handleStageChange = async (newStage: Deal['stage']) => {
    if (!deal || newStage === editStage) return;
    setEditStage(newStage);
    setSaving(true);
    try {
      const res = await fetch(`/api/deals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      const data = await res.json();
      if (data.deal) { setDeal(data.deal); setDirty(false); toast(`Stage → ${newStage}`, 'success'); }
    } finally {
      setSaving(false);
    }
  };

  const handlePostNote = async () => {
    if (!noteInput.trim()) return;
    setPostingNote(true);
    try {
      const res = await fetch(`/api/deals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteContent: noteInput.trim() }),
      });
      const data = await res.json();
      if (data.deal) {
        setDeal(data.deal);
        setNoteInput('');
        if (noteRef.current) noteRef.current.style.height = 'auto';
        toast('Note added', 'success');
      }
    } finally {
      setPostingNote(false);
    }
  };

  if (loading) return <DetailSkeleton />;
  if (!deal) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-slate-500">Deal not found.</p>
      <Link href="/pipeline" className="text-sm text-blue-600 hover:underline">← Back to Pipeline</Link>
    </div>
  );

  const stageIndex = STAGES.indexOf(editStage);
  const activities = deal.activities ?? [];
  const isClosed = editStage === 'Closed Won' || editStage === 'Closed Lost';

  // Activity filter state
  const [activitySearch, setActivitySearch] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>('all');
  const [activityDateFilter, setActivityDateFilter] = useState<string>('all');

  const ACTIVITY_TYPE_TABS = [
    { id: 'all',         label: 'All' },
    { id: 'note',        label: 'Notes' },
    { id: 'call',        label: 'Calls' },
    { id: 'email',       label: 'Emails' },
    { id: 'debrief',     label: 'Debriefs' },
    { id: 'stage_change',label: 'Stage' },
  ];

  const activityDateBoundary = (filter: string): Date | null => {
    const now = new Date();
    if (filter === 'today') { const d = new Date(now); d.setHours(0,0,0,0); return d; }
    if (filter === 'week')  { const d = new Date(now); d.setDate(d.getDate() - 7); return d; }
    if (filter === 'month') { const d = new Date(now); d.setMonth(d.getMonth() - 1); return d; }
    return null;
  };

  const filteredActivities = activities.filter(act => {
    if (activityTypeFilter !== 'all' && act.type !== activityTypeFilter) return false;
    const boundary = activityDateBoundary(activityDateFilter);
    if (boundary && new Date(act.createdAt) < boundary) return false;
    if (activitySearch.trim()) {
      const q = activitySearch.toLowerCase();
      if (!act.content.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const activeFilterCount = [
    activityTypeFilter !== 'all',
    activityDateFilter !== 'all',
    activitySearch.trim() !== '',
  ].filter(Boolean).length;
  const hasCompetitiveContext = !!(deal.incumbentPlatform || deal.incumbentProvider || deal.competitiveBrief);
  const showAccountOpenByDefault = editStage === 'Prospecting' || editStage === 'Qualification';
  const showCompetitiveOpenByDefault = editStage === 'Proposal' || editStage === 'Negotiation';

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <Breadcrumbs items={[
        { label: 'Pipeline', href: '/pipeline' },
        { label: deal.title }
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Header card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-start justify-between gap-4 mb-1">
              <input
                type="text"
                value={editTitle}
                onChange={e => { setEditTitle(e.target.value); setDirty(true); }}
                className="flex-1 text-2xl font-bold text-slate-900 bg-transparent border-0 focus:outline-none focus:ring-0 p-0 min-w-0"
                placeholder="Deal title"
              />
              <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${STAGE_ACCENT[editStage]?.badge}`}>
                {editStage}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Created {new Date(deal.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
              {saving && <span className="ml-2 text-blue-500">Saving…</span>}
            </p>

            {/* Stage progression */}
            <div className="mb-4">
              <div className="flex gap-1">
                {STAGES.map((s, i) => {
                  const active = i <= stageIndex;
                  const isCurrent = s === editStage;
                  return (
                    <button
                      key={s}
                      onClick={() => handleStageChange(s)}
                      className={`flex-1 py-2 rounded-md text-[11px] font-semibold transition-all relative ${
                        active
                          ? `${STAGE_ACCENT[editStage]?.bar ?? 'bg-blue-600'} text-white shadow-sm`
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                      }`}
                    >
                      {s === 'Closed Won' ? 'Won' : s}
                      {isCurrent && <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-80" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Value + Account */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Deal Value</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <span className="text-slate-400 text-sm font-medium">R</span>
                  <input
                    type="number"
                    value={editValue}
                    onChange={e => { setEditValue(e.target.value); setDirty(true); }}
                    className="flex-1 text-lg font-bold text-slate-900 bg-transparent border-0 focus:outline-none p-0 w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Account</label>
                {deal.account ? (
                  <Link href={`/accounts/${deal.account.id}`}
                    className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 hover:border-blue-300 hover:bg-blue-50 transition-all group min-h-[42px]">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">{deal.account.name}</p>
                      {deal.account.industry && <p className="text-xs text-slate-400">{deal.account.industry}</p>}
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-300 group-hover:text-blue-400 flex-shrink-0">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                ) : (
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 min-h-[42px]">
                    <span className="text-sm text-slate-400">No account linked</span>
                  </div>
                )}
              </div>
            </div>

            {/* Incumbent quick tags — always visible when set */}
            {(deal.incumbentPlatform || deal.incumbentProvider) && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {deal.incumbentPlatform && (
                  <span className="text-xs bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded-full font-medium">
                    vs {deal.incumbentPlatform}
                  </span>
                )}
                {deal.incumbentProvider && (
                  <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-full font-medium">
                    SI: {deal.incumbentProvider}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ─ STAGE WORKFLOW ─ (promoted to top — most important for daily work) */}
          <StageProgressCard
            dealId={deal.id}
            currentStage={editStage}
            daysInStage={calculateDaysInStage(deal.stageWorkflow?.stageHistory)}
            activities={activities}
            onDebriefComplete={() => setTaskRefreshKey(k => k + 1)}
          />

          {/* ─ STAGE CTA ─ */}
          <StageCTACard
            stage={editStage}
            dealId={deal.id}
            accountId={deal.accountId ?? undefined}
            primaryContactId={deal.primaryContactId ?? undefined}
            onGenerateProposal={() => setProposalModalOpen(true)}
            onGenerateBrief={() => {
              const btn = document.getElementById('competitive-brief-generate-btn') as HTMLButtonElement | null;
              btn?.click();
            }}
          />

          {/* ─ ACCOUNT OVERVIEW (collapsible) ─ */}
          {deal.account && (
            <CollapseSection
              title="Account Overview"
              badge={deal.account.name}
              defaultOpen={showAccountOpenByDefault}
            >
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Industry</p>
                    <p className="text-sm font-medium text-slate-900">{deal.account.industry || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">ARR</p>
                    <p className="text-sm font-medium text-slate-900">
                      {deal.account.annualRevenue ? formatCurrency(deal.account.annualRevenue) : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Location</p>
                    <p className="text-sm font-medium text-slate-900">{(deal.account as any).headquarters || '—'}</p>
                  </div>
                </div>
                {deal.enrichmentData && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">AI Company Research</p>
                    <CompanyIntelligencePanel enrichmentData={deal.enrichmentData} />
                  </div>
                )}
                <Link href={`/accounts/${deal.account.id}`} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  View full account →
                </Link>
              </div>
            </CollapseSection>
          )}

          {/* ─ COMPETITIVE CONTEXT (collapsible) ─ */}
          {hasCompetitiveContext && (
            <CollapseSection
              title="Competitive Context"
              badge={deal.incumbentPlatform ?? undefined}
              defaultOpen={showCompetitiveOpenByDefault}
            >
              <div className="p-5 space-y-4">
                <CompetitiveBriefDisplay
                  dealId={deal.id}
                  dealTitle={deal.title}
                  accountInfo={deal.account ? { name: deal.account.name, industry: deal.account.industry ?? undefined, annualRevenue: deal.account.annualRevenue ?? undefined } : undefined}
                  incumbentPlatform={deal.incumbentPlatform}
                  incumbentProvider={deal.incumbentProvider}
                  brief={deal.competitiveBrief}
                  onBriefUpdated={brief => setDeal({ ...deal, competitiveBrief: brief })}
                />
              </div>
            </CollapseSection>
          )}

          {/* ─ ACTIVITY TIMELINE ─ */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Activity
                {activities.length > 0 && (
                  <span className="ml-2 text-xs text-slate-400 font-normal">
                    {activeFilterCount > 0
                      ? `${filteredActivities.length} of ${activities.length}`
                      : `${activities.length} entries`}
                  </span>
                )}
                {activeFilterCount > 0 && (
                  <span className="ml-2 text-[10px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                    {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} on
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTemplateModalOpen(true)}
                  className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Save as Template
                </button>
                <button
                  onClick={() => setEmailModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Send Email
                </button>
              </div>
            </div>

            {/* Activity filters */}
            {activities.length > 3 && (
              <div className="px-5 py-3 border-b border-slate-100 space-y-2.5 bg-slate-50/50">
                {/* Search */}
                <div className="relative">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    value={activitySearch}
                    onChange={e => setActivitySearch(e.target.value)}
                    placeholder="Search activity…"
                    className="w-full pl-8 pr-8 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                  />
                  {activitySearch && (
                    <button onClick={() => setActivitySearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs">✕</button>
                  )}
                </div>
                {/* Type + date pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 flex-wrap">
                    {ACTIVITY_TYPE_TABS.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActivityTypeFilter(tab.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                          activityTypeFilter === tab.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="h-3 w-px bg-slate-200 mx-1" />
                  <div className="flex items-center gap-1">
                    {[
                      { id: 'all',   label: 'Any time' },
                      { id: 'today', label: 'Today' },
                      { id: 'week',  label: 'This week' },
                      { id: 'month', label: 'This month' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setActivityDateFilter(opt.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                          activityDateFilter === opt.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => { setActivitySearch(''); setActivityTypeFilter('all'); setActivityDateFilter('all'); }}
                      className="ml-auto text-[11px] text-slate-500 hover:text-slate-700 underline underline-offset-2"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Note composer */}
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
              <textarea
                ref={noteRef}
                value={noteInput}
                onChange={e => {
                  setNoteInput(e.target.value);
                  if (noteRef.current) {
                    noteRef.current.style.height = 'auto';
                    noteRef.current.style.height = noteRef.current.scrollHeight + 'px';
                  }
                }}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handlePostNote(); }}
                placeholder="Add a note… (Cmd+Enter to save)"
                rows={2}
                className="w-full text-sm text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder:text-slate-400 overflow-hidden"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handlePostNote}
                  disabled={!noteInput.trim() || postingNote}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {postingNote ? 'Saving…' : 'Add Note'}
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="divide-y divide-slate-50">
              {[
                ...filteredActivities,
                ...(activityTypeFilter === 'all' || activityTypeFilter === 'created' ? [{ id: '__created__', type: 'created', content: 'Deal created', createdAt: deal.createdAt, metadata: null }] : []),
              ].map((act, idx) => {
                const isDebrief = act.type === 'debrief';
                const isStageChange = act.type === 'stage_change';
                const iconBg = isDebrief
                  ? 'bg-indigo-100 text-indigo-600'
                  : isStageChange ? 'bg-blue-100 text-blue-600'
                  : act.type === 'created' ? 'bg-slate-100 text-slate-500'
                  : 'bg-emerald-50 text-emerald-600';

                if (isDebrief && act.metadata) {
                  const m = act.metadata as any;
                  const sentimentStyle: Record<string, string> = {
                    positive: 'bg-emerald-100 text-emerald-700',
                    neutral:  'bg-amber-100 text-amber-700',
                    at_risk:  'bg-red-100 text-red-700',
                  };
                  return (
                    <div key={act.id ?? idx} className="px-5 py-4 border-b border-slate-50">
                      <div className="flex gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${iconBg}`}>
                          {ACTIVITY_ICONS.debrief}
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-indigo-600">AI Debrief</span>
                            {m.sentiment && (
                              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${sentimentStyle[m.sentiment] ?? 'bg-slate-100 text-slate-600'}`}>
                                {m.sentiment === 'at_risk' ? 'At risk' : m.sentiment}
                              </span>
                            )}
                            <span className="text-xs text-slate-400">{timeAgo(act.createdAt)}</span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">{act.content.replace(/^\[AI Debrief[^\]]*\]\s*/, '')}</p>
                          {m.actionItems?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {m.actionItems.slice(0, 3).map((item: any, i: number) => (
                                <span key={i} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                                  ✓ {item.content.length > 40 ? item.content.slice(0, 40) + '…' : item.content}
                                </span>
                              ))}
                              {m.actionItems.length > 3 && (
                                <span className="text-xs text-slate-400">+{m.actionItems.length - 3} more</span>
                              )}
                            </div>
                          )}
                          {m.objections?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {m.objections.map((obj: any, i: number) => (
                                <span key={i} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-100">
                                  ⚠ {obj.category}{obj.competitor ? ` (${obj.competitor})` : ''}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={act.id ?? idx} className="flex gap-3 px-5 py-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${iconBg}`}>
                      {ACTIVITY_ICONS[act.type] ?? ACTIVITY_ICONS.note}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 leading-relaxed">{act.content}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{timeAgo(act.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {activities.length === 0 && (
              <div className="px-5 pb-5 text-center">
                <p className="text-xs text-slate-400">No activity yet — log a call, run AI Debrief, or add a note above.</p>
              </div>
            )}
            {activities.length > 0 && filteredActivities.length === 0 && (
              <div className="px-5 py-8 text-center">
                <p className="text-xs text-slate-500 font-medium mb-1">No activities match your filters</p>
                <button
                  onClick={() => { setActivitySearch(''); setActivityTypeFilter('all'); setActivityDateFilter('all'); }}
                  className="text-[11px] text-blue-600 hover:text-blue-700 underline underline-offset-2"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN — tabbed sidebar ── */}
        <div className="space-y-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden sticky top-4">

            {/* Tab bar */}
            <div className="flex border-b border-slate-100">
              {([
                { id: 'tasks',   label: 'Tasks' },
                { id: 'contact', label: 'Contact' },
                { id: 'info',    label: 'Info' },
              ] as { id: SidebarTab; label: string }[]).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSidebarTab(tab.id)}
                  className={`flex-1 py-3 text-xs font-semibold transition-all border-b-2 ${
                    sidebarTab === tab.id
                      ? 'text-blue-600 border-blue-600 bg-blue-50/50'
                      : 'text-slate-500 border-transparent hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tasks tab */}
            {sidebarTab === 'tasks' && (
              <DealTasksPanel key={taskRefreshKey} dealId={deal.id} />
            )}

            {/* Contact tab */}
            {sidebarTab === 'contact' && (
              <div className="p-4 space-y-4">
                <ContactPanel contact={deal.primaryContact} />
                {deal.primaryContact?.email && (
                  <button
                    onClick={() => setEmailModalOpen(true)}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    Send Email
                  </button>
                )}
              </div>
            )}

            {/* Info tab */}
            {sidebarTab === 'info' && (
              <div className="divide-y divide-slate-50">
                <FollowUpScheduling dealId={deal.id} dueDate={deal.dueDate} nextAction={deal.nextAction} />
                {isClosed && (
                  <DealClosureSection
                    dealId={deal.id}
                    stage={editStage}
                    closureReason={deal.closureReason}
                    lossReason={deal.lossReason}
                    onUpdate={() => window.location.reload()}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating save bar */}
      {dirty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-lg z-50">
          <span className="text-sm">Unsaved changes</span>
          <button
            onClick={() => { setEditTitle(deal.title); setEditValue(String(deal.value)); setEditStage(deal.stage); setDirty(false); }}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition-all disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      )}

      {deal && (
        <SaveAsTemplateModal
          isOpen={templateModalOpen}
          dealTitle={deal.title}
          accountId={deal.accountId}
          incumbentPlatform={deal.incumbentPlatform}
          incumbentProvider={deal.incumbentProvider}
          onClose={() => setTemplateModalOpen(false)}
          onSaved={() => {}}
        />
      )}

      {proposalModalOpen && deal && (
        <GenerateProposalModal
          dealId={deal.id}
          dealTitle={deal.title}
          onClose={() => setProposalModalOpen(false)}
        />
      )}

      {emailModalOpen && deal && (
        <EmailComposeModal
          isOpen={emailModalOpen}
          onClose={() => { setEmailModalOpen(false); window.location.reload(); }}
          dealId={deal.id}
          dealTitle={deal.title}
          toEmail={deal.primaryContact?.email ?? ''}
          toName={deal.primaryContact?.name ?? ''}
          contactId={deal.primaryContactId ?? undefined}
          accountName={deal.account?.name}
          stage={editStage}
        />
      )}
    </div>
  );
}
