
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface InfluencerData {
  id: string;
  name: string;
  platform: string;
  followers: number;
  engagement_rate: number;
  influence_score: number;
  recent_posts: any; // Changed from any[] to any to match Json type
}

export const useInfluencerData = () => {
  const [influencers, setInfluencers] = useState<InfluencerData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchInfluencers = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('influencer_data')
        .select('*')
        .eq('user_id', user.id)
        .order('influence_score', { ascending: false });

      if (error) {
        console.error('Error fetching influencers:', error);
        return;
      }

      // Transform the data to match our interface
      const transformedData: InfluencerData[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        platform: item.platform,
        followers: item.followers,
        engagement_rate: item.engagement_rate,
        influence_score: item.influence_score,
        recent_posts: item.recent_posts || []
      }));

      setInfluencers(transformedData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfluencers();
  }, [user]);

  return {
    influencers,
    loading,
    refetch: fetchInfluencers
  };
};
