
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SystemSettings, defaultSettings } from '@/types/systemSettings';
import { systemMetricsService } from '@/services/systemMetricsService';
import { useSystemStats } from '@/hooks/useSystemStats';

export const useSystemSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const { stats, refreshStats } = useSystemStats();

  const loadSettings = async () => {
    try {
      const loadedSettings = await systemMetricsService.loadSettings();
      
      if (loadedSettings) {
        setSettings({
          ...defaultSettings,
          ...loadedSettings
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: SystemSettings) => {
    try {
      setLoading(true);

      const success = await systemMetricsService.saveSettings(newSettings);

      if (success) {
        setSettings(newSettings);
        
        toast({
          title: "Paramètres sauvegardés",
          description: "La configuration système a été mise à jour avec succès.",
        });
      } else {
        throw new Error('Échec de la sauvegarde');
      }

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const insertMetric = async (metricType: string, value: number, unit: string = '') => {
    await systemMetricsService.insertMetric(metricType, value, unit);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    stats,
    loading,
    saveSettings,
    refreshStats,
    insertMetric
  };
};

// Re-export types for backward compatibility
export type { SystemSettings, SystemStats } from '@/types/systemSettings';
