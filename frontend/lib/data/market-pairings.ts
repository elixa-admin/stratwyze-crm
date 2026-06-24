/**
 * SA Market Pairings — reference knowledge base of known South African
 * system-integrator ↔ platform relationships.
 *
 * This is structured competitive intelligence, NOT a UI widget. It is consumed
 * by the competitive AI brief route (app/api/competitive/brief) so generated
 * battle cards are aware of established SI/platform alignments in the local
 * market (e.g. which SIs front for ServiceNow, Ivanti, ManageEngine, etc.).
 *
 * Add a pairing here when a new SA SI↔platform relationship is confirmed.
 */
export interface MarketPairing {
  /** The South African system integrator / consultancy */
  si: string;
  /** The ITSM platform they implement or resell */
  platform: string;
  /** Short qualifier on the nature of the relationship */
  note: string;
}

export const SA_MARKET_PAIRINGS: MarketPairing[] = [
  { si: 'Nexio',          platform: 'ServiceNow',   note: 'OEM Reseller — Gauteng enterprise' },
  { si: 'Think Tank',     platform: 'Ivanti',       note: 'Ivanti Premier Partner SA' },
  { si: 'ITR Technology', platform: 'ManageEngine', note: 'Exclusive SA distributor' },
  { si: 'S Con',          platform: 'Freshservice', note: 'Freshworks SA partner' },
  { si: 'Mediro',         platform: 'ServiceNow',   note: 'ServiceNow BSM specialist' },
];
