
import { ReportConfig } from "../../types/reportTypes";
import { ExecutiveReportData } from "../types/executiveReportTypes";

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
