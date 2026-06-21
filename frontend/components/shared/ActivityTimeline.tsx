'use client';

interface Activity {
  id: string;
  type: 'call' | 'email' | 'note' | 'deal' | 'update';
  title: string;
  description: string;
  owner: string;
  initials: string;
  timestamp: string;
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'call',
    title: 'Discovery Call',
    description: 'Discussed pain points and budget allocation for Q3',
    owner: 'Sarah Johnson',
    initials: 'SJ',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'email',
    title: 'Proposal Sent',
    description: 'Sent comprehensive proposal covering enterprise tier',
    owner: 'Anthony Alverado',
    initials: 'AA',
    timestamp: '1 day ago',
  },
  {
    id: '3',
    type: 'note',
    title: 'Customer Note',
    description: 'CFO requested additional security documentation',
    owner: 'Michael Brown',
    initials: 'MB',
    timestamp: '2 days ago',
  },
  {
    id: '4',
    type: 'deal',
    title: 'Opportunity Created',
    description: 'New opportunity: Enterprise Implementation',
    owner: 'Maya Rodriguez',
    initials: 'MR',
    timestamp: '3 days ago',
  },
];


export default function ActivityTimeline() {
  return (
    <div className="space-y-4">
      {MOCK_ACTIVITIES.map((activity, index) => (
        <div key={activity.id} className="flex gap-4">
          {/* Timeline Line */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
              {activity.initials[0]}
            </div>
            {index < MOCK_ACTIVITIES.length - 1 && (
              <div className="w-0.5 h-12 bg-slate-200 mt-2"></div>
            )}
          </div>

          {/* Activity Content */}
          <div className="flex-1 pt-1">
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="font-600 text-slate-900">{activity.title}</p>
                <p className="text-sm text-slate-600">{activity.owner}</p>
              </div>
              <span className="text-xs text-slate-500 whitespace-nowrap ml-4">{activity.timestamp}</span>
            </div>
            <p className="text-sm text-slate-600">{activity.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
