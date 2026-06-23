'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';

interface SaveAsTemplateModalProps {
  isOpen: boolean;
  dealTitle: string;
  accountId?: string;
  incumbentPlatform?: string;
  incumbentProvider?: string;
  onClose: () => void;
  onSaved?: () => void;
}

export default function SaveAsTemplateModal({
  isOpen,
  dealTitle,
  accountId,
  incumbentPlatform,
  incumbentProvider,
  onClose,
  onSaved,
}: SaveAsTemplateModalProps) {
  const [templateName, setTemplateName] = useState(dealTitle);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!templateName.trim()) {
      toast('Template name is required', 'error');
      return;
    }

    setSaving(true);
    try {
      await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName.trim(),
          accountId: accountId || null,
          incumbentPlatform: incumbentPlatform || null,
          incumbentProvider: incumbentProvider || null,
        }),
      });
      toast(`Template "${templateName}" saved`, 'success');
      onSaved?.();
      onClose();
    } catch (err) {
      toast('Failed to save template', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Save as Template</h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Template Name</label>
            <input
              type="text"
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              placeholder="e.g., Enterprise SaaS Deal"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <p className="text-xs text-slate-500">
            This template will save the deal title and competitive context for reuse.
          </p>
        </div>

        <div className="border-t border-slate-200 px-6 py-3 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Template'}
          </button>
        </div>
      </div>
    </div>
  );
}
