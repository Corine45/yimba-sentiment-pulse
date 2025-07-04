
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { MentionResult, SearchFilters } from '@/services/realApiService';
import { SavedMention } from '@/types/savedMentions';
import { SavedMentionsService } from '@/services/savedMentionsService';
import { FileGenerators } from '@/utils/fileGenerators';

export const useSavedMentions = () => {
  const [savedMentions, setSavedMentions] = useState<SavedMention[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchSavedMentions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await SavedMentionsService.fetchSavedMentions(user.id);
      setSavedMentions(data);
    } catch (error) {
      console.error('Error fetching saved mentions:', error);
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
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // Calculate statistics
      const positiveCount = mentions.filter(m => m.sentiment === 'positive').length;
      const negativeCount = mentions.filter(m => m.sentiment === 'negative').length;
      const neutralCount = mentions.filter(m => m.sentiment === 'neutral').length;
      const totalEngagement = mentions.reduce((sum, m) => 
        sum + m.engagement.likes + m.engagement.comments + m.engagement.shares, 0
      );

      const stats = {
        positive: positiveCount,
        neutral: neutralCount,
        negative: negativeCount,
        engagement: totalEngagement
      };

      // Save to database
      const { data, fileName } = await SavedMentionsService.saveMentionsToDatabase(
        user.id,
        mentions,
        keywords,
        platforms,
        filters,
        format,
        stats
      );

      // Generate file
      await FileGenerators.generateFile(mentions, keywords, platforms, format, fileName, {
        total: mentions.length,
        positive: positiveCount,
        neutral: neutralCount,
        negative: negativeCount,
        engagement: totalEngagement
      });

      // Refresh the list
      await fetchSavedMentions();

      return { success: true, data };
    } catch (error) {
      console.error('Error saving mentions:', error);
      return { success: false, error };
    }
  };

  const deleteSavedMention = async (id: string) => {
    try {
      await SavedMentionsService.deleteSavedMention(id);
      setSavedMentions(prev => prev.filter(m => m.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting saved mention:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchSavedMentions();
    }
  }, [user]);

  return {
    savedMentions,
    loading,
    saveMentions,
    deleteSavedMention,
    fetchSavedMentions
  };
};
