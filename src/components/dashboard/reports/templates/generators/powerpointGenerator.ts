
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
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: #0f172a;
            color: white;
            overflow-x: hidden;
        }
        .slide-container {
            scroll-snap-type: y mandatory;
            overflow-y: scroll;
            height: 100vh;
        }
        .slide { 
            width: 100vw; 
            height: 100vh; 
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 80px 60px;
            box-sizing: border-box;
            scroll-snap-align: start;
            position: relative;
        }
        .slide::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.1;
            background: radial-gradient(circle at 50% 50%, #3b82f6, transparent 70%);
            pointer-events: none;
        }
        .slide-title { 
            background: linear-gradient(135deg, #1e40af, #3b82f6, #06b6d4);
            position: relative;
        }
        .slide-content { 
            background: linear-gradient(135deg, #1e293b, #334155, #475569);
            position: relative;
        }
        .slide-dark {
            background: linear-gradient(135deg, #0f172a, #1e293b);
            position: relative;
        }
        h1 { 
            font-size: 5rem; 
            margin-bottom: 30px; 
            text-align: center; 
            font-weight: 800;
            background: linear-gradient(45deg, #60a5fa, #34d399, #fbbf24);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 0 30px rgba(96, 165, 250, 0.5);
        }
        h2 { 
            font-size: 3.5rem; 
            margin-bottom: 40px; 
            text-align: center; 
            color: #60a5fa;
            font-weight: 700;
            text-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
        }
        h3 { 
            font-size: 2.2rem; 
            margin-bottom: 25px; 
            color: #93c5fd;
            font-weight: 600;
        }
        .subtitle {
            font-size: 1.8rem;
            text-align: center;
            opacity: 0.9;
            font-weight: 300;
            margin-bottom: 20px;
        }
        .slide-number {
            position: absolute;
            bottom: 30px;
            right: 30px;
            font-size: 1.2rem;
            opacity: 0.7;
            color: #94a3b8;
        }
        .metrics-showcase { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 50px; 
            width: 100%; 
            max-width: 1000px;
            margin: 20px 0;
        }
        .big-metric { 
            text-align: center; 
            background: rgba(255,255,255,0.08); 
            padding: 50px 30px; 
            border-radius: 25px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .big-metric::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(96, 165, 250, 0.1), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .big-metric:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(96, 165, 250, 0.2);
        }
        .big-metric:hover::before {
            opacity: 1;
        }
        .big-number { 
            font-size: 4.5rem; 
            font-weight: 900; 
            background: linear-gradient(45deg, #60a5fa, #34d399);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 15px;
            display: block;
        }
        .big-label { 
            font-size: 1.4rem; 
            opacity: 0.9;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .sentiment-visual { 
            width: 100%; 
            max-width: 800px; 
            height: 80px; 
            border-radius: 40px; 
            overflow: hidden;
            margin: 40px 0;
            display: flex;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            border: 2px solid rgba(255,255,255,0.1);
        }
        .sentiment-legend {
            display: flex;
            justify-content: space-around;
            font-size: 1.6rem;
            margin-top: 30px;
            font-weight: 600;
        }
        .keywords-showcase {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 25px;
            max-width: 1000px;
            margin: 30px 0;
        }
        .keyword-bubble {
            background: linear-gradient(135deg, rgba(96,165,250,0.2), rgba(56,189,248,0.3));
            color: #60a5fa;
            padding: 20px 35px;
            border-radius: 50px;
            font-size: 1.6rem;
            font-weight: 600;
            border: 2px solid rgba(96,165,250,0.4);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            text-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
        }
        .keyword-bubble:hover {
            transform: scale(1.1);
            box-shadow: 0 0 25px rgba(96, 165, 250, 0.4);
        }
        .trends-display {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 60px;
            max-width: 900px;
            width: 100%;
        }
        .trend-card {
            background: rgba(255,255,255,0.05);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255,255,255,0.1);
        }
        .trend-title {
            font-size: 1.8rem;
            margin-bottom: 20px;
            color: #93c5fd;
            font-weight: 600;
        }
        .trend-indicator {
            font-size: 3rem;
            font-weight: bold;
            margin: 15px 0;
        }
        .trend-up { color: #22c55e; text-shadow: 0 0 15px rgba(34, 197, 94, 0.5); }
        .trend-down { color: #ef4444; text-shadow: 0 0 15px rgba(239, 68, 68, 0.5); }
        .trend-stable { color: #64748b; text-shadow: 0 0 15px rgba(100, 116, 139, 0.5); }
        .topics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            max-width: 1000px;
            width: 100%;
            margin: 30px 0;
        }
        .topic-item {
            background: rgba(255,255,255,0.08);
            padding: 25px;
            border-radius: 15px;
            border-left: 4px solid #60a5fa;
            backdrop-filter: blur(10px);
            font-size: 1.3rem;
            transition: transform 0.2s ease;
        }
        .topic-item:hover {
            transform: translateX(10px);
        }
        .recommendations-showcase {
            max-width: 1100px;
            width: 100%;
            text-align: left;
        }
        .recommendation-item {
            background: rgba(255,255,255,0.06);
            margin: 25px 0;
            padding: 30px;
            border-radius: 15px;
            border-left: 5px solid #60a5fa;
            backdrop-filter: blur(15px);
            font-size: 1.4rem;
            line-height: 1.6;
            position: relative;
            counter-increment: rec-counter;
        }
        .recommendation-item::before {
            content: counter(rec-counter);
            position: absolute;
            left: -15px;
            top: 30px;
            background: linear-gradient(135deg, #60a5fa, #3b82f6);
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1rem;
            box-shadow: 0 0 15px rgba(96, 165, 250, 0.4);
        }
        .recommendations-showcase {
            counter-reset: rec-counter;
        }
        .final-slide {
            background: linear-gradient(135deg, #1e40af, #3730a3, #581c87);
            text-align: center;
        }
        .logo-section {
            margin: 40px 0;
        }
        .contact-info {
            font-size: 1.3rem;
            opacity: 0.9;
            line-height: 1.8;
        }
        @media (max-width: 768px) {
            .slide { padding: 40px 30px; }
            h1 { font-size: 3rem; }
            h2 { font-size: 2.5rem; }
            .metrics-showcase { grid-template-columns: 1fr; gap: 30px; }
            .big-number { font-size: 3rem; }
            .trends-display { grid-template-columns: 1fr; gap: 30px; }
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <!-- Slide 1: Titre -->
        <div class="slide slide-title">
            <h1>📊 YIMBA</h1>
            <div class="subtitle">Rapport Exécutif d'Analyse Émotionnelle</div>
            <p style="font-size: 1.6rem; text-align: center; opacity: 0.8; margin-top: 30px;">
                ${periodLabel} • ${currentDate}
            </p>
            <div class="slide-number">1/7</div>
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
            <div class="slide-number">2/7</div>
        </div>

        <!-- Slide 3: Analyse de Sentiment -->
        <div class="slide slide-dark">
            <h2>💭 Répartition des Sentiments</h2>
            <div class="sentiment-visual">
                <div style="background: linear-gradient(135deg, #22c55e, #16a34a); width: ${data.keyMetrics.positivePercentage}%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.4rem;">
                    ${data.keyMetrics.positivePercentage}%
                </div>
                <div style="background: linear-gradient(135deg, #64748b, #475569); width: ${data.keyMetrics.neutralPercentage}%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.4rem;">
                    ${data.keyMetrics.neutralPercentage}%
                </div>
                <div style="background: linear-gradient(135deg, #ef4444, #dc2626); width: ${data.keyMetrics.negativePercentage}%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.4rem;">
                    ${data.keyMetrics.negativePercentage}%
                </div>
            </div>
            <div class="sentiment-legend">
                <span style="color: #22c55e">● Positif</span>
                <span style="color: #64748b">● Neutre</span>
                <span style="color: #ef4444">● Négatif</span>
            </div>
            <p style="font-size: 1.4rem; margin-top: 40px; text-align: center; opacity: 0.9;">
                🕐 Pic d'engagement: <strong>${data.keyMetrics.peakEngagementHour}</strong>
            </p>
            <div class="slide-number">3/7</div>
        </div>

        <!-- Slide 4: Mots-clés -->
        <div class="slide slide-content">
            <h2>🔑 Mots-clés Principaux</h2>
            <div class="keywords-showcase">
                ${data.keyMetrics.topKeywords.map(keyword => 
                    `<div class="keyword-bubble">${keyword}</div>`
                ).join('')}
            </div>
            <div class="slide-number">4/7</div>
        </div>

        <!-- Slide 5: Tendances -->
        <div class="slide slide-dark">
            <h2>📊 Tendances Identifiées</h2>
            <div class="trends-display">
                <div class="trend-card">
                    <div class="trend-title">📈 Sentiment</div>
                    <div class="trend-indicator trend-${data.trends.sentimentTrend}">
                        ${data.trends.sentimentTrend === 'up' ? '📈' : data.trends.sentimentTrend === 'down' ? '📉' : '➡️'}
                    </div>
                    <div style="font-size: 1.3rem; margin-top: 10px;">
                        ${data.trends.sentimentTrend === 'up' ? 'En hausse' : data.trends.sentimentTrend === 'down' ? 'En baisse' : 'Stable'}
                    </div>
                </div>
                <div class="trend-card">
                    <div class="trend-title">👥 Engagement</div>
                    <div class="trend-indicator trend-${data.trends.engagementTrend}">
                        ${data.trends.engagementTrend === 'up' ? '📈' : data.trends.engagementTrend === 'down' ? '📉' : '➡️'}
                    </div>
                    <div style="font-size: 1.3rem; margin-top: 10px;">
                        ${data.trends.engagementTrend === 'up' ? 'En hausse' : data.trends.engagementTrend === 'down' ? 'En baisse' : 'Stable'}
                    </div>
                </div>
            </div>
            <h3 style="margin-top: 50px;">🌟 Sujets Émergents</h3>
            <div class="topics-grid">
                ${data.trends.emergingTopics.map(topic => `<div class="topic-item">${topic}</div>`).join('')}
            </div>
            <div class="slide-number">5/7</div>
        </div>

        <!-- Slide 6: Recommandations -->
        <div class="slide slide-content">
            <h2>💡 Recommandations Clés</h2>
            <div class="recommendations-showcase">
                ${data.recommendations.slice(0, 4).map(rec => `<div class="recommendation-item">${rec}</div>`).join('')}
            </div>
            <div class="slide-number">6/7</div>
        </div>

        <!-- Slide 7: Conclusion -->
        <div class="slide final-slide">
            <div class="logo-section">
                <h1 style="font-size: 4rem; margin-bottom: 20px;">🌐 YIMBA</h1>
                <h2 style="font-size: 2rem; margin-bottom: 40px;">Laboratoire d'Innovation</h2>
            </div>
            <div class="contact-info">
                <p><strong>PNUD Côte d'Ivoire</strong></p>
                <p>www.yimbaci.net</p>
                <p style="margin-top: 30px; font-size: 1.1rem; opacity: 0.8;">
                    Rapport généré le ${currentDate}
                </p>
            </div>
            <div class="slide-number">7/7</div>
        </div>
    </div>

    <script>
        // Navigation au clavier pour les slides
        document.addEventListener('keydown', function(e) {
            const container = document.querySelector('.slide-container');
            const slideHeight = window.innerHeight;
            
            if (e.key === 'ArrowDown' || e.key === ' ') {
                e.preventDefault();
                container.scrollBy(0, slideHeight);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                container.scrollBy(0, -slideHeight);
            }
        });
        
        // Auto-scroll smooth
        document.querySelector('.slide-container').style.scrollBehavior = 'smooth';
    </script>
</body>
</html>`;
};
