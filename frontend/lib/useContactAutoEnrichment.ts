import { useEffect, useState } from 'react';
import { preQualifyContact, shouldRefreshIntelligence, ENRICHMENT_CONFIG } from './contact-auto-enrichment';

interface UseContactAutoEnrichmentProps {
  contact: any;
  account: any;
  onEnrichmentStart?: () => void;
  onEnrichmentComplete?: (data: any) => void;
  onEnrichmentError?: (error: any) => void;
}

export function useContactAutoEnrichment({
  contact,
  account,
  onEnrichmentStart,
  onEnrichmentComplete,
  onEnrichmentError,
}: UseContactAutoEnrichmentProps) {
  const [isEnriching, setIsEnriching] = useState(false);
  const [hasAutoRun, setHasAutoRun] = useState(false);
  const [autoEnrichmentQualification, setAutoEnrichmentQualification] = useState<any>(null);

  useEffect(() => {
    // Skip if already enriched in this session
    if (hasAutoRun) return;

    // Skip if missing required data
    if (!contact?.id || !account?.id) return;

    // Skip if user has disabled auto-enrichment
    if (ENRICHMENT_CONFIG.DO_NOT_AUTO_RUN_IF.userDisabledAutoEnrichment) return;

    // Pre-qualify the contact
    const qualification = preQualifyContact(contact, account);
    setAutoEnrichmentQualification(qualification);

    // Check if we should auto-run
    const shouldAutoRun =
      ENRICHMENT_CONFIG.AUTO_RUN_ON_PAGE_LOAD &&
      qualification.shouldAutoEnrich &&
      ENRICHMENT_CONFIG.AUTO_RUN_FOR_PRIORITIES.includes(qualification.priority) &&
      shouldRefreshIntelligence(contact);

    if (!shouldAutoRun) return;

    // Auto-run intelligence
    runAutoEnrichment();
    setHasAutoRun(true);
  }, [contact?.id, account?.id, hasAutoRun]);

  const runAutoEnrichment = async () => {
    setIsEnriching(true);
    onEnrichmentStart?.();

    try {
      const res = await fetch(`/api/contacts/${contact.id}/intelligence`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Intelligence fetch failed');

      const data = await res.json();
      onEnrichmentComplete?.(data);
    } catch (err) {
      console.error('Auto-enrichment error:', err);
      onEnrichmentError?.(err);
    } finally {
      setIsEnriching(false);
    }
  };

  const manualRefresh = async () => {
    setIsEnriching(true);
    onEnrichmentStart?.();

    try {
      const res = await fetch(`/api/contacts/${contact.id}/intelligence`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Intelligence fetch failed');

      const data = await res.json();
      onEnrichmentComplete?.(data);
    } catch (err) {
      console.error('Manual refresh error:', err);
      onEnrichmentError?.(err);
    } finally {
      setIsEnriching(false);
    }
  };

  return {
    isEnriching,
    hasAutoRun,
    autoEnrichmentQualification,
    manualRefresh,
  };
}
