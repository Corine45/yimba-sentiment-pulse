
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  storageUsed: number;
  storageTotal: number;
  dbConnections: number;
  maxDbConnections: number;
  activeUsers: number;
  totalRequests: number;
  averageResponseTime: number;
  uptime: string;
}

export const useSystemMetrics = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    storageUsed: 0,
    storageTotal: 10000, // 10GB en MB
    dbConnections: 0,
    maxDbConnections: 100,
    activeUsers: 0,
    totalRequests: 0,
    averageResponseTime: 0,
    uptime: "0 days"
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSystemMetrics = async () => {
    if (!user) return;
    
    try {
      // Récupérer les métriques système réelles
      const { data: systemMetrics } = await supabase
        .from('system_metrics')
        .select('*')
        .order('recorded_at', { ascending: false });

      // Calculer les utilisateurs actifs depuis les sessions
      const { data: activeSessions } = await supabase
        .from('user_sessions')
        .select('user_id')
        .eq('is_active', true);

      // Calculer les requêtes totales depuis search_results
      const { data: searchData } = await supabase
        .from('search_results')
        .select('id, created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Traiter les données de métriques système
      const processedMetrics = { ...metrics };
      
      if (systemMetrics) {
        systemMetrics.forEach(item => {
          switch (item.metric_type) {
            case 'cpu':
              processedMetrics.cpuUsage = Number(item.value);
              break;
            case 'memory':
              processedMetrics.memoryUsage = Number(item.value);
              break;
            case 'storage':
              processedMetrics.storageUsed = Number(item.value);
              break;
            case 'database':
              processedMetrics.dbConnections = Number(item.value);
              break;
            case 'network':
              processedMetrics.averageResponseTime = Number(item.value);
              break;
          }
        });
      }

      processedMetrics.activeUsers = activeSessions?.length || 0;
      processedMetrics.totalRequests = searchData?.length || 0;
      
      // Calculer l'uptime basé sur la première métrique enregistrée
      if (systemMetrics && systemMetrics.length > 0) {
        const oldestMetric = systemMetrics[systemMetrics.length - 1];
        const startTime = new Date(oldestMetric.recorded_at);
        const uptimeDays = Math.floor((Date.now() - startTime.getTime()) / (1000 * 60 * 60 * 24));
        processedMetrics.uptime = `${uptimeDays} days`;
      }

      setMetrics(processedMetrics);
    } catch (error) {
      console.error('Error fetching system metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemMetrics();
    
    // Actualiser les métriques toutes les 30 secondes
    const interval = setInterval(fetchSystemMetrics, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  return {
    metrics,
    loading,
    refetch: fetchSystemMetrics
  };
};
