'use client';

import { useState } from 'react';

export interface QuickAction {
  id: string;
  type: 'research' | 'call' | 'email' | 'followup' | 'schedule';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  targetId?: string;
  targetType?: 'contact' | 'deal';
}

interface QuickActionsHubProps {
  actions: QuickAction[];
  onActionClick?: (action: QuickAction) => void;
}

export default function QuickActionsHub({ actions, onActionClick }: QuickActionsHubProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'research':
        return '🔍';
      case 'call':
        return '📞';
      case 'email':
        return '📧';
      case 'followup':
        return '💬';
      case 'schedule':
        return '📅';
      default:
        return '✨';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-900';
      case 'medium':
        return 'bg-amber-100 text-amber-900';
      default:
        return 'bg-slate-100 text-slate-900';
    }
  };

  if (actions.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isExpanded && (
        <div className="absolute bottom-16 right-0 bg-white border border-slate-200 rounded-lg shadow-lg w-80 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-900">Next Best Actions</h3>
          </div>
          <div className="divide-y">
            {actions.slice(0, 5).map((action) => (
              <button
                key={action.id}
                onClick={() => {
                  onActionClick?.(action);
                  setIsExpanded(false);
                }}
                className="w-full text-left p-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span className="text-xl">{getIcon(action.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900">{action.title}</p>
                    <p className="text-xs text-slate-600 mt-1">{action.description}</p>
                    <span className={`inline-block text-xs px-2 py-1 rounded mt-2 ${getPriorityColor(action.priority)}`}>
                      {action.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg hover:shadow-xl transition-all ${
          isExpanded ? 'bg-blue-600 text-white' : 'bg-white border-2 border-blue-600 text-blue-600'
        }`}
      >
        ✨
      </button>

      {/* Action Count Badge */}
      {!isExpanded && actions.length > 0 && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
          {actions.length}
        </div>
      )}
    </div>
  );
}
