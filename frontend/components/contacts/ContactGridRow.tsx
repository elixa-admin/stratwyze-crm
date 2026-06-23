'use client';

import { useState } from 'react';

interface ContactGridRowProps {
  contact: {
    id: string;
    name: string;
    title?: string;
    company?: string;
    email?: string;
    intelligenceProfile?: {
      decisionMakerScore?: number;
      buyingRelevance?: number;
      researchCompletedAt?: string;
    } | null;
  };
  onEmailCopy?: () => void;
  onCall?: () => void;
  onRefresh?: () => void;
  onRowClick?: (id: string) => void;
}

export default function ContactGridRow({
  contact,
  onEmailCopy,
  onCall,
  onRefresh,
  onRowClick,
}: ContactGridRowProps) {
  const [copied, setCopied] = useState(false);

  const dmScore = contact.intelligenceProfile?.decisionMakerScore || 0;
  const brScore = contact.intelligenceProfile?.buyingRelevance || 0;

  const getScoreBadge = (score: number) => {
    if (score >= 80) return '🟢';
    if (score >= 60) return '🟡';
    return '⚪';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-slate-600';
  };

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (contact.email) {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      onEmailCopy?.();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (contact.email) {
      window.location.href = `tel:${contact.email}`;
      onCall?.();
    }
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRefresh?.();
  };

  const lastUpdated = contact.intelligenceProfile?.researchCompletedAt
    ? new Date(contact.intelligenceProfile.researchCompletedAt).toLocaleDateString()
    : 'Never';

  return (
    <tr
      onClick={() => onRowClick?.(contact.id)}
      className="border-b border-slate-200 hover:bg-blue-50 cursor-pointer transition-colors"
    >
      {/* Name */}
      <td className="px-4 py-3 text-sm font-medium text-slate-900">{contact.name}</td>

      {/* Title */}
      <td className="px-4 py-3 text-sm text-slate-600">{contact.title || '—'}</td>

      {/* Company */}
      <td className="px-4 py-3 text-sm text-slate-600">{contact.company || '—'}</td>

      {/* Decision Maker Score */}
      <td className="px-4 py-3">
        <div className={`text-sm font-semibold ${getScoreColor(dmScore)}`}>
          {getScoreBadge(dmScore)} {dmScore}%
        </div>
      </td>

      {/* Buying Relevance Score */}
      <td className="px-4 py-3">
        <div className={`text-sm font-semibold ${getScoreColor(brScore)}`}>
          {getScoreBadge(brScore)} {brScore}%
        </div>
      </td>

      {/* Email */}
      <td className="px-4 py-3 text-sm font-mono text-slate-600">{contact.email || '—'}</td>

      {/* Last Updated */}
      <td className="px-4 py-3 text-xs text-slate-500">{lastUpdated}</td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={handleCopyEmail}
            title="Copy email"
            className={`px-2 py-1 rounded text-sm font-semibold transition-all ${
              copied
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
            }`}
          >
            {copied ? '✓' : '📧'}
          </button>
          {contact.email && (
            <button
              onClick={handleCall}
              title="Call"
              className="px-2 py-1 bg-green-600 text-white rounded text-sm font-semibold hover:bg-green-700"
            >
              📞
            </button>
          )}
          <button
            onClick={handleRefresh}
            title="Refresh intelligence"
            className="px-2 py-1 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700"
          >
            ⟳
          </button>
        </div>
      </td>
    </tr>
  );
}
