'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';

interface ProposalGeneratorProps {
  deal: any;
  solutionDesign: any;
  existingProposal: any;
  onGenerated: (proposal: any) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
      <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">{title}</h4>
      {children}
    </div>
  );
}

function ValuePropBadge({ moat, headline, detail }: { moat: string; headline: string; detail: string }) {
  const colors: Record<string, string> = {
    Cost: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    Speed: 'bg-blue-50 border-blue-200 text-blue-800',
    Adoption: 'bg-purple-50 border-purple-200 text-purple-800',
    'AI Automation': 'bg-orange-50 border-orange-200 text-orange-800',
    Cloud: 'bg-sky-50 border-sky-200 text-sky-800',
    Simplicity: 'bg-indigo-50 border-indigo-200 text-indigo-800',
  };
  const cls = colors[moat] ?? 'bg-slate-50 border-slate-200 text-slate-700';
  return (
    <div className={`px-3 py-2 rounded-lg border ${cls} mb-2`}>
      <p className="text-xs font-bold">{moat}: {headline}</p>
      <p className="text-xs mt-0.5 opacity-80">{detail}</p>
    </div>
  );
}

export default function ProposalGenerator({ deal, solutionDesign, existingProposal, onGenerated }: ProposalGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [proposal, setProposal] = useState<any>(existingProposal);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/deals/${deal.id}/generate-proposal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(solutionDesign ?? {}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setProposal(data.proposal);
      onGenerated(data.proposal);
      toast('Proposal generated', 'success');
    } catch (err: any) {
      toast(err.message, 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyExec = () => {
    if (!proposal?.executiveSummary) return;
    navigator.clipboard.writeText(proposal.executiveSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!proposal) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto text-2xl">📄</div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Ready to generate your personalised proposal</p>
          <p className="text-xs text-slate-500 mt-1">
            AI will craft a proposal targeting {deal?.account?.name || 'this prospect'}'s specific pain points
            {solutionDesign?.incumbent ? ` and position against ${solutionDesign.incumbent}` : ''}.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="mx-auto px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {generating ? (
            <>
              <span className="animate-spin">⟳</span>
              Generating proposal...
            </>
          ) : (
            '✦ Generate AI Proposal'
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Opening line – copyable for email */}
      {proposal.openingLine && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-amber-500 text-lg">✉</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-1">Personalised Opening Line</p>
            <p className="text-sm text-amber-800 italic">"{proposal.openingLine}"</p>
          </div>
          <button
            onClick={handleCopyExec}
            className="text-xs text-amber-700 hover:text-amber-900 font-semibold shrink-0"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      )}

      {/* Main proposal card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {proposal.proposedSolution?.headline || `HaloITSM Proposal — ${deal?.account?.name || deal?.title}`}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{proposal.proposedSolution?.implementationTimeline} · AI-personalised</p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold whitespace-nowrap"
          >
            {generating ? '⟳ Regenerating...' : '↺ Regenerate'}
          </button>
        </div>

        <Section title="Executive Summary">
          <p className="text-sm text-slate-700 leading-relaxed">{proposal.executiveSummary}</p>
        </Section>

        <Section title="Situation Analysis">
          <p className="text-sm text-slate-700 leading-relaxed">{proposal.situationAnalysis}</p>
        </Section>

        {proposal.proposedSolution && (
          <Section title="Proposed Solution">
            <p className="text-sm text-slate-700 mb-2">{proposal.proposedSolution.deploymentApproach}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(proposal.proposedSolution.modules || []).map((mod: string) => (
                <span key={mod} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">{mod}</span>
              ))}
            </div>
          </Section>
        )}

        {proposal.valueProposition?.length > 0 && (
          <Section title="Value Proposition">
            {proposal.valueProposition.map((vp: any, i: number) => (
              <ValuePropBadge key={i} moat={vp.moat} headline={vp.headline} detail={vp.detail} />
            ))}
          </Section>
        )}

        {proposal.incumbentComparison && (
          <Section title={`vs. ${proposal.incumbentComparison.incumbent}`}>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                <p className="text-xs font-bold text-red-700 mb-1">Their Weakness</p>
                <p className="text-xs text-red-600">{proposal.incumbentComparison.theirWeakness}</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                <p className="text-xs font-bold text-emerald-700 mb-1">Our Advantage</p>
                <p className="text-xs text-emerald-600">{proposal.incumbentComparison.ourAdvantage}</p>
              </div>
            </div>
          </Section>
        )}

        {proposal.roiSummary && (
          <Section title="ROI Summary">
            <p className="text-sm font-semibold text-emerald-700 mb-1">{proposal.roiSummary.headline}</p>
            <p className="text-sm text-slate-700">{proposal.roiSummary.detail}</p>
          </Section>
        )}

        {proposal.nextSteps?.length > 0 && (
          <Section title="Next Steps">
            <ol className="space-y-1.5">
              {proposal.nextSteps.map((step: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </Section>
        )}
      </div>
    </div>
  );
}
