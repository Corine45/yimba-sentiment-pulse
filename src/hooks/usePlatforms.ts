
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
      console.log('Starting platform fetch...');
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.email);
      
      if (!user) {
        console.log('No authenticated user found');
        setPlatforms([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('social_platforms')
        .select('*')
        .eq('is_active', true)
        .order('name');

      console.log('Platform query result:', { data, error });

      if (error) {
        console.error('Error fetching platforms:', error);
        throw error;
      }
      
      console.log('Setting platforms:', data);
      setPlatforms(data || []);
    } catch (error) {
      console.error('Error in fetchPlatforms:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePlatformActorId = async (platformId: string, actorId: string) => {
    try {
      const { error } = await supabase
        .from('social_platforms')
        .update({ apify_actor_id: actorId })
        .eq('id', platformId);

      if (error) {
        console.error('Error updating platform actor ID:', error);
        return { success: false, error };
      }

      await fetchPlatforms(); // Refresh the platforms list
      return { success: true };
    } catch (error) {
      console.error('Error in updatePlatformActorId:', error);
      return { success: false, error };
    }
  };

  return { platforms, loading, refetch: fetchPlatforms, updatePlatformActorId };
};
