
import { ReportConfig } from "../../types/reportTypes";
import { ExecutiveReportData } from "../types/executiveReportTypes";

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
