
import { ReportConfig } from "../../types/reportTypes";
import { ExecutiveReportData } from "../types/executiveReportTypes";

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
