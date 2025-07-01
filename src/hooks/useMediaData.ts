
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface MediaData {
  id: string;
  media_type: string;
  platform: string;
  content_url?: string;
  mentions: number;
  engagement: any;
  sentiment?: string;
}

export const useMediaData = () => {
  const [mediaData, setMediaData] = useState<MediaData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMediaData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('media_data')
        .select('*')
        .eq('user_id', user.id)
        .order('mentions', { ascending: false });

      if (error) {
        console.error('Error fetching media data:', error);
        return;
      }

      setMediaData(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaData();
  }, [user]);

  return {
    mediaData,
    loading,
    refetch: fetchMediaData
  };
};
