'use client';

import { useState } from 'react';

const MODULES = [
  { id: 'incident', label: 'Incident Management', core: true },
  { id: 'change', label: 'Change Management', core: true },
  { id: 'asset', label: 'Asset Management', core: false },
  { id: 'service-catalogue', label: 'Service Catalogue', core: true },
  { id: 'problem', label: 'Problem Management', core: false },
  { id: 'knowledge', label: 'Knowledge Management', core: false },
  { id: 'hr', label: 'HR Service Management', core: false },
  { id: 'project', label: 'Project Management', core: false },
  { id: 'release', label: 'Release Management', core: false },
  { id: 'financial', label: 'Financial Management', core: false },
];

const POSITIONING_ANGLES = [
  { id: 'Cost', label: 'Cost Reduction', description: '70% lower TCO vs. incumbent' },
  { id: 'Speed', label: 'Time-to-Value', description: '4–6 month implementation' },
  { id: 'Adoption', label: 'User Adoption', description: '90%+ adoption in 6 months' },
  { id: 'Simplicity', label: 'Simplicity', description: 'All modules, one price' },
  { id: 'AI Automation', label: 'AI Automation', description: '40–50% manual work reduction' },
];

interface SolutionDesignFormProps {
  deal: any;
  onComplete: (design: any) => void;
}

export default function SolutionDesignForm({ deal, onComplete }: SolutionDesignFormProps) {
  const workflow = deal?.stageWorkflow;
  const profile = deal?.opportunityProfile;
  const discoveryData = (profile?.discoveryData as any) ?? {};

  // Auto-populate from discovery
  const [selectedModules, setSelectedModules] = useState<string[]>(
    MODULES.filter(m => m.core).map(m => m.label)
  );
  const [userCount, setUserCount] = useState('');
  const [locations, setLocations] = useState('');
  const [timeline, setTimeline] = useState(discoveryData.timeline || workflow?.timeline || '');
  const [positioningAngle, setPositioningAngle] = useState(workflow?.positioningAngle || 'Cost');
  const [additionalContext, setAdditionalContext] = useState('');

  const toggleModule = (label: string) => {
    setSelectedModules(prev =>
      prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]
    );
  };

  const handleSubmit = () => {
    onComplete({
      solutionModules: selectedModules,
      userCount,
      locations,
      timeline,
      positioningAngle,
      additionalContext,
      incumbent: workflow?.incumbentPlatform || deal?.incumbentPlatform,
      painPoints: workflow?.painPoints || discoveryData.painPoints || [],
      budgetRange: workflow?.budgetRange || discoveryData.budgetRange,
      champion: workflow?.champion || discoveryData.champion,
    });
  };

  return (
    <div className="space-y-5">
      {/* Discovery prefill banner */}
      {(discoveryData.painPoints?.length || workflow?.incumbentPlatform) && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
          <span className="text-blue-500 text-lg">💡</span>
          <div>
            <p className="text-sm font-semibold text-blue-900">Auto-populated from Discovery</p>
            <p className="text-xs text-blue-700 mt-0.5">
              {workflow?.incumbentPlatform && `Incumbent: ${workflow.incumbentPlatform}. `}
              {workflow?.painPoints?.length ? `Top pain: ${workflow.painPoints[0]}.` : ''}
              {workflow?.budgetRange ? ` Budget: ${workflow.budgetRange}.` : ''}
            </p>
          </div>
        </div>
      )}

      {/* Modules */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">HaloITSM Modules</h3>
        <div className="grid grid-cols-2 gap-2">
          {MODULES.map(mod => (
            <label
              key={mod.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm ${
                selectedModules.includes(mod.label)
                  ? 'bg-blue-50 border-blue-300 text-blue-800'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedModules.includes(mod.label)}
                onChange={() => toggleModule(mod.label)}
                className="w-4 h-4"
              />
              {mod.label}
              {mod.core && <span className="text-[10px] text-blue-500 font-semibold ml-auto">CORE</span>}
            </label>
          ))}
        </div>
      </div>

      {/* Scale */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Scale & Deployment</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">User Count</label>
            <input
              type="text"
              value={userCount}
              onChange={e => setUserCount(e.target.value)}
              placeholder="e.g. 500–1,000 IT staff"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">Locations / Sites</label>
            <input
              type="text"
              value={locations}
              onChange={e => setLocations(e.target.value)}
              placeholder="e.g. Johannesburg, Cape Town, Durban"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">Target Go-Live</label>
            <select
              value={timeline}
              onChange={e => setTimeline(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Select timeline...</option>
              <option>Q3 2026 (3–4 months)</option>
              <option>Q4 2026 (6 months)</option>
              <option>Q1 2027 (6–9 months)</option>
              <option>H1 2027 (12 months)</option>
              <option>Flexible — to be agreed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Positioning angle */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Lead Positioning Angle</h3>
        <div className="space-y-2">
          {POSITIONING_ANGLES.map(angle => (
            <label
              key={angle.id}
              className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${
                positioningAngle === angle.id
                  ? 'bg-indigo-50 border-indigo-300'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="angle"
                checked={positioningAngle === angle.id}
                onChange={() => setPositioningAngle(angle.id)}
                className="mt-0.5 w-4 h-4"
              />
              <div>
                <p className="text-sm font-semibold text-slate-900">{angle.label}</p>
                <p className="text-xs text-slate-500">{angle.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Additional context */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
          Additional Context for AI (optional)
        </label>
        <textarea
          value={additionalContext}
          onChange={e => setAdditionalContext(e.target.value)}
          placeholder="Any quotes from the prospect, specific priorities, or nuances the AI should incorporate..."
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
          rows={3}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={selectedModules.length === 0}
        className="w-full py-3 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        ✓ Save Design — Generate Proposal →
      </button>
    </div>
  );
}
