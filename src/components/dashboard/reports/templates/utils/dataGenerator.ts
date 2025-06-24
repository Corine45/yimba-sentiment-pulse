
import { ReportConfig } from "../../types/reportTypes";
import { ExecutiveReportData } from "../types/executiveReportTypes";

export const generateExecutiveReportData = (config: ReportConfig): ExecutiveReportData => {
  const periodMultiplier = config.period === '7d' ? 1 : config.period === '30d' ? 4 : 12;
  
  return {
    summary: {
      totalMentions: Math.floor((Math.random() * 5000 + 1000) * periodMultiplier),
      sentimentScore: Math.floor(Math.random() * 40 + 60),
      engagementRate: Math.floor(Math.random() * 15 + 5),
      reachEstimate: Math.floor((Math.random() * 50000 + 10000) * periodMultiplier),
      criticalAlerts: Math.floor(Math.random() * 5)
    },
    keyMetrics: {
      positivePercentage: Math.floor(Math.random() * 30 + 45),
      negativePercentage: Math.floor(Math.random() * 20 + 5),
      neutralPercentage: Math.floor(Math.random() * 25 + 15),
      topKeywords: [
        'développement', 'innovation', 'économie', 'emploi', 'santé',
        'éducation', 'infrastructure', 'gouvernance', 'digital', 'jeunesse'
      ].sort(() => 0.5 - Math.random()).slice(0, 5),
      peakEngagementHour: `${Math.floor(Math.random() * 12 + 8)}:00`
    },
    trends: {
      sentimentTrend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as any,
      engagementTrend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as any,
      emergingTopics: [
        'Intelligence artificielle', 'Développement durable', 'Inclusion financière',
        'Transformation numérique', 'Énergies renouvelables'
      ].slice(0, 3),
      riskTopics: [
        'Instabilité économique', 'Tensions sociales', 'Cybersécurité'
      ].slice(0, Math.floor(Math.random() * 3) + 1)
    },
    recommendations: [
      'Renforcer la communication positive sur les initiatives de développement',
      'Surveiller de près les sujets sensibles identifiés',
      'Optimiser la stratégie de contenu aux heures de forte engagement',
      'Développer une réponse proactive aux préoccupations émergentes',
      'Capitaliser sur les tendances positives pour améliorer l\'image'
    ]
  };
};
