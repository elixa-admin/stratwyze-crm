'use client';

import { useState, useEffect } from 'react';

interface LeadEntryProps {
  onNext: (data: { companyName: string; accountId?: string; incumbentPlatform?: string }) => void;
  loading: boolean;
}

export default function LeadEntryScreen({ onNext, loading }: LeadEntryProps) {
  const [companyName, setCompanyName] = useState('');
  const [accountId, setAccountId] = useState('');
  const [incumbentPlatform, setIncumbentPlatform] = useState('');
  const [accounts, setAccounts] = useState<{ id: string; name: string }[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);

  useEffect(() => {
    // Fetch existing accounts
    fetch('/api/accounts')
      .then(r => r.json())
      .then(d => {
        if (d.accounts) setAccounts(d.accounts);
      })
      .catch(() => {})
      .finally(() => setAccountsLoading(false));
  }, []);

  const handleSubmit = () => {
    if (!companyName.trim()) {
      alert('Company name required');
      return;
    }
    onNext({
      companyName: companyName.trim(),
      accountId: accountId || undefined,
      incumbentPlatform: incumbentPlatform || undefined,
    });
  };

  const platforms = [
    { id: 'servicenow', label: 'ServiceNow' },
    { id: 'jira', label: 'Jira Service Management' },
    { id: 'freshservice', label: 'Freshservice' },
    { id: 'bmchelix', label: 'BMC Helix' },
    { id: 'zendesk', label: 'Zendesk' },
    { id: 'ivanti', label: 'Ivanti Neurons' },
    { id: 'bmcremedy', label: 'BMC Remedy' },
    { id: 'cherwell', label: 'Cherwell' },
    { id: 'solarwinds', label: 'SolarWinds ITSM' },
    { id: 'manageengine', label: 'ManageEngine ServiceDesk Plus' },
    { id: 'opsgenie', label: 'Atlassian Opsgenie' },
    { id: 'unknown', label: 'Unknown / Will discover' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Phase 14</h2>
        <p className="text-slate-600">
          Let's prep you for your discovery call with the right intel, questions, and battle-cards.
        </p>
      </div>

      <div className="space-y-6">
        {/* Company Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            placeholder="e.g., MTN Group, FirstRand, Vodacom"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <p className="text-xs text-slate-400 mt-1">Enter the company you're meeting with</p>
        </div>

        {/* Existing Account Link */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Link to Existing Account
          </label>
          {accountsLoading ? (
            <div className="text-sm text-slate-400">Loading accounts...</div>
          ) : (
            <select
              value={accountId}
              onChange={e => setAccountId(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">No account linked (new prospect)</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          )}
          <p className="text-xs text-slate-400 mt-1">If this company exists in the system, link it</p>
        </div>

        {/* Incumbent Platform Guess */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Current ITSM Platform (if known)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {platforms.map(platform => (
              <label
                key={platform.id}
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all ${
                  incumbentPlatform === platform.id
                    ? 'bg-blue-50 border-blue-400'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="platform"
                  value={platform.id}
                  checked={incumbentPlatform === platform.id}
                  onChange={e => setIncumbentPlatform(e.target.value)}
                  className="w-4 h-4"
                  disabled={loading}
                />
                <span className="text-sm font-medium text-slate-700">{platform.label}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            💡 TIP: If unsure, select "Unknown"—we'll help you discover it during the call
          </p>
        </div>

        {/* CTA */}
        <div className="pt-6 border-t border-slate-100">
          <button
            onClick={handleSubmit}
            disabled={!companyName.trim() || loading}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating pre-meeting brief...
              </>
            ) : (
              <>
                Next: Pre-Meeting Brief
                <span>→</span>
              </>
            )}
          </button>
          <p className="text-xs text-slate-400 text-center mt-2">
            Takes 30 seconds to gather company intel and generate your brief
          </p>
        </div>
      </div>
    </div>
  );
}
