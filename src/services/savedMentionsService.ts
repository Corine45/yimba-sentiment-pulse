import { supabase } from '@/integrations/supabase/client';
import { SavedMention } from '@/types/savedMentions';
import { MentionResult, SearchFilters } from '@/services/api/types';

export class SavedMentionsService {
  static async fetchSavedMentions(userId: string): Promise<SavedMention[]> {
    const { data, error } = await supabase
      .from('mention_saves')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform the data to match our interface with proper type safety
    const transformedData = (data || []).map(item => ({
      ...item,
      mentions_data: Array.isArray(item.mentions_data) ? 
        (item.mentions_data as unknown as MentionResult[]) : [],
      filters_applied: (item.filters_applied as unknown as SearchFilters) || {},
      export_format: (item.export_format as 'json' | 'pdf' | 'csv') || 'json'
    }));
    
    return transformedData;
  }

  static async saveMentionsToDatabase(
    userId: string,
    mentions: MentionResult[],
    keywords: string[],
    platforms: string[],
    filters: SearchFilters,
    format: 'json' | 'pdf' | 'csv',
    stats: {
      positive: number;
      neutral: number;
      negative: number;
      engagement: number;
    }
  ) {
    const fileName = `mentions_${keywords.join('_')}_${new Date().toISOString().split('T')[0]}`;

    const { data, error } = await supabase
      .from('mention_saves')
      .insert([{
        user_id: userId,
        search_keywords: keywords,
        platforms: platforms,
        total_mentions: mentions.length,
        positive_mentions: stats.positive,
        neutral_mentions: stats.neutral,
        negative_mentions: stats.negative,
        total_engagement: stats.engagement,
        mentions_data: mentions as any,
        filters_applied: filters as any,
        export_format: format,
        file_name: fileName
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, fileName };
  }

  static async deleteSavedMention(id: string) {
    const { error } = await supabase
      .from('mention_saves')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }
}
