
import { ReportConfig } from "../../types/reportTypes";
import { ExecutiveReportData } from "../types/executiveReportTypes";

export const generateExecutiveReportPDF = (data: ExecutiveReportData, config: ReportConfig): string => {
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
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #000; 
            background: white;
            font-size: 11pt;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 100%;
            margin: 0 auto;
        }
        .header { 
            text-align: center; 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
            page-break-after: avoid;
        }
        .header h1 { 
            font-size: 28pt; 
            color: #2563eb; 
            margin: 0 0 10px 0;
            font-weight: bold;
        }
        .header .subtitle {
            font-size: 14pt;
            color: #666;
            margin-bottom: 15px;
        }
        .report-meta {
            background: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #2563eb;
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        .section { 
            margin-bottom: 30px; 
            page-break-inside: avoid;
        }
        .section-title { 
            font-size: 18pt; 
            font-weight: bold; 
            color: #2563eb; 
            border-bottom: 2px solid #2563eb; 
            padding-bottom: 8px; 
            margin-bottom: 20px;
            page-break-after: avoid;
        }
        .metrics-grid { 
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        .metric-card { 
            border: 2px solid #e5e7eb;
            padding: 20px; 
            text-align: center;
            background: #f9fafb;
        }
        .metric-value { 
            font-size: 24pt; 
            font-weight: bold; 
            color: #2563eb;
            margin-bottom: 5px;
            display: block;
        }
        .metric-label {
            font-size: 10pt;
            color: #374151;
            font-weight: 600;
            text-transform: uppercase;
        }
        .sentiment-analysis {
            background: #f0f9ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .sentiment-bar { 
            height: 30px; 
            margin: 15px 0; 
            border: 1px solid #000;
            display: flex;
            overflow: hidden;
        }
        .sentiment-legend {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            font-size: 10pt;
            font-weight: bold;
        }
        .keywords-section {
            margin: 20px 0;
        }
        .keywords-grid { 
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin: 15px 0;
        }
        .keyword-item { 
            border: 1px solid #2563eb; 
            padding: 8px 12px; 
            text-align: center;
            font-size: 10pt;
            background: #eff6ff;
            color: #1d4ed8;
            font-weight: 500;
        }
        .trends-section {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 20px 0;
        }
        .trend-card {
            background: #f8fafc;
            padding: 15px;
            border-left: 4px solid #2563eb;
        }
        .trend-title {
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 8px;
        }
        .trend-value {
            font-size: 12pt;
            font-weight: bold;
        }
        .trend-up { color: #059669; }
        .trend-down { color: #dc2626; }
        .trend-stable { color: #6b7280; }
        .topics-list {
            list-style: none;
            padding: 0;
            margin: 15px 0;
        }
        .topics-list li {
            background: #f9fafb;
            padding: 8px 12px;
            margin: 5px 0;
            border-left: 3px solid #2563eb;
            font-size: 10pt;
        }
        .recommendations-section {
            page-break-inside: avoid;
        }
        .recommendations-list { 
            list-style: none;
            counter-reset: item;
            padding: 0;
        }
        .recommendations-list li { 
            counter-increment: item;
            display: block; 
            margin-bottom: 15px;
            padding: 15px;
            background: #f8fafc;
            border-left: 4px solid #2563eb;
            position: relative;
        }
        .recommendations-list li::before { 
            content: counter(item);
            background: #2563eb;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            left: -10px;
            top: 15px;
            font-weight: bold;
            font-size: 9pt;
        }
        .alert-box {
            background: #fef2f2;
            border: 2px solid #fca5a5;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .alert-title {
            color: #dc2626;
            font-weight: bold;
            font-size: 12pt;
            margin-bottom: 8px;
        }
        .footer { 
            margin-top: 40px;
            padding: 20px 0;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            font-size: 9pt;
            color: #6b7280;
            page-break-inside: avoid;
        }
        .page-break { page-break-before: always; }
        
        @media print {
            body { -webkit-print-color-adjust: exact; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 YIMBA</h1>
            <div class="subtitle">Rapport Exécutif d'Analyse Émotionnelle</div>
        </div>

        <div class="report-meta">
            <strong>Période analysée:</strong> ${periodLabel}<br>
            <strong>Date de génération:</strong> ${currentDate}<br>
            <strong>Format:</strong> Document PDF optimisé pour impression
        </div>

        <div class="section">
            <h2 class="section-title">📈 RÉSUMÉ EXÉCUTIF</h2>
            <div class="metrics-grid">
                <div class="metric-card">
                    <span class="metric-value">${data.summary.totalMentions.toLocaleString()}</span>
                    <div class="metric-label">Mentions Totales</div>
                </div>
                <div class="metric-card">
                    <span class="metric-value">${data.summary.sentimentScore}/100</span>
                    <div class="metric-label">Score de Sentiment</div>
                </div>
                <div class="metric-card">
                    <span class="metric-value">${data.summary.engagementRate}%</span>
                    <div class="metric-label">Taux d'Engagement</div>
                </div>
                <div class="metric-card">
                    <span class="metric-value">${data.summary.reachEstimate.toLocaleString()}</span>
                    <div class="metric-label">Portée Estimée</div>
                </div>
            </div>
            
            ${data.summary.criticalAlerts > 0 ? `
            <div class="alert-box">
                <div class="alert-title">⚠️ ${data.summary.criticalAlerts} Alerte(s) Critique(s)</div>
                <p>Des sujets nécessitant une attention immédiate ont été détectés.</p>
            </div>
            ` : ''}
        </div>

        <div class="section">
            <h2 class="section-title">💭 ANALYSE DE SENTIMENT</h2>
            <div class="sentiment-analysis">
                <div class="sentiment-bar">
                    <div style="background: #22c55e; width: ${data.keyMetrics.positivePercentage}%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10pt;">
                        ${data.keyMetrics.positivePercentage}%
                    </div>
                    <div style="background: #64748b; width: ${data.keyMetrics.neutralPercentage}%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10pt;">
                        ${data.keyMetrics.neutralPercentage}%
                    </div>
                    <div style="background: #ef4444; width: ${data.keyMetrics.negativePercentage}%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10pt;">
                        ${data.keyMetrics.negativePercentage}%
                    </div>
                </div>
                <div class="sentiment-legend">
                    <span style="color: #22c55e">● Positif</span>
                    <span style="color: #64748b">● Neutre</span>
                    <span style="color: #ef4444">● Négatif</span>
                </div>
                <p style="margin-top: 15px;"><strong>🕐 Pic d'engagement:</strong> ${data.keyMetrics.peakEngagementHour}</p>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">🔑 MOTS-CLÉS PRINCIPAUX</h2>
            <div class="keywords-section">
                <div class="keywords-grid">
                    ${data.keyMetrics.topKeywords.map(keyword => `<div class="keyword-item">${keyword}</div>`).join('')}
                </div>
            </div>
        </div>

        <div class="page-break"></div>

        <div class="section">
            <h2 class="section-title">📊 TENDANCES & ÉVOLUTIONS</h2>
            <div class="trends-section">
                <div class="trend-card">
                    <div class="trend-title">📈 Évolution du Sentiment</div>
                    <div class="trend-value trend-${data.trends.sentimentTrend}">
                        ${data.trends.sentimentTrend === 'up' ? '↗ En hausse' : data.trends.sentimentTrend === 'down' ? '↘ En baisse' : '→ Stable'}
                    </div>
                </div>
                <div class="trend-card">
                    <div class="trend-title">👥 Évolution de l'Engagement</div>
                    <div class="trend-value trend-${data.trends.engagementTrend}">
                        ${data.trends.engagementTrend === 'up' ? '↗ En hausse' : data.trends.engagementTrend === 'down' ? '↘ En baisse' : '→ Stable'}
                    </div>
                </div>
            </div>
            
            <h3 style="color: #2563eb; margin: 25px 0 15px 0;">🌟 Sujets Émergents</h3>
            <ul class="topics-list">
                ${data.trends.emergingTopics.map(topic => `<li>${topic}</li>`).join('')}
            </ul>
            
            ${data.trends.riskTopics.length > 0 ? `
            <h3 style="color: #dc2626; margin: 25px 0 15px 0;">⚠️ Sujets à Risque</h3>
            <ul class="topics-list">
                ${data.trends.riskTopics.map(topic => `<li style="border-left-color: #dc2626;">${topic}</li>`).join('')}
            </ul>
            ` : ''}
        </div>

        <div class="section recommendations-section">
            <h2 class="section-title">💡 RECOMMANDATIONS STRATÉGIQUES</h2>
            <ol class="recommendations-list">
                ${data.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ol>
        </div>

        <div class="footer">
            <strong>🌐 YIMBA - Laboratoire d'Innovation du PNUD Côte d'Ivoire</strong><br>
            www.yimbaci.net | Rapport généré le ${currentDate}
        </div>
    </div>
</body>
</html>`;
};
