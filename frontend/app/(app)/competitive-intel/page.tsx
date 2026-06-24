'use client';

import { useState, useMemo } from 'react';
import CompetitorCard from '@/components/competitive/CompetitorCard';
import CompetitorDetailPanel from '@/components/competitive/CompetitorDetailPanel';
import SAPartnerCard from '@/components/competitive/SAPartnerCard';
import SAPartnerDetailPanel from '@/components/competitive/SAPartnerDetailPanel';
import PursuitEngine from '@/components/competitive/PursuitEngine';
import ProposalBuilder from '@/components/competitive/ProposalBuilder';
import { COMPETITORS } from '@/lib/data/competitors';
import { SA_PARTNERS } from '@/lib/data/sa-partners';
import { Competitor, RiskLevel } from '@/lib/types/competitive';
import PageHeader from '@/components/shared/PageHeader';
import { SAPartner, PartnerCategory } from '@/lib/types/sa-partners';

const RISK_LEVELS: RiskLevel[] = ['Critical', 'High', 'Medium', 'Low'];
type ActiveTab = 'global' | 'sa' | 'pursuit' | 'proposal';

const SUB_NAV: { id: ActiveTab; label: string; count?: number; badge?: string; description: string; icon: JSX.Element }[] = [
  {
    id: 'global',
    label: 'Platforms',
    count: COMPETITORS.length,
    description: 'Global ITSM platform positioning',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 2 9 5-9 5-9-5 9-5z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" />
      </svg>
    ),
  },
  {
    id: 'sa',
    label: 'System Integrators',
    count: SA_PARTNERS.length,
    description: 'SA channel & platform SIs',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
  },
  {
    id: 'pursuit',
    label: 'Pursuit Builder',
    description: 'Unified battle card generator',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 'proposal',
    label: 'Proposal Builder',
    badge: 'AI',
    description: 'Stream a full HaloITSM proposal',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
];

interface VerificationReportInterface {
  freshnessScore: string;
  freshnessRationale: string;
  newIntelligence: string[];
  recommendation: string;
  safeToPropose: boolean;
}

export default function CompetitiveIntelPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('global');

  // Proposal tab state (set when navigating from Pursuit Builder)
  const [proposalCompetitorId, setProposalCompetitorId] = useState('');
  const [proposalSiId, setProposalSiId] = useState('');
  const [proposalVerificationReport, setProposalVerificationReport] = useState<VerificationReportInterface | null>(null);

  const handleNavigateToProposal = (competitorId: string, siId: string, verificationReport?: VerificationReportInterface) => {
    setProposalCompetitorId(competitorId);
    setProposalSiId(siId);
    setProposalVerificationReport(verificationReport ?? null);
    setActiveTab('proposal');
  };

  // Global tab state
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<RiskLevel | 'All'>('All');
  const [selectedDeploymentFilter, setSelectedDeploymentFilter] = useState<string>('All');

  // SA tab state
  const [selectedPartner, setSelectedPartner] = useState<SAPartner | null>(null);
  const [saSearchQuery, setSaSearchQuery] = useState('');
  const [selectedCategoryFilter] = useState<PartnerCategory | 'All'>('All');

  // Get unique deployment options
  const deploymentOptions = useMemo(() => {
    const deployments = new Set(COMPETITORS.map(c => c.deployment));
    return Array.from(deployments).sort();
  }, []);

  // Filter global competitors
  const filteredCompetitors = useMemo(() => {
    return COMPETITORS.filter(competitor => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        competitor.name.toLowerCase().includes(searchLower) ||
        competitor.tagline.toLowerCase().includes(searchLower) ||
        competitor.ownership.toLowerCase().includes(searchLower) ||
        competitor.keyWeaknesses.some(w => w.title.toLowerCase().includes(searchLower));
      const matchesRisk = selectedRiskFilter === 'All' || competitor.riskLevel === selectedRiskFilter;
      const matchesDeployment = selectedDeploymentFilter === 'All' || competitor.deployment === selectedDeploymentFilter;
      return matchesSearch && matchesRisk && matchesDeployment;
    });
  }, [searchQuery, selectedRiskFilter, selectedDeploymentFilter]);

  // Filter SA partners
  const filteredPartners = useMemo(() => {
    return SA_PARTNERS.filter(partner => {
      const searchLower = saSearchQuery.toLowerCase();
      const matchesSearch =
        partner.name.toLowerCase().includes(searchLower) ||
        partner.tagline.toLowerCase().includes(searchLower) ||
        partner.platformAlignment.toLowerCase().includes(searchLower) ||
        partner.weaknesses.some(w => w.toLowerCase().includes(searchLower));
      const matchesCategory = selectedCategoryFilter === 'All' || partner.category === selectedCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [saSearchQuery, selectedCategoryFilter]);

  const channelPartners = filteredPartners.filter(p => p.category === 'HaloITSM Channel Partner');
  const platformPartners = filteredPartners.filter(p => p.category === 'Competing Platform Partner');

  const [saSubTab, setSaSubTab] = useState<'halo-partners' | 'platform-sis'>('halo-partners');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Competitive Intelligence"
        subtitle="Platform positioning, SA landscape, and flanking strategies for pursuit opportunities"
      />

      {/* Section navigation + content */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left sub-navigation */}
        <aside className="lg:w-60 flex-shrink-0">
          <nav className="lg:sticky lg:top-4 bg-white rounded-xl border border-slate-200 shadow-xs p-2 space-y-1">
            <p className="px-2 pt-1 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Sections</p>
            {SUB_NAV.map(item => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-start gap-2.5 py-2.5 pr-3 pl-[9px] rounded-lg text-left transition-all border-l-[3px] ${
                    active
                      ? 'bg-blue-50 text-blue-700 border-blue-600'
                      : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={`mt-0.5 flex-shrink-0 ${active ? 'text-blue-600' : 'text-slate-400'}`}>{item.icon}</span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-1.5">
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.count !== undefined && (
                        <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${active ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                          {item.count}
                        </span>
                      )}
                      {item.badge && (
                        <span className="text-[10px] font-bold text-white bg-blue-600 px-1.5 py-0.5 rounded-full">{item.badge}</span>
                      )}
                    </span>
                    <span className={`block text-[11px] mt-0.5 leading-tight ${active ? 'text-blue-500' : 'text-slate-400'}`}>
                      {item.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content area */}
        <div className="flex-1 min-w-0">

      {/* ─── GLOBAL PLATFORMS TAB ─── */}
      {activeTab === 'global' && (
        <div className="space-y-5">
          {/* Risk Level Legend */}
          <div className="flex flex-wrap gap-4 items-center text-sm">
            <span className="font-semibold text-slate-700">Risk Level:</span>
            <div className="flex gap-3">
              {[
                { label: 'Critical', color: 'bg-red-500' },
                { label: 'High', color: 'bg-amber-400' },
                { label: 'Medium', color: 'bg-indigo-500' },
                { label: 'Low', color: 'bg-emerald-500' },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-slate-600">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search competitors..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
            <select
              value={selectedRiskFilter}
              onChange={e => setSelectedRiskFilter(e.target.value as RiskLevel | 'All')}
              className="px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="All">All Risk Levels</option>
              {RISK_LEVELS.map(level => (
                <option key={level} value={level}>{level} Risk</option>
              ))}
            </select>
            <select
              value={selectedDeploymentFilter}
              onChange={e => setSelectedDeploymentFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="All">All Deployments</option>
              {deploymentOptions.map(deployment => (
                <option key={deployment} value={deployment}>{deployment}</option>
              ))}
            </select>
          </div>

          {/* Grid + Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredCompetitors.length > 0 ? (
                filteredCompetitors.map(competitor => (
                  <CompetitorCard
                    key={competitor.id}
                    competitor={competitor}
                    isSelected={selectedCompetitor?.id === competitor.id}
                    onClick={() => setSelectedCompetitor(competitor)}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                  </div>
                  <p className="text-slate-600 font-medium">No competitors found</p>
                  <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
            <div className="lg:col-span-2">
              <div className="sticky top-6">
                <CompetitorDetailPanel competitor={selectedCompetitor} />
              </div>
            </div>
          </div>

          <div className="text-sm text-slate-500 text-center">
            Showing {filteredCompetitors.length} of {COMPETITORS.length} competitors
          </div>
        </div>
      )}

      {/* ─── SA LANDSCAPE TAB ─── */}
      {activeTab === 'sa' && (
        <div className="space-y-5">
          {/* Sub-tab: HaloITSM Partners | Platform SIs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
            <button
              onClick={() => setSaSubTab('halo-partners')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                saSubTab === 'halo-partners'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              HaloITSM Partners
              <span className="ml-2 text-[11px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                {channelPartners.length}
              </span>
            </button>
            <button
              onClick={() => setSaSubTab('platform-sis')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                saSubTab === 'platform-sis'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Platform SIs
              <span className="ml-2 text-[11px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
                {platformPartners.length}
              </span>
            </button>
          </div>

          {/* Context line */}
          <p className="text-xs text-slate-500">
            {saSubTab === 'halo-partners'
              ? 'SA companies that also implement HaloITSM — competing for the same Halo contracts.'
              : 'SA system integrators implementing ServiceNow, ManageEngine, Freshservice, or Ivanti — competing for the same ITSM budget.'}
          </p>

          {/* Search */}
          <div className="relative max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              type="text"
              value={saSearchQuery}
              onChange={e => setSaSearchQuery(e.target.value)}
              placeholder={saSubTab === 'halo-partners' ? 'Search HaloITSM partners…' : 'Search platform SIs…'}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Grid + sticky panel */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: cards */}
            <div className="lg:col-span-3 space-y-3">
              {saSubTab === 'halo-partners' && (
                channelPartners.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {channelPartners.map(partner => (
                      <SAPartnerCard
                        key={partner.id}
                        partner={partner}
                        isSelected={selectedPartner?.id === partner.id}
                        onClick={() => setSelectedPartner(partner)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm py-8 text-center">No HaloITSM partners match your search</p>
                )
              )}
              {saSubTab === 'platform-sis' && (
                platformPartners.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {platformPartners.map(partner => (
                      <SAPartnerCard
                        key={partner.id}
                        partner={partner}
                        isSelected={selectedPartner?.id === partner.id}
                        onClick={() => setSelectedPartner(partner)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm py-8 text-center">No platform SIs match your search</p>
                )
              )}
            </div>

            {/* Right: sticky detail panel */}
            <div className="lg:col-span-2">
              <div className="sticky top-6">
                <SAPartnerDetailPanel partner={selectedPartner} />
              </div>
            </div>
          </div>

          <div className="text-sm text-slate-500 text-center">
            Showing {filteredPartners.length} of {SA_PARTNERS.length} SA competitors
          </div>
        </div>
      )}

      {/* ─── PURSUIT BUILDER TAB ─── */}
      {activeTab === 'pursuit' && (
        <div className="space-y-5">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600 flex-shrink-0 mt-0.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-0.5">Pursuit Intelligence Engine</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Select the incumbent platform and/or SI consultancy in a live deal. Generate a unified battle card with platform risk, SI credibility gaps, and talking points segmented by stakeholder persona.
                </p>
              </div>
            </div>
          </div>
          <PursuitEngine onNavigateToProposal={handleNavigateToProposal} />
        </div>
      )}

      {/* ─── PROPOSAL BUILDER TAB ─── */}
      {activeTab === 'proposal' && (
        <div className="space-y-5">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600 flex-shrink-0 mt-0.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-0.5">AI Proposal Generator</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Configure the account, incumbent platform, and SI — then stream a full HaloITSM proposal with competitive positioning, TCO comparison, and tailored executive narrative. Print or export to PDF.
                </p>
              </div>
            </div>
          </div>
          <ProposalBuilder
            competitorId={proposalCompetitorId}
            saPartnerId={proposalSiId}
            verificationReport={proposalVerificationReport}
          />
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
