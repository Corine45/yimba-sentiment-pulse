
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { getRolePermissions } from '@/components/dashboard/utils/dashboardUtils';

export interface Notification {
  id: string;
  type: 'search' | 'alert' | 'system' | 'security' | 'health' | 'report';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  source: string;
  timestamp: string;
  read: boolean;
  data?: any;
  user_id: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      const permissions = getRolePermissions(user.role);
      const generatedNotifications: Notification[] = [];

      // 1. Notifications de recherche (recherches récentes)
      if (permissions.canSearch) {
        const { data: searchResults } = await supabase
          .from('search_results')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false })
          .limit(10);

        searchResults?.forEach(result => {
          const severity = result.total_mentions > 100 ? 'high' : 
                          result.total_mentions > 50 ? 'medium' : 'low';
          
          generatedNotifications.push({
            id: `search-${result.id}`,
            type: 'search',
            severity: severity as 'low' | 'medium' | 'high',
            title: 'Nouvelle recherche terminée',
            message: `Recherche "${result.search_term}" sur ${result.platform}: ${result.total_mentions} mentions trouvées`,
            source: result.platform,
            timestamp: result.created_at,
            read: false,
            data: result,
            user_id: result.user_id
          });
        });
      }

      // 2. Alertes système (événements de sécurité pour admins)
      if (user.role === 'admin') {
        const { data: securityEvents } = await supabase
          .from('security_events')
          .select('*')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false })
          .limit(5);

        securityEvents?.forEach(event => {
          generatedNotifications.push({
            id: `security-${event.id}`,
            type: 'security',
            severity: event.severity === 'critical' ? 'critical' : 
                     event.severity === 'high' ? 'high' : 'medium',
            title: 'Événement de sécurité',
            message: `${event.event_type}: ${event.event_data?.component || 'Système'}`,
            source: 'Système de sécurité',
            timestamp: event.created_at,
            read: false,
            data: event,
            user_id: user.id
          });
        });
      }

      // 3. Notifications de rapports (contextes IA récents)
      if (permissions.canGenerateReports || permissions.canAnalyze) {
        const { data: aiContexts } = await supabase
          .from('ai_contexts')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false })
          .limit(5);

        aiContexts?.forEach(context => {
          generatedNotifications.push({
            id: `report-${context.id}`,
            type: 'report',
            severity: context.confidence > 80 ? 'high' : 'medium',
            title: 'Nouveau rapport généré',
            message: `Analyse IA terminée avec ${context.confidence}% de confiance`,
            source: 'Générateur IA',
            timestamp: context.created_at,
            read: false,
            data: context,
            user_id: context.user_id
          });
        });
      }

      // 4. Alertes de veille sanitaire
      if (permissions.canAccessHealthSurveillance) {
        // Simuler des alertes sanitaires basées sur l'activité récente
        const recentActivity = generatedNotifications.filter(n => n.type === 'search').length;
        if (recentActivity > 3) {
          generatedNotifications.push({
            id: `health-alert-${Date.now()}`,
            type: 'health',
            severity: 'critical',
            title: 'Alerte sanitaire détectée',
            message: `Augmentation significative des mentions liées à la santé (${recentActivity} recherches récentes)`,
            source: 'Veille sanitaire',
            timestamp: new Date().toISOString(),
            read: false,
            data: { activity_count: recentActivity },
            user_id: user.id
          });
        }
      }

      // 5. Notifications système générales
      const { data: systemMetrics } = await supabase
        .from('system_metrics')
        .select('*')
        .eq('metric_type', 'cpu')
        .gte('recorded_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false })
        .limit(1);

      if (systemMetrics?.[0] && Number(systemMetrics[0].value) > 80) {
        generatedNotifications.push({
          id: `system-${systemMetrics[0].id}`,
          type: 'system',
          severity: 'high',
          title: 'Charge système élevée',
          message: `Utilisation CPU: ${systemMetrics[0].value}% - Surveillance requise`,
          source: 'Monitoring système',
          timestamp: systemMetrics[0].recorded_at,
          read: false,
          data: systemMetrics[0],
          user_id: user.id
        });
      }

      // Trier par timestamp (plus récent en premier)
      const sortedNotifications = generatedNotifications.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setNotifications(sortedNotifications);
      setUnreadCount(sortedNotifications.filter(n => !n.read).length);

    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  useEffect(() => {
    fetchNotifications();
    
    // Actualiser toutes les 30 secondes
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  // Écouter les changements en temps réel
  useEffect(() => {
    if (!user) return;

    const channels = [
      supabase
        .channel('search-results-changes')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'search_results',
          filter: `user_id=eq.${user.id}`
        }, () => fetchNotifications())
        .subscribe(),

      supabase
        .channel('ai-contexts-changes')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_contexts',
          filter: `user_id=eq.${user.id}`
        }, () => fetchNotifications())
        .subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [user]);

  return {
    notifications,
    loading,
    unreadCount,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};
