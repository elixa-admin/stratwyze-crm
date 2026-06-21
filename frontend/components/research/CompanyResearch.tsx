'use client';

import { useState } from 'react';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  date: string | null;
}

interface KnowledgePanel {
  name: string;
  description: string;
  website: string;
  founded: string;
  employees: string;
}

interface ResearchData {
  results: SearchResult[];
  knowledgePanel: KnowledgePanel | null;
  query: string;
}

interface Props {
  companyName: string;
}

type ResearchType = 'company' | 'news' | 'funding';

export default function CompanyResearch({ companyName }: Props) {
  const [data, setData] = useState<ResearchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState<ResearchType>('company');
  const [error, setError] = useState<string | null>(null);

  const runSearch = async (type: ResearchType) => {
    setLoading(true);
    setError(null);
    setActiveType(type);
    try {
      const res = await fetch(`/api/research?q=${encodeURIComponent(companyName)}&type=${type}`);
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        setData(json);
      }
    } catch {
      setError('Research request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">AI Research</h2>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded font-medium">Powered by SerpAPI</span>
      </div>

      {/* Search Type Tabs */}
      <div className="flex gap-2 mb-5">
        {([
          { key: 'company', label: 'Overview' },
          { key: 'news', label: 'News' },
          { key: 'funding', label: 'Funding' },
        ] as { key: ResearchType; label: string }[]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => runSearch(key)}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeType === key && data
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'
            } disabled:opacity-50`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Initial prompt */}
      {!data && !loading && !error && (
        <div className="text-center py-8">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-slate-600 text-sm">Click a tab above to research <span className="font-semibold text-slate-900">{companyName}</span></p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-600">Searching the web...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{error === 'SerpAPI not configured'
            ? 'SerpAPI key not set. Add SERPAPI_KEY to your environment variables.'
            : error}
          </p>
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div className="space-y-4">
          {/* Knowledge Panel */}
          {data.knowledgePanel && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-bold text-slate-900 mb-1">{data.knowledgePanel.name}</p>
              {data.knowledgePanel.description && (
                <p className="text-sm text-slate-600 mb-2">{data.knowledgePanel.description}</p>
              )}
              <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                {data.knowledgePanel.founded && <span>Founded: <strong>{data.knowledgePanel.founded}</strong></span>}
                {data.knowledgePanel.employees && <span>Employees: <strong>{data.knowledgePanel.employees}</strong></span>}
                {data.knowledgePanel.website && (
                  <a href={data.knowledgePanel.website} target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline">{data.knowledgePanel.website}</a>
                )}
              </div>
            </div>
          )}

          {/* Organic Results */}
          <div className="space-y-3">
            {data.results.map((result, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all">
                <a href={result.url} target="_blank" rel="noopener noreferrer"
                  className="font-semibold text-sm text-blue-600 hover:text-blue-700 hover:underline block mb-1">
                  {result.title}
                </a>
                <p className="text-xs text-slate-600 leading-relaxed">{result.snippet}</p>
                {result.date && (
                  <p className="text-xs text-slate-400 mt-1">{result.date}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
