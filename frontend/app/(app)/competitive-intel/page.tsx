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
import { SAPartner, PartnerCategory } from '@/lib/types/sa-partners';

const RISK_LEVELS: RiskLevel[] = ['Critical', 'High', 'Medium', 'Low'];
type ActiveTab = 'global' | 'sa' | 'pursuit' | 'proposal';

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
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<PartnerCategory | 'All'>('All');

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Competitive Intelligence</h1>
        <p className="text-slate-600 text-sm mt-1">
          Platform positioning, SA landscape, and flanking strategies for pursuit opportunities
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('global')}
          className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
            activeTab === 'global'
              ? 'text-blue-600 border-blue-500'
              : 'text-slate-500 border-transparent hover:text-slate-700'
          }`}
        >
          Global Platforms
          <span className="ml-2 text-[11px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
            {COMPETITORS.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('sa')}
          className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
            activeTab === 'sa'
              ? 'text-blue-600 border-blue-500'
              : 'text-slate-500 border-transparent hover:text-slate-700'
          }`}
        >
          SA Landscape
          <span className="ml-2 text-[11px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
            {SA_PARTNERS.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('pursuit')}
          className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
            activeTab === 'pursuit'
              ? 'text-blue-600 border-blue-500'
              : 'text-slate-500 border-transparent hover:text-slate-700'
          }`}
        >
          Pursuit Builder
        </button>
        <button
          onClick={() => setActiveTab('proposal')}
          className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
            activeTab === 'proposal'
              ? 'text-blue-600 border-blue-500'
              : 'text-slate-500 border-transparent hover:text-slate-700'
          }`}
        >
          Proposal Builder
          <span className="ml-2 text-[10px] font-bold text-white bg-blue-600 px-1.5 py-0.5 rounded-full">AI</span>
        </button>
      </div>

      {/* ─── GLOBAL PLATFORMS TAB ─── */}
      {activeTab === 'global' && (
        <div className="space-y-5">
          {/* Risk Level Legend */}
          <div className="flex flex-wrap gap-4 items-center text-sm">
            <span className="font-semibold text-slate-700">Risk Level:</span>
            <div className="flex gap-3">
              {[
                { label: 'Critical', color: 'bg-red-500' },
                { label: 'High', color: 'bg-orange-500' },
                { label: 'Medium', color: 'bg-blue-500' },
                { label: 'Low', color: 'bg-green-500' },
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
          {/* Context banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500 flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-0.5">South African Competitive Landscape</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Two categories of SA competitors: <span className="font-medium text-blue-700">HaloITSM Channel Partners</span> compete for the same Halo implementation contracts.{' '}
                  <span className="font-medium text-purple-700">Competing Platform Partners</span> target the same ITSM budget with Ivanti, ServiceNow, ManageEngine, or Freshservice.
                </p>
              </div>
            </div>
          </div>

          {/* SA Threat legend */}
          <div className="flex flex-wrap gap-4 items-center text-sm">
            <span className="font-semibold text-slate-700">Threat Level:</span>
            <div className="flex gap-3">
              {[
                { label: 'Primary', color: 'bg-red-500' },
                { label: 'Secondary', color: 'bg-orange-500' },
                { label: 'Emerging', color: 'bg-slate-400' },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-slate-600">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SA Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </span>
              <input
                type="text"
                value={saSearchQuery}
                onChange={e => setSaSearchQuery(e.target.value)}
                placeholder="Search SA competitors..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
            <select
              value={selectedCategoryFilter}
              onChange={e => setSelectedCategoryFilter(e.target.value as PartnerCategory | 'All')}
              className="px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="HaloITSM Channel Partner">HaloITSM Channel Partners</option>
              <option value="Competing Platform Partner">Competing Platform Partners</option>
            </select>
          </div>

          {/* Two-section grid + sticky panel */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: two sections */}
            <div className="lg:col-span-3 space-y-6">

              {/* HaloITSM Channel Partners */}
              {(selectedCategoryFilter === 'All' || selectedCategoryFilter === 'HaloITSM Channel Partner') && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <h3 className="text-sm font-semibold text-slate-800">
                      HaloITSM Channel Partners
                    </h3>
                    <span className="text-[11px] text-slate-500">({channelPartners.length})</span>
                    <span className="text-[11px] text-slate-500 ml-1">— same platform, competing for same contracts</span>
                  </div>
                  {channelPartners.length > 0 ? (
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
                    <p className="text-slate-500 text-sm py-4 text-center">No channel partners match your search</p>
                  )}
                </div>
              )}

              {/* Divider */}
              {selectedCategoryFilter === 'All' && <div className="border-t border-slate-200" />}

              {/* Competing Platform Partners */}
              {(selectedCategoryFilter === 'All' || selectedCategoryFilter === 'Competing Platform Partner') && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <h3 className="text-sm font-semibold text-slate-800">
                      Competing Platform Partners
                    </h3>
                    <span className="text-[11px] text-slate-500">({platformPartners.length})</span>
                    <span className="text-[11px] text-slate-500 ml-1">— different platforms, same ITSM budget</span>
                  </div>
                  {platformPartners.length > 0 ? (
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
                    <p className="text-slate-500 text-sm py-4 text-center">No platform partners match your search</p>
                  )}
                </div>
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
  );
}
