'use client';

import Link from 'next/link';
import { PipelineIcon, AIIcon, AnalyticsIcon, ContactsIcon, AccountsIcon, CalendarIcon, DocumentsIcon, SettingsIcon, SearchIcon } from '@/components/icons/FeatureIcons';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2 L20 8 L20 16 C20 21.5 12 22 12 22 C12 22 4 21.5 4 16 L4 8 Z" fill="white" stroke="currentColor" strokeWidth="0.5"/>
                <path d="M12 8 L14 12 L12 16 L10 12 Z" fill="white"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900">Stratwyze</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <button className="px-4 py-2.5 rounded-lg text-sm font-600 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all">
                Sign In
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-4 py-2.5 rounded-lg text-sm font-600 bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-sm">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center mb-16 md:mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            The premium AI-native sales CRM
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Stratwyze combines beautiful pipeline management, intelligent company research, and AI-powered insights in one platform.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup">
              <button className="px-8 py-3 rounded-lg text-base font-600 bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-sm">
                Start Free Trial
              </button>
            </Link>
            <Link href="/login">
              <button className="px-8 py-3 rounded-lg text-base font-600 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition-all">
                Demo Dashboard
              </button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-xs hover:shadow-md hover:border-blue-200 transition-all group">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
              <PipelineIcon />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Beautiful Pipeline</h3>
            <p className="text-slate-600 leading-relaxed">
              Drag-and-drop Kanban board across 5 pipeline stages. Real-time deal updates with beautiful cards and progress bars.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-xs hover:shadow-md hover:border-blue-200 transition-all group">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
              <AIIcon />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">AI Insights</h3>
            <p className="text-slate-600 leading-relaxed">
              AI-powered deal risk scoring, win probability, executive summaries, and next best action recommendations.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-xs hover:shadow-md hover:border-blue-200 transition-all group">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
              <AnalyticsIcon />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Advanced Analytics</h3>
            <p className="text-slate-600 leading-relaxed">
              Revenue forecasts, pipeline health metrics, deal velocity tracking, and win rate analysis — all executive-ready.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 pt-20 border-t border-slate-200">
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">64%</p>
            <p className="text-slate-600 mt-2 font-500">Average win rate</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">$27.9M</p>
            <p className="text-slate-600 mt-2 font-500">Typical pipeline managed</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">5</p>
            <p className="text-slate-600 mt-2 font-500">Pipeline stages included</p>
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="bg-white border-t border-slate-200 py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need</h2>
            <p className="text-lg text-slate-600">Built for modern sales teams</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { Icon: ContactsIcon, title: 'Contact Management', desc: 'Organize contacts by account with activity timelines' },
              { Icon: AccountsIcon, title: 'Account Workspaces', desc: 'Track accounts with ARR, employees, and health scores' },
              { Icon: CalendarIcon, title: 'Calendar & Activities', desc: 'Schedule calls, meetings, and track all interactions' },
              { Icon: DocumentsIcon, title: 'Document Management', desc: 'Store and share proposals, contracts, and materials' },
              { Icon: SettingsIcon, title: 'Settings & Team', desc: 'Manage team members, roles, and workspace preferences' },
              { Icon: SearchIcon, title: 'Advanced Search', desc: 'Find prospects, deals, and documents instantly' },
            ].map((feature, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  <feature.Icon />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-32">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Ready to transform your sales process?</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Join sales teams at Fortune 500 companies who use Stratwyze to close more deals faster.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup">
              <button className="px-8 py-3 rounded-lg text-base font-600 bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-sm">
                Start Free Trial
              </button>
            </Link>
            <Link href="/login">
              <button className="px-8 py-3 rounded-lg text-base font-600 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 transition-all">
                View Demo
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-white text-xs font-bold">⚡</div>
              <span className="font-bold text-slate-900">Stratwyze</span>
            </div>
            <p className="text-sm text-slate-600">© 2026 Stratwyze CRM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
