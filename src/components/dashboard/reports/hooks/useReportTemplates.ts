
import { useState } from 'react';
import { ReportTemplate } from '../types/templateTypes';

export const useReportTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);

  const templates: ReportTemplate[] = [
    {
      id: 'executive-summary',
      name: 'Rapport Exécutif',
      description: 'Vue d\'ensemble stratégique pour la direction avec KPIs essentiels',
      category: 'executive',
      defaultConfig: {
        type: 'custom',
        period: '30d',
        format: 'pdf',
        sections: ['summary', 'key-metrics', 'trends', 'recommendations'],
        charts: ['sentiment-overview', 'engagement-stats', 'crisis-alerts']
      },
      features: ['Résumé exécutif', 'Métriques clés', 'Recommandations stratégiques'],
      estimatedSize: '3.2 MB',
      estimatedTime: '2-3 min'
    },
    {
      id: 'demographic-analysis',
      name: 'Analyse Démographique',
      description: 'Focus détaillé sur les segments démographiques et leur comportement',
      category: 'demographic',
      defaultConfig: {
        type: 'demographic',
        period: '30d',
        format: 'excel',
        sections: ['age-groups', 'geographic', 'gender', 'interests'],
        charts: ['demographic-breakdown', 'geographic-heatmap', 'interest-analysis']
      },
      features: ['Segmentation par âge', 'Analyse géographique', 'Centres d\'intérêt'],
      estimatedSize: '1.8 MB',
      estimatedTime: '1-2 min'
    },
    {
      id: 'ai-complete',
      name: 'Analyse IA Complète',
      description: 'Rapport complet utilisant tous les modules d\'intelligence artificielle',
      category: 'ai',
      defaultConfig: {
        type: 'ai',
        period: '7d',
        format: 'pdf',
        sections: ['sentiment-ai', 'topic-modeling', 'predictive-analysis', 'anomaly-detection'],
        charts: ['sentiment-trends', 'topic-clusters', 'prediction-models']
      },
      features: ['Analyse prédictive', 'Détection d\'anomalies', 'Modélisation de sujets'],
      estimatedSize: '4.5 MB',
      estimatedTime: '3-4 min'
    },
    {
      id: 'crisis-management',
      name: 'Rapport de Crise',
      description: 'Focus sur les alertes critiques et situations d\'urgence',
      category: 'crisis',
      defaultConfig: {
        type: 'crisis',
        period: '7d',
        format: 'pdf',
        sections: ['critical-alerts', 'escalation-timeline', 'impact-assessment', 'response-plan'],
        charts: ['alert-severity', 'response-time', 'impact-metrics']
      },
      features: ['Alertes critiques', 'Timeline d\'escalade', 'Plan de réponse'],
      estimatedSize: '2.1 MB',
      estimatedTime: '1-2 min'
    },
    {
      id: 'trends-keywords',
      name: 'Tendances & Mots-clés',
      description: 'Analyse approfondie des tendances émergentes et fréquences de mots-clés',
      category: 'trends',
      defaultConfig: {
        type: 'trends',
        period: '30d',
        format: 'powerpoint',
        sections: ['trending-topics', 'keyword-frequency', 'emerging-themes', 'viral-content'],
        charts: ['trend-timeline', 'keyword-cloud', 'engagement-spikes']
      },
      features: ['Sujets tendances', 'Nuage de mots-clés', 'Contenu viral'],
      estimatedSize: '8.7 MB',
      estimatedTime: '3-4 min'
    },
    {
      id: 'multimedia-analysis',
      name: 'Rapport Multimédia',
      description: 'Analyse spécialisée des contenus visuels, vidéos et médias',
      category: 'multimedia',
      defaultConfig: {
        type: 'custom',
        period: '30d',
        format: 'pdf',
        sections: ['image-analysis', 'video-metrics', 'media-engagement', 'visual-trends'],
        charts: ['media-performance', 'visual-sentiment', 'content-types']
      },
      features: ['Analyse d\'images', 'Métriques vidéo', 'Tendances visuelles'],
      estimatedSize: '12.3 MB',
      estimatedTime: '4-5 min'
    }
  ];

  const getTemplatesByCategory = (category: string) => {
    return templates.filter(template => template.category === category);
  };

  const useTemplate = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    return template.defaultConfig;
  };

  return {
    templates,
    selectedTemplate,
    getTemplatesByCategory,
    useTemplate,
    setSelectedTemplate
  };
};
