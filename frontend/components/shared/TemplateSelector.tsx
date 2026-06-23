'use client';

import { useState, useEffect } from 'react';

interface Template {
  id: string;
  name: string;
  accountId?: string;
  account?: { id: string; name: string };
  incumbentPlatform?: string;
  incumbentProvider?: string;
}

interface TemplateSelectorProps {
  onSelect?: (template: Template) => void;
}

export default function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.json())
      .then(data => {
        if (data.templates) setTemplates(data.templates);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (template: Template) => {
    onSelect?.(template);
    setOpen(false);
  };

  if (loading) return null;
  if (templates.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
      >
        📋 Use a template
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg border border-slate-200 shadow-lg z-50 w-72 max-h-64 overflow-y-auto">
          {templates.map(template => (
            <button
              key={template.id}
              onClick={() => handleSelect(template)}
              className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors"
            >
              <p className="font-medium text-slate-900 text-sm">{template.name}</p>
              {template.account && (
                <p className="text-xs text-slate-500 mt-0.5">{template.account.name}</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
