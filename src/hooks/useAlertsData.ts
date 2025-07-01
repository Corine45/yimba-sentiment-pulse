
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Alert {
  id: string;
  type: 'crisis' | 'opportunity' | 'trend';
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  platform: string;
  keywords: string[];
  user_id: string;
  created_at: string;
}

export const useAlertsData = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAlerts = async () => {
    if (!user) return;
    
    try {
      // Récupérer les données de recherche récentes pour créer des alertes dynamiques
      const { data: searchResults, error } = await supabase
        .from('search_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching search results for alerts:', error);
        return;
      }

      // Transformer les résultats de recherche en alertes intelligentes
      const dynamicAlerts: Alert[] = (searchResults || []).map((result, index) => {
        const alertTypes: Alert['type'][] = ['crisis', 'opportunity', 'trend'];
        const severities: Alert['severity'][] = ['high', 'medium', 'low'];
        
        return {
          id: `alert-${result.id}`,
          type: alertTypes[index % 3],
          message: `${result.total_mentions > 100 ? 'Pic de mentions détecté' : 'Nouvelle activité'} pour "${result.search_term}" sur ${result.platform}`,
          severity: result.total_mentions > 100 ? 'high' : result.total_mentions > 50 ? 'medium' : 'low',
          timestamp: new Date(result.created_at).toLocaleString('fr-FR'),
          platform: result.platform,
          keywords: [result.search_term],
          user_id: result.user_id,
          created_at: result.created_at
        };
      });

      setAlerts(dynamicAlerts);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [user]);

  return {
    alerts,
    loading,
    refetch: fetchAlerts
  };
};
