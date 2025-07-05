import { PlatformTransformers } from './api/platformTransformers';
import { MentionResult, SearchFilters, CachedResult } from './api/types';

const CACHE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

export default class RealApiService {
  private baseUrl: string;
  private cache: Map<string, CachedResult>;

  constructor() {
    this.baseUrl = 'https://yimbapulseapi.a-car.ci';
    this.cache = new Map();
  }

  private generateCacheKey(keywords: string[], platforms: string[], filters: SearchFilters): string {
    const sortedKeywords = [...keywords].sort().join(',');
    const sortedPlatforms = [...platforms].sort().join(',');
    const filterString = JSON.stringify(filters);
    return `${sortedKeywords}-${sortedPlatforms}-${filterString}`;
  }

  private checkCache(cacheKey: string): CachedResult | undefined {
    const cachedData = this.cache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY_MS) {
      console.log('📦 Données trouvées dans le cache');
      return cachedData;
    }
    return undefined;
  }

  clearCache(): void {
    this.cache.clear();
    console.log('🧹 Cache vidé manuellement');
  }

  async searchWithCache(
    keywords: string[],
    platforms: string[],
    filters: SearchFilters = {}
  ): Promise<{ results: MentionResult[], fromCache: boolean, platformCounts: { [key: string]: number } }> {
    const cacheKey = this.generateCacheKey(keywords, platforms, filters);
    const cachedResult = this.checkCache(cacheKey);

    if (cachedResult) {
      console.log('✅ Récupération des résultats depuis le cache');
      return {
        results: cachedResult.data,
        fromCache: true,
        platformCounts: cachedResult.platforms.reduce((acc, platform) => {
          acc[platform] = cachedResult.data.filter(item => item.platform === platform).length;
          return acc;
        }, {} as { [key: string]: number })
      };
    }

    try {
      console.log('🚀 RECHERCHE API BACKEND ENRICHIE - HARMONISATION COMPLÈTE');
      
      const allResults: MentionResult[] = [];
      const platformCounts: { [key: string]: number } = {};
      
      for (const platform of platforms) {
        console.log(`\n🔍 TRAITEMENT PLATEFORME: ${platform.toUpperCase()}`);
        
        try {
          let platformResults: MentionResult[] = [];
          
          switch (platform.toLowerCase()) {
            case 'facebook':
              platformResults = await this.searchFacebookEnriched(keywords, filters);
              break;
            case 'instagram':
              platformResults = await this.searchInstagramEnriched(keywords, filters);
              break;
            case 'twitter':
            case 'x-post':
              platformResults = await this.searchTwitterEnriched(keywords, filters);
              break;
            case 'youtube':
              platformResults = await this.searchYouTubeEnriched(keywords, filters);
              break;
            case 'google':
              platformResults = await this.searchGoogleEnriched(keywords, filters);
              break;
            case 'web':
              platformResults = await this.searchWebEnriched(keywords, filters);
              break;
            default:
              console.warn(`⚠️ Plateforme non supportée: ${platform}`);
          }

          if (platformResults.length > 0) {
            allResults.push(...platformResults);
            platformCounts[platform] = platformResults.length;
          } else {
            platformCounts[platform] = 0;
          }
          
        } catch (error) {
          console.error(`❌ Erreur ${platform}:`, error);
          platformCounts[platform] = 0;
        }
      }

      const filteredResults = this.applyAdvancedFilters(allResults, filters);
      
      this.cache.set(cacheKey, {
        data: filteredResults,
        timestamp: Date.now(),
        filters,
        keywords,
        platforms
      });

      return {
        results: filteredResults,
        fromCache: false,
        platformCounts
      };

    } catch (error) {
      console.error('❌ Erreur générale de recherche:', error);
      throw error;
    }
  }

  private generateCacheKey(keywords: string[], platforms: string[], filters: SearchFilters): string {
    const sortedKeywords = [...keywords].sort().join(',');
    const sortedPlatforms = [...platforms].sort().join(',');
    const filterString = JSON.stringify(filters);
    return `${sortedKeywords}-${sortedPlatforms}-${filterString}`;
  }

  private checkCache(cacheKey: string): CachedResult | undefined {
    const cachedData = this.cache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY_MS) {
      return cachedData;
    }
    return undefined;
  }

  clearCache(): void {
    this.cache.clear();
    console.log('🧹 Cache vidé manuellement');
  }

  private async searchFacebookEnriched(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        let searchInput = keyword;
        if (keyword.includes('facebook.com') || keyword.includes('fb.com')) {
          searchInput = keyword;
        } else {
          searchInput = `https://www.facebook.com/search/posts/?q=${encodeURIComponent(keyword)}`;
        }
        
        const response = await fetch(`${this.baseUrl}/api/scrape/facebook-posts-ideal`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: searchInput,
            max_posts: 50
          })
        });

        if (response.ok) {
          const data = await response.json();
          const transformed = PlatformTransformers.transformFacebookData(data.posts || data.data || []);
          results.push(...transformed);
        }
      } catch (error) {
        console.error('❌ Erreur Facebook:', error);
      }
    }

    return results;
  }

  private async searchInstagramEnriched(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        let username = keyword;
        if (keyword.includes('instagram.com')) {
          const match = keyword.match(/instagram\.com\/([^\/\?]+)/);
          username = match ? match[1] : keyword;
        }

        const response = await fetch(`${this.baseUrl}/api/scrape/instagram-profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username.replace('@', ''),
            max_posts: 30
          })
        });

        if (response.ok) {
          const data = await response.json();
          const transformed = PlatformTransformers.transformInstagramData(data.posts || data.data || []);
          results.push(...transformed);
        }
      } catch (error) {
        console.error('❌ Erreur Instagram:', error);
      }
    }

    return results;
  }

  private async searchGoogleEnriched(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        const response = await fetch(`${this.baseUrl}/api/scrape/google-search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: keyword,
            max_results: 20
          })
        });

        if (response.ok) {
          const data = await response.json();
          const transformed = PlatformTransformers.transformGoogleData(data.results || data.data || []);
          results.push(...transformed);
        }
      } catch (error) {
        console.error('❌ Erreur Google:', error);
      }
    }

    return results;
  }

  private async searchWebEnriched(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    const baseUrls = [
      'https://news.google.com',
      'https://www.bbc.com',
      'https://www.lemonde.fr',
      'https://www.rfi.fr'
    ];
    
    for (const keyword of keywords) {
      try {
        const response = await fetch(`${this.baseUrl}/api/scrape/cheerio`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startUrls: baseUrls.map(url => `${url}/search?q=${encodeURIComponent(keyword)}`),
            max_pages: 5
          })
        });

        if (response.ok) {
          const data = await response.json();
          const transformed = PlatformTransformers.transformWebData(data.results || data.data || []);
          results.push(...transformed);
        }
      } catch (error) {
        console.error('❌ Erreur Web:', error);
      }
    }

    return results;
  }

  private async searchYouTubeEnriched(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        let query = keyword;
        if (!keyword.includes('youtube.com')) {
          query = `https://www.youtube.com/results?search_query=${encodeURIComponent(keyword)}`;
        }
        
        const response = await fetch(`${this.baseUrl}/api/scrape/youtube-channel-video`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: query,
            max_videos: 25
          })
        });

        if (response.ok) {
          const data = await response.json();
          const transformed = PlatformTransformers.transformYouTubeData(data.videos || data.data || []);
          results.push(...transformed);
        }
      } catch (error) {
        console.error('❌ Erreur YouTube:', error);
      }
    }

    return results;
  }

  private async searchTwitterEnriched(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];

    for (const keyword of keywords) {
      try {
        const response = await fetch(`${this.baseUrl}/api/scrape/x-twitter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: keyword,
            max_tweets: 40
          })
        });

        if (response.ok) {
          const data = await response.json();
          const transformed = PlatformTransformers.transformTwitterData(data.tweets || data.data || []);
          results.push(...transformed);
        }
      } catch (error) {
        console.error('❌ Erreur Twitter:', error);
      }
    }

    return results;
  }

  private applyAdvancedFilters(mentions: MentionResult[], filters: SearchFilters): MentionResult[] {
    let filteredResults = [...mentions];

    if (filters.sentiment) {
      filteredResults = filteredResults.filter(mention => mention.sentiment === filters.sentiment);
    }

    if (filters.minInfluenceScore) {
      filteredResults = filteredResults.filter(mention => (mention.influenceScore || 0) >= filters.minInfluenceScore!);
    }

    if (filters.language) {
      filteredResults = filteredResults.filter(mention => mention.content.toLowerCase().includes(filters.language!.toLowerCase()));
    }

    if (filters.author) {
      filteredResults = filteredResults.filter(mention => 
        mention.author.toLowerCase().includes(filters.author!.toLowerCase())
      );
    }

    if (filters.domain) {
      filteredResults = filteredResults.filter(mention => 
        mention.url.toLowerCase().includes(filters.domain!.toLowerCase())
      );
    }

    return filteredResults;
  }
}
