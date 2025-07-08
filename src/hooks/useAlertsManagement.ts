import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Alert {
  id: string;
  keyword: string;
  platform: string;
  threshold: number;
  alert_type: 'mention' | 'sentiment' | 'engagement';
  status: 'active' | 'inactive';
  triggered_count: number;
  last_triggered_at: string | null;
  created_at: string;
  updated_at: string;
}

interface DatabaseAlert {
  id: string;
  keyword: string;
  platform: string;
  threshold: number;
  alert_type: string;
  status: string;
  triggered_count: number;
  last_triggered_at: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useAlertsManagement = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAlerts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transformer les données de la base vers le type Alert
      const transformedAlerts: Alert[] = (data || []).map((dbAlert: DatabaseAlert) => ({
        id: dbAlert.id,
        keyword: dbAlert.keyword,
        platform: dbAlert.platform,
        threshold: dbAlert.threshold,
        alert_type: dbAlert.alert_type as 'mention' | 'sentiment' | 'engagement',
        status: dbAlert.status as 'active' | 'inactive',
        triggered_count: dbAlert.triggered_count,
        last_triggered_at: dbAlert.last_triggered_at,
        created_at: dbAlert.created_at,
        updated_at: dbAlert.updated_at
      }));
      
      setAlerts(transformedAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les alertes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async (alertData: Omit<Alert, 'id' | 'created_at' | 'updated_at' | 'triggered_count' | 'last_triggered_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('alerts')
        .insert({
          ...alertData,
          user_id: user.id,
          triggered_count: 0
        })
        .select()
        .single();

      if (error) throw error;
      
      const transformedAlert: Alert = {
        id: data.id,
        keyword: data.keyword,
        platform: data.platform,
        threshold: data.threshold,
        alert_type: data.alert_type as 'mention' | 'sentiment' | 'engagement',
        status: data.status as 'active' | 'inactive',
        triggered_count: data.triggered_count,
        last_triggered_at: data.last_triggered_at,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setAlerts(prev => [transformedAlert, ...prev]);
      toast({
        title: "Alerte créée",
        description: `Alerte créée pour "${alertData.keyword}" sur ${alertData.platform}`,
      });
      
      return data;
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'alerte",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateAlert = async (id: string, updates: Partial<Alert>) => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      
      const transformedAlert: Alert = {
        id: data.id,
        keyword: data.keyword,
        platform: data.platform,
        threshold: data.threshold,
        alert_type: data.alert_type as 'mention' | 'sentiment' | 'engagement',
        status: data.status as 'active' | 'inactive',
        triggered_count: data.triggered_count,
        last_triggered_at: data.last_triggered_at,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setAlerts(prev => prev.map(alert => 
        alert.id === id ? transformedAlert : alert
      ));
      
      return data;
    } catch (error) {
      console.error('Error updating alert:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'alerte",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      setAlerts(prev => prev.filter(alert => alert.id !== id));
      toast({
        title: "Alerte supprimée",
        description: "L'alerte a été supprimée avec succès",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'alerte",
        variant: "destructive",
      });
      return false;
    }
  };

  const toggleAlertStatus = async (id: string) => {
    const alert = alerts.find(a => a.id === id);
    if (!alert) return;

    const newStatus = alert.status === 'active' ? 'inactive' : 'active';
    return await updateAlert(id, { status: newStatus });
  };

  // Calculer les statistiques
  const getStats = () => {
    const activeAlerts = alerts.filter(alert => alert.status === 'active').length;
    const totalTriggered = alerts.reduce((sum, alert) => sum + alert.triggered_count, 0);
    const totalAlerts = alerts.length;

    return {
      activeAlerts,
      totalTriggered,
      totalAlerts
    };
  };

  useEffect(() => {
    fetchAlerts();
  }, [user]);

  return {
    alerts,
    loading,
    createAlert,
    updateAlert,
    deleteAlert,
    toggleAlertStatus,
    refetch: fetchAlerts,
    stats: getStats()
  };
};