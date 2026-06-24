'use client';

import Link from 'next/link';

interface StageCTACardProps {
  stage: string;
  dealId: string;
  accountId?: string;
  primaryContactId?: string;
  onGenerateProposal: () => void;
  onGenerateBrief: () => void;
}

interface CTAButton {
  label: string;
  description: string;
  icon: React.ReactNode;
  variant: 'primary' | 'secondary';
  action: (() => void) | string; // function or href string
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const STAGE_CONFIG: Record<string, {
  accent: string;
  bg: string;
  label: string;
  tagline: string;
}> = {
  Prospecting: { accent: '#6366F1', bg: '#EEF2FF', label: 'Prospecting Tools', tagline: 'Identify, research, and qualify your prospect' },
  Qualification: { accent: '#F59E0B', bg: '#FFFBEB', label: 'Qualification Tools', tagline: 'Understand needs, budget, and competitive landscape' },
  Proposal: { accent: '#2A7FD4', bg: '#EFF6FF', label: 'Proposal Tools', tagline: 'Build and deliver a winning proposal' },
  Negotiation: { accent: '#059669', bg: '#ECFDF5', label: 'Negotiation Tools', tagline: 'Close objections and finalise terms' },
  'Closed Won': { accent: '#059669', bg: '#ECFDF5', label: 'Post-Sale', tagline: 'Handover, onboarding, and expansion' },
  'Closed Lost': { accent: '#DC2626', bg: '#FEF2F2', label: 'Post-Loss Review', tagline: 'Capture lessons and keep the door open' },
};

export default function StageCTACard({
  stage,
  dealId,
  accountId,
  primaryContactId,
  onGenerateProposal,
  onGenerateBrief,
}: StageCTACardProps) {
  const config = STAGE_CONFIG[stage] ?? STAGE_CONFIG.Prospecting;

  const buttons: CTAButton[] = (() => {
    switch (stage) {
      case 'Prospecting':
        return [
          {
            label: 'Research Account',
            description: 'Enrich with company intelligence',
            icon: <SearchIcon />,
            variant: 'primary' as const,
            action: accountId ? `/accounts/${accountId}` : `/accounts`,
          },
          {
            label: 'Add Contact',
            description: 'Find the decision maker',
            icon: <UsersIcon />,
            variant: 'secondary' as const,
            action: primaryContactId ? `/contacts/${primaryContactId}` : `/contacts/new?dealId=${dealId}`,
          },
        ];

      case 'Qualification':
        return [
          {
            label: 'Generate Competitive Brief',
            description: 'AI-powered battle card vs incumbent',
            icon: <ShieldIcon />,
            variant: 'primary' as const,
            action: onGenerateBrief,
          },
          {
            label: 'View Contact Intelligence',
            description: 'Stakeholder profile & buying signals',
            icon: <SearchIcon />,
            variant: 'secondary' as const,
            action: primaryContactId ? `/contacts/${primaryContactId}` : `/contacts`,
          },
        ];

      case 'Proposal':
        return [
          {
            label: 'Generate Proposal',
            description: 'AI-written budgetary proposal in Stratwyze format',
            icon: <DocIcon />,
            variant: 'primary' as const,
            action: onGenerateProposal,
          },
          {
            label: 'Competitive Intel',
            description: 'Full battle cards vs incumbent',
            icon: <ShieldIcon />,
            variant: 'secondary' as const,
            action: `/competitive`,
          },
        ];

      case 'Negotiation':
        return [
          {
            label: 'Generate New Proposal Variant',
            description: 'Revised pricing or scope',
            icon: <DocIcon />,
            variant: 'primary' as const,
            action: onGenerateProposal,
          },
          {
            label: 'Competitive Brief',
            description: 'Refresh battle card for final push',
            icon: <ShieldIcon />,
            variant: 'secondary' as const,
            action: onGenerateBrief,
          },
        ];

      case 'Closed Won':
        return [
          {
            label: 'Mark Won & Handover',
            description: 'Complete closure checklist',
            icon: <CheckIcon />,
            variant: 'primary' as const,
            action: onGenerateProposal,
          },
        ];

      default:
        return [];
    }
  })();

  if (buttons.length === 0) return null;

  return (
    <div
      className="rounded-xl border p-5 shadow-xs"
      style={{ backgroundColor: config.bg, borderColor: config.accent + '33' }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ backgroundColor: config.accent }}
        />
        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: config.accent }}>
          {config.label}
        </p>
      </div>
      <p className="text-xs text-slate-500 mb-4">{config.tagline}</p>

      <div className={`grid gap-3 ${buttons.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {buttons.map((btn, i) => {
          const isPrimary = btn.variant === 'primary';
          const className = `flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-all ${
            isPrimary ? 'text-white shadow-sm hover:opacity-90' : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
          }`;
          const style = isPrimary ? { backgroundColor: config.accent } : {};

          const inner = (
            <>
              <span className={isPrimary ? 'text-white opacity-90' : 'text-slate-400'}>
                {btn.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${isPrimary ? 'text-white' : 'text-slate-800'}`}>
                  {btn.label}
                </p>
                <p className={`text-xs mt-0.5 ${isPrimary ? 'text-white opacity-75' : 'text-slate-500'}`}>
                  {btn.description}
                </p>
              </div>
              <span className={isPrimary ? 'text-white opacity-60' : 'text-slate-300'}>
                <ArrowRight />
              </span>
            </>
          );

          if (typeof btn.action === 'string') {
            return (
              <Link key={i} href={btn.action} className={className} style={style}>
                {inner}
              </Link>
            );
          }

          return (
            <button key={i} onClick={btn.action} className={className} style={style}>
              {inner}
            </button>
          );
        })}
      </div>
    </div>
  );
}
