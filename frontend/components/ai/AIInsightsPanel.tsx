'use client';

export default function AIInsightsPanel() {
  return (
    <div className="space-y-4">
      {/* Deal Risk */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-600 text-slate-900">Deal Risk Assessment</h3>
          <div className="text-2xl font-bold text-red-600">24%</div>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-slate-600">Low risk deal showing strong momentum</p>
          <div className="flex gap-2 mt-3">
            <span className="px-2 py-1 rounded text-xs bg-green-50 text-green-700 font-500">On Track</span>
          </div>
        </div>
      </div>

      {/* Win Probability */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-600 text-slate-900">Win Probability</h3>
          <div className="text-2xl font-bold text-green-600">76%</div>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-slate-600">Strong engagement with decision makers</p>
          <div className="flex gap-2 mt-3">
            <span className="px-2 py-1 rounded text-xs bg-green-50 text-green-700 font-500">High Confidence</span>
          </div>
        </div>
      </div>

      {/* Next Best Action */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
        <h3 className="font-600 text-slate-900 mb-3">Next Best Action</h3>
        <div className="space-y-2 text-sm">
          <p className="text-slate-900 font-500">Schedule follow-up call with Finance team</p>
          <p className="text-slate-600">Budget approval pending - CFO requested security docs</p>
          <button className="mt-3 px-3 py-1.5 rounded text-xs font-600 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
            Create Task →
          </button>
        </div>
      </div>
    </div>
  );
}
