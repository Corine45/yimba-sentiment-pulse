
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface GeographicData {
  id: string;
  region: string;
  country: string;
  mentions: number;
  sentiment_score: number;
  coordinates?: any;
}

export const useGeographicData = () => {
  const [geographicData, setGeographicData] = useState<GeographicData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchGeographicData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('geographic_data')
        .select('*')
        .eq('user_id', user.id)
        .order('mentions', { ascending: false });

      if (error) {
        console.error('Error fetching geographic data:', error);
        return;
      }

      setGeographicData(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeographicData();
  }, [user]);

  return {
    geographicData,
    loading,
    refetch: fetchGeographicData
  };
};
