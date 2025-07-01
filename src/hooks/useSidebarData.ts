
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SidebarData {
  unreadAlerts: number;
  activeSearches: number;
  pendingTasks: number;
  recentActivity: {
    type: 'search' | 'alert' | 'report';
    count: number;
    lastUpdate: string;
  }[];
  userStatus: 'online' | 'busy' | 'away' | 'offline';
  notifications: number;
}

export const useSidebarData = () => {
  const [sidebarData, setSidebarData] = useState<SidebarData>({
    unreadAlerts: 0,
    activeSearches: 0,
    pendingTasks: 0,
    recentActivity: [],
    userStatus: 'online',
    notifications: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSidebarData = async () => {
    if (!user) return;
    
    try {
      // Récupérer les recherches actives (dernières 24h)
      const { data: searchResults, error: searchError } = await supabase
        .from('search_results')
        .select('id, created_at, search_term, platform')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (searchError) {
        console.error('Error fetching search results:', searchError);
      }

      // Récupérer les recherches sauvegardées actives
      const { data: savedSearches, error: savedError } = await supabase
        .from('saved_searches')
        .select('id, name, last_executed_at, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (savedError) {
        console.error('Error fetching saved searches:', savedError);
      }

      // Récupérer les contextes IA récents
      const { data: aiContexts, error: aiError } = await supabase
        .from('ai_contexts')
        .select('id, created_at, summary')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (aiError) {
        console.error('Error fetching AI contexts:', aiError);
      }

      // Calculer les données temps réel
      const activeSearches = searchResults?.length || 0;
      const pendingTasks = savedSearches?.filter(s => 
        !s.last_executed_at || 
        new Date(s.last_executed_at).getTime() < Date.now() - 60 * 60 * 1000
      ).length || 0;

      // Simuler les alertes non lues (basé sur l'activité récente)
      const unreadAlerts = Math.max(0, Math.floor(activeSearches / 3));
      
      // Activité récente
      const recentActivity = [
        {
          type: 'search' as const,
          count: searchResults?.filter(r => 
            new Date(r.created_at).getTime() > Date.now() - 60 * 60 * 1000
          ).length || 0,
          lastUpdate: searchResults?.[0] ? getRelativeTime(new Date(searchResults[0].created_at)) : 'Aucune'
        },
        {
          type: 'alert' as const,
          count: unreadAlerts,
          lastUpdate: unreadAlerts > 0 ? 'Il y a quelques minutes' : 'Aucune'
        },
        {
          type: 'report' as const,
          count: aiContexts?.length || 0,
          lastUpdate: aiContexts?.[0] ? getRelativeTime(new Date(aiContexts[0].created_at)) : 'Aucun'
        }
      ];

      // Déterminer le statut utilisateur basé sur l'activité
      const lastActivityTime = searchResults?.[0] ? 
        new Date(searchResults[0].created_at).getTime() : 0;
      const timeSinceLastActivity = Date.now() - lastActivityTime;
      
      let userStatus: 'online' | 'busy' | 'away' | 'offline' = 'offline';
      if (timeSinceLastActivity < 5 * 60 * 1000) userStatus = 'online'; // 5 min
      else if (timeSinceLastActivity < 30 * 60 * 1000) userStatus = 'busy'; // 30 min
      else if (timeSinceLastActivity < 2 * 60 * 60 * 1000) userStatus = 'away'; // 2h

      setSidebarData({
        unreadAlerts,
        activeSearches,
        pendingTasks,
        recentActivity,
        userStatus,
        notifications: unreadAlerts + pendingTasks
      });

    } catch (error) {
      console.error('Error fetching sidebar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes}min`;
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Il y a ${diffInDays}j`;
    }
  };

  useEffect(() => {
    fetchSidebarData();
    
    // Actualiser les données toutes les minutes
    const interval = setInterval(fetchSidebarData, 60000);
    
    return () => clearInterval(interval);
  }, [user]);

  return {
    sidebarData,
    loading,
    refetch: fetchSidebarData
  };
};
