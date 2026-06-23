'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';
import StageGateIndicator from '../StageGateIndicator';
import { checkStageLocking } from '@/lib/deal-gating';

type SolutionTab = 'fit' | 'demo' | 'scope';

const HALOITSM_MODULES = [
  { id: 'incident', label: 'Incident Management', description: 'ITIL 4 incident lifecycle, SLA management, escalation rules' },
  { id: 'change', label: 'Change Management', description: 'RFC workflow, CAB approvals, emergency change, change calendar' },
  { id: 'asset', label: 'Asset Management', description: 'CMDB, asset lifecycle, depreciation, licence tracking' },
  { id: 'service-catalogue', label: 'Service Catalogue', description: 'Self-service portal, request fulfilment, SLA-bound workflows' },
  { id: 'problem', label: 'Problem Management', description: 'Known error database, root cause analysis, workarounds' },
  { id: 'knowledge', label: 'Knowledge Management', description: 'Integrated KB, AI-suggested articles, deflection metrics' },
  { id: 'hr', label: 'HR Service Delivery', description: 'Onboarding, offboarding, employee request workflows' },
  { id: 'project', label: 'Project Management', description: 'Tasks, Gantt, resource allocation linked to ITSM tickets' },
];

const COMPLEXITY_SIGNALS = [
  'Legacy on-prem infrastructure',
  'Active Directory / LDAP integration required',
  'Large user base (>1,000 agents)',
  'Complex custom workflows needed',
  'Multi-site / multi-country rollout',
  'Data migration from legacy system',
  'API / third-party integrations required',
  'Compliance / audit requirements (POPIA, ISO 27001)',
  'Executive sponsorship unclear',
  'Change-resistant IT culture',
];

interface SolutioningWorkflowProps {
  deal: any;
  onStepComplete?: (stepId: string) => void;
  onAdvance?: () => void;
}

export default function SolutioningWorkflow({ deal, onStepComplete, onAdvance: _onAdvance }: SolutioningWorkflowProps) {
  const stepsCompleted: string[] = deal?.stageWorkflow?.stepsCompleted ?? [];
  const workflow = deal?.stageWorkflow;
  const gates = checkStageLocking('Solutioning', stepsCompleted, {
    proposalReadinessScore: workflow?.proposalReadinessScore,
  });

  const [activeTab, setActiveTab] = useState<SolutionTab>('fit');
  const [selectedModules, setSelectedModules] = useState<string[]>(['incident', 'change', 'service-catalogue']);
  const [complexitySignals, setComplexitySignals] = useState<string[]>([]);
  const [demoFormat, setDemoFormat] = useState('');
  const [demoDate, setDemoDate] = useState('');
  const [demoFocus, setDemoFocus] = useState('');
  const [scopeNotes, setScopeNotes] = useState('');
  const [competitorRisk, setCompetitorRisk] = useState('');
  const [saving, setSaving] = useState(false);

  // Auto-load from discovery data
  const painPoints: string[] = workflow?.painPoints ?? [];
  const incumbent = workflow?.incumbentPlatform ?? '';
  const fitScore = workflow?.fitScore ?? 0;

  // Proposal readiness: scored from fit + modules + scope
  const readinessScore = Math.min(100, Math.round(
    (fitScore * 0.4) +
    (selectedModules.length >= 3 ? 20 : selectedModules.length * 7) +
    (scopeNotes.length > 50 ? 20 : scopeNotes.length / 2.5) +
    (demoDate ? 20 : 0)
  ));

  const toggleModule = (id: string) =>
    setSelectedModules(p => p.includes(id) ? p.filter(m => m !== id) : [...p, id]);
  const toggleSignal = (s: string) =>
    setComplexitySignals(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const saveSolutioning = async () => {
    setSaving(true);
    try {
      const solutioningData = {
        selectedModules,
        complexitySignals,
        demoFormat,
        demoDate,
        demoFocus,
        scopeNotes,
        competitorRisk,
        proposalReadinessScore: readinessScore,
      };

      await fetch(`/api/deals/${deal.id}/stage-completion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId: 'solution-defined', metadata: solutioningData }),
      });
      if (demoDate) {
        await fetch(`/api/deals/${deal.id}/stage-completion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stepId: 'demo-planned', metadata: { demoDate, demoFormat } }),
        });
      }
      if (readinessScore >= 70) {
        await fetch(`/api/deals/${deal.id}/stage-completion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stepId: 'scope-agreed', metadata: { readinessScore } }),
        });
        onStepComplete?.('scope-agreed');
      }
      onStepComplete?.('solution-defined');
      toast('Solutioning saved', 'success');
    } catch {
      toast('Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: SolutionTab; label: string }[] = [
    { id: 'fit', label: 'HaloITSM Fit' },
    { id: 'demo', label: 'Demo Plan' },
    { id: 'scope', label: 'Scope & Risk' },
  ];

  return (
    <div className="space-y-4">
      <StageGateIndicator gates={gates} canAdvance={gates.canAdvance} />

      {/* Readiness banner */}
      <div className={`rounded-xl border p-4 flex items-center gap-4 ${
        readinessScore >= 70
          ? 'bg-emerald-50 border-emerald-200'
          : readinessScore >= 40
          ? 'bg-amber-50 border-amber-200'
          : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex-1">
          <p className={`text-sm font-semibold ${readinessScore >= 70 ? 'text-emerald-800' : readinessScore >= 40 ? 'text-amber-800' : 'text-slate-700'}`}>
            Proposal Readiness
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full transition-all ${readinessScore >= 70 ? 'bg-emerald-500' : readinessScore >= 40 ? 'bg-amber-400' : 'bg-slate-300'}`}
                style={{ width: `${readinessScore}%` }}
              />
            </div>
            <span className="text-sm font-bold tabular-nums">{readinessScore}%</span>
          </div>
        </div>
        {fitScore > 0 && (
          <div className="text-right">
            <p className="text-xs text-slate-500">Fit score from discovery</p>
            <p className="text-lg font-bold text-blue-600">{fitScore}/100</p>
          </div>
        )}
      </div>

      {/* Discovery context — auto-populated */}
      {(painPoints.length > 0 || incumbent) && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-800 mb-1.5">Carried forward from Discovery</p>
          <div className="flex flex-wrap gap-1.5">
            {incumbent && (
              <span className="px-2 py-0.5 bg-white border border-blue-200 text-blue-700 text-xs rounded-full">
                Incumbent: {incumbent}
              </span>
            )}
            {painPoints.slice(0, 3).map((p, i) => (
              <span key={i} className="px-2 py-0.5 bg-white border border-blue-200 text-blue-700 text-xs rounded-full">{p}</span>
            ))}
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex border-b border-slate-100 px-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: HaloITSM Fit */}
      {activeTab === 'fit' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Recommended modules for this deal</h3>
            <p className="text-xs text-slate-500">Select the HaloITSM modules that address the prospect's pain points.</p>
          </div>
          <div className="space-y-2">
            {HALOITSM_MODULES.map(mod => (
              <label key={mod.id} className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${
                selectedModules.includes(mod.id)
                  ? 'bg-blue-50 border-blue-300'
                  : 'border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="checkbox"
                  checked={selectedModules.includes(mod.id)}
                  onChange={() => toggleModule(mod.id)}
                  className="mt-0.5 w-4 h-4 shrink-0"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{mod.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{mod.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Demo Plan */}
      {activeTab === 'demo' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Demo planning</h3>
            <p className="text-xs text-slate-500">Structure the demo around their specific pain points to maximise impact.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">Format</label>
              <select
                value={demoFormat}
                onChange={e => setDemoFormat(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Select...</option>
                <option>Live interactive demo</option>
                <option>Recorded walkthrough + Q&A</option>
                <option>POC (proof of concept) environment</option>
                <option>Sandbox access for prospect</option>
                <option>Partner-led demo (Stratwyze)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">Scheduled Date</label>
              <input
                type="date"
                value={demoDate}
                onChange={e => setDemoDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">Demo Focus Areas</label>
            <textarea
              value={demoFocus}
              onChange={e => setDemoFocus(e.target.value)}
              placeholder={`Based on their pain points, focus the demo on:${painPoints.length > 0 ? '\n- ' + painPoints.slice(0, 2).join('\n- ') : '\n- Incident SLA management\n- Self-service portal\n- Change approval workflow'}`}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
              rows={4}
            />
          </div>

          {/* Demo script tips */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-700">Demo best practices</p>
            {[
              `Open with their problem: "You mentioned ${painPoints[0] || 'SLA breaches'} — watch how HaloITSM handles this..."`,
              'Show the self-service portal first — highest adoption impact, most visible ROI',
              `Compare ${incumbent ? `live vs. ${incumbent}` : 'before/after'} on the key pain point`,
              'End with: "What would need to be true for this to be your top priority this quarter?"',
            ].map((tip, i) => (
              <p key={i} className="text-xs text-slate-600 flex gap-2">
                <span className="text-blue-400 font-bold shrink-0">{i + 1}.</span> {tip}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Scope & Risk */}
      {activeTab === 'scope' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Scope Notes</label>
            <textarea
              value={scopeNotes}
              onChange={e => setScopeNotes(e.target.value)}
              placeholder="Document the agreed implementation scope: modules, timeline, phasing approach, key integrations needed..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Competitor / Risk</label>
            <input
              type="text"
              value={competitorRisk}
              onChange={e => setCompetitorRisk(e.target.value)}
              placeholder="e.g. Freshservice in late-stage eval, internal IT team building in-house solution..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">Complexity Signals</p>
            <div className="grid grid-cols-2 gap-1.5">
              {COMPLEXITY_SIGNALS.map(sig => (
                <label key={sig} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border cursor-pointer text-xs transition-all ${
                  complexitySignals.includes(sig)
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={complexitySignals.includes(sig)}
                    onChange={() => toggleSignal(sig)}
                    className="w-3 h-3 shrink-0"
                  />
                  {sig}
                </label>
              ))}
            </div>
            {complexitySignals.length > 0 && (
              <p className="text-xs text-amber-700 mt-2 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
                {complexitySignals.length} complexity signal{complexitySignals.length !== 1 ? 's' : ''} flagged — factor into implementation timeline and pricing.
              </p>
            )}
          </div>
        </div>
      )}

      <button
        onClick={saveSolutioning}
        disabled={saving}
        className="w-full py-3 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving...' : '✓ Save Solutioning — Advance to Proposal →'}
      </button>
    </div>
  );
}
