'use client';

import { useState, useRef } from 'react';
import { COMPETITORS } from '@/lib/data/competitors';
import { SA_PARTNERS } from '@/lib/data/sa-partners';
import { MOCK_ACCOUNTS } from '@/lib/data/accounts';

interface VerificationReport {
  freshnessScore: string;
  freshnessRationale: string;
  newIntelligence: string[];
  recommendation: string;
  safeToPropose: boolean;
}

interface Props {
  competitorId?: string;
  saPartnerId?: string;
  accountId?: string;
  verificationReport?: VerificationReport | null;
  prefillNotes?: string;
}

const CHANNEL_PARTNERS = SA_PARTNERS.filter(p => p.category === 'HaloITSM Channel Partner');
const PLATFORM_PARTNERS = SA_PARTNERS.filter(p => p.category === 'Competing Platform Partner');

function renderMarkdown(md: string): string {

  return md
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-semibold text-slate-900 mt-6 mb-2 pb-1 border-b border-slate-200">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold text-slate-800 mt-4 mb-1">$1</h3>')
    .replace(/^\*\*(.+?)\*\*/gm, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="text-sm text-slate-700 leading-relaxed ml-4 list-disc">$1</li>')
    .replace(/\n\n/g, '</p><p class="text-sm text-slate-700 leading-relaxed mb-2">')
    .replace(/\n/g, '<br/>');
}

export default function ProposalBuilder({ competitorId: initCompetitorId = '', saPartnerId: initSaPartnerId = '', accountId = '', verificationReport, prefillNotes = '' }: Props) {
  const [competitorId, setCompetitorId] = useState(initCompetitorId);
  const [saPartnerId, setSaPartnerId] = useState(initSaPartnerId);
  const [selectedAccountId, setSelectedAccountId] = useState(accountId);
  const [notes, setNotes] = useState(prefillNotes);
  const [generated, setGenerated] = useState(false);
  const [completion, setCompletion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const proposalRef = useRef<HTMLDivElement>(null);

  const account = MOCK_ACCOUNTS.find(a => a.id === selectedAccountId);
  const competitor = COMPETITORS.find(c => c.id === competitorId);

  const handleGenerate = async () => {
    setGenerated(true);
    setIsLoading(true);
    setCompletion('');
    setStreamError(null);

    try {
      const res = await fetch('/api/competitive/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitorId: competitorId || undefined,
          saPartnerId: saPartnerId || undefined,
          accountContext: account ? {
            name: account.name,
            industry: account.industry,
            location: account.location,
            arr: account.arr,
            employees: account.employees,
          } : undefined,
          dealContext: { notes },
          verificationReport: verificationReport ?? undefined,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Proposal generation failed');
      }
      if (!res.body) throw new Error('No stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // AI SDK toTextStreamResponse sends plain text chunks
        buffer += chunk;
        // Strip SSE formatting if present (data: ... lines)
        const lines = buffer.split('\n');
        let text = '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              // AI SDK v6 text stream format
              if (typeof parsed === 'string') text += parsed;
              else if (parsed.type === 'text-delta') text += parsed.textDelta;
              else if (typeof parsed.text === 'string') text += parsed.text;
            } catch {
              text += data;
            }
          } else if (!line.startsWith(':') && !line.startsWith('event:') && line.trim()) {
            text += line;
          }
        }
        if (text) {
          setCompletion(prev => prev + text);
          buffer = '';
        }
      }
    } catch (e: unknown) {
      setStreamError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => window.print();

  const canGenerate = competitorId || saPartnerId || selectedAccountId;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

      {/* Config panel */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Proposal Configuration</h3>
          <p className="text-xs text-slate-500 mb-5">Configure the context for AI proposal generation.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Account / Prospect</label>
              <select value={selectedAccountId} onChange={e => setSelectedAccountId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select account (optional)</option>
                {MOCK_ACCOUNTS.map(a => <option key={a.id} value={a.id}>{a.name} — {a.industry}</option>)}
              </select>
              {account && <p className="text-[10px] text-slate-400 mt-1">{account.location} · {account.arr} ARR · {account.employees.toLocaleString()} employees</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Incumbent Platform</label>
              <select value={competitorId} onChange={e => setCompetitorId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">No specific incumbent</option>
                {COMPETITORS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Incumbent SI</label>
              <select value={saPartnerId} onChange={e => setSaPartnerId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">No known SI</option>
                <optgroup label="HaloITSM Channel Partners">
                  {CHANNEL_PARTNERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </optgroup>
                <optgroup label="Competing Platform Partners">
                  {PLATFORM_PARTNERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">SE Notes (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Key context from discovery calls, stakeholder priorities, specific pain points..."
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>

          {verificationReport && (
            <div className={`mt-4 p-3 rounded-lg border text-xs ${verificationReport.safeToPropose ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
              {verificationReport.safeToPropose
                ? `Intel verified — ${verificationReport.freshnessScore.toLowerCase()}`
                : `Review flagged — ${verificationReport.freshnessRationale}`}
            </div>
          )}

          {!canGenerate && <p className="text-xs text-slate-400 text-center mt-3">Select at least one field to generate</p>}

          <button onClick={handleGenerate} disabled={!canGenerate || isLoading}
            className="w-full mt-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isLoading ? (
              <><div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Generating proposal...</>
            ) : (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Generate Proposal</>
            )}
          </button>
        </div>

        {competitor && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-2">TCO Reference</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">{competitor.name} 3YR</span>
                <span className="font-semibold text-red-600">R{competitor.tco3Year.competitor.min/1000}K–R{competitor.tco3Year.competitor.max/1000}K</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">HaloITSM 3YR</span>
                <span className="font-semibold text-green-600">R{competitor.tco3Year.haloITSM.min/1000}K–R{competitor.tco3Year.haloITSM.max/1000}K</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Proposal output */}
      <div className="lg:col-span-3">
        {!generated ? (
          <div className="border border-slate-200 rounded-xl bg-white flex flex-col items-center justify-center min-h-[480px] p-8">
            <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <p className="text-slate-700 font-semibold text-sm">Configure and generate your proposal</p>
            <p className="text-slate-400 text-xs mt-1 text-center max-w-xs">AI writes a full, structured HaloITSM proposal tailored to the account, incumbent, and deal context.</p>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 no-print">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">
                  {account ? `Proposal — ${account.name}` : 'HaloITSM Proposal'}
                </span>
                {isLoading && (
                  <span className="text-[10px] text-blue-600 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full border border-blue-600 border-t-transparent animate-spin" />
                    Writing...
                  </span>
                )}
              </div>
              {!isLoading && completion && (
                <div className="flex items-center gap-2">
                  <button onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                    Export PDF
                  </button>
                </div>
              )}
            </div>

            <div ref={proposalRef} className="p-8 overflow-y-auto max-h-[70vh]">
              {/* Proposal header */}
              <div className="mb-8 pb-6 border-b border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-2">Proposal</div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      {account ? `HaloITSM for ${account.name}` : 'HaloITSM Implementation Proposal'}
                    </h1>
                    {competitor && <p className="text-sm text-slate-500 mt-1">Displacing {competitor.name} · Stratwyze Solutions</p>}
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <p className="font-semibold text-slate-600">Stratwyze Solutions</p>
                    <p>Potchefstroom, North West</p>
                    <p>stratwyze.co.za</p>
                    <p className="mt-1">{new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              {/* Streaming content */}
              {completion ? (
                <div
                  className="prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(completion) }}
                />
              ) : isLoading ? (
                <div className="space-y-3 animate-pulse">
                  {[100, 80, 90, 70, 85, 60, 95, 75].map((w, i) => (
                    <div key={i} className={`h-3 bg-slate-100 rounded`} style={{ width: `${w}%` }} />
                  ))}
                </div>
              ) : null}

              {streamError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                  <p className="text-sm font-semibold text-red-700">Generation failed</p>
                  <p className="text-xs text-red-600 mt-1">{streamError}</p>
                </div>
              )}

              {/* Proposal footer */}
              {!isLoading && completion && (
                <div className="mt-8 pt-6 border-t border-slate-200 text-xs text-slate-400">
                  <p className="font-semibold text-slate-600">Stratwyze Solutions (Pty) Ltd</p>
                  <p>Reg. 2026/246323/07 · Potchefstroom, North West Province, South Africa</p>
                  <p>stratwyze.co.za · Authorised HaloITSM Partner</p>
                  <p className="mt-1">Prepared {new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
