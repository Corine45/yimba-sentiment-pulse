
import { MentionResult, SearchFilters } from '@/services/realApiService';

export interface SavedMention {
  id: string;
  user_id: string;
  search_keywords: string[];
  platforms: string[];
  total_mentions: number;
  positive_mentions: number;
  neutral_mentions: number;
  negative_mentions: number;
  total_engagement: number;
  mentions_data: MentionResult[];
  filters_applied: SearchFilters;
  export_format: 'json' | 'pdf' | 'csv';
  file_name: string;
  created_at: string;
  updated_at: string;
}

export interface MentionStats {
  total: number;
  positive: number;
  neutral: number;
  negative: number;
  engagement: number;
}
