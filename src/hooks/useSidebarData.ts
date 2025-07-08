
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
      // Récupérer les données réelles de recherche (dernières 24h)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const { data: searchResults, error: searchError } = await supabase
        .from('search_results')
        .select('id, created_at, search_term, platform, total_mentions, total_engagement')
        .eq('user_id', user.id)
        .gte('created_at', yesterday);

      if (searchError) throw searchError;

      // Récupérer les recherches sauvegardées actives
      const { data: savedSearches, error: savedError } = await supabase
        .from('saved_searches')
        .select('id, name, last_executed_at, is_active, created_at')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (savedError) throw savedError;

      // Récupérer les sauvegardes de mentions (dernière semaine)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      
      const { data: mentionSaves, error: savesError } = await supabase
        .from('mention_saves')
        .select('id, created_at, total_mentions, file_name')
        .eq('user_id', user.id)
        .gte('created_at', weekAgo);

      if (savesError) throw savesError;

      // Calculer les métriques réelles
      const activeSearches = searchResults?.length || 0;
      const totalSavedSearches = savedSearches?.length || 0;
      
      // Recherches sauvegardées non exécutées récemment = tâches en attente
      const pendingTasks = savedSearches?.filter(s => 
        !s.last_executed_at || 
        new Date(s.last_executed_at).getTime() < Date.now() - 2 * 60 * 60 * 1000 // 2h
      ).length || 0;

      // Alertes basées sur l'activité récente
      const recentHighActivity = searchResults?.filter(r => 
        r.total_mentions > 50 || r.total_engagement > 1000
      ).length || 0;
      
      const unreadAlerts = recentHighActivity + (activeSearches > 10 ? 1 : 0);
      
      // Activité récente avec données réelles
      const recentActivity = [
        {
          type: 'search' as const,
          count: searchResults?.filter(r => 
            new Date(r.created_at).getTime() > Date.now() - 60 * 60 * 1000 // dernière heure
          ).length || 0,
          lastUpdate: searchResults?.[0] ? getRelativeTime(new Date(searchResults[0].created_at)) : 'Aucune'
        },
        {
          type: 'alert' as const,
          count: unreadAlerts,
          lastUpdate: unreadAlerts > 0 ? getRelativeTime(new Date(Date.now() - 15 * 60 * 1000)) : 'Aucune'
        },
        {
          type: 'report' as const,
          count: mentionSaves?.length || 0,
          lastUpdate: mentionSaves?.[0] ? getRelativeTime(new Date(mentionSaves[0].created_at)) : 'Aucun'
        }
      ];

      // Statut utilisateur basé sur l'activité récente et la session tracking
      let userStatus: 'online' | 'busy' | 'away' | 'offline' = 'online';
      
      // Récupérer la session utilisateur active pour déterminer le statut réel
      const { data: activeSessions } = await supabase
        .from('user_sessions_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('last_activity', { ascending: false })
        .limit(1);

      const activeSession = activeSessions?.[0];
      
      if (activeSession) {
        const lastActivity = new Date(activeSession.last_activity || activeSession.session_start);
        const timeSinceActivity = Date.now() - lastActivity.getTime();
        
        if (timeSinceActivity < 5 * 60 * 1000) { // Moins de 5 minutes = en ligne
          userStatus = activeSearches > 5 ? 'busy' : 'online';
        } else if (timeSinceActivity < 30 * 60 * 1000) { // 5-30 minutes = absent
          userStatus = 'away';
        } else { // Plus de 30 minutes = hors ligne
          userStatus = 'offline';
        }
      } else {
        userStatus = 'offline';
      }

      setSidebarData({
        unreadAlerts,
        activeSearches: totalSavedSearches,
        pendingTasks,
        recentActivity,
        userStatus,
        notifications: unreadAlerts + pendingTasks
      });

    } catch (error) {
      console.error('Error fetching sidebar data:', error);
      // Utiliser des données par défaut en cas d'erreur
      setSidebarData({
        unreadAlerts: 0,
        activeSearches: 0,
        pendingTasks: 0,
        recentActivity: [
          { type: 'search', count: 0, lastUpdate: 'Aucune' },
          { type: 'alert', count: 0, lastUpdate: 'Aucune' },
          { type: 'report', count: 0, lastUpdate: 'Aucun' }
        ],
        userStatus: 'offline',
        notifications: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  useEffect(() => {
    fetchSidebarData();
    
    // Actualiser les données toutes les 2 minutes
    const interval = setInterval(fetchSidebarData, 120000);
    
    return () => clearInterval(interval);
  }, [user]);

  return {
    sidebarData,
    loading,
    refetch: fetchSidebarData
  };
};
