
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SavedSearch {
  id: string;
  name: string;
  keywords: string[];
  platforms: string[];
  language: string;
  period: string;
  filters: any;
  is_active: boolean;
  last_executed_at?: string;
  created_at: string;
}

export const useSavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSavedSearches();
    }
  }, [user]);

  const fetchSavedSearches = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedSearches(data || []);
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSearch = async (searchData: Omit<SavedSearch, 'id' | 'created_at' | 'last_executed_at'>) => {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .insert([searchData]);

      if (error) throw error;
      await fetchSavedSearches();
      return { success: true };
    } catch (error) {
      console.error('Error saving search:', error);
      return { success: false, error };
    }
  };

  const executeSearch = async (searchId: string) => {
    try {
      const { data, error } = await supabase.rpc('execute_saved_search', { search_id: searchId });
      
      if (error) throw error;
      await fetchSavedSearches();
      return { success: true, data };
    } catch (error) {
      console.error('Error executing search:', error);
      return { success: false, error };
    }
  };

  const deleteSearch = async (searchId: string) => {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', searchId);

      if (error) throw error;
      await fetchSavedSearches();
      return { success: true };
    } catch (error) {
      console.error('Error deleting search:', error);
      return { success: false, error };
    }
  };

  return { 
    savedSearches, 
    loading, 
    saveSearch, 
    executeSearch, 
    deleteSearch, 
    refetch: fetchSavedSearches 
  };
};
