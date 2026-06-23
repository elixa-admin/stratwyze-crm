'use client';

interface TimelineEvent {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'intelligence' | 'note' | 'stage_change';
  timestamp: string;
  summary: string;
  details?: string;
  metadata?: any;
}

interface ActivityTimelineProps {
  events: TimelineEvent[];
  isLoading?: boolean;
}

export default function ActivityTimeline({ events, isLoading }: ActivityTimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'call':
        return '📞';
      case 'email':
        return '📧';
      case 'meeting':
        return '📅';
      case 'intelligence':
        return '🔍';
      case 'stage_change':
        return '📊';
      default:
        return '📝';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'call':
        return 'border-blue-500 bg-blue-50';
      case 'email':
        return 'border-green-500 bg-green-50';
      case 'meeting':
        return 'border-purple-500 bg-purple-50';
      case 'intelligence':
        return 'border-orange-500 bg-orange-50';
      case 'stage_change':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-slate-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return <div className="text-center py-8 text-slate-500">No activity yet</div>;
  }

  return (
    <div className="space-y-4">
      {events.map((event, idx) => (
        <div key={event.id} className="relative">
          {/* Timeline line */}
          {idx !== events.length - 1 && (
            <div className="absolute left-[19px] top-12 w-0.5 h-8 bg-slate-200" />
          )}

          {/* Event */}
          <div className="flex gap-4">
            {/* Icon */}
            <div className="pt-1 text-2xl">{getIcon(event.type)}</div>

            {/* Content */}
            <div className={`flex-1 rounded-lg border-l-4 p-3 ${getColor(event.type)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-900">{event.summary}</p>
                  {event.details && <p className="text-xs text-slate-600 mt-1">{event.details}</p>}
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                  {formatTime(event.timestamp)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
