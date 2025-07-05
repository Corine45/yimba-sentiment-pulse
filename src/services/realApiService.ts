
import { PlatformTransformers } from './api/platformTransformers';
import { MentionResult, SearchFilters, CachedResult } from './api/types';
import { FiltersManager } from './api/filtersManager';

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
      console.log('📦 Cache trouvé - données récupérées');
      return cachedData;
    }
    if (cachedData) {
      console.log('🕐 Cache expiré - suppression');
      this.cache.delete(cacheKey);
    }
    return undefined;
  }

  clearCache(): void {
    this.cache.clear();
    console.log('🧹 Cache complètement vidé');
  }

  async searchWithCache(
    keywords: string[],
    platforms: string[],
    filters: SearchFilters = {}
  ): Promise<{ results: MentionResult[], fromCache: boolean, platformCounts: { [key: string]: number } }> {
    const cacheKey = this.generateCacheKey(keywords, platforms, filters);
    const cachedResult = this.checkCache(cacheKey);

    if (cachedResult) {
      console.log('✅ Résultats récupérés depuis le cache');
      const platformCounts = this.calculatePlatformCounts(cachedResult.data);
      return {
        results: cachedResult.data,
        fromCache: true,
        platformCounts
      };
    }

    try {
      console.log('🚀 NOUVELLE RECHERCHE API BACKEND CORRIGÉE');
      console.log('🔗 Endpoint:', this.baseUrl);
      console.log('📝 Mots-clés:', keywords);
      console.log('🎯 Plateformes:', platforms);
      console.log('🔧 Filtres:', filters);
      
      const allResults: MentionResult[] = [];
      const platformCounts: { [key: string]: number } = {};
      
      // Traitement parallèle des plateformes pour de meilleures performances
      const platformPromises = platforms.map(async (platform) => {
        console.log(`\n🔍 TRAITEMENT ${platform.toUpperCase()} - CORRIGÉ`);
        
        try {
          let platformResults: MentionResult[] = [];
          
          switch (platform.toLowerCase()) {
            case 'tiktok':
              platformResults = await this.searchTikTokCorriged(keywords, filters);
              break;
            case 'facebook':
              platformResults = await this.searchFacebookCorriged(keywords, filters);
              break;
            case 'instagram':
              platformResults = await this.searchInstagramCorriged(keywords, filters);
              break;
            case 'twitter':
            case 'x-post':
              platformResults = await this.searchTwitterCorriged(keywords, filters);
              break;
            case 'youtube':
              platformResults = await this.searchYouTubeCorriged(keywords, filters);
              break;
            case 'google':
              platformResults = await this.searchGoogleCorriged(keywords, filters);
              break;
            case 'web':
              platformResults = await this.searchWebCorriged(keywords, filters);
              break;
            default:
              console.warn(`⚠️ Plateforme non supportée: ${platform}`);
          }

          console.log(`✅ ${platform} CORRIGÉ: ${platformResults.length} résultats`);
          return { platform, results: platformResults };
          
        } catch (error) {
          console.error(`❌ Erreur ${platform} CORRIGÉE:`, error);
          return { platform, results: [] };
        }
      });

      const platformResultsArray = await Promise.all(platformPromises);
      
      platformResultsArray.forEach(({ platform, results }) => {
        allResults.push(...results);
        platformCounts[platform] = results.length;
      });

      // Application des filtres avancés
      const filteredResults = FiltersManager.applyFilters(allResults, filters);
      
      // Mise en cache
      this.cache.set(cacheKey, {
        data: filteredResults,
        timestamp: Date.now(),
        filters,
        keywords,
        platforms
      });

      console.log(`🏁 RECHERCHE CORRIGÉE TERMINÉE: ${filteredResults.length} mentions après filtrage`);

      return {
        results: filteredResults,
        fromCache: false,
        platformCounts: this.calculatePlatformCounts(filteredResults)
      };

    } catch (error) {
      console.error('❌ Erreur générale de recherche CORRIGÉE:', error);
      throw error;
    }
  }

  private calculatePlatformCounts(results: MentionResult[]): { [key: string]: number } {
    const counts: { [key: string]: number } = {};
    results.forEach(result => {
      counts[result.platform] = (counts[result.platform] || 0) + 1;
    });
    return counts;
  }

  private async searchTikTokCorriged(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`🎵 TIKTOK RECHERCHE CORRIGÉE: "${keyword}"`);
        
        const hashtagKeyword = keyword.startsWith('#') ? keyword : `#${keyword}`;
        
        const response = await fetch(`${this.baseUrl}/api/scrape/tiktok-posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hashtag: hashtagKeyword,
            max_posts: 100 // Augmenté pour plus de résultats
          })
        });

        console.log(`🎵 TikTok Response Status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`🎵 TikTok Raw Data:`, data);
          
          const posts = data.posts || data.data || data.items || [];
          const transformed = PlatformTransformers.transformTikTokData(posts);
          results.push(...transformed);
          console.log(`✅ TikTok CORRIGÉ: ${transformed.length} posts pour "${keyword}"`);
        } else {
          const errorText = await response.text();
          console.error(`❌ TikTok Error: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error('❌ Erreur TikTok CORRIGÉE:', error);
      }
    }

    return results;
  }

  private async searchFacebookCorriged(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`📘 FACEBOOK RECHERCHE CORRIGÉE: "${keyword}"`);
        
        let searchInput = keyword;
        if (!keyword.includes('facebook.com')) {
          searchInput = `https://www.facebook.com/search/posts/?q=${encodeURIComponent(keyword)}`;
        }
        
        const response = await fetch(`${this.baseUrl}/api/scrape/facebook-posts-ideal`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: searchInput,
            max_posts: 100
          })
        });

        console.log(`📘 Facebook Response Status: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          console.log(`📘 Facebook Raw Data:`, data);
          
          const posts = data.posts || data.data || data.items || [];
          const transformed = PlatformTransformers.transformFacebookData(posts);
          results.push(...transformed);
          console.log(`✅ Facebook CORRIGÉ: ${transformed.length} posts pour "${keyword}"`);
        } else {
          const errorText = await response.text();
          console.error(`❌ Facebook Error: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error('❌ Erreur Facebook CORRIGÉE:', error);
      }
    }

    return results;
  }

  private async searchInstagramCorriged(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`📸 INSTAGRAM RECHERCHE CORRIGÉE: "${keyword}"`);
        
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
            max_posts: 50
          })
        });

        console.log(`📸 Instagram Response Status: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          console.log(`📸 Instagram Raw Data:`, data);
          
          const posts = data.posts || data.data || data.items || [];
          const transformed = PlatformTransformers.transformInstagramData(posts);
          results.push(...transformed);
          console.log(`✅ Instagram CORRIGÉ: ${transformed.length} posts pour "${keyword}"`);
        } else {
          const errorText = await response.text();
          console.error(`❌ Instagram Error: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error('❌ Erreur Instagram CORRIGÉE:', error);
      }
    }

    return results;
  }

  private async searchTwitterCorriged(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];

    for (const keyword of keywords) {
      try {
        console.log(`🐦 TWITTER RECHERCHE CORRIGÉE: "${keyword}"`);
        
        const response = await fetch(`${this.baseUrl}/api/scrape/x-twitter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: keyword,
            max_tweets: 80
          })
        });

        console.log(`🐦 Twitter Response Status: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          console.log(`🐦 Twitter Raw Data:`, data);
          
          const tweets = data.tweets || data.data || data.items || [];
          const transformed = PlatformTransformers.transformTwitterData(tweets);
          results.push(...transformed);
          console.log(`✅ Twitter CORRIGÉ: ${transformed.length} tweets pour "${keyword}"`);
        } else {
          const errorText = await response.text();
          console.error(`❌ Twitter Error: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error('❌ Erreur Twitter CORRIGÉE:', error);
      }
    }

    return results;
  }

  private async searchYouTubeCorriged(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`📺 YOUTUBE RECHERCHE CORRIGÉE: "${keyword}"`);
        
        let query = keyword;
        if (!keyword.includes('youtube.com')) {
          query = `https://www.youtube.com/results?search_query=${encodeURIComponent(keyword)}`;
        }
        
        const response = await fetch(`${this.baseUrl}/api/scrape/youtube-channel-video`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: query,
            max_videos: 50
          })
        });

        console.log(`📺 YouTube Response Status: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          console.log(`📺 YouTube Raw Data:`, data);
          
          const videos = data.videos || data.data || data.items || [];
          const transformed = PlatformTransformers.transformYouTubeData(videos);
          results.push(...transformed);
          console.log(`✅ YouTube CORRIGÉ: ${transformed.length} vidéos pour "${keyword}"`);
        } else {
          const errorText = await response.text();
          console.error(`❌ YouTube Error: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error('❌ Erreur YouTube CORRIGÉE:', error);
      }
    }

    return results;
  }

  private async searchGoogleCorriged(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`🔍 GOOGLE RECHERCHE CORRIGÉE: "${keyword}"`);
        
        const response = await fetch(`${this.baseUrl}/api/scrape/google-search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: keyword,
            max_results: 30
          })
        });

        console.log(`🔍 Google Response Status: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          console.log(`🔍 Google Raw Data:`, data);
          
          const searchResults = data.results || data.data || data.items || [];
          const transformed = PlatformTransformers.transformGoogleData(searchResults);
          results.push(...transformed);
          console.log(`✅ Google CORRIGÉ: ${transformed.length} résultats pour "${keyword}"`);
        } else {
          const errorText = await response.text();
          console.error(`❌ Google Error: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error('❌ Erreur Google CORRIGÉE:', error);
      }
    }

    return results;
  }

  private async searchWebCorriged(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    const baseUrls = [
      'https://news.google.com',
      'https://www.bbc.com',
      'https://www.lemonde.fr',
      'https://www.rfi.fr'
    ];
    
    for (const keyword of keywords) {
      try {
        console.log(`🌐 WEB RECHERCHE CORRIGÉE: "${keyword}"`);
        
        const response = await fetch(`${this.baseUrl}/api/scrape/cheerio`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startUrls: baseUrls.map(url => `${url}/search?q=${encodeURIComponent(keyword)}`),
            max_pages: 10
          })
        });

        console.log(`🌐 Web Response Status: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          console.log(`🌐 Web Raw Data:`, data);
          
          const webResults = data.results || data.data || data.items || [];
          const transformed = PlatformTransformers.transformWebData(webResults);
          results.push(...transformed);
          console.log(`✅ Web CORRIGÉ: ${transformed.length} articles pour "${keyword}"`);
        } else {
          const errorText = await response.text();
          console.error(`❌ Web Error: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error('❌ Erreur Web CORRIGÉE:', error);
      }
    }

    return results;
  }
}
