'use client';

import { useEffect, useState } from 'react';

interface Opportunity {
  id: string;
  name: string;
  value: number;
  probability: number;
  stage_id: string;
  lead_id: string;
  close_date?: string;
}

interface Stage {
  name: string;
  opportunities: Opportunity[];
}

const stageConfig = {
  'Discovery': { color: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800' },
  'Proposal': { color: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-800' },
  'Negotiation': { color: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-800' },
  'Closed Won': { color: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-800' },
  'Closed Lost': { color: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-800' }
};

export default function KanbanBoard() {
  const [stages, setStages] = useState<Record<string, Opportunity[]>>({});
  const [loading, setLoading] = useState(true);
  const [draggedCard, setDraggedCard] = useState<{id: string, fromStage: string} | null>(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/opportunities');
      const data = await response.json();
      setStages(data);
    } catch (err) {
      console.error('Failed to fetch opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, opportunityId: string, stageName: string) => {
    setDraggedCard({ id: opportunityId, fromStage: stageName });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, toStageName: string) => {
    e.preventDefault();
    if (!draggedCard) return;

    const fromStage = stages[draggedCard.fromStage];
    const opportunity = fromStage?.find(o => o.id === draggedCard.id);

    if (!opportunity) return;

    // Get the stage ID for the target stage
    const toStageObj = Object.values(stages)
      .flat()
      .find(o => o.stage_id); // This is a simplification - ideally we'd have stage IDs

    try {
      // Update opportunity with new stage
      await fetch(`http://localhost:8000/api/opportunities/${draggedCard.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage_id: toStageName })
      });

      // Optimistic update
      const newStages = { ...stages };
      newStages[draggedCard.fromStage] = newStages[draggedCard.fromStage].filter(
        o => o.id !== draggedCard.id
      );
      newStages[toStageName] = [...(newStages[toStageName] || []), opportunity];
      setStages(newStages);
    } catch (err) {
      console.error('Failed to update opportunity:', err);
    }

    setDraggedCard(null);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading pipeline...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sales Pipeline</h1>

        <div className="grid grid-cols-5 gap-6 overflow-x-auto pb-8">
          {Object.entries(stageConfig).map(([stageName, config]) => (
            <div
              key={stageName}
              className={`flex-shrink-0 w-80 rounded-lg ${config.color} border-2 ${config.border} p-4`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stageName)}
            >
              {/* Stage Header */}
              <div className="mb-4">
                <h2 className={`font-semibold text-lg ${config.badge}`}>{stageName}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {stages[stageName]?.length || 0} deals
                </p>
              </div>

              {/* Opportunity Cards */}
              <div className="space-y-3">
                {stages[stageName]?.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>No deals yet</p>
                  </div>
                ) : (
                  stages[stageName]?.map((opportunity) => (
                    <div
                      key={opportunity.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, opportunity.id, stageName)}
                      className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow cursor-move border border-gray-200 hover:border-gray-400"
                    >
                      {/* Deal Name */}
                      <h3 className="font-semibold text-gray-900 truncate">
                        {opportunity.name}
                      </h3>

                      {/* Deal Value */}
                      <p className="text-xl font-bold text-blue-600 mt-2">
                        ${opportunity.value.toLocaleString()}
                      </p>

                      {/* Probability Bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Win Probability</span>
                          <span>{opportunity.probability}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${opportunity.probability}%` }}
                          />
                        </div>
                      </div>

                      {/* Close Date */}
                      {opportunity.close_date && (
                        <p className="text-xs text-gray-500 mt-2">
                          Close: {new Date(opportunity.close_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
