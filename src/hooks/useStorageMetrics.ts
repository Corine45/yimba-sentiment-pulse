
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface StorageMetrics {
  totalUsed: number;
  totalAvailable: number;
  usagePercentage: number;
  categories: Array<{
    category: string;
    used: number;
    description: string;
    count: number;
  }>;
  recentActivity: Array<{
    type: string;
    count: number;
    lastUpdate: string;
  }>;
}

export const useStorageMetrics = () => {
  const [storageMetrics, setStorageMetrics] = useState<StorageMetrics>({
    totalUsed: 0,
    totalAvailable: 10000, // 10GB en MB
    usagePercentage: 0,
    categories: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchStorageMetrics = async () => {
    if (!user) return;
    
    try {
      // Récupérer les métriques de stockage réelles depuis system_metrics
      const { data: storageData } = await supabase
        .from('system_metrics')
        .select('*')
        .eq('metric_type', 'storage')
        .order('recorded_at', { ascending: false })
        .limit(1);

      // Récupérer les données pour calculer l'utilisation par catégorie
      const [
        { data: searchResults },
        { data: savedSearches },
        { data: aiContexts },
        { data: profiles },
        { data: geographicData }
      ] = await Promise.all([
        supabase.from('search_results').select('id, created_at, results_data').eq('user_id', user.id),
        supabase.from('saved_searches').select('id, created_at').eq('user_id', user.id),
        supabase.from('ai_contexts').select('id, created_at').eq('user_id', user.id),
        supabase.from('profiles').select('id, created_at'),
        supabase.from('geographic_data').select('id, created_at').eq('user_id', user.id)
      ]);

      // Calculer l'utilisation réelle par catégorie
      const categories = [
        {
          category: 'Résultats de recherche',
          used: searchResults?.length ? Math.ceil(searchResults.length * 0.3) : 0, // Estimation plus réaliste
          description: 'Données de recherche et mentions',
          count: searchResults?.length || 0
        },
        {
          category: 'Contextes IA',
          used: aiContexts?.length ? Math.ceil(aiContexts.length * 0.08) : 0,
          description: 'Analyses générées par l\'IA',
          count: aiContexts?.length || 0
        },
        {
          category: 'Recherches sauvegardées',
          used: savedSearches?.length ? Math.ceil(savedSearches.length * 0.005) : 0,
          description: 'Configurations de recherche',
          count: savedSearches?.length || 0
        },
        {
          category: 'Données géographiques',
          used: geographicData?.length ? Math.ceil(geographicData.length * 0.02) : 0,
          description: 'Informations de localisation',
          count: geographicData?.length || 0
        },
        {
          category: 'Profils utilisateurs',
          used: profiles?.length ? Math.ceil(profiles.length * 0.001) : 0,
          description: 'Données des utilisateurs',
          count: profiles?.length || 0
        }
      ];

      // Utiliser les données réelles de system_metrics si disponibles
      const totalUsed = storageData?.[0] 
        ? Number(storageData[0].value) 
        : categories.reduce((sum, cat) => sum + cat.used, 0);

      const usagePercentage = Math.round((totalUsed / storageMetrics.totalAvailable) * 100);

      // Activité récente basée sur les vraies données
      const recentActivity = [
        {
          type: 'Nouvelles recherches',
          count: searchResults?.filter(r => 
            new Date(r.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
          ).length || 0,
          lastUpdate: 'Dernière semaine'
        },
        {
          type: 'Contextes IA générés',
          count: aiContexts?.filter(c => 
            new Date(c.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
          ).length || 0,
          lastUpdate: 'Dernière semaine'
        },
        {
          type: 'Recherches sauvegardées',
          count: savedSearches?.filter(s => 
            new Date(s.created_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
          ).length || 0,
          lastUpdate: 'Dernier mois'
        }
      ];

      setStorageMetrics({
        totalUsed,
        totalAvailable: storageMetrics.totalAvailable,
        usagePercentage,
        categories,
        recentActivity
      });

    } catch (error) {
      console.error('Error fetching storage metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorageMetrics();
    
    // Actualiser les données toutes les 5 minutes
    const interval = setInterval(fetchStorageMetrics, 300000);
    
    return () => clearInterval(interval);
  }, [user]);

  return {
    storageMetrics,
    loading,
    refetch: fetchStorageMetrics
  };
};
