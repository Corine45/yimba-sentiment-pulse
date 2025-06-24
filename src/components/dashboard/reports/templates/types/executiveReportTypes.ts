
export interface ExecutiveReportData {
  summary: {
    totalMentions: number;
    sentimentScore: number;
    engagementRate: number;
    reachEstimate: number;
    criticalAlerts: number;
  };
  keyMetrics: {
    positivePercentage: number;
    negativePercentage: number;
    neutralPercentage: number;
    topKeywords: string[];
    peakEngagementHour: string;
  };
  trends: {
    sentimentTrend: 'up' | 'down' | 'stable';
    engagementTrend: 'up' | 'down' | 'stable';
    emergingTopics: string[];
    riskTopics: string[];
  };
  recommendations: string[];
}
