'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/lib/toast';
import { COMPETITORS } from '@/lib/data/competitors';
import { SA_PARTNERS } from '@/lib/data/sa-partners';

interface NewDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; value: number; accountId: string; stageName: string; dealId?: string }) => void;
}

type Step = 'details' | 'profile' | 'researching' | 'brief';

const EMPLOYEE_RANGES = ['1–50', '51–200', '201–500', '501–1,000', '1,001–5,000', '5,001–10,000', '10,000+'];
const INDUSTRIES = ['IT Services', 'Financial Services', 'Healthcare', 'Manufacturing', 'Retail & FMCG', 'Government & Public Sector', 'Logistics & Transport', 'Education', 'Mining & Resources', 'Telecommunications', 'Professional Services', 'Other'];

const IconChevron = ({ dir = 'right' }: { dir?: 'left' | 'right' }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    {dir === 'right' ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
  </svg>
);

const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Spinner = () => (
  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
);

function StepIndicator({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-100 bg-slate-50">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
            i < current ? 'bg-blue-600 text-white' :
            i === current ? 'bg-blue-600 text-white ring-2 ring-blue-200' :
            'bg-slate-200 text-slate-500'
          }`}>
            {i < current ? '✓' : i + 1}
          </div>
          <span className={`text-xs font-medium ${i === current ? 'text-blue-700' : i < current ? 'text-slate-600' : 'text-slate-400'}`}>
            {label}
          </span>
          {i < steps.length - 1 && <div className={`w-6 h-px ${i < current ? 'bg-blue-400' : 'bg-slate-200'}`} />}
        </div>
      ))}
    </div>
  );
}

export default function NewDealModal({ isOpen, onClose, onSubmit }: NewDealModalProps) {
  const [step, setStep] = useState<Step>('details');
  // Step 1 — Deal details
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [accountId, setAccountId] = useState('');
  const [stageName, setStageName] = useState('Prospecting');
  const [accounts, setAccounts] = useState<{ id: string; name: string; industry?: string; annualRevenue?: number }[]>([]);
  // Step 2 — Company profile
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [employees, setEmployees] = useState('');
  const [location, setLocation] = useState('');
  const [competitorId, setCompetitorId] = useState('');
  const [saPartnerId, setSaPartnerId] = useState('');
  const [extraContext, setExtraContext] = useState('');
  // Research + brief
  const [researchLog, setResearchLog] = useState<string[]>([]);
  const [researchData, setResearchData] = useState<any>(null);
  const [briefData, setBriefData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/accounts').then(r => r.json()).then(d => { if (d.accounts) setAccounts(d.accounts); }).catch(() => {});
  }, [isOpen]);

  const resetAll = () => {
    setStep('details');
    setTitle(''); setValue(''); setAccountId(''); setStageName('Prospecting');
    setCompanyName(''); setWebsite(''); setIndustry(''); setEmployees('');
    setLocation(''); setCompetitorId(''); setSaPartnerId(''); setExtraContext('');
    setResearchLog([]); setResearchData(null); setBriefData(null); setLoading(false);
  };

  const handleClose = () => { resetAll(); onClose(); };

  const addLog = (msg: string) => setResearchLog(prev => [...prev, msg]);

  const handleResearch = async () => {
    if (!title || !value) { toast('Deal title and value required', 'error'); return; }
    const nameToResearch = companyName || title;

    setStep('researching');
    setResearchLog([]);
    setLoading(true);

    try {
      addLog(`🔍 Searching web for ${nameToResearch}...`);
      const resRes = await fetch('/api/company/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: nameToResearch, website, industry, employees, location }),
      });

      let researchProfile = null;
      if (resRes.ok) {
        const resData = await resRes.json();
        researchProfile = resData.profile;
        setResearchData(resData);
        addLog(`✓ Found company data (${resData.sourceCount || 0} sources)`);
        addLog(`✓ Revenue & employees extracted`);
        if (resData.profile?.recentNews?.length) addLog(`✓ ${resData.profile.recentNews.length} recent news items found`);
        if (resData.profile?.maActivity?.length) addLog(`✓ ${resData.profile.maActivity.length} M&A events identified`);
        if (resData.profile?.linkedinInsights) addLog(`✓ LinkedIn insights gathered`);
      } else {
        addLog(`⚠ Web research unavailable — proceeding with competitive brief`);
      }

      addLog(`🤖 Generating competitive brief...`);
      const account = accounts.find(a => a.id === accountId);
      const briefRes = await fetch('/api/deals/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          incumbentPlatform: competitorId ? COMPETITORS.find(c => c.id === competitorId)?.name : undefined,
          saPartner: saPartnerId ? SA_PARTNERS.find(p => p.id === saPartnerId)?.name : undefined,
          accountInfo: account ? { name: account.name, industry: account.industry, annualRevenue: account.annualRevenue } : undefined,
          companyResearch: researchProfile,
          extraContext,
        }),
      });

      const briefJson = await briefRes.json();
      if (!briefRes.ok) throw new Error(briefJson.error || 'Brief generation failed');
      setBriefData(briefJson);
      addLog(`✓ Brief generated (${briefJson.aiTier})`);
      setStep('brief');
    } catch (err: any) {
      toast(err?.message || 'Research failed', 'error');
      setStep('profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeal = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          value: parseFloat(value),
          accountId: accountId || undefined,
          stageName,
          competitorId: competitorId || undefined,
          saPartnerId: saPartnerId || undefined,
          competitiveBrief: briefData?.brief || undefined,
          enrichmentData: researchData?.profile || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create deal');
      toast(`Deal "${title}" created`, 'success');
      onSubmit({ title, value: parseFloat(value), accountId, stageName, dealId: data.deal?.id });
      setTimeout(() => { resetAll(); onClose(); }, 400);
    } catch (err: any) {
      toast(err?.message || 'Failed to create deal', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const stepIndex = step === 'details' ? 0 : step === 'profile' ? 1 : 2;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between bg-gradient-to-r from-blue-600 to-indigo-600">
          <div>
            <h2 className="text-base font-bold text-white">Create New Deal</h2>
            <p className="text-xs text-blue-200 mt-0.5">AI-powered prospect intelligence and competitive brief</p>
          </div>
          <button onClick={handleClose} className="w-7 h-7 rounded-full flex items-center justify-center text-blue-200 hover:text-white hover:bg-white/20 transition-all">
            <IconX />
          </button>
        </div>

        {/* Step indicator */}
        {step !== 'researching' && (
          <StepIndicator current={stepIndex} steps={['Deal Details', 'Prospect Profile', 'AI Brief']} />
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* ─── STEP 1: Deal Details ─── */}
          {step === 'details' && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                    Deal Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. MTN ITSM Modernisation"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                    Value (ZAR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder="250000"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Stage</label>
                  <select value={stageName} onChange={e => setStageName(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Link to Account</label>
                  <select value={accountId} onChange={e => setAccountId(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select account (optional)</option>
                    {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 2: Prospect Profile ─── */}
          {step === 'profile' && (
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                <p className="text-xs font-semibold text-blue-800">AI Company Research</p>
                <p className="text-xs text-blue-600 mt-0.5">We'll search the web, recent news, M&A events, and LinkedIn to build a qualification brief before your first meeting.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder={title || 'e.g. MTN Group'}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Leave blank to use deal title</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Website URL</label>
                  <input
                    type="url"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="https://mtn.co.za"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Industry</label>
                  <select value={industry} onChange={e => setIndustry(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select industry</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Company Size</label>
                  <select value={employees} onChange={e => setEmployees(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Employees (optional)</option>
                    {EMPLOYEE_RANGES.map(r => <option key={r} value={r}>{r} employees</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Headquarters / Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Johannesburg, South Africa"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Competitive context */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Competitive Intelligence (Optional)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1.5">Incumbent Platform</label>
                    <select value={competitorId} onChange={e => setCompetitorId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option value="">Unknown / None</option>
                      {COMPETITORS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1.5">Incumbent SI</label>
                    <select value={saPartnerId} onChange={e => setSaPartnerId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option value="">Unknown / None</option>
                      {SA_PARTNERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Extra context */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">Additional Context</label>
                <textarea
                  value={extraContext}
                  onChange={e => setExtraContext(e.target.value)}
                  placeholder="e.g. Met at MicroFocus event. CIO mentioned pain with current ticketing system. Budget cycle Q1 2026."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* ─── STEP 3: Researching ─── */}
          {step === 'researching' && (
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-sm font-semibold text-slate-900">Researching {companyName || title}...</p>
                <p className="text-xs text-slate-500 mt-1">Searching web, news, LinkedIn and M&A data</p>
              </div>
              <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs space-y-1.5 min-h-[160px]">
                {researchLog.map((line, i) => (
                  <p key={i} className={`${line.startsWith('✓') ? 'text-emerald-400' : line.startsWith('⚠') ? 'text-amber-400' : line.startsWith('🤖') ? 'text-blue-400' : 'text-slate-400'}`}>
                    {line}
                  </p>
                ))}
                {loading && <p className="text-slate-500 animate-pulse">_</p>}
              </div>
            </div>
          )}

          {/* ─── STEP 4: Brief ─── */}
          {step === 'brief' && briefData && (
            <div className="p-6 space-y-4">
              {/* Company snapshot */}
              {researchData?.profile?.companySnapshot && (
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Company Snapshot</p>
                  <p className="text-sm text-slate-800 mb-3">{researchData.profile.companySnapshot.description}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {researchData.profile.companySnapshot.revenue && (
                      <div className="bg-white rounded-lg p-2 border border-slate-100">
                        <p className="text-slate-500">Revenue</p>
                        <p className="font-semibold text-slate-800">{researchData.profile.companySnapshot.revenue}</p>
                      </div>
                    )}
                    {researchData.profile.companySnapshot.employees && (
                      <div className="bg-white rounded-lg p-2 border border-slate-100">
                        <p className="text-slate-500">Employees</p>
                        <p className="font-semibold text-slate-800">{researchData.profile.companySnapshot.employees}</p>
                      </div>
                    )}
                    {researchData.profile.companySnapshot.headquarters && (
                      <div className="bg-white rounded-lg p-2 border border-slate-100">
                        <p className="text-slate-500">HQ</p>
                        <p className="font-semibold text-slate-800">{researchData.profile.companySnapshot.headquarters}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recent news */}
              {researchData?.profile?.recentNews?.length > 0 && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
                    <p className="text-xs font-semibold text-slate-700">Recent News & Activity</p>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {researchData.profile.recentNews.slice(0, 3).map((item: any, i: number) => (
                      <div key={i} className="px-4 py-3">
                        <p className="text-xs font-medium text-slate-900">{item.headline}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.summary}</p>
                        {item.significance && <p className="text-xs text-blue-600 mt-1">→ {item.significance}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* M&A */}
              {researchData?.profile?.maActivity?.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-800 mb-2">M&A Activity Detected</p>
                  {researchData.profile.maActivity.slice(0, 2).map((item: any, i: number) => (
                    <div key={i} className="mb-1">
                      <p className="text-xs font-medium text-amber-900">{item.event}</p>
                      <p className="text-xs text-amber-700">{item.implication}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Opening + Win */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-blue-700 mb-1">Opening Statement</p>
                <p className="text-sm text-blue-900">{briefData.brief?.openingStatement}</p>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-emerald-700 mb-1">Win Statement</p>
                <p className="text-sm text-emerald-900 font-medium">{briefData.brief?.winStatement}</p>
              </div>

              {/* Risks */}
              {(briefData.brief?.platformRisks?.length > 0 || briefData.brief?.siRisks?.length > 0) && (
                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-700 mb-2">Key Risks</p>
                  <ul className="space-y-1">
                    {[...(briefData.brief?.platformRisks || []), ...(briefData.brief?.siRisks || [])].map((r: string, i: number) => (
                      <li key={i} className="text-xs text-slate-700 flex gap-2">
                        <span className="text-red-400 flex-shrink-0">•</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Discovery questions */}
              {researchData?.profile?.qualificationQuestions?.length > 0 && (
                <div className="border border-purple-200 bg-purple-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-purple-700 mb-2">Discovery Questions</p>
                  <ol className="space-y-1.5">
                    {researchData.profile.qualificationQuestions.map((q: string, i: number) => (
                      <li key={i} className="text-xs text-purple-900 flex gap-2">
                        <span className="font-bold text-purple-400 flex-shrink-0">{i + 1}.</span>{q}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* CIO / IT Manager angles */}
              {(briefData.brief?.cioAngle || briefData.brief?.itManagerAngle) && (
                <div className="grid grid-cols-2 gap-3">
                  {briefData.brief?.cioAngle && (
                    <div className="bg-slate-50 rounded-lg p-3 border-l-2 border-blue-500">
                      <p className="text-[10px] font-semibold text-slate-600 uppercase mb-1">CIO Angle</p>
                      <p className="text-xs text-slate-700">{briefData.brief.cioAngle}</p>
                    </div>
                  )}
                  {briefData.brief?.itManagerAngle && (
                    <div className="bg-slate-50 rounded-lg p-3 border-l-2 border-indigo-500">
                      <p className="text-[10px] font-semibold text-slate-600 uppercase mb-1">IT Manager Angle</p>
                      <p className="text-xs text-slate-700">{briefData.brief.itManagerAngle}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Meta */}
              <p className="text-[10px] text-slate-400 text-center">
                Generated with {briefData.aiTier} · {researchData?.sourceCount || 0} web sources
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-100 px-6 py-4 bg-white flex gap-3">
          {step === 'details' && (
            <>
              <button onClick={handleClose} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!title || !value) { toast('Deal title and value required', 'error'); return; }
                  setStep('profile');
                }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Prospect Profile <IconChevron />
              </button>
            </>
          )}

          {step === 'profile' && (
            <>
              <button onClick={() => setStep('details')} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1">
                <IconChevron dir="left" /> Back
              </button>
              <button
                onClick={handleResearch}
                disabled={loading}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Spinner /> : '🔍'} Research & Generate Brief
              </button>
            </>
          )}

          {step === 'brief' && (
            <>
              <button onClick={() => setStep('profile')} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1">
                <IconChevron dir="left" /> Back
              </button>
              <button
                onClick={handleCreateDeal}
                disabled={loading}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Spinner /> : '✓'} Create Deal
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
