
import { useState } from 'react';
import { ReportConfig, ReportGenerationProgress, GeneratedReport } from '../types/reportTypes';

export const useReportGenerator = () => {
  const [progress, setProgress] = useState<ReportGenerationProgress>({
    isGenerating: false,
    progress: 0,
    currentStep: ''
  });

  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);

  const generateReport = async (config: ReportConfig): Promise<GeneratedReport> => {
    setProgress({
      isGenerating: true,
      progress: 0,
      currentStep: 'Initialisation...',
      estimatedTime: 60
    });

    // Simulation des étapes de génération
    const steps = [
      { step: 'Collecte des données...', progress: 20, delay: 1000 },
      { step: 'Analyse des données...', progress: 40, delay: 1500 },
      { step: 'Génération du contenu...', progress: 70, delay: 2000 },
      { step: 'Formatage du document...', progress: 90, delay: 1000 },
      { step: 'Finalisation...', progress: 100, delay: 500 }
    ];

    for (const { step, progress: stepProgress, delay } of steps) {
      setProgress(prev => ({
        ...prev,
        currentStep: step,
        progress: stepProgress
      }));
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    const newReport: GeneratedReport = {
      id: `report-${Date.now()}`,
      title: getReportTitle(config),
      type: config.type,
      format: config.format,
      generatedAt: new Date().toISOString(),
      fileUrl: '#', // URL simulée
      size: getEstimatedSize(config),
      status: 'completed'
    };

    setGeneratedReports(prev => [newReport, ...prev]);
    
    setProgress({
      isGenerating: false,
      progress: 100,
      currentStep: 'Terminé'
    });

    return newReport;
  };

  const getReportTitle = (config: ReportConfig): string => {
    const typeNames: Record<string, string> = {
      sentiment: 'Rapport Sentiment',
      demographic: 'Analyse Démographique',
      ai: 'Analyse IA',
      crisis: 'Rapport de Crise',
      trends: 'Rapport Tendances',
      keywords: 'Analyse Mots-clés',
      custom: 'Rapport Personnalisé'
    };

    const periodNames: Record<string, string> = {
      '7d': '7 jours',
      '30d': '30 jours', 
      '3m': '3 mois',
      'custom': 'Période personnalisée'
    };

    return `${typeNames[config.type]} - ${periodNames[config.period]}`;
  };

  const getEstimatedSize = (config: ReportConfig): string => {
    const baseSizes: Record<string, number> = {
      pdf: 2.5,
      excel: 1.2,
      powerpoint: 8.0
    };
    
    const multipliers: Record<string, number> = {
      '7d': 1,
      '30d': 1.5,
      '3m': 3,
      'custom': 2
    };

    const size = baseSizes[config.format] * multipliers[config.period];
    return `${size.toFixed(1)} MB`;
  };

  const cancelGeneration = () => {
    setProgress({
      isGenerating: false,
      progress: 0,
      currentStep: ''
    });
  };

  return {
    progress,
    generatedReports,
    generateReport,
    cancelGeneration
  };
};
