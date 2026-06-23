'use client';

interface BadgeConfig {
  label: string;
  bg: string;
  text: string;
  border: string;
  icon: string;
}

const BADGE_STYLES: Record<string, BadgeConfig> = {
  'High Intent':     { label: 'High Intent',     bg: 'bg-emerald-50',  text: 'text-emerald-800', border: 'border-emerald-300', icon: '🔥' },
  'Qualified':       { label: 'Qualified',        bg: 'bg-blue-50',     text: 'text-blue-800',    border: 'border-blue-300',    icon: '✓' },
  'Proposal Ready':  { label: 'Proposal Ready',   bg: 'bg-purple-50',   text: 'text-purple-800',  border: 'border-purple-300',  icon: '📄' },
  'At Risk':         { label: 'At Risk',           bg: 'bg-red-50',      text: 'text-red-800',     border: 'border-red-300',     icon: '⚠️' },
  'Closing':         { label: 'Closing',           bg: 'bg-amber-50',    text: 'text-amber-800',   border: 'border-amber-300',   icon: '🤝' },
  'JSE Listed':      { label: 'JSE Listed',        bg: 'bg-slate-50',    text: 'text-slate-700',   border: 'border-slate-300',   icon: '📈' },
  'Demo Scheduled':  { label: 'Demo Scheduled',    bg: 'bg-indigo-50',   text: 'text-indigo-800',  border: 'border-indigo-300',  icon: '📅' },
};

function computeBadges(deal: any): string[] {
  const badges: string[] = [];
  const stepsCompleted: string[] = deal?.stageWorkflow?.stepsCompleted ?? [];
  const stage = deal?.stage ?? 'Prospecting';
  const fitScore = deal?.stageWorkflow?.fitScore ?? 0;
  const goNoGo = deal?.stageWorkflow?.goNoGo;
  const readiness = deal?.stageWorkflow?.proposalReadinessScore ?? 0;
  const buyerIntentScore = deal?.stageWorkflow?.buyerIntentScore ?? 0;

  // High Intent — buyer intent score ≥60 or detected buying signals
  if (buyerIntentScore >= 60 || (deal?.stageWorkflow?.buyerIntentSignals?.length ?? 0) >= 2) {
    badges.push('High Intent');
  }

  // Qualified — fit score ≥70 + qualified-scored step done + GO
  if (fitScore >= 70 && stepsCompleted.includes('qualified-scored') && goNoGo === 'GO') {
    badges.push('Qualified');
  }

  // Proposal Ready — readiness ≥70 or scope-agreed step completed
  if ((readiness >= 70 || stepsCompleted.includes('scope-agreed')) && ['Solutioning', 'Proposal'].includes(stage)) {
    badges.push('Proposal Ready');
  }

  // Demo Scheduled — demo-planned step done
  if (stepsCompleted.includes('demo-planned')) {
    badges.push('Demo Scheduled');
  }

  // JSE Listed — account is listed
  if (deal?.account?.isListed || deal?.account?.jseTickerSymbol) {
    badges.push('JSE Listed');
  }

  // At Risk — fit score <50 after qualification, or go-no-go is NO-GO
  if (goNoGo === 'NO-GO' || (stage === 'Qualification' && fitScore > 0 && fitScore < 50)) {
    badges.push('At Risk');
  }

  // Closing — proposal generated + approved, stage is Proposal
  if (stage === 'Proposal' && stepsCompleted.includes('proposal-generated') && stepsCompleted.includes('proposal-approved')) {
    badges.push('Closing');
  }

  return badges;
}

interface DealBadgesProps {
  deal: any;
  maxVisible?: number;
}

export default function DealBadges({ deal, maxVisible = 5 }: DealBadgesProps) {
  const badges = computeBadges(deal);
  if (badges.length === 0) return null;

  const visible = badges.slice(0, maxVisible);
  const overflow = badges.length - visible.length;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visible.map(badge => {
        const s = BADGE_STYLES[badge];
        if (!s) return null;
        return (
          <span
            key={badge}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${s.bg} ${s.text} ${s.border}`}
          >
            <span className="text-[10px]">{s.icon}</span>
            {s.label}
          </span>
        );
      })}
      {overflow > 0 && (
        <span className="text-xs text-slate-400 font-medium">+{overflow}</span>
      )}
    </div>
  );
}

export { computeBadges };
