import { Competitor } from '@/lib/types/competitive';
import { SAPartner } from '@/lib/types/sa-partners';
import { PursuitBattleCard, StakeholderAngle } from '@/lib/types/pursuit';

export function formatTCO(min: number, max: number): string {
  const fmt = (n: number) =>
    n >= 1_000_000 ? `R${(n / 1_000_000).toFixed(1)}M` : `R${(n / 1_000).toFixed(0)}K`;
  return `${fmt(min)}–${fmt(max)}`;
}

export function computeBattleCard(
  competitor: Competitor | null,
  partner: SAPartner | null
): PursuitBattleCard {
  const platformName = competitor?.name ?? null;
  const siName = partner?.name ?? null;

  const openingStatement =
    competitor && partner
      ? `Competing against ${platformName} implemented by ${siName}. This battle card addresses both the platform fit gap and the consultancy credibility gap.`
      : competitor
      ? `Competing against ${platformName}. Position HaloITSM as the superior ITSM platform for the SA market.`
      : partner
      ? `Competing against ${siName} for the HaloITSM implementation contract. Differentiate Stratwyze's specialist approach.`
      : '';

  const platformWeaknesses: string[] = competitor
    ? competitor.keyWeaknesses.map(w => `${w.title}: ${w.description}`)
    : [];

  const siWeaknesses: string[] = partner ? partner.weaknesses : [];

  // Narrative split into discrete plays for readable on-screen display.
  const narrativePoints: string[] =
    competitor && partner
      ? [
          competitor.salesRebuttal.keyMessage,
          partner.flankingStrategy.approach,
          `When ${competitor.name} and ${partner.name} appear together, sequence the pursuit: lead with platform risk — TCO, implementation timeline, POPIA data residency — then SI credibility — track record, pure-play HaloITSM focus, no competing platforms.`,
          `This order stops the prospect anchoring on brand recognition before they hear your cost and speed story.`,
        ]
      : competitor
      ? [competitor.salesRebuttal.keyMessage]
      : partner
      ? [partner.flankingStrategy.approach]
      : [];

  // Joined form kept for export / copy-to-clipboard consumers.
  const combinedNarrative = narrativePoints.join(' ');

  const winStatement =
    competitor && partner
      ? `Stratwyze delivers HaloITSM — the modern, SA-compliant ITSM platform — at ${formatTCO(competitor.tco3Year.haloITSM.min, competitor.tco3Year.haloITSM.max)} over 3 years, in 4–8 weeks, with a team whose only product is Halo.`
      : competitor
      ? `HaloITSM delivers enterprise ITSM at ${formatTCO(competitor.tco3Year.haloITSM.min, competitor.tco3Year.haloITSM.max)} over 3 years vs ${competitor.name}'s ${competitor.complexity.implementation} timeline.`
      : partner
      ? `Stratwyze is a pure-play HaloITSM partner — no competing platforms, no MSP operations, no divided attention.`
      : '';

  const stakeholderAngles: StakeholderAngle[] = [
    {
      persona: 'CIO',
      headline: competitor ? 'Platform TCO, strategic risk, and time-to-value' : 'Partner delivery confidence and strategic alignment',
      talkingPoints: [
        competitor
          ? `3YR TCO: ${competitor.name} ${formatTCO(competitor.tco3Year.competitor.min, competitor.tco3Year.competitor.max)} vs HaloITSM ${formatTCO(competitor.tco3Year.haloITSM.min, competitor.tco3Year.haloITSM.max)}`
          : null,
        competitor
          ? `Implementation timeline: ${competitor.complexity.implementation} for ${competitor.name} vs 4–8 weeks for HaloITSM`
          : null,
        competitor && competitor.ownership.includes('PE')
          ? `Vendor risk: ${competitor.name} is PE-owned — pricing and roadmap are at private equity discretion`
          : null,
        partner
          ? `SI risk: ${partner.weaknesses[0] ?? 'limited ITSM implementation track record'}`
          : null,
        'Stratwyze delivers the full Halo ecosystem: HaloITSM + HaloCRM + HaloPSA — one SA partner, one platform.',
      ].filter((x): x is string => x !== null),
    },
    {
      persona: 'IT Manager',
      headline: 'Feature completeness, daily usability, and admin overhead',
      talkingPoints: [
        ...(competitor?.functionality?.slice(0, 2).map(f => `${f.category}: ${f.gap}`) ?? []),
        competitor ? `Admin complexity: ${competitor.complexity.adminComplexity} — ${competitor.name} requires ${competitor.complexity.customization.toLowerCase()} customisation` : null,
        competitor ? `Support quality: ${competitor.complexity.supportQuality} vs HaloITSM's responsive UK-backed support` : null,
        partner ? `Process depth: ${partner.weaknesses[1] ?? 'limited ITSM process engineering capability'}` : null,
        'HaloITSM is purpose-built ITSM — not a customer service tool, not a project platform adapted for ITSM.',
      ].filter((x): x is string => x !== null),
    },
    {
      persona: 'Procurement',
      headline: 'Pricing transparency, hidden costs, and contract risk',
      talkingPoints: [
        competitor ? `Pricing model: ${competitor.pricing.type} at ${competitor.pricing.basePrice}` : null,
        competitor && competitor.pricing.additionalCosts.length > 0
          ? `Hidden costs: ${competitor.pricing.additionalCosts[0]}`
          : null,
        competitor ? `Implementation cost: ${competitor.implementationCost}` : null,
        partner && partner.typicalDealSize
          ? `Typical SI deal size: ${partner.typicalDealSize} — ask for itemised day-rates and post-go-live retainer costs`
          : null,
        'Stratwyze empowers your team to self-manage HaloITSM — no mandatory ongoing SI retainer after go-live.',
      ].filter((x): x is string => x !== null),
    },
    {
      persona: 'CISO',
      headline: 'Data residency, security posture, and POPIA compliance',
      talkingPoints: [
        competitor && competitor.deployment.toLowerCase().includes('only')
          ? `${competitor.name} is ${competitor.deployment} — data leaves South Africa, creating POPIA cross-border transfer risk`
          : null,
        competitor
          ? `Security certifications: ${competitor.securityCertifications.length > 0 ? competitor.securityCertifications.join(', ') : 'verify directly — limited public certification evidence'}`
          : null,
        competitor && competitor.architecture === 'Legacy'
          ? `Legacy architecture: ${competitor.name}'s codebase carries elevated CVE exposure`
          : null,
        'HaloITSM supports on-premises deployment — full SA data sovereignty and POPIA compliance from day one.',
        'HaloITSM is ISO 27001 certified, UK-based, with regular proactive security updates.',
      ].filter((x): x is string => x !== null),
    },
  ];

  const watchOuts: string[] = [
    ...(competitor?.salesRebuttal?.weaknesses?.slice(0, 2) ?? []),
    ...(partner ? [partner.flankingStrategy.watchOut] : []),
  ];

  return {
    platformName,
    siName,
    openingStatement,
    platformWeaknesses,
    siWeaknesses,
    combinedNarrative,
    narrativePoints,
    stakeholderAngles,
    winStatement,
    watchOuts,
  };
}
