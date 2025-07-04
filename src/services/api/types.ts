
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
  language?: string;
  period?: string;
  sortBy?: 'recent' | 'popular';
  sentiment?: 'positive' | 'negative' | 'neutral';
  minEngagement?: number;
  maxEngagement?: number;
  geography?: {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
  };
}

export interface CachedResult {
  data: MentionResult[];
  timestamp: number;
  filters: SearchFilters;
  keywords: string[];
  platforms: string[];
}
