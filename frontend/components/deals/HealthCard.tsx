'use client';

interface HealthCardProps {
  deal: {
    id: string;
    title: string;
    value: number;
    stage: string;
    primaryContact?: {
      intelligenceProfile?: {
        decisionMakerScore?: number;
        buyingRelevance?: number;
      } | null;
    } | null;
  };
  daysInStage: number;
  onClick?: () => void;
}

export default function HealthCard({ deal, daysInStage, onClick }: HealthCardProps) {
  const dmScore = deal.primaryContact?.intelligenceProfile?.decisionMakerScore || 0;
  const brScore = deal.primaryContact?.intelligenceProfile?.buyingRelevance || 0;
  const healthScore = Math.round((dmScore + brScore) / 2);

  const getHealthColor = (score: number) => {
    if (score >= 70) return 'bg-emerald-100 text-emerald-900';
    if (score >= 40) return 'bg-amber-100 text-amber-900';
    return 'bg-red-100 text-red-900';
  };

  const getHealthIcon = (score: number) => {
    if (score >= 70) return '🟢';
    if (score >= 40) return '🟡';
    return '🔴';
  };

  const riskFlags = [];
  if (daysInStage > 30) riskFlags.push('Stale (30+ days)');
  if (!deal.primaryContact) riskFlags.push('No contact');
  if (dmScore < 50) riskFlags.push('Low DM score');

  return (
    <div
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <h3 className="font-semibold text-sm text-slate-900 line-clamp-1">{deal.title}</h3>
      <p className="text-xs text-slate-500 mt-1">{deal.stage}</p>

      {/* Health Score */}
      <div className={`mt-3 p-3 rounded ${getHealthColor(healthScore)}`}>
        <div className="text-2xl font-bold">
          {getHealthIcon(healthScore)} {healthScore}%
        </div>
      </div>

      {/* Deal Value & Days */}
      <div className="mt-3 text-xs space-y-1 text-slate-600">
        <p>Value: ${deal.value.toLocaleString()}</p>
        <p>Stage: {daysInStage} days</p>
      </div>

      {/* Risk Flags */}
      {riskFlags.length > 0 && (
        <div className="mt-3 space-y-1">
          {riskFlags.map((flag, idx) => (
            <p key={idx} className="text-xs bg-red-50 text-red-700 p-1 rounded">
              ⚠️ {flag}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
