
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { MentionResult, SearchFilters } from '@/services/api/types';
import { SavedMention } from '@/types/savedMentions';
import { FileGenerators } from '@/utils/fileGenerators';

export const useSavedMentions = () => {
  const [savedMentions, setSavedMentions] = useState<SavedMention[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchSavedMentions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mention_saves')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match SavedMention interface
      const transformedData: SavedMention[] = (data || []).map(item => ({
        ...item,
        mentions_data: Array.isArray(item.mentions_data) ? item.mentions_data as MentionResult[] : [],
        filters_applied: (item.filters_applied as SearchFilters) || {}
      }));
      
      setSavedMentions(transformedData);
    } catch (error) {
      console.error('Error fetching saved mentions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer l'historique des sauvegardes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveMentions = async (
    mentions: MentionResult[],
    keywords: string[],
    platforms: string[],
    filters: SearchFilters,
    format: 'json' | 'pdf' | 'csv' = 'json'
  ) => {
    if (!user) return { success: false };

    try {
      const stats = {
        total: mentions.length,
        positive: mentions.filter(m => m.sentiment === 'positive').length,
        neutral: mentions.filter(m => m.sentiment === 'neutral').length,
        negative: mentions.filter(m => m.sentiment === 'negative').length,
        engagement: mentions.reduce((sum, m) => 
          sum + m.engagement.likes + m.engagement.comments + m.engagement.shares, 0
        )
      };

      const { data, error } = await supabase
        .from('mention_saves')
        .insert({
          search_keywords: keywords,
          platforms: platforms,
          total_mentions: stats.total,
          positive_mentions: stats.positive,
          neutral_mentions: stats.neutral,
          negative_mentions: stats.negative,
          total_engagement: stats.engagement,
          mentions_data: mentions,
          filters_applied: filters,
          export_format: format,
          file_name: `mentions_${new Date().toISOString().split('T')[0]}_${stats.total}`
        })
        .select()
        .single();

      if (error) throw error;

      await fetchSavedMentions();
      return { success: true, data };
    } catch (error) {
      console.error('Error saving mentions:', error);
      return { success: false, error };
    }
  };

  const saveMentionData = async (
    mentionData: SavedMention,
    format: 'json' | 'pdf' | 'csv' = 'json'
  ) => {
    try {
      const stats = {
        total: mentionData.total_mentions,
        positive: mentionData.positive_mentions,
        neutral: mentionData.neutral_mentions,
        negative: mentionData.negative_mentions,
        engagement: mentionData.total_engagement
      };

      await FileGenerators.generateFile(
        mentionData.mentions_data,
        mentionData.search_keywords,
        mentionData.platforms,
        format,
        mentionData.file_name,
        stats
      );

      toast({
        title: "Téléchargement réussi",
        description: `Le fichier ${format.toUpperCase()} a été téléchargé avec succès`,
      });

      return { success: true };
    } catch (error) {
      console.error('Error downloading mentions:', error);
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger le fichier",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteSavedMention = async (id: string) => {
    if (!user) return { success: false };

    try {
      const { error } = await supabase
        .from('mention_saves')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSavedMentions(prev => prev.filter(mention => mention.id !== id));
      
      toast({
        title: "Suppression réussie",
        description: "La sauvegarde a été supprimée avec succès",
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting saved mention:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la sauvegarde",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchSavedMentions();
  }, [user]);

  return {
    savedMentions,
    loading,
    saveMentions,
    saveMentionData,
    deleteSavedMention,
    fetchSavedMentions
  };
};
