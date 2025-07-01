
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  keywords: string[];
  platforms: string[];
  language: string;
  period: string;
  filters: any;
  is_active: boolean;
  last_executed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useSavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createSavedSearch = async (searchData: Omit<SavedSearch, 'id' | 'created_at' | 'updated_at' | 'last_executed_at' | 'user_id'>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .insert([{
          ...searchData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating saved search:', error);
      return { success: false, error };
    }
  };

  const fetchSavedSearches = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedSearches(data || []);
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeSavedSearch = async (searchId: string) => {
    try {
      const { data, error } = await supabase.rpc('execute_saved_search', {
        search_id: searchId
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error executing saved search:', error);
      return { success: false, error };
    }
  };

  const deleteSavedSearch = async (searchId: string) => {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', searchId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting saved search:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchSavedSearches();
    }
  }, [user]);

  return {
    savedSearches,
    loading,
    createSavedSearch,
    fetchSavedSearches,
    executeSavedSearch,
    deleteSavedSearch
  };
};
