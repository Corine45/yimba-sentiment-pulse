
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface RealtimeDataPoint {
  id: string;
  metric_name: string;
  metric_value: any;
  timestamp: string;
}

export const useRealtimeData = () => {
  const [realtimeData, setRealtimeData] = useState<RealtimeDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRealtimeData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('realtime_data')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching realtime data:', error);
        return;
      }

      setRealtimeData(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealtimeData();
    
    // Écouter les nouvelles données en temps réel
    const channel = supabase
      .channel('realtime-data-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'realtime_data',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchRealtimeData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    realtimeData,
    loading,
    refetch: fetchRealtimeData
  };
};
