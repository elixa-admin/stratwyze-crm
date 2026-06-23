import { useEffect, useState } from 'react';
import { toast } from '@/lib/toast';

interface UseContactIntelligenceProps {
  contactId: string;
  autoResearch?: boolean;
}

interface IntelligenceProfile {
  contact: {
    name: string;
    title: string;
    company: string;
    email: string;
    emailConfidence: number;
    linkedin?: string;
  };
  profile: {
    researchCompletedAt: string;
    researchStatus: string;
    decisionMakerScore?: number;
    influenceScore?: number;
    technicalInfluence?: number;
    commercialInfluence?: number;
    haloItsmRelevance?: number;
    buyingRelevance?: number;
    confidenceScore?: number;
  } | null;
  briefing: any;
  evidence: {
    facts: any[];
    inferences: any[];
    sources: any[];
  };
  lastRefreshAt?: string;
  nextRefreshAt?: string;
  researchProgress: {
    step1_domain: boolean;
    step2_company_web: boolean;
    step3_individual: boolean;
    step4_email: boolean;
    step5_career: boolean;
    step6_scores: boolean;
    step7_briefing: boolean;
  };
  status: 'not_started' | 'in_progress' | 'step4_complete' | 'completed' | 'failed';
  message?: string;
}

interface ResearchProgress {
  step: number;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export function useContactIntelligence({ contactId, autoResearch = false }: UseContactIntelligenceProps) {
  const [profile, setProfile] = useState<IntelligenceProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [progress, setProgress] = useState<ResearchProgress[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [contactId]);

  // Auto-research if enabled and not already researched
  useEffect(() => {
    if (autoResearch && profile && profile.status === 'not_started') {
      startResearch();
    }
  }, [autoResearch, profile?.status]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/contacts/${contactId}/intelligence/profile`);
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setProfile(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch profile');
      console.error('Profile fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const startResearch = async () => {
    try {
      setIsResearching(true);
      setError(null);
      setProgress([
        { step: 1, name: 'Resolve Company Domain', status: 'in_progress' },
        { step: 2, name: 'Research Company Web', status: 'pending' },
        { step: 3, name: 'Research Individual', status: 'pending' },
        { step: 4, name: 'Find & Validate Email', status: 'pending' },
        { step: 5, name: 'Generate Career Summary', status: 'pending' },
        { step: 6, name: 'Calculate Scores', status: 'pending' },
        { step: 7, name: 'Generate Briefing', status: 'pending' },
      ]);

      const res = await fetch(`/api/contacts/${contactId}/intelligence/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceRefresh: false }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Research failed');
      }

      const response = await res.json();

      // Poll for progress
      pollForProgress(response.profileId);

      toast('Intelligence research started. This may take a few minutes.', 'info');
    } catch (err: any) {
      setError(err?.message || 'Research failed');
      toast(err?.message || 'Research failed', 'error');
      setIsResearching(false);
    }
  };

  const pollForProgress = async (_profileId: string) => {
    const maxAttempts = 60; // Poll for up to 10 minutes (60 * 10s)
    let attempts = 0;

    const poll = async () => {
      try {
        const res = await fetch(`/api/contacts/${contactId}/intelligence/profile`);
        if (!res.ok) throw new Error('Failed to fetch profile');

        const data = await res.json();
        setProfile(data);

        // Update progress UI based on research state
        if (data.researchProgress) {
          const newProgress: ResearchProgress[] = [
            { step: 1, name: 'Resolve Company Domain', status: data.researchProgress.step1_domain ? 'completed' : 'pending' },
            { step: 2, name: 'Research Company Web', status: data.researchProgress.step2_company_web ? 'completed' : 'pending' },
            { step: 3, name: 'Research Individual', status: data.researchProgress.step3_individual ? 'completed' : 'pending' },
            { step: 4, name: 'Find & Validate Email', status: data.researchProgress.step4_email ? 'completed' : 'pending' },
            { step: 5, name: 'Generate Career Summary', status: data.researchProgress.step5_career ? 'completed' : 'pending' },
            { step: 6, name: 'Calculate Scores', status: data.researchProgress.step6_scores ? 'completed' : 'pending' },
            { step: 7, name: 'Generate Briefing', status: data.researchProgress.step7_briefing ? 'completed' : 'pending' },
          ];
          setProgress(newProgress);
        }

        if (data.status === 'completed' || data.status === 'step4_complete') {
          setIsResearching(false);
          toast('Intelligence research complete!', 'success');
          return;
        }

        if (data.status === 'failed') {
          setIsResearching(false);
          setError(data.message || 'Research failed');
          toast('Research failed: ' + (data.message || 'Unknown error'), 'error');
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          setIsResearching(false);
          setError('Research took too long');
          toast('Research timed out', 'error');
        }
      } catch (err: any) {
        console.error('Poll error:', err);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000);
        } else {
          setIsResearching(false);
          setError('Polling failed');
        }
      }
    };

    poll();
  };

  const refreshResearch = async () => {
    await startResearch();
  };

  return {
    profile,
    isLoading,
    isResearching,
    progress,
    error,
    startResearch,
    refreshResearch,
    fetchProfile,
  };
}
