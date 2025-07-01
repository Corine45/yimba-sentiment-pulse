
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Platform {
  id: string;
  name: string;
  is_active: boolean;
  apify_actor_id?: string;
  api_key?: string;
  configuration?: any;
}

export const usePlatforms = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    try {
      console.log('Fetching platforms from database...');
      const { data, error } = await supabase
        .from('social_platforms')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching platforms:', error);
        throw error;
      }
      
      console.log('Platforms fetched:', data);
      setPlatforms(data || []);
    } catch (error) {
      console.error('Error fetching platforms:', error);
    } finally {
      setLoading(false);
    }
  };

  return { platforms, loading, refetch: fetchPlatforms };
};
