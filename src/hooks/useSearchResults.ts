
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SearchResult {
  id: string;
  search_id: string | null;
  user_id: string;
  search_term: string;
  platform: string;
  total_mentions: number;
  positive_sentiment: number;
  negative_sentiment: number;
  neutral_sentiment: number;
  total_reach: number;
  total_engagement: number;
  results_data: any[];
  executed_at: string;
  created_at: string;
}

export const useSearchResults = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createSearchResult = async (resultData: Omit<SearchResult, 'id' | 'executed_at' | 'created_at' | 'user_id'>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      console.log('💾 Création du résultat de recherche:', resultData);
      
      const { data, error } = await supabase
        .from('search_results')
        .insert([{
          ...resultData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur lors de la création:', error);
        throw error;
      }

      console.log('✅ Résultat créé avec succès:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error creating search result:', error);
      return { success: false, error };
    }
  };

  const fetchSearchResults = useCallback(async (searchTerm?: string) => {
    if (!user) {
      console.log('❌ Utilisateur non authentifié');
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    try {
      console.log('🔍 Récupération des résultats pour:', searchTerm || 'tous les termes');
      
      let query = supabase
        .from('search_results')
        .select('*')
        .eq('user_id', user.id)
        .order('executed_at', { ascending: false });

      if (searchTerm) {
        query = query.eq('search_term', searchTerm);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Erreur lors de la récupération:', error);
        throw error;
      }
      
      console.log('📊 Résultats récupérés:', data?.length || 0);
      
      // Transformer les données pour s'assurer que results_data est un tableau
      const transformedData = (data || []).map(item => ({
        ...item,
        results_data: Array.isArray(item.results_data) ? item.results_data : []
      }));
      
      setSearchResults(transformedData);
      return { success: true, data: transformedData };
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Rechargement automatique des résultats au montage
  useEffect(() => {
    if (user) {
      fetchSearchResults();
    }
  }, [user, fetchSearchResults]);

  return { 
    searchResults, 
    loading, 
    createSearchResult, 
    fetchSearchResults 
  };
};
