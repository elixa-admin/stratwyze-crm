'use client';

export default function DocumentsPage() {
  const documents = [
    { id: '1', name: 'Acme Enterprise Proposal.pdf', size: '2.4 MB', uploaded: 'Jan 10, 2026', owner: 'Sarah J.', type: 'Proposal' },
    { id: '2', name: 'Implementation Plan.docx', size: '1.1 MB', uploaded: 'Jan 8, 2026', owner: 'Michael C.', type: 'Plan' },
    { id: '3', name: 'Q1 Sales Strategy.pdf', size: '3.2 MB', uploaded: 'Jan 5, 2026', owner: 'Anthony A.', type: 'Strategy' },
    { id: '4', name: 'Contract - Global Inc.pdf', size: '1.8 MB', uploaded: 'Dec 28, 2025', owner: 'Sarah J.', type: 'Contract' },
    { id: '5', name: 'Product Demo Video.mp4', size: '125 MB', uploaded: 'Dec 20, 2025', owner: 'Emily D.', type: 'Video' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Documents</h1>
          <p className="text-slate-600 mt-1">Manage sales documents and files</p>
        </div>
        <button className="px-4 py-2.5 rounded-lg text-sm font-600 bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-sm">
          + Upload Document
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search documents..."
          className="flex-1 px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select className="px-3 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Types</option>
          <option>Proposal</option>
          <option>Contract</option>
          <option>Plan</option>
          <option>Strategy</option>
          <option>Video</option>
        </select>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-4 font-600 text-sm text-slate-900">Name</th>
              <th className="text-left px-6 py-4 font-600 text-sm text-slate-900">Type</th>
              <th className="text-left px-6 py-4 font-600 text-sm text-slate-900">Size</th>
              <th className="text-left px-6 py-4 font-600 text-sm text-slate-900">Owner</th>
              <th className="text-left px-6 py-4 font-600 text-sm text-slate-900">Uploaded</th>
              <th className="text-right px-6 py-4 font-600 text-sm text-slate-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-700">
                      {doc.name.split('.').pop()?.toUpperCase()}
                    </div>
                    <span className="font-500 text-slate-900 truncate">{doc.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{doc.type}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{doc.size}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{doc.owner}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{doc.uploaded}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-2 justify-end">
                    <button className="text-sm font-500 text-blue-600 hover:text-blue-700">Download</button>
                    <button className="text-sm font-500 text-slate-600 hover:text-slate-900">Share</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Storage Info */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Storage Usage</h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-500 text-slate-900">Used</span>
              <span className="text-sm font-500 text-slate-900">142 MB / 1 GB</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: '14.2%' }}></div>
            </div>
          </div>
          <p className="text-xs text-slate-600">Upgrade your plan to increase storage</p>
        </div>
      </div>
    </div>
  );
}
