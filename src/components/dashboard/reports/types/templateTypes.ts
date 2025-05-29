
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'executive' | 'demographic' | 'ai' | 'crisis' | 'trends' | 'multimedia';
  previewImage?: string;
  defaultConfig: {
    type: string;
    period: string;
    format: string;
    sections: string[];
    charts: string[];
  };
  features: string[];
  estimatedSize: string;
  estimatedTime: string;
}

export const TEMPLATE_CATEGORIES = {
  executive: 'Exécutif',
  demographic: 'Démographique',
  ai: 'Intelligence Artificielle',
  crisis: 'Gestion de crise',
  trends: 'Tendances',
  multimedia: 'Multimédia'
};
