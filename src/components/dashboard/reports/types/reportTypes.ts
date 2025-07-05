
export interface ReportConfig {
  title?: string;
  description?: string;
  template?: string;
  type: string;
  period: string;
  format: string;
  dateRange?: string;
  customDateRange?: {
    startDate: string;
    endDate: string;
  };
  includeRealData?: boolean;
  includeAIContext?: boolean;
  includeDemographics?: boolean;
  includeInfluencers?: boolean;
  includeGeography?: boolean;
}

export interface ReportGenerationProgress {
  isGenerating: boolean;
  progress: number;
  currentStep: string;
  estimatedTime?: number;
}

export interface GeneratedReport {
  id: string;
  title: string;
  type: string;
  format: string;
  generatedAt: string;
  fileUrl: string;
  size: string;
  status: 'completed' | 'failed';
}

export const REPORT_TYPES = {
  sentiment: 'Analyse de sentiment',
  demographic: 'Analyse démographique', 
  ai: 'Analyse IA',
  crisis: 'Rapport de crise',
  trends: 'Tendances',
  keywords: 'Fréquence mots-clés',
  custom: 'Personnalisé'
};

export const PERIODS = {
  '7d': '7 derniers jours',
  '30d': '30 derniers jours', 
  '3m': '3 derniers mois',
  'custom': 'Période personnalisée'
};

export const FORMATS = {
  pdf: 'PDF',
  powerpoint: 'PowerPoint',
  html: 'HTML'
};
