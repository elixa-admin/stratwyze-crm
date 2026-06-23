'use client';

import { useState } from 'react';

// Objection data pulled from HALOITSM_COMPETITIVE_KNOWLEDGEBASE
const OBJECTIONS: { id: string; objection: string; rebuttal: string; tag: string }[] = [
  {
    id: 'price',
    tag: 'Pricing',
    objection: "HaloITSM seems expensive — we can get ServiceNow for similar cost.",
    rebuttal: "ServiceNow's headline licence is only part of the story. When you factor in the 12–18 month implementation, £200k–£500k SI fees, and mandatory annual price escalations, the 5-year TCO is typically 3–4× what you see in the quote. HaloITSM includes all modules, deploys in 4–6 months, and requires a fraction of the SI effort — our customers routinely see 50–70% total cost reduction over 5 years. Would it help to model a TCO comparison for your specific scale?"
  },
  {
    id: 'risk',
    tag: 'Risk / Change',
    objection: "We're concerned about the risk of migrating away from our current platform.",
    rebuttal: "Migration risk is real, and we take it seriously. That's why we offer a phased adoption approach: we run HaloITSM in parallel during a 4–6 week pilot covering your top incident and service request flows, before you decommission anything. We've done over 200 migrations — including from ServiceNow and BMC — with zero data loss. Our SA implementation team handles the data migration, and Stratwyze stays on-site through go-live. Would a 30-day pilot with no production dependency address that concern?"
  },
  {
    id: 'adoption',
    tag: 'User Adoption',
    objection: "Our IT team is resistant to change. They'll push back on a new platform.",
    rebuttal: "Adoption is the single biggest predictor of ITSM ROI, and it's exactly where HaloITSM wins. Our average Net Promoter Score from IT staff is +42 vs. +8 for ServiceNow — because the interface is built for the people doing the tickets, not consultants configuring it. We run hands-on change management workshops as part of every implementation. Typically we see 80%+ active adoption within the first 60 days. I'd also point out: if your team is resistant now, that's often a signal the current platform isn't working for them — HaloITSM tends to turn resistors into advocates."
  },
  {
    id: 'features',
    tag: 'Feature Gaps',
    objection: "Can HaloITSM really match all the features we get from our current platform?",
    rebuttal: "HaloITSM is ITIL 4-certified and covers every enterprise ITSM module: Incident, Change, Problem, Asset, CMDB, Service Catalogue, Knowledge, HR Service Delivery, and Project Management — all included in the base licence, not as paid add-ons. For your specific situation, the modules you highlighted in discovery [reference their specific pain areas] are actually where HaloITSM is strongest. I'll send you our feature comparison matrix against [their incumbent] — there are a handful of areas where we approach things differently, but nothing that affects your core use cases. Do you want me to map your top 5 requirements against our current build?"
  },
  {
    id: 'support',
    tag: 'Local Support',
    objection: "We're worried about getting support in South Africa — we need a local partner.",
    rebuttal: "This is exactly why Stratwyze is your implementation partner, not a generic reseller. We're a South African business with a team in Johannesburg and Cape Town. We offer POPIA-compliant data residency, on-site support, and a dedicated customer success manager in your timezone. HaloITSM itself provides 24/7 support out of the UK, but for all implementation, customisation, and escalation, you deal with us — South Africans, in your timezone, who understand your regulatory context. We're not a support ticket away from the UK; we're a call away."
  },
  {
    id: 'timing',
    tag: 'Timing / Urgency',
    objection: "This isn't the right time — we have other priorities this quarter.",
    rebuttal: "I understand priorities compete, and I won't push for a decision you're not ready for. But I'd ask: what's the cost of staying on [their incumbent] for another 6–12 months? Based on what you shared in discovery — [reference their specific pain, e.g. 'the SLA breaches that triggered the CIO review'] — that's not a neutral holding pattern, it's an ongoing cost. Our typical implementation takes 4–6 months. If you started a pilot in [current month+1], you'd be live before [relevant deadline/event they mentioned]. Would it be worth exploring a phased start that fits within your current bandwidth?"
  },
  {
    id: 'competitor',
    tag: 'Competitor Preference',
    objection: "We're also evaluating Freshservice — they came in cheaper.",
    rebuttal: "Freshservice is a solid SMB ticketing tool, and their entry price is attractive. The inflection point comes at scale: they hit a 500-agent ceiling, don't include native Change, Asset, or CMDB management, and charge per-module above their base tier. When you're building an enterprise ITSM capability — which [company name] clearly is based on [scale/complexity they mentioned] — the total cost of Freshservice's modular pricing typically lands within 20% of HaloITSM, but without the enterprise depth. I'd recommend we do a side-by-side scope check: list your 10 critical requirements and score both platforms against them. It usually makes the decision clearer."
  },
];

interface NegotiationBriefProps {
  deal: any;
  proposal: any;
}

export default function NegotiationBrief({ deal, proposal: _proposal }: NegotiationBriefProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const incumbent = (deal?.stageWorkflow?.incumbentPlatform || '').toLowerCase();
  const budget = deal?.stageWorkflow?.budgetRange;
  const painPoints: string[] = deal?.stageWorkflow?.painPoints || [];

  // Prioritise relevant objections: if we know the incumbent, show competitor objection first
  const prioritised = [...OBJECTIONS].sort((a, _b) => {
    if (a.id === 'competitor' && (incumbent.includes('fresh') || incumbent.includes('jira'))) return -1;
    if (a.id === 'price' && budget?.toLowerCase().includes('budget')) return -1;
    return 0;
  });

  const copy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Context banner */}
      {(painPoints.length > 0 || incumbent) && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-700 mb-1">Deal context loaded</p>
          <div className="flex flex-wrap gap-1.5">
            {incumbent && (
              <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 text-xs rounded-full">
                Incumbent: {incumbent}
              </span>
            )}
            {painPoints.slice(0, 3).map((p, i) => (
              <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 text-xs rounded-full">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-500 px-1">
        Tap any objection to expand the rebuttal script. Copy to use verbatim, or adapt to the conversation.
      </p>

      {/* Objection cards */}
      <div className="space-y-2">
        {prioritised.map(obj => (
          <div
            key={obj.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(expandedId === obj.id ? null : obj.id)}
              className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wide shrink-0">
                  {obj.tag}
                </span>
                <p className="text-sm text-slate-700 truncate italic">"{obj.objection}"</p>
              </div>
              <span className={`text-slate-400 text-sm transition-transform ${expandedId === obj.id ? 'rotate-180' : ''}`}>▾</span>
            </button>

            {expandedId === obj.id && (
              <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Rebuttal Script</p>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{obj.rebuttal}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copy(obj.id, obj.rebuttal)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold transition-colors"
                  >
                    {copiedId === obj.id ? '✓ Copied' : 'Copy rebuttal'}
                  </button>
                  <button
                    onClick={() => copy(`${obj.id}-both`, `Objection: "${obj.objection}"\n\nRebuttal: ${obj.rebuttal}`)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold transition-colors"
                  >
                    Copy Q&A pair
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Negotiation guidance */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Negotiation Principles</h3>
        <div className="space-y-2">
          {[
            { icon: '🎯', rule: 'Anchor on value, not price', note: 'Lead with 5-year TCO and avoided risk, not monthly licence cost.' },
            { icon: '🔒', rule: 'Protect your floor', note: 'Discount modules, not headline licence. Never move on implementation rate.' },
            { icon: '⏱', rule: 'Create urgency legitimately', note: 'Reference their specific pain point timeline — "you mentioned SLA breaches are a board issue."' },
            { icon: '🤝', rule: 'Make concessions conditional', note: '"If we can agree terms by end of month, I can include the extra training days."' },
            { icon: '📋', rule: 'Mutual close plan', note: 'Propose a written next-step plan with dates. Ambiguity kills deals at proposal stage.' },
          ].map(item => (
            <div key={item.rule} className="flex gap-3">
              <span className="text-lg">{item.icon}</span>
              <div>
                <p className="text-xs font-semibold text-slate-900">{item.rule}</p>
                <p className="text-xs text-slate-500">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
