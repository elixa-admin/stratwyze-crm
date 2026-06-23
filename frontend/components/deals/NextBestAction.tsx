'use client';

interface NBAConfig {
  headline: string;
  description: string;
  urgency: 'high' | 'medium' | 'low';
  category: string;
}

function computeNBA(deal: any): NBAConfig {
  const stage: string = deal?.stage ?? 'Prospecting';
  const stepsCompleted: string[] = deal?.stageWorkflow?.stepsCompleted ?? [];
  const fitScore = deal?.stageWorkflow?.fitScore ?? 0;
  const goNoGo = deal?.stageWorkflow?.goNoGo;
  const readiness = deal?.stageWorkflow?.proposalReadinessScore ?? 0;
  const incumbent = deal?.stageWorkflow?.incumbentPlatform ?? '';
  const hasProposal = stepsCompleted.includes('proposal-generated');
  const hasBrief = stepsCompleted.includes('pre-brief-generated');
  const hasDiscovery = stepsCompleted.includes('discovery-completed');
  const hasQualified = stepsCompleted.includes('qualified-scored');

  if (stage === 'Prospecting') {
    if (!hasBrief) {
      return {
        headline: 'Generate pre-meeting brief',
        description: 'Run the AI brief to research this company before any outreach — key intel on size, tech stack, incumbents.',
        urgency: 'high',
        category: 'Research',
      };
    }
    if (!stepsCompleted.includes('discovery-scheduled')) {
      return {
        headline: 'Schedule discovery call',
        description: 'Brief is ready. Book the first 30-minute discovery call to confirm pain, authority, and urgency.',
        urgency: 'high',
        category: 'Outreach',
      };
    }
    if (!hasDiscovery) {
      return {
        headline: 'Complete discovery call',
        description: 'Discovery is scheduled — run the call, extract intel, and mark it complete to unlock qualification.',
        urgency: 'high',
        category: 'Sales Call',
      };
    }
    return {
      headline: 'Extract and log call intel',
      description: 'Capture the 3-5 key signals from your discovery call before you advance to qualification scoring.',
      urgency: 'medium',
      category: 'Admin',
    };
  }

  if (stage === 'Qualification') {
    if (!hasQualified) {
      return {
        headline: 'Complete qualification scoring',
        description: 'Fill in BANT fields and run the fit score. You need ≥70 to advance — confirm pain, budget, and timeline.',
        urgency: 'high',
        category: 'Qualification',
      };
    }
    if (fitScore < 70 && fitScore > 0) {
      return {
        headline: `Fit score too low to advance (${fitScore}/100)`,
        description: 'Clarify budget authority and implementation timeline with the champion to lift the score above 70.',
        urgency: 'high',
        category: 'Qualification',
      };
    }
    if (goNoGo === 'NO-GO') {
      return {
        headline: 'Deal marked NO-GO — review or close',
        description: 'Confirm with your manager whether to nurture long-term or formally close as lost now.',
        urgency: 'high',
        category: 'Decision',
      };
    }
    return {
      headline: 'Advance to Solutioning',
      description: `Deal is qualified. Move to solutioning to map ${incumbent || 'current platform'} gaps to HaloITSM modules before building the proposal.`,
      urgency: 'medium',
      category: 'Stage Gate',
    };
  }

  if (stage === 'Solutioning') {
    if (!stepsCompleted.includes('solution-defined')) {
      return {
        headline: 'Define the solution modules',
        description: 'Select the HaloITSM modules that address their pain points. This drives the proposal content.',
        urgency: 'high',
        category: 'Solutioning',
      };
    }
    if (!stepsCompleted.includes('demo-planned')) {
      return {
        headline: 'Schedule the product demo',
        description: 'A focused demo around their top pain points will accelerate decision-making significantly.',
        urgency: 'high',
        category: 'Demo',
      };
    }
    if (readiness < 70) {
      return {
        headline: `Lift proposal readiness to 70% (now ${readiness}%)`,
        description: 'Add scope notes, confirm timeline, and complete the demo plan to unlock the proposal stage.',
        urgency: 'medium',
        category: 'Solutioning',
      };
    }
    return {
      headline: 'Advance to Proposal stage',
      description: 'Solutioning is complete. Generate the AI proposal tailored to their pain points and modules.',
      urgency: 'medium',
      category: 'Stage Gate',
    };
  }

  if (stage === 'Proposal') {
    if (!hasProposal) {
      return {
        headline: 'Generate the AI proposal',
        description: 'Solution design is locked in. Generate the personalised proposal to send to the decision maker.',
        urgency: 'high',
        category: 'Proposal',
      };
    }
    if (!stepsCompleted.includes('proposal-approved')) {
      return {
        headline: 'Review, approve and send proposal',
        description: 'Read through the proposal, copy the opening line for your email intro, then send and mark as sent.',
        urgency: 'high',
        category: 'Proposal',
      };
    }
    return {
      headline: 'Prepare for commercial negotiation',
      description: 'Review the objection handling cards for price, risk, and competitor objections before the follow-up call.',
      urgency: 'medium',
      category: 'Negotiation',
    };
  }

  return {
    headline: 'Continue deal progression',
    description: 'Complete the current stage requirements to advance this deal.',
    urgency: 'low',
    category: 'General',
  };
}

const URGENCY_STYLES = {
  high:   { bar: 'bg-red-500',     badge: 'bg-red-50 border-red-200 text-red-700',     label: 'Urgent' },
  medium: { bar: 'bg-amber-400',   badge: 'bg-amber-50 border-amber-200 text-amber-700', label: 'This week' },
  low:    { bar: 'bg-slate-300',   badge: 'bg-slate-50 border-slate-200 text-slate-600', label: 'When ready' },
};

interface Props {
  deal: any;
}

export default function NextBestAction({ deal }: Props) {
  const nba = computeNBA(deal);
  const style = URGENCY_STYLES[nba.urgency];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className={`h-1 ${style.bar}`} />
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Next Best Action</p>
            <p className="text-sm font-bold text-slate-900">{nba.headline}</p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${style.badge}`}>
              {style.label}
            </span>
            <span className="text-[10px] text-slate-400">{nba.category}</span>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">{nba.description}</p>
      </div>
    </div>
  );
}
