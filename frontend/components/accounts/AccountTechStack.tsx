'use client';

import { useState } from 'react';
import { TechnologyStack } from '@/lib/data/accounts';
import { COMPETITORS } from '@/lib/data/competitors';
import { SA_PARTNERS } from '@/lib/data/sa-partners';

interface Props {
  accountName: string;
  technologyStack: TechnologyStack;
  onUpdate?: (updated: TechnologyStack) => void;
}

const THREAT_COLORS: Record<string, string> = {
  Primary:   'bg-red-100 text-red-700 border-red-200',
  Secondary: 'bg-orange-100 text-orange-700 border-orange-200',
  Emerging:  'bg-slate-100 text-slate-600 border-slate-200',
};

const RISK_COLORS: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  High:     'bg-orange-100 text-orange-700 border-orange-200',
  Medium:   'bg-amber-100 text-amber-700 border-amber-200',
  Low:      'bg-green-100 text-green-700 border-green-200',
};

export default function AccountTechStack({ technologyStack, onUpdate }: Omit<Props, 'accountName'> & { accountName?: string }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<TechnologyStack>(technologyStack);

  const competitor = COMPETITORS.find(c => c.id === technologyStack.competitorId);
  const partner = SA_PARTNERS.find(p => p.id === technologyStack.saPartnerId);

  const pursuitParams = new URLSearchParams();
  if (technologyStack.competitorId) pursuitParams.set('platform', technologyStack.competitorId);
  if (technologyStack.saPartnerId) pursuitParams.set('si', technologyStack.saPartnerId);

  const handleSave = () => {
    onUpdate?.(draft);
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Technology Stack</span>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">Incumbent Platform</label>
            <select
              value={draft.competitorId ?? ''}
              onChange={e => setDraft(d => ({ ...d, competitorId: e.target.value || undefined, platform: COMPETITORS.find(c => c.id === e.target.value)?.name }))}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Unknown / none</option>
              {COMPETITORS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">SI / Consultancy</label>
            <select
              value={draft.saPartnerId ?? ''}
              onChange={e => setDraft(d => ({ ...d, saPartnerId: e.target.value || undefined, siPartner: SA_PARTNERS.find(p => p.id === e.target.value)?.name }))}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Unknown / none</option>
              <optgroup label="HaloITSM Channel Partners">
                {SA_PARTNERS.filter(p => p.category === 'HaloITSM Channel Partner').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </optgroup>
              <optgroup label="Competing Platform Partners">
                {SA_PARTNERS.filter(p => p.category === 'Competing Platform Partner').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </optgroup>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">Contract Expiry</label>
            <input
              type="date"
              value={draft.contractExpiry ?? ''}
              onChange={e => setDraft(d => ({ ...d, contractExpiry: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">Field notes</label>
            <textarea
              value={draft.notes ?? ''}
              onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="What did you learn in the field?"
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all"
          >
            Save changes
          </button>
        </div>
      ) : (
        <div className="space-y-3">

          {/* Platform row */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Platform</span>
            <div className="flex items-center gap-2">
              {competitor && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${RISK_COLORS[competitor.riskLevel]}`}>
                  {competitor.riskLevel}
                </span>
              )}
              <span className="text-sm font-semibold text-slate-900">
                {technologyStack.platform ?? '—'}
              </span>
            </div>
          </div>

          {/* SI row */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">SI / Consultancy</span>
            <div className="flex items-center gap-2">
              {partner && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${THREAT_COLORS[partner.threatLevel]}`}>
                  {partner.threatLevel}
                </span>
              )}
              <span className="text-sm font-semibold text-slate-900">
                {technologyStack.siPartner ?? '—'}
              </span>
            </div>
          </div>

          {/* Contract expiry */}
          {technologyStack.contractExpiry && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Contract expiry</span>
              <span className="text-sm text-slate-900">
                {new Date(technologyStack.contractExpiry).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          )}

          {/* Notes */}
          {technologyStack.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-1">
              <p className="text-[11px] text-amber-900 leading-relaxed">{technologyStack.notes}</p>
            </div>
          )}

          {/* Last updated */}
          {technologyStack.lastUpdatedBy && (
            <p className="text-[10px] text-slate-400 pt-1">
              Updated by {technologyStack.lastUpdatedBy}
              {technologyStack.lastUpdatedAt && ` · ${new Date(technologyStack.lastUpdatedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}`}
            </p>
          )}

          {/* Open Pursuit Brief CTA */}
          {(technologyStack.competitorId || technologyStack.saPartnerId) && (
            <a
              href={`/competitive-intel?tab=pursuit&${pursuitParams.toString()}`}
              className="flex items-center justify-center gap-2 w-full mt-2 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-all"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Open Pursuit Brief
            </a>
          )}

        </div>
      )}
    </div>
  );
}
