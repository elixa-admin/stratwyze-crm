'use client';

import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 15));

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const events: Record<number, Array<{ title: string; time: string; color: string }>> = {
    5: [{ title: 'Discovery Call - Acme', time: '10:00 AM', color: 'bg-blue-50' }],
    12: [{ title: 'Proposal Review', time: '2:00 PM', color: 'bg-purple-50' }],
    15: [{ title: 'Team Standup', time: '9:00 AM', color: 'bg-slate-50' }],
    22: [{ title: 'Client Workshop', time: '1:00 PM', color: 'bg-green-50' }],
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Calendar"
        subtitle="Manage your sales activities and meetings"
        action={
          <button className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/20 hover:bg-white/30 text-white transition-all border border-white/30">
            + Schedule Activity
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="px-3 py-1.5 rounded text-sm border border-slate-300 hover:bg-slate-50">← Prev</button>
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="px-3 py-1.5 rounded text-sm border border-slate-300 hover:bg-slate-50">Next →</button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-600 text-slate-600 py-2">{day}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg border min-h-20 ${
                  day === null
                    ? 'bg-slate-50 border-transparent'
                    : 'border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors'
                }`}
              >
                {day && (
                  <>
                    <p className={`text-sm font-600 mb-1 ${
                      day === currentDate.getDate() ? 'text-blue-600' : 'text-slate-900'
                    }`}>
                      {day}
                    </p>
                    {events[day] && events[day].length > 0 && (
                      <div className="text-xs space-y-1">
                        {events[day].slice(0, 1).map((event, i) => (
                          <div key={i} className={`${event.color} px-2 py-1 rounded text-slate-700 truncate`}>
                            {event.title}
                          </div>
                        ))}
                        {events[day].length > 1 && (
                          <p className="text-slate-500 px-2">+{events[day].length - 1} more</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Activities */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Upcoming Activities</h2>
          <div className="space-y-3">
            {[
              { date: 'Today, 10:00 AM', title: 'Discovery Call - Acme', type: 'Call' },
              { date: 'Tomorrow, 2:00 PM', title: 'Proposal Review', type: 'Meeting' },
              { date: 'Jan 18, 1:00 PM', title: 'Client Workshop', type: 'Workshop' },
              { date: 'Jan 20, 3:00 PM', title: 'Follow-up Call', type: 'Call' },
            ].map((activity, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">
                <p className="text-xs text-slate-600 mb-1">{activity.date}</p>
                <p className="text-sm font-500 text-slate-900">{activity.title}</p>
                <p className="text-xs text-slate-500 mt-1">{activity.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
