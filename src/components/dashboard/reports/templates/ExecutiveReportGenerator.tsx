
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

export const generateExecutiveReportHTML = (data: ExecutiveReportData, config: ReportConfig): string => {
  const currentDate = new Date().toLocaleDateString('fr-FR');
  const periodLabel = config.period === '7d' ? '7 derniers jours' : 
                     config.period === '30d' ? '30 derniers jours' : '3 derniers mois';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport Exécutif YIMBA</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background: #f8fafc;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        
        .header { 
            background: linear-gradient(135deg, #2563eb, #0ea5e9);
            color: white; 
            padding: 40px 20px; 
            text-align: center;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(37, 99, 235, 0.2);
        }
        
        .header h1 { 
            font-size: 2.5rem; 
            font-weight: 700; 
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .header .subtitle { 
            font-size: 1.2rem; 
            opacity: 0.9; 
            font-weight: 300;
        }
        
        .report-info { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            margin-bottom: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            border-left: 4px solid #2563eb;
        }
        
        .section { 
            background: white; 
            margin-bottom: 30px; 
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        
        .section-header { 
            background: linear-gradient(90deg, #f1f5f9, #e2e8f0);
            padding: 20px; 
            border-bottom: 2px solid #e2e8f0;
        }
        
        .section-title { 
            color: #1e293b; 
            font-size: 1.5rem; 
            font-weight: 600;
            display: flex;
            align-items: center;
        }
        
        .section-content { padding: 30px; }
        
        .metrics-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 20px; 
            margin-bottom: 20px; 
        }
        
        .metric-card { 
            background: linear-gradient(135deg, #f8fafc, #f1f5f9);
            padding: 25px; 
            border-radius: 12px; 
            text-align: center;
            border: 1px solid #e2e8f0;
            transition: transform 0.2s ease;
        }
        
        .metric-card:hover { transform: translateY(-2px); }
        
        .metric-value { 
            font-size: 2.5rem; 
            font-weight: 700; 
            color: #2563eb; 
            margin-bottom: 8px;
        }
        
        .metric-label { 
            color: #64748b; 
            font-size: 0.95rem; 
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .sentiment-section { 
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
            padding: 25px; 
            border-radius: 12px; 
            margin: 20px 0;
        }
        
        .sentiment-bars { 
            display: flex; 
            height: 30px; 
            border-radius: 15px; 
            overflow: hidden; 
            margin: 15px 0;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .sentiment-positive { background: linear-gradient(90deg, #22c55e, #16a34a); }
        .sentiment-neutral { background: linear-gradient(90deg, #64748b, #475569); }
        .sentiment-negative { background: linear-gradient(90deg, #ef4444, #dc2626); }
        
        .sentiment-legend { 
            display: flex; 
            justify-content: space-around; 
            margin-top: 15px;
            font-weight: 500;
        }
        
        .keywords-container { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 12px; 
            margin: 20px 0;
        }
        
        .keyword-tag { 
            background: linear-gradient(135deg, #dbeafe, #bfdbfe);
            color: #1d4ed8; 
            padding: 8px 16px; 
            border-radius: 20px; 
            font-weight: 500;
            font-size: 0.9rem;
            border: 1px solid #93c5fd;
        }
        
        .trends-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 25px;
        }
        
        .trend-item { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px;
            border-left: 4px solid #2563eb;
        }
        
        .trend-indicator { margin-left: 10px; font-size: 1.2rem; }
        .trend-up { color: #22c55e; }
        .trend-down { color: #ef4444; }
        .trend-stable { color: #64748b; }
        
        .recommendations-list { 
            list-style: none; 
            counter-reset: rec-counter;
        }
        
        .recommendations-list li { 
            counter-increment: rec-counter;
            background: #f8fafc; 
            margin: 15px 0; 
            padding: 20px; 
            border-radius: 8px;
            border-left: 4px solid #2563eb;
            position: relative;
        }
        
        .recommendations-list li::before {
            content: counter(rec-counter);
            background: #2563eb;
            color: white;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            left: -12px;
            top: 20px;
            font-weight: bold;
            font-size: 0.8rem;
        }
        
        .alert-section { 
            background: linear-gradient(135deg, #fef2f2, #fee2e2);
            border: 2px solid #fecaca; 
            padding: 20px; 
            border-radius: 12px; 
            margin: 20px 0;
        }
        
        .alert-title { 
            color: #dc2626; 
            font-weight: 700; 
            font-size: 1.1rem;
            margin-bottom: 10px;
        }
        
        .footer { 
            margin-top: 50px; 
            padding: 30px; 
            background: linear-gradient(135deg, #1e293b, #334155);
            color: white; 
            text-align: center; 
            border-radius: 12px;
        }
        
        @media print {
            body { background: white; }
            .section { box-shadow: none; border: 1px solid #e2e8f0; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 YIMBA</h1>
            <div class="subtitle">Rapport Exécutif d'Analyse Émotionnelle</div>
        </div>

        <div class="report-info">
            <h3>📅 Informations du Rapport</h3>
            <p><strong>Période analysée:</strong> ${periodLabel}</p>
            <p><strong>Date de génération:</strong> ${currentDate}</p>
            <p><strong>Type:</strong> Analyse complète des sentiments et tendances</p>
        </div>

        <div class="section">
            <div class="section-header">
                <h2 class="section-title">📈 Résumé Exécutif</h2>
            </div>
            <div class="section-content">
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-value">${data.summary.totalMentions.toLocaleString()}</div>
                        <div class="metric-label">Mentions Totales</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.summary.sentimentScore}/100</div>
                        <div class="metric-label">Score de Sentiment</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.summary.engagementRate}%</div>
                        <div class="metric-label">Taux d'Engagement</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${data.summary.reachEstimate.toLocaleString()}</div>
                        <div class="metric-label">Portée Estimée</div>
                    </div>
                </div>
                
                ${data.summary.criticalAlerts > 0 ? `
                <div class="alert-section">
                    <div class="alert-title">⚠️ ${data.summary.criticalAlerts} Alerte(s) Critique(s)</div>
                    <p>Des sujets nécessitant une attention immédiate ont été détectés et nécessitent un suivi prioritaire.</p>
                </div>
                ` : ''}
            </div>
        </div>

        <div class="section">
            <div class="section-header">
                <h2 class="section-title">💭 Analyse de Sentiment</h2>
            </div>
            <div class="section-content">
                <div class="sentiment-section">
                    <div class="sentiment-bars">
                        <div class="sentiment-positive" style="width: ${data.keyMetrics.positivePercentage}%"></div>
                        <div class="sentiment-neutral" style="width: ${data.keyMetrics.neutralPercentage}%"></div>
                        <div class="sentiment-negative" style="width: ${data.keyMetrics.negativePercentage}%"></div>
                    </div>
                    <div class="sentiment-legend">
                        <span style="color: #22c55e">● Positif: ${data.keyMetrics.positivePercentage}%</span>
                        <span style="color: #64748b">● Neutre: ${data.keyMetrics.neutralPercentage}%</span>
                        <span style="color: #ef4444">● Négatif: ${data.keyMetrics.negativePercentage}%</span>
                    </div>
                </div>
                <p><strong>🕐 Pic d'engagement:</strong> ${data.keyMetrics.peakEngagementHour}</p>
            </div>
        </div>

        <div class="section">
            <div class="section-header">
                <h2 class="section-title">🔑 Mots-clés Principaux</h2>
            </div>
            <div class="section-content">
                <div class="keywords-container">
                    ${data.keyMetrics.topKeywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">
                <h2 class="section-title">📊 Tendances & Insights</h2>
            </div>
            <div class="section-content">
                <div class="trends-grid">
                    <div class="trend-item">
                        <h4>📈 Évolution du Sentiment</h4>
                        <p>Tendance: <span class="trend-indicator trend-${data.trends.sentimentTrend}">
                            ${data.trends.sentimentTrend === 'up' ? '📈 Hausse' : data.trends.sentimentTrend === 'down' ? '📉 Baisse' : '➡️ Stable'}
                        </span></p>
                    </div>
                    <div class="trend-item">
                        <h4>👥 Évolution de l'Engagement</h4>
                        <p>Tendance: <span class="trend-indicator trend-${data.trends.engagementTrend}">
                            ${data.trends.engagementTrend === 'up' ? '📈 Hausse' : data.trends.engagementTrend === 'down' ? '📉 Baisse' : '➡️ Stable'}
                        </span></p>
                    </div>
                </div>
                
                <h4>🌟 Sujets Émergents:</h4>
                <ul>
                    ${data.trends.emergingTopics.map(topic => `<li>${topic}</li>`).join('')}
                </ul>
                
                ${data.trends.riskTopics.length > 0 ? `
                <h4 style="color: #dc2626; margin-top: 20px;">⚠️ Sujets à Risque:</h4>
                <ul>
                    ${data.trends.riskTopics.map(topic => `<li style="color: #dc2626">${topic}</li>`).join('')}
                </ul>
                ` : ''}
            </div>
        </div>

        <div class="section">
            <div class="section-header">
                <h2 class="section-title">💡 Recommandations Stratégiques</h2>
            </div>
            <div class="section-content">
                <ol class="recommendations-list">
                    ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ol>
            </div>
        </div>

        <div class="footer">
            <h3>🌐 YIMBA - Plateforme d'Analyse Émotionnelle</h3>
            <p>Rapport généré le ${currentDate} | www.yimbaci.net</p>
            <p>Laboratoire d'Innovation du PNUD Côte d'Ivoire</p>
        </div>
    </div>
</body>
</html>`;
};

export const generateExecutiveReportPowerPoint = (data: ExecutiveReportData, config: ReportConfig): string => {
  const currentDate = new Date().toLocaleDateString('fr-FR');
  const periodLabel = config.period === '7d' ? '7 derniers jours' : 
                     config.period === '30d' ? '30 derniers jours' : '3 derniers mois';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Présentation YIMBA - Format PowerPoint</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; padding: 0; 
            background: #1e293b;
            color: white;
        }
        .slide { 
            width: 100vw; 
            height: 100vh; 
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 60px;
            box-sizing: border-box;
            page-break-after: always;
        }
        .slide-title { 
            background: linear-gradient(135deg, #2563eb, #0ea5e9);
        }
        .slide-content { 
            background: linear-gradient(135deg, #334155, #475569);
        }
        h1 { font-size: 4rem; margin-bottom: 20px; text-align: center; }
        h2 { font-size: 2.5rem; margin-bottom: 30px; text-align: center; color: #60a5fa; }
        h3 { font-size: 2rem; margin-bottom: 20px; color: #93c5fd; }
        .metrics-showcase { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 40px; 
            width: 100%; 
            max-width: 800px;
        }
        .big-metric { 
            text-align: center; 
            background: rgba(255,255,255,0.1); 
            padding: 40px; 
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        .big-number { 
            font-size: 4rem; 
            font-weight: bold; 
            color: #60a5fa; 
            margin-bottom: 10px;
        }
        .big-label { 
            font-size: 1.2rem; 
            opacity: 0.9;
        }
        .sentiment-visual { 
            width: 100%; 
            max-width: 600px; 
            height: 60px; 
            border-radius: 30px; 
            overflow: hidden;
            margin: 30px 0;
            display: flex;
        }
        .bullet-points { 
            font-size: 1.5rem; 
            line-height: 2; 
            max-width: 800px;
        }
        .bullet-points li { margin-bottom: 15px; }
        @media print {
            .slide { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <!-- Slide 1: Titre -->
    <div class="slide slide-title">
        <h1>📊 YIMBA</h1>
        <h2>Rapport Exécutif d'Analyse Émotionnelle</h2>
        <p style="font-size: 1.5rem; text-align: center; opacity: 0.8;">
            ${periodLabel} • ${currentDate}
        </p>
    </div>

    <!-- Slide 2: Métriques Clés -->
    <div class="slide slide-content">
        <h2>📈 Métriques Clés</h2>
        <div class="metrics-showcase">
            <div class="big-metric">
                <div class="big-number">${data.summary.totalMentions.toLocaleString()}</div>
                <div class="big-label">Mentions Totales</div>
            </div>
            <div class="big-metric">
                <div class="big-number">${data.summary.sentimentScore}/100</div>
                <div class="big-label">Score de Sentiment</div>
            </div>
            <div class="big-metric">
                <div class="big-number">${data.summary.engagementRate}%</div>
                <div class="big-label">Taux d'Engagement</div>
            </div>
            <div class="big-metric">
                <div class="big-number">${(data.summary.reachEstimate/1000).toFixed(0)}K</div>
                <div class="big-label">Portée Estimée</div>
            </div>
        </div>
    </div>

    <!-- Slide 3: Analyse de Sentiment -->
    <div class="slide slide-content">
        <h2>💭 Répartition des Sentiments</h2>
        <div class="sentiment-visual">
            <div style="background: #22c55e; width: ${data.keyMetrics.positivePercentage}%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                ${data.keyMetrics.positivePercentage}%
            </div>
            <div style="background: #64748b; width: ${data.keyMetrics.neutralPercentage}%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                ${data.keyMetrics.neutralPercentage}%
            </div>
            <div style="background: #ef4444; width: ${data.keyMetrics.negativePercentage}%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                ${data.keyMetrics.negativePercentage}%
            </div>
        </div>
        <div style="display: flex; justify-content: space-around; font-size: 1.3rem; margin-top: 30px;">
            <span style="color: #22c55e">● Positif</span>
            <span style="color: #64748b">● Neutre</span>
            <span style="color: #ef4444">● Négatif</span>
        </div>
    </div>

    <!-- Slide 4: Mots-clés -->
    <div class="slide slide-content">
        <h2>🔑 Mots-clés Principaux</h2>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; max-width: 800px;">
            ${data.keyMetrics.topKeywords.map(keyword => 
                `<span style="background: rgba(96,165,250,0.2); color: #60a5fa; padding: 15px 30px; border-radius: 25px; font-size: 1.3rem; border: 2px solid #60a5fa;">${keyword}</span>`
            ).join('')}
        </div>
        <p style="font-size: 1.2rem; margin-top: 40px; text-align: center; opacity: 0.8;">
            🕐 Pic d'engagement: ${data.keyMetrics.peakEngagementHour}
        </p>
    </div>

    <!-- Slide 5: Tendances -->
    <div class="slide slide-content">
        <h2>📊 Tendances Identifiées</h2>
        <div style="text-align: left; font-size: 1.4rem; max-width: 800px;">
            <p style="margin: 30px 0;">
                <strong>📈 Sentiment:</strong> 
                <span style="color: ${data.trends.sentimentTrend === 'up' ? '#22c55e' : data.trends.sentimentTrend === 'down' ? '#ef4444' : '#64748b'};">
                    ${data.trends.sentimentTrend === 'up' ? '📈 En hausse' : data.trends.sentimentTrend === 'down' ? '📉 En baisse' : '➡️ Stable'}
                </span>
            </p>
            <p style="margin: 30px 0;">
                <strong>👥 Engagement:</strong> 
                <span style="color: ${data.trends.engagementTrend === 'up' ? '#22c55e' : data.trends.engagementTrend === 'down' ? '#ef4444' : '#64748b'};">
                    ${data.trends.engagementTrend === 'up' ? '📈 En hausse' : data.trends.engagementTrend === 'down' ? '📉 En baisse' : '➡️ Stable'}
                </span>
            </p>
            <h3>🌟 Sujets Émergents:</h3>
            <ul class="bullet-points">
                ${data.trends.emergingTopics.map(topic => `<li>${topic}</li>`).join('')}
            </ul>
        </div>
    </div>

    <!-- Slide 6: Recommandations -->
    <div class="slide slide-content">
        <h2>💡 Recommandations Clés</h2>
        <ol class="bullet-points" style="text-align: left; max-width: 900px;">
            ${data.recommendations.slice(0, 4).map(rec => `<li>${rec}</li>`).join('')}
        </ol>
    </div>

    <!-- Slide 7: Conclusion -->
    <div class="slide slide-title">
        <h2>🌐 YIMBA</h2>
        <p style="font-size: 1.5rem; text-align: center; margin: 30px 0;">
            Laboratoire d'Innovation du PNUD Côte d'Ivoire
        </p>
        <p style="font-size: 1.2rem; text-align: center; opacity: 0.8;">
            www.yimbaci.net • ${currentDate}
        </p>
    </div>
</body>
</html>`;
};

export const generateExecutiveReportPDF = (data: ExecutiveReportData, config: ReportConfig): string => {
  // Pour le format PDF, nous utilisons une version optimisée pour l'impression
  const currentDate = new Date().toLocaleDateString('fr-FR');
  const periodLabel = config.period === '7d' ? '7 derniers jours' : 
                     config.period === '30d' ? '30 derniers jours' : '3 derniers mois';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport YIMBA - Format PDF</title>
    <style>
        @page { 
            size: A4; 
            margin: 2cm; 
        }
        body { 
            font-family: 'Times New Roman', serif; 
            line-height: 1.6; 
            color: #000; 
            background: white;
            font-size: 12pt;
        }
        .header { 
            text-align: center; 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
        }
        .header h1 { 
            font-size: 24pt; 
            color: #2563eb; 
            margin-bottom: 10px;
        }
        .section { 
            margin-bottom: 25px; 
            page-break-inside: avoid;
        }
        .section-title { 
            font-size: 16pt; 
            font-weight: bold; 
            color: #2563eb; 
            border-bottom: 1px solid #2563eb; 
            padding-bottom: 5px; 
            margin-bottom: 15px;
        }
        .metrics-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 15px 0;
        }
        .metrics-table td { 
            border: 1px solid #ddd; 
            padding: 12px; 
            text-align: center;
        }
        .metrics-table .metric-value { 
            font-size: 18pt; 
            font-weight: bold; 
            color: #2563eb;
        }
        .sentiment-bar { 
            height: 20px; 
            margin: 10px 0; 
            border: 1px solid #000;
            display: flex;
        }
        .keywords-list { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 5px;
        }
        .keyword { 
            border: 1px solid #2563eb; 
            padding: 3px 8px; 
            font-size: 10pt;
        }
        .recommendations { 
            counter-reset: item;
        }
        .recommendations li { 
            display: block; 
            margin-bottom: 10px;
        }
        .recommendations li:before { 
            content: counter(item) ". "; 
            counter-increment: item; 
            font-weight: bold;
        }
        .footer { 
            position: fixed; 
            bottom: 1cm; 
            width: 100%; 
            text-align: center; 
            font-size: 10pt; 
            color: #666;
            border-top: 1px solid #ddd; 
            padding-top: 10px;
        }
        .page-number:after { 
            content: counter(page);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>YIMBA - Rapport Exécutif</h1>
        <p><strong>Période:</strong> ${periodLabel} | <strong>Date:</strong> ${currentDate}</p>
    </div>

    <div class="section">
        <h2 class="section-title">RÉSUMÉ EXÉCUTIF</h2>
        <table class="metrics-table">
            <tr>
                <td>
                    <div class="metric-value">${data.summary.totalMentions.toLocaleString()}</div>
                    <div>Mentions Totales</div>
                </td>
                <td>
                    <div class="metric-value">${data.summary.sentimentScore}/100</div>
                    <div>Score de Sentiment</div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="metric-value">${data.summary.engagementRate}%</div>
                    <div>Taux d'Engagement</div>
                </td>
                <td>
                    <div class="metric-value">${data.summary.reachEstimate.toLocaleString()}</div>
                    <div>Portée Estimée</div>
                </td>
            </tr>
        </table>
        
        ${data.summary.criticalAlerts > 0 ? `
        <div style="border: 2px solid #ef4444; padding: 10px; background: #fef2f2; margin: 15px 0;">
            <strong style="color: #ef4444;">⚠ ${data.summary.criticalAlerts} Alerte(s) Critique(s)</strong>
            <p>Des sujets nécessitant une attention immédiate ont été détectés.</p>
        </div>
        ` : ''}
    </div>

    <div class="section">
        <h2 class="section-title">ANALYSE DE SENTIMENT</h2>
        <div class="sentiment-bar">
            <div style="background: #22c55e; width: ${data.keyMetrics.positivePercentage}%; color: white; text-align: center; line-height: 20px; font-size: 10pt;">
                ${data.keyMetrics.positivePercentage}%
            </div>
            <div style="background: #64748b; width: ${data.keyMetrics.neutralPercentage}%; color: white; text-align: center; line-height: 20px; font-size: 10pt;">
                ${data.keyMetrics.neutralPercentage}%
            </div>
            <div style="background: #ef4444; width: ${data.keyMetrics.negativePercentage}%; color: white; text-align: center; line-height: 20px; font-size: 10pt;">
                ${data.keyMetrics.negativePercentage}%
            </div>
        </div>
        <p style="font-size: 10pt;">
            ■ Positif: ${data.keyMetrics.positivePercentage}% | 
            ■ Neutre: ${data.keyMetrics.neutralPercentage}% | 
            ■ Négatif: ${data.keyMetrics.negativePercentage}%
        </p>
        <p><strong>Pic d'engagement:</strong> ${data.keyMetrics.peakEngagementHour}</p>
    </div>

    <div class="section">
        <h2 class="section-title">MOTS-CLÉS PRINCIPAUX</h2>
        <div class="keywords-list">
            ${data.keyMetrics.topKeywords.map(keyword => `<span class="keyword">${keyword}</span>`).join('')}
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">TENDANCES</h2>
        <p><strong>Évolution du sentiment:</strong> 
            ${data.trends.sentimentTrend === 'up' ? '↗ En hausse' : data.trends.sentimentTrend === 'down' ? '↘ En baisse' : '→ Stable'}
        </p>
        <p><strong>Évolution de l'engagement:</strong> 
            ${data.trends.engagementTrend === 'up' ? '↗ En hausse' : data.trends.engagementTrend === 'down' ? '↘ En baisse' : '→ Stable'}
        </p>
        
        <h3>Sujets émergents:</h3>
        <ul>
            ${data.trends.emergingTopics.map(topic => `<li>${topic}</li>`).join('')}
        </ul>
        
        ${data.trends.riskTopics.length > 0 ? `
        <h3>Sujets à risque:</h3>
        <ul>
            ${data.trends.riskTopics.map(topic => `<li>${topic}</li>`).join('')}
        </ul>
        ` : ''}
    </div>

    <div class="section">
        <h2 class="section-title">RECOMMANDATIONS STRATÉGIQUES</h2>
        <ol class="recommendations">
            ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ol>
    </div>

    <div class="footer">
        YIMBA - Laboratoire d'Innovation du PNUD Côte d'Ivoire | www.yimbaci.net | Page <span class="page-number"></span>
    </div>
</body>
</html>`;
};
