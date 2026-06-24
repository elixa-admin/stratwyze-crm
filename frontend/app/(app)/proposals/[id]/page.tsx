'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { formatUSD, formatZAR } from '@/lib/proposals/pricing';

interface PricingRow {
  lineItem: string;
  perSeatPerMonth?: number;
  monthlyTotal?: number;
  annualUSD: number;
  annualZAR: number;
  bold?: boolean;
}

interface ProposalData {
  id: string;
  referenceNumber: string;
  clientName: string;
  clientContact?: string;
  clientEmail?: string;
  agentCount: number;
  deploymentPref: string;
  exchangeRate: number;
  createdAt: string;
  sections: {
    executiveSummary: {
      headline: string;
      paragraph1: string;
      paragraph2: string;
      stats: { value: string; label: string }[];
    };
    whyHaloITSM: {
      subtitle: string;
      capabilities: { capability: string; relevance: string }[];
    };
    pricing: {
      scenarioA: { label: string; rows: PricingRow[] };
      scenarioB: { label: string; rows: PricingRow[] };
      scenarioC1: { label: string; rows: PricingRow[] };
      scenarioC2: { label: string; rows: PricingRow[] };
    };
    deploymentPref: string;
    agentCount: number;
    exchangeRate: number;
  };
}

function PricingTable({ scenario }: { scenario: { label: string; rows: PricingRow[] } }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-slate-900 mb-3">{scenario.label}</h3>
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr style={{ backgroundColor: '#1C2B3A', color: 'white' }}>
            <th className="text-left px-3 py-2 font-semibold">Line Item</th>
            <th className="text-right px-3 py-2 font-semibold w-24">Per Seat/Mo</th>
            <th className="text-right px-3 py-2 font-semibold w-24">Monthly Total</th>
            <th className="text-right px-3 py-2 font-semibold w-28">Annual (USD)</th>
            <th className="text-right px-3 py-2 font-semibold w-32">Annual (ZAR @ R{scenario.rows[0] ? 17 : 17})</th>
          </tr>
        </thead>
        <tbody>
          {scenario.rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-slate-200 ${row.bold ? 'font-bold' : ''}`}
              style={{ backgroundColor: row.bold ? '#EFF6FF' : i % 2 === 0 ? 'white' : '#F8FAFF' }}
            >
              <td className="px-3 py-2 text-slate-800">{row.lineItem}</td>
              <td className="px-3 py-2 text-right text-slate-700">
                {row.perSeatPerMonth != null ? formatUSD(row.perSeatPerMonth) : '—'}
              </td>
              <td className="px-3 py-2 text-right text-slate-700">
                {row.monthlyTotal != null ? formatUSD(row.monthlyTotal) : '—'}
              </td>
              <td className="px-3 py-2 text-right text-slate-900">{formatUSD(row.annualUSD)}</td>
              <td className="px-3 py-2 text-right text-slate-900">{formatZAR(row.annualZAR)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-3 mt-8">
      <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#2A7FD4' }}>
        {number} {title.split('').join(' ')}
      </p>
    </div>
  );
}

export default function ProposalPage() {
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/proposals/${id}`)
      .then(r => r.json())
      .then(setProposal)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500 text-sm">Loading proposal…</div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500 text-sm">Proposal not found.</p>
      </div>
    );
  }

  const s = proposal.sections;
  const issueDate = new Date(proposal.createdAt);
  const monthYear = issueDate.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });

  return (
    <>
      {/* Print / export toolbar — hidden in print */}
      <div className="no-print sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-900">{proposal.referenceNumber}</span>
          <span className="text-xs text-slate-400">—</span>
          <span className="text-sm text-slate-600">{proposal.clientName}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Export PDF
          </button>
          <button
            onClick={() => history.back()}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-all"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Proposal document */}
      <div
        id="proposal-document"
        className="mx-auto bg-white text-slate-900"
        style={{ maxWidth: '794px', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '10px', lineHeight: '1.5' }}
      >

        {/* ── COVER PAGE ───────────────────────────────────────────── */}
        <div className="px-12 pt-10 pb-8 min-h-screen flex flex-col" style={{ pageBreakAfter: 'always' }}>

          {/* Top rule */}
          <div className="mb-6" style={{ borderTop: '3px solid #2A7FD4' }} />

          {/* Brand */}
          <div className="mb-10">
            <p className="font-bold tracking-widest text-xs uppercase mb-0.5" style={{ color: '#2A7FD4', letterSpacing: '0.2em' }}>
              S T R A T W Y Z E &nbsp; S O L U T I O N S
            </p>
            <p className="text-xs text-slate-500">South Africa's Premier Halo ITSM Partner</p>
          </div>

          {/* Product name */}
          <div className="mb-10 flex-1">
            <h1 className="font-black mb-2" style={{ fontSize: '52px', lineHeight: '1', color: '#1A1A1A' }}>HaloITSM</h1>
            <h2 className="font-semibold mb-1" style={{ fontSize: '20px', color: '#2A7FD4' }}>
              Service Management Modernisation
            </h2>
            <p className="text-slate-600" style={{ fontSize: '13px' }}>Budgetary Commercial Proposal</p>
          </div>

          {/* Metadata table */}
          <div className="mb-10">
            <div style={{ borderTop: '1px solid #2A7FD4', borderBottom: '1px solid #2A7FD4' }}>
              {[
                { label: 'PREPARED FOR', value: `${proposal.clientName}${proposal.clientContact ? ` · Attn: ${proposal.clientContact}` : ''}` },
                { label: 'PREPARED BY', value: 'Stratwyze Solutions (Pty) Ltd' },
                { label: 'REFERENCE', value: `${proposal.referenceNumber} · ${monthYear}` },
                { label: 'VALID', value: '30 days from date of issue' },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-4 py-2 border-b border-slate-100 last:border-0">
                  <p className="font-bold text-xs w-32 flex-shrink-0" style={{ color: '#2A7FD4' }}>{label}</p>
                  <p className="text-xs text-slate-800">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom rule + classification */}
          <div>
            <div className="mb-4" style={{ borderTop: '1px solid #2A7FD4' }} />
            <p className="text-center font-semibold tracking-widest uppercase text-slate-500" style={{ fontSize: '8px', letterSpacing: '0.15em' }}>
              C L A S S I F I C A T I O N : &nbsp; C O N F I D E N T I A L &nbsp; — &nbsp; N O T &nbsp; F O R &nbsp; D I S T R I B U T I O N
            </p>
            <p className="text-center text-slate-400 mt-1" style={{ fontSize: '8px' }}>
              All pricing is budgetary and indicative. Final terms subject to formal scoping workshop. Excludes VAT.
            </p>
          </div>
        </div>

        {/* ── PAGES 2–7: CONTENT ──────────────────────────────────── */}
        <div className="px-12">

          {/* Page header line */}
          <div className="flex justify-between items-center py-2 mb-4 text-slate-500" style={{ fontSize: '8px', borderBottom: '1px solid #e2e8f0' }}>
            <span className="font-bold uppercase tracking-wider">Stratwyze Solutions</span>
            <span>HaloITSM Budgetary Proposal · {proposal.clientName} · {monthYear}</span>
          </div>

          {/* ── 01 EXECUTIVE SUMMARY ── */}
          <SectionLabel number="01" title="EXECUTIVE SUMMARY" />
          <h2 className="font-black mb-3" style={{ fontSize: '22px' }}>{s.executiveSummary.headline}</h2>
          <p className="text-slate-700 mb-3 leading-relaxed" style={{ fontSize: '10px' }}>{s.executiveSummary.paragraph1}</p>
          <p className="text-slate-700 mb-5 leading-relaxed" style={{ fontSize: '10px' }}>{s.executiveSummary.paragraph2}</p>

          {/* Stats strip */}
          <div className="grid grid-cols-4 mb-8 rounded overflow-hidden" style={{ backgroundColor: '#1C2B3A' }}>
            {s.executiveSummary.stats.map((stat, i) => (
              <div key={i} className="text-center py-4 px-3" style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <p className="font-black mb-1" style={{ fontSize: '24px', color: '#2A7FD4' }}>{stat.value}</p>
                <p className="text-white text-center" style={{ fontSize: '8px', opacity: 0.8 }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ── 02 WHY HALOITSM ── */}
          <SectionLabel number="02" title="WHY HALOITSM" />
          <h2 className="font-black mb-3" style={{ fontSize: '22px' }}>{s.whyHaloITSM.subtitle}</h2>
          <table className="w-full text-xs border-collapse mb-8">
            <thead>
              <tr style={{ backgroundColor: '#1C2B3A', color: 'white' }}>
                <th className="text-left px-3 py-2 font-semibold w-48">Capability</th>
                <th className="text-left px-3 py-2 font-semibold">Relevance to {proposal.clientName}</th>
              </tr>
            </thead>
            <tbody>
              {s.whyHaloITSM.capabilities.map((cap, i) => (
                <tr key={i} className="border-b border-slate-200" style={{ backgroundColor: i % 2 === 0 ? 'white' : '#F8FAFF' }}>
                  <td className="px-3 py-2 font-semibold text-slate-900">{cap.capability}</td>
                  <td className="px-3 py-2 text-slate-700">{cap.relevance}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── 03 DEPLOYMENT OPTIONS ── */}
          <SectionLabel number="03" title="DEPLOYMENT OPTIONS" />
          <h2 className="font-black mb-3" style={{ fontSize: '22px' }}>SaaS and On-Premises — Both Fully Supported</h2>
          <p className="text-slate-700 mb-3 leading-relaxed" style={{ fontSize: '10px' }}>
            HaloITSM is available in both cloud-hosted (SaaS) and on-premises configurations at the same per-agent licence rate.
            Costing remains the same from a licensing perspective across both deployment models; however consideration should
            be given for dedicated hosting infrastructure that could drive the overall TCO up.
          </p>
          <table className="w-full text-xs border-collapse mb-8">
            <thead>
              <tr style={{ backgroundColor: '#1C2B3A', color: 'white' }}>
                <th className="text-left px-3 py-2 font-semibold w-36">Dimension</th>
                <th className="text-left px-3 py-2 font-semibold">SaaS (Cloud)</th>
                <th className="text-left px-3 py-2 font-semibold">On-Premises</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Data Sovereignty', 'Hosted on HaloITSM infrastructure — region selection available', 'Full sovereignty on client-owned infrastructure within SA'],
                ['Go-Live Timeline', '8–12 weeks', '8–12 weeks (*dependent on infrastructure availability and provisioning lead-times)'],
                ['Licence Cost Model', 'Annual subscription per named agent. No capex.', 'Same per-agent rate. Perpetual licence option available.'],
                ['Infrastructure Ownership', 'Fully managed by HaloITSM', 'Client manages server, OS, backups and patching'],
                ['Platform Upgrades', 'Automatic — no maintenance windows required', 'Scheduled windows — coordinated with Stratwyze'],
                ['Internet Dependency', 'Required — outages affect platform availability', 'None — operational during internet outages'],
                ['Regulatory Fit', 'Suitable for most commercial and enterprise environments', 'Suited to POPIA, FSB, healthcare and government data obligations'],
              ].map(([dim, saas, op], i) => (
                <tr key={i} className="border-b border-slate-200" style={{ backgroundColor: i % 2 === 0 ? 'white' : '#F8FAFF' }}>
                  <td className="px-3 py-2 font-semibold text-slate-900">{dim}</td>
                  <td className="px-3 py-2 text-slate-700">{saas}</td>
                  <td className="px-3 py-2 text-slate-700">{op}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── 04 COMMERCIAL SUMMARY ── */}
          <SectionLabel number="04" title="COMMERCIAL SUMMARY" />
          <h2 className="font-black mb-2" style={{ fontSize: '22px' }}>Budgetary Pricing — Named Agent Model</h2>
          <p className="text-slate-700 mb-4 leading-relaxed" style={{ fontSize: '10px' }}>
            Pricing below is indicative and budgetary. Final commercial terms are subject to a formal scoping workshop.
            All ZAR figures apply an indicative exchange rate of R{proposal.exchangeRate.toFixed(2)}/USD.
            Invoices issued in ZAR at the prevailing rate on date of invoice.
          </p>

          <PricingTable scenario={s.pricing.scenarioA} />
          <PricingTable scenario={s.pricing.scenarioB} />

          <ul className="text-slate-600 mb-6 space-y-1 list-disc list-inside" style={{ fontSize: '9px' }}>
            <li>Implementation is payable in three milestones: project kick-off, successful deployment, and sign-off. Annual licence is payable upfront upon instance provisioning.</li>
            <li>Ongoing support is payable monthly in arrears.</li>
            <li>All ZAR figures are indicative at R{proposal.exchangeRate.toFixed(2)}/USD; actual invoices will use the prevailing rate on the date of invoice.</li>
            <li>On-premises infrastructure (server hardware, OS licensing) is a client-side capital cost not included above.</li>
          </ul>

          <h2 className="font-black mb-2" style={{ fontSize: '18px' }}>Budgetary Pricing — Concurrent Seat Model</h2>
          <p className="text-slate-700 mb-4 leading-relaxed" style={{ fontSize: '10px' }}>
            Concurrent seats licence the peak number of analysts logged in simultaneously rather than every named individual.
            This model may be more cost-efficient for shift-based operations.
          </p>
          <PricingTable scenario={s.pricing.scenarioC1} />
          <PricingTable scenario={s.pricing.scenarioC2} />

          {/* ── 05 IMPLEMENTATION ── */}
          <SectionLabel number="05" title="IMPLEMENTATION APPROACH" />
          <h2 className="font-black mb-3" style={{ fontSize: '22px' }}>Managed Deployment — 8 to 12 Weeks</h2>
          <p className="text-slate-700 mb-4 leading-relaxed" style={{ fontSize: '10px' }}>
            Stratwyze Solutions works alongside {proposal.clientName} throughout the HaloITSM deployment. The structured
            five-phase approach ensures minimal disruption to live operations during transition, with go-live approved
            only after all validation criteria are met through joint assessment.
          </p>
          <table className="w-full text-xs border-collapse mb-6">
            <thead>
              <tr style={{ backgroundColor: '#1C2B3A', color: 'white' }}>
                <th className="text-left px-3 py-2 font-semibold w-12">Phase</th>
                <th className="text-left px-3 py-2 font-semibold w-36">Activity</th>
                <th className="text-left px-3 py-2 font-semibold">Key Deliverables</th>
                <th className="text-left px-3 py-2 font-semibold w-24">Timeline</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['01', 'Onboarding & Scoping', 'Project charter, RACI matrix, integration map, infrastructure checklist', 'Weeks 1–2'],
                ['02', 'Configuration', 'Core modules, ITIL workflows, SLA rules, client workspaces, integrations configured', 'Weeks 3–6'],
                ['03', 'Analyst Onboarding', 'User provisioning, role assignment, workflow orientation for the full analyst team', 'Weeks 6–8'],
                ['04', 'UAT & Parallel Running', 'Live parallel operation, SLA accuracy validation, client isolation testing, go-live decision gate', 'Weeks 8–11'],
                ['05', 'Go-Live & Hypercare', 'Full production cut-over, 30-day hypercare support, SLA monitoring and sign-off', 'Week 12'],
              ].map(([phase, activity, deliverables, timeline], i) => (
                <tr key={i} className="border-b border-slate-200" style={{ backgroundColor: i % 2 === 0 ? 'white' : '#F8FAFF' }}>
                  <td className="px-3 py-2 font-bold" style={{ color: '#2A7FD4' }}>{phase}</td>
                  <td className="px-3 py-2 font-semibold text-slate-900">{activity}</td>
                  <td className="px-3 py-2 text-slate-700">{deliverables}</td>
                  <td className="px-3 py-2 text-slate-700">{timeline}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── 06 TERMS ── */}
          <SectionLabel number="06" title="TERMS & CONDITIONS" />
          <h2 className="font-black mb-3" style={{ fontSize: '22px' }}>Standard Commercial Terms</h2>
          <table className="w-full text-xs border-collapse mb-8">
            <thead>
              <tr style={{ backgroundColor: '#1C2B3A', color: 'white' }}>
                <th className="text-left px-3 py-2 font-semibold w-36">Term</th>
                <th className="text-left px-3 py-2 font-semibold">Detail</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Budgetary Status', 'All pricing in this document is indicative and budgetary only. No commercial commitment arises from this proposal. Binding pricing is confirmed exclusively in a signed order form or contract following a formal scoping workshop.'],
                ['Validity', 'This proposal is valid for 30 days from the date of issue. After expiry, pricing is subject to revision based on prevailing HaloITSM partner rates and applicable exchange rates.'],
                ['VAT & Currency', 'All pricing excludes South African VAT (currently 15%). USD amounts will be invoiced in ZAR at the prevailing exchange rate on the date of invoice.'],
                ['Payment Terms', 'Annual licence fees are invoiced in full upfront upon provisioning. Implementation fees are invoiced across three milestones. Ongoing support is invoiced monthly in arrears. All invoices due net 30 days.'],
                ['Licence Scaling', 'Additional named agent seats may be added at any time during the contract year, billed pro-rata to the next annual renewal at the applicable rate.'],
                ['Confidentiality', `This document is confidential and prepared exclusively for ${proposal.clientName}. It may not be reproduced, distributed, or disclosed to any third party without the prior written consent of Stratwyze Solutions (Pty) Ltd.`],
                ['Governing Law', 'This proposal and any resulting contract shall be governed by and construed in accordance with the laws of the Republic of South Africa.'],
              ].map(([term, detail], i) => (
                <tr key={i} className="border-b border-slate-200" style={{ backgroundColor: i % 2 === 0 ? 'white' : '#F8FAFF' }}>
                  <td className="px-3 py-2 font-semibold text-slate-900 align-top">{term}</td>
                  <td className="px-3 py-2 text-slate-700 leading-relaxed">{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Contact block */}
          <div className="grid grid-cols-2 gap-4 mb-10 border border-slate-200 rounded overflow-hidden">
            <div className="p-4 border-r border-slate-200">
              <p className="font-bold text-slate-900 mb-1" style={{ fontSize: '11px' }}>Stratwyze Solutions</p>
              <p className="text-slate-600" style={{ fontSize: '9px' }}>Gareth Moir · Sales &amp; Marketing Director</p>
              <p style={{ fontSize: '9px', color: '#2A7FD4' }}>gareth@stratwyze.co.za</p>
              <p className="text-slate-600" style={{ fontSize: '9px' }}>+27 83 406 7622</p>
              <p style={{ fontSize: '9px', color: '#2A7FD4' }}>www.stratwyze.co.za</p>
            </div>
            <div className="p-4">
              <p className="font-bold text-slate-900 mb-1" style={{ fontSize: '11px' }}>{proposal.clientName}</p>
              {proposal.clientContact && <p className="text-slate-600" style={{ fontSize: '9px' }}>{proposal.clientContact}</p>}
              {proposal.clientEmail && <p style={{ fontSize: '9px', color: '#2A7FD4' }}>{proposal.clientEmail}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-4 text-slate-400 border-t border-slate-200" style={{ fontSize: '8px' }}>
            Stratwyze Solutions (Pty) Ltd · gareth@stratwyze.co.za · +27 83 406 7622 · www.stratwyze.co.za
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          #proposal-document {
            max-width: 100% !important;
            font-size: 9px !important;
          }
        }
      `}</style>
    </>
  );
}
