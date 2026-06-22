'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import GlobalSearch from '@/components/shared/GlobalSearch';
import NewDealModal from '@/components/shared/NewDealModal';
import CreateAccountModal from '@/components/shared/CreateAccountModal';
import { Toast, useToast, ToastType } from '@/components/shared/Toast';

const IconDashboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);
const IconPipeline = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const IconContacts = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconAccounts = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const IconReports = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);
const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconDocuments = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const IconCompetitive = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6" /><circle cx="16" cy="16" r="6" /><line x1="11" y1="11" x2="13" y2="13" />
  </svg>
);
const IconSettings = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconChevronsLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" />
  </svg>
);
const IconChevronsRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" />
  </svg>
);
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const NAV = [
  { group: 'Main', items: [
    { href: '/dashboard',       label: 'Dashboard',       Icon: IconDashboard },
    { href: '/pipeline',        label: 'Pipeline',        Icon: IconPipeline },
    { href: '/contacts',        label: 'Contacts',        Icon: IconContacts },
    { href: '/accounts',        label: 'Accounts',        Icon: IconAccounts },
  ]},
  { group: 'Insights', items: [
    { href: '/analytics',       label: 'Reports',         Icon: IconReports },
    { href: '/competitive-intel', label: 'Competitive Intel', Icon: IconCompetitive },
  ]},
  { group: 'Workspace', items: [
    { href: '/calendar',        label: 'Calendar',        Icon: IconCalendar },
    { href: '/documents',       label: 'Documents',       Icon: IconDocuments },
    { href: '/settings',        label: 'Settings',        Icon: IconSettings },
  ]},
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const { toasts, show } = useToast();
  const showRef = useRef(show);
  showRef.current = show;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
    else setAuthenticated(true);
  }, [router]);

  // Global toast event bus
  useEffect(() => {
    const handler = (e: Event) => {
      const { message, type } = (e as CustomEvent<{ message: string; type: ToastType }>).detail;
      showRef.current(message, type);
    };
    window.addEventListener('toast', handler);
    return () => window.removeEventListener('toast', handler);
  }, []);

  useEffect(() => {
    const handleOpenDealModal = () => setShowNewDealModal(true);
    const handleOpenAccountModal = () => setShowCreateAccountModal(true);
    window.addEventListener('openNewDealModal', handleOpenDealModal);
    window.addEventListener('openCreateAccountModal', handleOpenAccountModal);
    return () => {
      window.removeEventListener('openNewDealModal', handleOpenDealModal);
      window.removeEventListener('openCreateAccountModal', handleOpenAccountModal);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleNewDealSubmit = (data: { title: string; value: number; accountId: string; stageName: string; dealId?: string }) => {
    window.dispatchEvent(new CustomEvent('dealCreated', { detail: data }));
    setShowNewDealModal(false);
  };

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`flex-shrink-0 h-screen bg-slate-900 flex flex-col sticky top-0 transition-all duration-200 overflow-hidden ${
        collapsed ? 'w-[60px]' : 'w-64'
      }`}>

        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-slate-800 flex-shrink-0 ${collapsed ? 'justify-center px-0' : 'gap-3 px-5'}`}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold tracking-tight">S</span>
          </div>
          {!collapsed && <span className="text-sm font-semibold text-white tracking-tight">Stratwyze</span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-5">
          {NAV.map(({ group, items }) => (
            <div key={group}>
              {!collapsed && (
                <p className="px-2 mb-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{group}</p>
              )}
              <div className="space-y-0.5">
                {items.map(({ href, label, Icon }) => {
                  const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
                  return (
                    <Link key={href} href={href} title={collapsed ? label : undefined}>
                      <div className={`flex items-center rounded-lg text-sm transition-all duration-150 ${
                        collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-2.5 px-2.5 py-2'
                      } ${
                        active
                          ? 'bg-blue-600/20 text-white'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}>
                        <span className={active ? 'text-blue-400' : ''}><Icon /></span>
                        {!collapsed && <span className={active ? 'font-medium' : ''}>{label}</span>}
                        {!collapsed && active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className={`flex-shrink-0 border-t border-slate-800 p-2 ${collapsed ? 'flex justify-center' : ''}`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-md mb-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">B</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">Brandon</p>
                <p className="text-[11px] text-slate-500 truncate">Admin</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white mb-2 mx-auto">B</div>
          )}
          <button
            onClick={handleLogout}
            title={collapsed ? 'Sign out' : undefined}
            className={`flex items-center gap-2.5 rounded-md text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all duration-150 ${
              collapsed ? 'justify-center w-10 h-9 mx-auto' : 'w-full px-2.5 py-2'
            }`}
          >
            <IconLogout />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 flex-shrink-0">
          <div className="flex items-center h-full px-6 gap-4">
            <button
              onClick={() => setCollapsed(c => !c)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <IconChevronsRight /> : <IconChevronsLeft />}
            </button>

            <GlobalSearch />

            <div className="flex items-center gap-2 ml-auto">
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all relative">
                <IconBell />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
              </button>
              <button
                onClick={() => setShowNewDealModal(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm"
              >
                <IconPlus />
                <span>New</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>

      <NewDealModal isOpen={showNewDealModal} onClose={() => setShowNewDealModal(false)} onSubmit={handleNewDealSubmit} />
      <CreateAccountModal isOpen={showCreateAccountModal} onClose={() => setShowCreateAccountModal(false)} />

      {/* Global toast stack */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <Toast message={t.message} type={t.type} />
          </div>
        ))}
      </div>
    </div>
  );
}
