import { useEffect, useState } from 'react';
import { cacheProfile, getCachedProfile, formatCacheAge } from './contact-intelligence/mobile-cache';
import { toast } from './toast';

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
    buyingRelevance?: number;
    haloItsmRelevance?: number;
    confidenceScore?: number;
  } | null;
  briefing: any;
  evidence: any;
}

interface UseMobileIntelligenceReturn {
  profile: IntelligenceProfile | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  cachedAt: string | null;
  isCached: boolean;
  refresh: () => Promise<void>;
}

/**
 * Hook for mobile-optimized intelligence profile loading
 * - Fast: returns cached profile immediately
 * - Offline: works without network
 * - Smart refresh: automatic fallback to cache on error
 */
export function useContactIntelligenceMobile(
  contactId: string
): UseMobileIntelligenceReturn {
  const [profile, setProfile] = useState<IntelligenceProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cachedAt, setCachedAt] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);

  // Initial load: try cache first, then network
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      // Try cache first (instant load)
      const cached = getCachedProfile(contactId);
      if (cached) {
        setProfile(cached.profile);
        setCachedAt(formatCacheAge(cached.hoursSince));
        setIsCached(true);
        setIsLoading(false);

        // If stale, refetch in background without blocking UI
        if (cached.isStale) {
          refreshInBackground();
        }
      } else {
        // No cache, fetch from network
        await fetchProfile();
      }
    };

    load();
  }, [contactId]);

  const fetchProfile = async () => {
    try {
      setError(null);
      const res = await fetch(`/api/contacts/${contactId}/intelligence/profile`);

      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await res.json();
      setProfile(data);
      setCachedAt(formatCacheAge(0));
      setIsCached(false);

      // Cache for offline use
      cacheProfile(contactId, data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load intelligence');

      // Fallback to cache on error
      const cached = getCachedProfile(contactId);
      if (cached) {
        setProfile(cached.profile);
        setCachedAt(formatCacheAge(cached.hoursSince));
        setIsCached(true);
        toast('Using cached intelligence (offline)', 'info');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshInBackground = async () => {
    try {
      await fetch(`/api/contacts/${contactId}/intelligence/profile`)
        .then(r => r.json())
        .then(data => {
          setProfile(data);
          setCachedAt(formatCacheAge(0));
          cacheProfile(contactId, data);
        });
    } catch {
      // Silent fail, keep cached version
    }
  };

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchProfile();
      toast('Intelligence updated!', 'success');
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    profile,
    isLoading,
    isRefreshing,
    error,
    cachedAt,
    isCached,
    refresh,
  };
}
