export interface MentionResult {
  id: string;
  platform: string;
  content: string;
  author: string;
  url: string;
  timestamp: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  sentiment?: 'positive' | 'negative' | 'neutral';
  influenceScore?: number;
  sourceUrl?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    city?: string;
    country?: string;
  };
}

export interface SearchFilters {
  sentiment?: string | string[] | 'positive' | 'negative' | 'neutral';
  influenceScore?: number;
  minEngagement?: number;
  maxEngagement?: number;
  period?: '1d' | '7d' | '30d' | '3m';
  
  sortBy?: 'recent' | 'popular' | 'engagement' | 'influence';
  
  language?: string;
  excludedLanguages?: string[];
  
  geography?: {
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    radius?: number; // en km
  };
  country?: string;
  excludedCountries?: string[];
  
  author?: string;
  domain?: string;
  tags?: string[];
  excludedTags?: string[];
  
  dateFrom?: string;
  dateTo?: string;
  
  importance?: 'all' | 'high' | 'medium' | 'low';
  visited?: 'all' | 'visited' | 'unvisited';
  
  includePageLikes?: boolean;
  includePageSearch?: boolean;
  includeComments?: boolean;
  
  minInfluenceScore?: number;
  maxInfluenceScore?: number;
}

export interface CachedResult {
  data: MentionResult[];
  timestamp: number;
  filters: SearchFilters;
  keywords: string[];
  platforms: string[];
}
