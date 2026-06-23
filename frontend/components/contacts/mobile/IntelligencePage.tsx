'use client';

import { useState } from 'react';
import { useContactIntelligenceMobile } from '@/lib/useContactIntelligenceMobile';
import HeroCard from './HeroCard';
import ActionBar from './ActionBar';
import IntelligenceSection from './IntelligenceSection';
import BriefingModal from './BriefingModal';

interface MobileIntelligencePageProps {
  contactId: string;
  onBack: () => void;
}

/**
 * Mobile-optimized contact intelligence page
 * Wave 27: Hero card + sticky action bar + offline support
 */
export default function MobileIntelligencePage({
  contactId,
  onBack,
}: MobileIntelligencePageProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showBriefing, setShowBriefing] = useState(false);

  const { profile, isLoading, isRefreshing, error, cachedAt, isCached, refresh } =
    useContactIntelligenceMobile(contactId);

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Loading intelligence...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3 text-center">
          <p className="text-red-900 font-semibold">Failed to load intelligence</p>
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!profile?.contact) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">No intelligence data available</p>
      </div>
    );
  }

  const { contact } = profile;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
  };

  const handleCall = () => {
    window.location.href = `tel:${contact.email}`;
  };

  const handleRefresh = async () => {
    await refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="text-blue-600 font-semibold text-sm hover:text-blue-700"
          >
            ← Back
          </button>
          <h1 className="text-lg font-bold text-slate-900">{contact.name}</h1>
          <div className="w-12" />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Cache Status */}
        {isCached && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-700">
              📡 Using cached intelligence from {cachedAt}
            </p>
          </div>
        )}

        {/* Hero Card */}
        <HeroCard
          name={contact.name}
          title={contact.title || 'Unknown'}
          company={contact.company || 'Unknown'}
          email={contact.email}
          emailConfidence={contact.emailConfidence || 0}
          decisionMakerScore={profile.profile?.decisionMakerScore}
          buyingRelevance={profile.profile?.buyingRelevance}
          cachedAt={cachedAt}
          isCached={isCached}
        />

        {/* Full Briefing Button */}
        <button
          onClick={() => setShowBriefing(true)}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
        >
          📋 Read Full Briefing
        </button>

        {/* Expandable Sections (Wave 28) */}
        {profile?.briefing && (
          <>
            {/* Likely Priorities */}
            {profile.briefing.likelyPriorities?.length > 0 && (
              <IntelligenceSection
                title="Likely Priorities"
                icon="🎯"
                items={profile.briefing.likelyPriorities}
                isOpen={openSection === 'priorities'}
                onToggle={(isOpen) => {
                  setOpenSection(isOpen ? 'priorities' : null);
                }}
              />
            )}

            {/* Potential Pain Points */}
            {profile.briefing.potentialPainPoints?.length > 0 && (
              <IntelligenceSection
                title="Potential Pain Points"
                icon="⚠️"
                items={profile.briefing.potentialPainPoints}
                isOpen={openSection === 'painpoints'}
                onToggle={(isOpen) => {
                  setOpenSection(isOpen ? 'painpoints' : null);
                }}
              />
            )}

            {/* Conversation Starters */}
            {profile.briefing.conversationStarters?.length > 0 && (
              <IntelligenceSection
                title="Conversation Starters"
                icon="💬"
                items={profile.briefing.conversationStarters}
                isOpen={openSection === 'starters'}
                onToggle={(isOpen) => {
                  setOpenSection(isOpen ? 'starters' : null);
                }}
              />
            )}

            {/* Discovery Questions */}
            {profile.briefing.discoveryQuestions?.length > 0 && (
              <IntelligenceSection
                title="Discovery Questions"
                icon="❓"
                items={profile.briefing.discoveryQuestions}
                isOpen={openSection === 'discovery'}
                onToggle={(isOpen) => {
                  setOpenSection(isOpen ? 'discovery' : null);
                }}
              />
            )}

            {/* Evidence Sources */}
            {profile.evidence?.sources?.length > 0 && (
              <IntelligenceSection
                title={`Evidence Sources (${profile.evidence.sources.length})`}
                icon="🔗"
                items={profile.evidence.sources.map(
                  (s: any) =>
                    `${s.platform.toUpperCase()}: ${s.title || s.url}`
                )}
                isOpen={openSection === 'evidence'}
                onToggle={(isOpen) => {
                  setOpenSection(isOpen ? 'evidence' : null);
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Briefing Modal (Wave 28) */}
      {profile?.briefing && (
        <BriefingModal
          isOpen={showBriefing}
          onClose={() => setShowBriefing(false)}
          briefing={profile.briefing}
        />
      )}

      {/* Sticky Action Bar */}
      <ActionBar
        email={contact.email}
        onCopyEmail={handleCopyEmail}
        onCall={handleCall}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
    </div>
  );
}
