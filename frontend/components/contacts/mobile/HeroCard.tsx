'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';

interface HeroCardProps {
  name: string;
  title: string;
  company: string;
  email: string;
  emailConfidence: number;
  decisionMakerScore?: number;
  buyingRelevance?: number;
  cachedAt?: string | null;
  isCached?: boolean;
}

/**
 * Mobile hero card: decision scores + email + quick actions
 * Designed for thumb-scrolling on mobile devices
 * Touch targets: 48px minimum
 */
export default function HeroCard({
  name,
  title,
  company,
  email,
  emailConfidence,
  decisionMakerScore = 0,
  buyingRelevance = 0,
  cachedAt,
  isCached,
}: HeroCardProps) {
  const [emailCopied, setEmailCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      toast('Email copied!', 'success');
      setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      toast('Failed to copy email', 'error');
    }
  };

  const callContact = () => {
    window.location.href = `tel:${email}`;
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-slate-600';
  };

  const scoreLabel = (score: number) => {
    if (score >= 80) return '🟢';
    if (score >= 60) return '🟡';
    return '⚪';
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4 shadow-sm">
      {/* Header: Name + Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{name}</h2>
          {isCached && cachedAt && (
            <p className="text-xs text-slate-500">Cached {cachedAt}</p>
          )}
        </div>
      </div>

      {/* Decision Maker & Buying Relevance Scores */}
      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded">
        <div>
          <p className="text-xs text-slate-600 font-semibold">Decision Maker</p>
          <div className={`text-2xl font-bold ${scoreColor(decisionMakerScore)}`}>
            {scoreLabel(decisionMakerScore)} {decisionMakerScore}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">/ 100</p>
        </div>
        <div>
          <p className="text-xs text-slate-600 font-semibold">Buying Relevance</p>
          <div className={`text-2xl font-bold ${scoreColor(buyingRelevance)}`}>
            {scoreLabel(buyingRelevance)} {buyingRelevance}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">/ 100</p>
        </div>
      </div>

      {/* Email Address with Confidence */}
      <div className="bg-blue-50 p-3 rounded border border-blue-200">
        <p className="text-xs text-blue-600 font-semibold mb-2">Primary Email</p>
        <p className="text-sm font-mono text-slate-900 break-all">{email}</p>
        <p className="text-xs text-blue-600 mt-1">
          {emailConfidence >= 80 ? '✓' : '?'} Confidence: {emailConfidence}%
        </p>
      </div>

      {/* Action Buttons: Copy & Call (48px minimum height) */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={copyEmail}
          className={`h-12 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            emailCopied
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-200 text-slate-900 hover:bg-slate-300 active:scale-95'
          }`}
        >
          {emailCopied ? '✓ Copied!' : '📋 Copy Email'}
        </button>

        <button
          onClick={callContact}
          className="h-12 rounded-lg bg-green-600 text-white font-semibold text-sm hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          📞 Call
        </button>
      </div>

      {/* Current Role & Company */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <div>
          <p className="text-xs text-slate-600 font-semibold">Title</p>
          <p className="text-sm text-slate-900">{title}</p>
        </div>
        <div>
          <p className="text-xs text-slate-600 font-semibold">Company</p>
          <p className="text-sm text-slate-900">{company}</p>
        </div>
      </div>
    </div>
  );
}
