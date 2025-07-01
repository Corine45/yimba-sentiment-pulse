
import { supabase } from '@/integrations/supabase/client';
import { SystemSettings } from '@/types/systemSettings';

export const systemMetricsService = {
  async insertMetric(metricType: string, value: number, unit: string = '') {
    try {
      const { error } = await supabase
        .from('system_metrics')
        .insert({
          metric_type: metricType,
          value: value,
          unit: unit
        });

      if (error) {
        console.error('Erreur lors de l\'insertion de métrique:', error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'insertion de métrique:', error);
    }
  },

  async loadSettings(): Promise<SystemSettings | null> {
    try {
      const { data: configData, error } = await supabase
        .from('system_metrics')
        .select('*')
        .eq('metric_type', 'system_config')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors du chargement des paramètres:', error);
        return null;
      }

      if (configData?.metadata) {
        try {
          const parsedSettings = typeof configData.metadata === 'string' 
            ? JSON.parse(configData.metadata) 
            : configData.metadata;
          
          return parsedSettings as SystemSettings;
        } catch (parseError) {
          console.error('Erreur lors du parsing des paramètres:', parseError);
        }
      }

      return null;
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      return null;
    }
  },

  async saveSettings(settings: SystemSettings): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('system_metrics')
        .upsert({
          metric_type: 'system_config',
          value: 1,
          unit: 'config',
          metadata: JSON.stringify(settings)
        });

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return false;
    }
  }
};
