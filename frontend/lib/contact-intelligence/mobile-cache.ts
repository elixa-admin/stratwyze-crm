/**
 * Mobile offline caching for contact intelligence profiles
 * Uses localStorage to persist last-known-good profiles
 */

export interface CachedProfile {
  profile: any;
  cachedAt: number;
  isStale: boolean;
  hoursSince: number;
}

const CACHE_PREFIX = 'stratwyze_profile_';
const STALE_THRESHOLD = 2; // hours

/**
 * Cache a complete intelligence profile locally
 */
export function cacheProfile(contactId: string, profile: any): void {
  try {
    const data = {
      profile,
      cachedAt: Date.now(),
    };
    localStorage.setItem(`${CACHE_PREFIX}${contactId}`, JSON.stringify(data));
  } catch (err) {
    console.warn('[MobileCache] Failed to cache profile:', err);
  }
}

/**
 * Retrieve cached profile if available and not too stale
 */
export function getCachedProfile(contactId: string): CachedProfile | null {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${contactId}`);
    if (!cached) return null;

    const { profile, cachedAt } = JSON.parse(cached);
    const hoursSince = (Date.now() - cachedAt) / (1000 * 60 * 60);
    const isStale = hoursSince > STALE_THRESHOLD;

    return {
      profile,
      cachedAt,
      isStale,
      hoursSince,
    };
  } catch (err) {
    console.warn('[MobileCache] Failed to retrieve cached profile:', err);
    return null;
  }
}

/**
 * Clear a cached profile
 */
export function clearCache(contactId: string): void {
  try {
    localStorage.removeItem(`${CACHE_PREFIX}${contactId}`);
  } catch (err) {
    console.warn('[MobileCache] Failed to clear cache:', err);
  }
}

/**
 * Get all cached contact IDs
 */
export function getCachedContactIds(): string[] {
  try {
    const ids: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_PREFIX)) {
        const contactId = key.substring(CACHE_PREFIX.length);
        ids.push(contactId);
      }
    }
    return ids;
  } catch (err) {
    console.warn('[MobileCache] Failed to get cached IDs:', err);
    return [];
  }
}

/**
 * Format cached timestamp for display
 */
export function formatCacheAge(hoursSince: number): string {
  if (hoursSince < 1) {
    const minutes = Math.round(hoursSince * 60);
    return `${minutes}m ago`;
  }
  if (hoursSince < 24) {
    const hours = Math.round(hoursSince);
    return `${hours}h ago`;
  }
  const days = Math.round(hoursSince / 24);
  return `${days}d ago`;
}
