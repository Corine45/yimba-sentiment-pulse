
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SocialMediaPost {
  id: string;
  platform: string;
  content: string;
  author: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  reach: number;
  created_at: string;
  search_term: string;
}

export const useSocialMediaData = (searchTerm?: string) => {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialMediaData();
  }, [searchTerm]);

  const fetchSocialMediaData = async () => {
    try {
      let query = supabase
        .from('social_media_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.eq('search_term', searchTerm);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching social media data:', error);
      } else {
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { posts, loading, refetch: fetchSocialMediaData };
};
