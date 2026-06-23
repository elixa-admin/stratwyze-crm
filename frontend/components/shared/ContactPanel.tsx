'use client';

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  title?: string;
}

interface ContactPanelProps {
  contact?: Contact;
}

export default function ContactPanel({ contact }: ContactPanelProps) {
  if (!contact) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Primary Contact</h3>
        <p className="text-xs text-slate-400">No contact assigned</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Primary Contact</h3>

      {/* Avatar + Name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
          {contact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-900">{contact.name}</p>
          {contact.title && <p className="text-xs text-slate-500">{contact.title}</p>}
        </div>
      </div>

      {/* Contact Actions */}
      <div className="space-y-2">
        {contact.email && (
          <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            {contact.email}
          </a>
        )}

        {contact.phone && (
          <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {contact.phone}
          </a>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
        {contact.email && (
          <button className="flex-1 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors">
            Email
          </button>
        )}
        {contact.phone && (
          <button className="flex-1 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors">
            Call
          </button>
        )}
      </div>
    </div>
  );
}
