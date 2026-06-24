'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const IconChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconHome = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav className="mb-5 flex items-center gap-1.5">
      <Link href="/dashboard" className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">
        <IconHome />
      </Link>

      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <span className="text-slate-600"><IconChevronRight /></span>
          {item.href ? (
            <Link href={item.href} className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-sm font-medium text-slate-200">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
