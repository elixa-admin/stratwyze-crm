/**
 * Proposal pricing calculator — matches CyberAntix budgetary proposal rates
 */

export interface PricingScenario {
  label: string;
  seats: number;
  seatType: 'named' | 'concurrent';
  licencePerSeatPerMonth: number;
  supportPerSeatPerMonth: number;
  implementationFlat: number;
  exchangeRate: number;
}

export interface PricingRow {
  lineItem: string;
  perSeatPerMonth?: number;
  monthlyTotal?: number;
  annualUSD: number;
  annualZAR: number;
  bold?: boolean;
}

const NAMED_LICENCE_PER_SEAT_MO = 56.25;
const NAMED_SUPPORT_PER_SEAT_MO = 11.25;
const CONCURRENT_LICENCE_PER_SEAT_MO = 125.0;
const CONCURRENT_SUPPORT_PER_SEAT_MO = 25.0;
const IMPLEMENTATION_FLAT = 4600;

export function calcScenario(
  seats: number,
  seatType: 'named' | 'concurrent',
  exchangeRate: number
): PricingRow[] {
  const licMo = seatType === 'named' ? NAMED_LICENCE_PER_SEAT_MO : CONCURRENT_LICENCE_PER_SEAT_MO;
  const supMo = seatType === 'named' ? NAMED_SUPPORT_PER_SEAT_MO : CONCURRENT_SUPPORT_PER_SEAT_MO;

  const licAnnualUSD = licMo * seats * 12;
  const supAnnualUSD = supMo * seats * 12;
  const totalY1USD = licAnnualUSD + supAnnualUSD + IMPLEMENTATION_FLAT;
  const totalY2USD = licAnnualUSD + supAnnualUSD;

  const fmt = (n: number) => Math.round(n);

  return [
    {
      lineItem: 'Annual Licence — payable upfront per annum upon instance provisioning',
      perSeatPerMonth: licMo,
      monthlyTotal: licMo * seats,
      annualUSD: licAnnualUSD,
      annualZAR: fmt(licAnnualUSD * exchangeRate),
    },
    {
      lineItem: 'Ongoing Support — 8×5, 20 hrs/month — payable monthly',
      perSeatPerMonth: supMo,
      monthlyTotal: supMo * seats,
      annualUSD: supAnnualUSD,
      annualZAR: fmt(supAnnualUSD * exchangeRate),
    },
    {
      lineItem: 'Implementation — 3 payment milestones: project kick-off / successful deployment / sign-off',
      annualUSD: IMPLEMENTATION_FLAT,
      annualZAR: fmt(IMPLEMENTATION_FLAT * exchangeRate),
    },
    {
      lineItem: 'TOTAL: Year 1 (incl. implementation)',
      annualUSD: totalY1USD,
      annualZAR: fmt(totalY1USD * exchangeRate),
      bold: true,
    },
    {
      lineItem: 'TOTAL: Year 2 Run Rate (licence + support)',
      perSeatPerMonth: licMo + supMo,
      monthlyTotal: (licMo + supMo) * seats,
      annualUSD: totalY2USD,
      annualZAR: fmt(totalY2USD * exchangeRate),
      bold: true,
    },
  ];
}

export function buildAllScenarios(agentCount: number, exchangeRate: number) {
  const scenarioA = calcScenario(agentCount, 'named', exchangeRate);
  const scenarioB = calcScenario(Math.round(agentCount * 1.67), 'named', exchangeRate);
  const scenarioC1 = calcScenario(5, 'concurrent', exchangeRate);
  const scenarioC2 = calcScenario(8, 'concurrent', exchangeRate);

  return {
    scenarioA: { label: `Scenario A — ${agentCount} Named Agents (Immediate)`, rows: scenarioA },
    scenarioB: { label: `Scenario B — ${Math.round(agentCount * 1.67)} Named Agents (Scaled)`, rows: scenarioB },
    scenarioC1: { label: 'Scenario C1 — 5 Concurrent Seats (Lean SOC)', rows: scenarioC1 },
    scenarioC2: { label: 'Scenario C2 — 8 Concurrent Seats (Mid-Size SOC)', rows: scenarioC2 },
  };
}

export function formatUSD(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatZAR(n: number) {
  return `R ${n.toLocaleString('en-ZA')}`;
}
