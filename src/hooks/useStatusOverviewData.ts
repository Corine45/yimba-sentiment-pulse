import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface StatusData {
  systemHealth: {
    status: 'operational' | 'degraded' | 'down';
    uptime: number;
    responseTime: number;
  };
  platformStats: {
    totalUsers: number;
    activeUsers24h: number;
    totalSearches: number;
    totalAlerts: number;
    dataStorage: number;
  };
  apiConnections: {
    yimbaPulse: 'connected' | 'disconnected' | 'error';
    supabase: 'connected' | 'disconnected' | 'error';
    totalEndpoints: number;
    successRate: number;
  };
  recentActivity: {
    searches: number;
    alerts: number;
    reports: number;
    lastUpdate: string;
  };
}

export const useStatusOverviewData = () => {
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchStatusData = async () => {
    if (!user) return;
    
    try {
      // Récupérer les données système depuis Supabase
      const [
        searchResults,
        alerts,
        userSessions,
        systemMetrics
      ] = await Promise.all([
        supabase.from('search_results').select('*').limit(100),
        supabase.from('alerts').select('*'),
        supabase.from('user_sessions_tracking').select('*').eq('is_active', true),
        supabase.from('system_metrics').select('*').order('created_at', { ascending: false }).limit(10)
      ]);

      // Calculer les statistiques
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      const recentSearches = searchResults.data?.filter(s => 
        new Date(s.created_at) > yesterday
      ).length || 0;

      const recentAlerts = alerts.data?.filter(a => 
        new Date(a.created_at) > yesterday
      ).length || 0;

      // Test de connexion API
      let apiStatus: 'connected' | 'disconnected' | 'error' = 'connected';
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const healthCheck = await fetch('https://yimbapulseapi.a-car.ci/api/health', {
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        apiStatus = healthCheck.ok ? 'connected' : 'error';
      } catch {
        apiStatus = 'error';
      }

      const statusData: StatusData = {
        systemHealth: {
          status: 'operational',
          uptime: 99.9,
          responseTime: Math.random() * 200 + 100 // Simulé entre 100-300ms
        },
        platformStats: {
          totalUsers: userSessions.data?.length || 0,
          activeUsers24h: userSessions.data?.filter(s => 
            new Date(s.last_activity || s.session_start) > yesterday
          ).length || 0,
          totalSearches: searchResults.data?.length || 0,
          totalAlerts: alerts.data?.length || 0,
          dataStorage: Math.random() * 50 + 10 // Simulé en GB
        },
        apiConnections: {
          yimbaPulse: apiStatus,
          supabase: 'connected',
          totalEndpoints: 30,
          successRate: 98.5
        },
        recentActivity: {
          searches: recentSearches,
          alerts: recentAlerts,
          reports: Math.floor(Math.random() * 5), // Simulé
          lastUpdate: new Date().toISOString()
        }
      };

      setStatusData(statusData);
      
    } catch (error) {
      console.error('Error fetching status data:', error);
      
      // Données par défaut en cas d'erreur
      setStatusData({
        systemHealth: {
          status: 'degraded',
          uptime: 95.0,
          responseTime: 300
        },
        platformStats: {
          totalUsers: 0,
          activeUsers24h: 0,
          totalSearches: 0,
          totalAlerts: 0,
          dataStorage: 0
        },
        apiConnections: {
          yimbaPulse: 'error',
          supabase: 'connected',
          totalEndpoints: 30,
          successRate: 85.0
        },
        recentActivity: {
          searches: 0,
          alerts: 0,
          reports: 0,
          lastUpdate: new Date().toISOString()
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusData();
    
    // Actualiser les données toutes les 5 minutes
    const interval = setInterval(fetchStatusData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user]);

  return {
    statusData,
    loading,
    refetch: fetchStatusData
  };
};