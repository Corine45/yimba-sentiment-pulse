
import { ReportConfig } from "../types/reportTypes";

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

export const generateExecutiveReportData = (config: ReportConfig): ExecutiveReportData => {
  // Simulation de données basées sur la période sélectionnée
  const periodMultiplier = config.period === '7d' ? 1 : config.period === '30d' ? 4 : 12;
  
  return {
    summary: {
      totalMentions: Math.floor((Math.random() * 5000 + 1000) * periodMultiplier),
      sentimentScore: Math.floor(Math.random() * 40 + 60), // 60-100 pour un score positif
      engagementRate: Math.floor(Math.random() * 15 + 5), // 5-20%
      reachEstimate: Math.floor((Math.random() * 50000 + 10000) * periodMultiplier),
      criticalAlerts: Math.floor(Math.random() * 5)
    },
    keyMetrics: {
      positivePercentage: Math.floor(Math.random() * 30 + 45), // 45-75%
      negativePercentage: Math.floor(Math.random() * 20 + 5), // 5-25%
      neutralPercentage: Math.floor(Math.random() * 25 + 15), // 15-40%
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

export const generateExecutiveReportHTML = (data: ExecutiveReportData, config: ReportConfig): string => {
  const currentDate = new Date().toLocaleDateString('fr-FR');
  const periodLabel = config.period === '7d' ? '7 derniers jours' : 
                     config.period === '30d' ? '30 derniers jours' : '3 derniers mois';

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport Exécutif YIMBA</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
        .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { color: #2563eb; font-size: 24px; font-weight: bold; }
        .report-info { color: #666; margin-top: 10px; }
        .section { margin-bottom: 30px; }
        .section-title { color: #2563eb; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-left: 4px solid #2563eb; padding-left: 10px; }
        .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .metric { background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
        .metric-label { color: #666; font-size: 14px; margin-top: 5px; }
        .sentiment-bars { display: flex; height: 20px; border-radius: 10px; overflow: hidden; margin: 10px 0; }
        .sentiment-positive { background: #22c55e; }
        .sentiment-neutral { background: #64748b; }
        .sentiment-negative { background: #ef4444; }
        .keywords { display: flex; flex-wrap: wrap; gap: 8px; }
        .keyword { background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 20px; font-size: 14px; }
        .trend-indicator { display: inline-block; margin-left: 8px; }
        .trend-up { color: #22c55e; }
        .trend-down { color: #ef4444; }
        .trend-stable { color: #64748b; }
        .recommendations li { margin-bottom: 8px; }
        .alert { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 10px 0; }
        .alert-title { color: #dc2626; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">YIMBA - Rapport Exécutif</div>
        <div class="report-info">
            Période analysée: ${periodLabel} | Généré le ${currentDate}
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">Résumé Exécutif</h2>
        <div class="metric-grid">
            <div class="metric">
                <div class="metric-value">${data.summary.totalMentions.toLocaleString()}</div>
                <div class="metric-label">Mentions totales</div>
            </div>
            <div class="metric">
                <div class="metric-value">${data.summary.sentimentScore}/100</div>
                <div class="metric-label">Score de sentiment</div>
            </div>
            <div class="metric">
                <div class="metric-value">${data.summary.engagementRate}%</div>
                <div class="metric-label">Taux d'engagement</div>
            </div>
            <div class="metric">
                <div class="metric-value">${data.summary.reachEstimate.toLocaleString()}</div>
                <div class="metric-label">Portée estimée</div>
            </div>
        </div>
        
        ${data.summary.criticalAlerts > 0 ? `
        <div class="alert">
            <div class="alert-title">⚠️ Alertes Critiques: ${data.summary.criticalAlerts}</div>
            Des sujets nécessitant une attention immédiate ont été détectés.
        </div>
        ` : ''}
    </div>

    <div class="section">
        <h2 class="section-title">Analyse de Sentiment</h2>
        <div class="sentiment-bars">
            <div class="sentiment-positive" style="width: ${data.keyMetrics.positivePercentage}%"></div>
            <div class="sentiment-neutral" style="width: ${data.keyMetrics.neutralPercentage}%"></div>
            <div class="sentiment-negative" style="width: ${data.keyMetrics.negativePercentage}%"></div>
        </div>
        <p>
            <span style="color: #22c55e">●</span> Positif: ${data.keyMetrics.positivePercentage}% |
            <span style="color: #64748b">●</span> Neutre: ${data.keyMetrics.neutralPercentage}% |
            <span style="color: #ef4444">●</span> Négatif: ${data.keyMetrics.negativePercentage}%
        </p>
    </div>

    <div class="section">
        <h2 class="section-title">Mots-clés Principaux</h2>
        <div class="keywords">
            ${data.keyMetrics.topKeywords.map(keyword => `<span class="keyword">${keyword}</span>`).join('')}
        </div>
        <p><strong>Pic d'engagement:</strong> ${data.keyMetrics.peakEngagementHour}</p>
    </div>

    <div class="section">
        <h2 class="section-title">Tendances</h2>
        <p>
            <strong>Sentiment:</strong> 
            <span class="trend-indicator trend-${data.trends.sentimentTrend}">
                ${data.trends.sentimentTrend === 'up' ? '📈' : data.trends.sentimentTrend === 'down' ? '📉' : '➡️'}
            </span>
        </p>
        <p>
            <strong>Engagement:</strong>
            <span class="trend-indicator trend-${data.trends.engagementTrend}">
                ${data.trends.engagementTrend === 'up' ? '📈' : data.trends.engagementTrend === 'down' ? '📉' : '➡️'}
            </span>
        </p>
        
        <h3>Sujets Émergents:</h3>
        <ul>
            ${data.trends.emergingTopics.map(topic => `<li>${topic}</li>`).join('')}
        </ul>
        
        ${data.trends.riskTopics.length > 0 ? `
        <h3>Sujets à Risque:</h3>
        <ul>
            ${data.trends.riskTopics.map(topic => `<li style="color: #dc2626">${topic}</li>`).join('')}
        </ul>
        ` : ''}
    </div>

    <div class="section">
        <h2 class="section-title">Recommandations Stratégiques</h2>
        <ol class="recommendations">
            ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ol>
    </div>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #666; font-size: 12px;">
        Rapport généré par YIMBA - Plateforme d'analyse émotionnelle | ${currentDate}
    </div>
</body>
</html>
  `;
};
