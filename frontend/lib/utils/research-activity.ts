export type ActivityType = 'search' | 'tier-attempt' | 'tier-success' | 'tier-timeout' | 'tier-error' | 'complete';

export interface ResearchActivity {
  timestamp: string;
  type: ActivityType;
  tier?: string;
  message: string;
  duration?: number;
  error?: string;
}

export class ResearchActivityTracker {
  private activities: ResearchActivity[] = [];
  private startTime = Date.now();

  addActivity(type: ActivityType, message: string, tier?: string, error?: string, duration?: number) {
    const timestamp = new Date().toLocaleTimeString();
    this.activities.push({
      timestamp,
      type,
      tier,
      message,
      error,
      duration,
    });
  }

  getActivities(): ResearchActivity[] {
    return this.activities;
  }

  getFormattedLog(): string {
    return this.activities
      .map((a) => {
        let prefix = '';
        if (a.type === 'search') prefix = '🔍';
        if (a.type === 'tier-attempt') prefix = '⏳';
        if (a.type === 'tier-success') prefix = '✅';
        if (a.type === 'tier-timeout') prefix = '⏱️';
        if (a.type === 'tier-error') prefix = '❌';
        if (a.type === 'complete') prefix = '🎉';

        let detail = '';
        if (a.tier) detail += ` [${a.tier.toUpperCase()}]`;
        if (a.duration) detail += ` (${a.duration}ms)`;
        if (a.error) detail += ` - ${a.error}`;

        return `${a.timestamp} ${prefix} ${a.message}${detail}`;
      })
      .join('\n');
  }

  getTotalDuration(): number {
    return Date.now() - this.startTime;
  }
}
