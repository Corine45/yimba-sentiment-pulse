
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
      // Récupérer les données des différentes tables
      const [
        { data: searchResults, error: searchError },
        { data: savedSearches, error: savedError },
        { data: aiContexts, error: aiError },
        { data: profiles, error: profilesError },
        { data: geographicData, error: geoError }
      ] = await Promise.all([
        supabase.from('search_results').select('id, created_at, results_data').eq('user_id', user.id),
        supabase.from('saved_searches').select('id, created_at').eq('user_id', user.id),
        supabase.from('ai_contexts').select('id, created_at').eq('user_id', user.id),
        supabase.from('profiles').select('id, created_at'),
        supabase.from('geographic_data').select('id, created_at').eq('user_id', user.id)
      ]);

      if (searchError || savedError || aiError || profilesError || geoError) {
        console.error('Error fetching storage data:', { searchError, savedError, aiError, profilesError, geoError });
        return;
      }

      // Calculer l'utilisation approximative par catégorie
      const categories = [
        {
          category: 'Résultats de recherche',
          used: Math.floor((searchResults?.length || 0) * 0.5), // ~0.5MB par résultat
          description: 'Données de recherche et mentions',
          count: searchResults?.length || 0
        },
        {
          category: 'Contextes IA',
          used: Math.floor((aiContexts?.length || 0) * 0.1), // ~0.1MB par contexte
          description: 'Analyses générées par l\'IA',
          count: aiContexts?.length || 0
        },
        {
          category: 'Recherches sauvegardées',
          used: Math.floor((savedSearches?.length || 0) * 0.01), // ~0.01MB par recherche
          description: 'Configurations de recherche',
          count: savedSearches?.length || 0
        },
        {
          category: 'Données géographiques',
          used: Math.floor((geographicData?.length || 0) * 0.05), // ~0.05MB par point
          description: 'Informations de localisation',
          count: geographicData?.length || 0
        },
        {
          category: 'Profils utilisateurs',
          used: Math.floor((profiles?.length || 0) * 0.001), // ~0.001MB par profil
          description: 'Données des utilisateurs',
          count: profiles?.length || 0
        }
      ];

      const totalUsed = categories.reduce((sum, cat) => sum + cat.used, 0);
      const usagePercentage = Math.round((totalUsed / storageMetrics.totalAvailable) * 100);

      // Activité récente
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
      console.error('Error:', error);
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
