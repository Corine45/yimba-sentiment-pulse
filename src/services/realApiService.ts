
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
      console.log('🚀 NOUVELLE RECHERCHE API BACKEND OPTIMISÉE');
      console.log('🔗 Endpoint:', this.baseUrl);
      console.log('📝 Mots-clés:', keywords);
      console.log('🎯 Plateformes:', platforms);
      console.log('🔧 Filtres (optionnels):', filters);
      
      const allResults: MentionResult[] = [];
      const platformCounts: { [key: string]: number } = {};
      
      // Traitement parallèle optimisé des plateformes
      const platformPromises = platforms.map(async (platform) => {
        console.log(`\n🔍 TRAITEMENT ${platform.toUpperCase()} - OPTIMISÉ`);
        
        try {
          let platformResults: MentionResult[] = [];
          
          switch (platform.toLowerCase()) {
            case 'tiktok':
              platformResults = await this.searchTikTokEnhanced(keywords, filters);
              break;
            case 'facebook':
              platformResults = await this.searchFacebookEnhanced(keywords, filters);
              break;
            case 'instagram':
              platformResults = await this.searchInstagramEnhanced(keywords, filters);
              break;
            case 'twitter':
            case 'x-post':
              platformResults = await this.searchTwitterEnhanced(keywords, filters);
              break;
            case 'youtube':
              platformResults = await this.searchYouTubeEnhanced(keywords, filters);
              break;
            case 'google':
              platformResults = await this.searchGoogleEnhanced(keywords, filters);
              break;
            case 'web':
              platformResults = await this.searchWebEnhanced(keywords, filters);
              break;
            default:
              console.warn(`⚠️ Plateforme non supportée: ${platform}`);
          }

          console.log(`✅ ${platform} OPTIMISÉ: ${platformResults.length} résultats`);
          return { platform, results: platformResults };
          
        } catch (error) {
          console.error(`❌ Erreur ${platform} OPTIMISÉE:`, error);
          return { platform, results: [] };
        }
      });

      const platformResultsArray = await Promise.all(platformPromises);
      
      platformResultsArray.forEach(({ platform, results }) => {
        allResults.push(...results);
        platformCounts[platform] = results.length;
      });

      // Application des filtres seulement si spécifiés
      const filteredResults = Object.keys(filters).length > 0 ? 
        FiltersManager.applyFilters(allResults, filters) : allResults;
      
      // Mise en cache
      this.cache.set(cacheKey, {
        data: filteredResults,
        timestamp: Date.now(),
        filters,
        keywords,
        platforms
      });

      console.log(`🏁 RECHERCHE OPTIMISÉE TERMINÉE: ${filteredResults.length} mentions ${Object.keys(filters).length > 0 ? 'après filtrage' : 'brutes'}`);

      return {
        results: filteredResults,
        fromCache: false,
        platformCounts: this.calculatePlatformCounts(filteredResults)
      };

    } catch (error) {
      console.error('❌ Erreur générale de recherche OPTIMISÉE:', error);
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

  // TikTok avec toutes les APIs disponibles
  private async searchTikTokEnhanced(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`🎵 TIKTOK RECHERCHE OPTIMISÉE: "${keyword}"`);
        
        // API principale TikTok
        const response1 = await fetch(`${this.baseUrl}/api/scrape/tiktok`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hashtag: keyword.startsWith('#') ? keyword : `#${keyword}`,
            max_posts: 150
          })
        });

        if (response1.ok) {
          const data = await response1.json();
          const posts = data.posts || data.data || data.items || [];
          const transformed = PlatformTransformers.transformTikTokData(posts);
          results.push(...transformed);
        }

        // API TikTok par géolocalisation si filtre géographique
        if (filters.geography) {
          const response2 = await fetch(`${this.baseUrl}/api/scrape/tiktok/location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              hashtag: keyword,
              location: filters.geography.country || filters.geography.city,
              max_posts: 100
            })
          });

          if (response2.ok) {
            const data = await response2.json();
            const posts = data.posts || data.data || data.items || [];
            const transformed = PlatformTransformers.transformTikTokData(posts);
            results.push(...transformed);
          }
        }

      } catch (error) {
        console.error('❌ Erreur TikTok OPTIMISÉE:', error);
      }
    }

    return results;
  }

  // Facebook avec toutes les APIs disponibles
  private async searchFacebookEnhanced(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`📘 FACEBOOK RECHERCHE OPTIMISÉE: "${keyword}"`);
        
        // API Facebook posts ideal
        const response1 = await fetch(`${this.baseUrl}/api/scrape/facebook-posts-ideal`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: keyword,
            max_posts: 150
          })
        });

        if (response1.ok) {
          const data = await response1.json();
          const posts = data.posts || data.data || data.items || [];
          results.push(...PlatformTransformers.transformFacebookData(posts));
        }

        // API Facebook par mots-clés
        const response2 = await fetch(`${this.baseUrl}/api/scrape/facebook`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: keyword,
            max_posts: 100
          })
        });

        if (response2.ok) {
          const data = await response2.json();
          const posts = data.posts || data.data || data.items || [];
          results.push(...PlatformTransformers.transformFacebookData(posts));
        }

        // API Facebook page search
        const response3 = await fetch(`${this.baseUrl}/api/scrape/facebook/page-search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: keyword,
            max_results: 50
          })
        });

        if (response3.ok) {
          const data = await response3.json();
          const pages = data.pages || data.data || data.items || [];
          results.push(...PlatformTransformers.transformFacebookData(pages));
        }

      } catch (error) {
        console.error('❌ Erreur Facebook OPTIMISÉE:', error);
      }
    }

    return results;
  }

  // Instagram avec toutes les APIs disponibles
  private async searchInstagramEnhanced(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`📸 INSTAGRAM RECHERCHE OPTIMISÉE: "${keyword}"`);
        
        // API Instagram général
        const response1 = await fetch(`${this.baseUrl}/api/scrape/instagram-general`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: keyword,
            max_posts: 120
          })
        });

        if (response1.ok) {
          const data = await response1.json();
          const posts = data.posts || data.data || data.items || [];
          results.push(...PlatformTransformers.transformInstagramData(posts));
        }

        // API Instagram hashtag
        const response2 = await fetch(`${this.baseUrl}/api/scrape/instagram/hashtag`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hashtag: keyword.startsWith('#') ? keyword : `#${keyword}`,
            max_posts: 100
          })
        });

        if (response2.ok) {
          const data = await response2.json();
          const posts = data.posts || data.data || data.items || [];
          results.push(...PlatformTransformers.transformInstagramData(posts));
        }

        // API Instagram reels
        const response3 = await fetch(`${this.baseUrl}/api/scrape/instagram/reels`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: keyword,
            max_reels: 50
          })
        });

        if (response3.ok) {
          const data = await response3.json();
          const reels = data.reels || data.data || data.items || [];
          results.push(...PlatformTransformers.transformInstagramData(reels));
        }

      } catch (error) {
        console.error('❌ Erreur Instagram OPTIMISÉE:', error);
      }
    }

    return results;
  }

  // Twitter avec toutes les APIs disponibles
  private async searchTwitterEnhanced(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];

    for (const keyword of keywords) {
      try {
        console.log(`🐦 TWITTER RECHERCHE OPTIMISÉE: "${keyword}"`);
        
        // API Twitter principal
        const response1 = await fetch(`${this.baseUrl}/api/scrape/twitter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: keyword,
            max_tweets: 120
          })
        });

        if (response1.ok) {
          const data = await response1.json();
          const tweets = data.tweets || data.data || data.items || [];
          results.push(...PlatformTransformers.transformTwitterData(tweets));
        }

        // API X-post replies
        const response2 = await fetch(`${this.baseUrl}/api/scrape/x-post-replies`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: keyword,
            max_replies: 80
          })
        });

        if (response2.ok) {
          const data = await response2.json();
          const replies = data.replies || data.data || data.items || [];
          results.push(...PlatformTransformers.transformTwitterData(replies));
        }

      } catch (error) {
        console.error('❌ Erreur Twitter OPTIMISÉE:', error);
      }
    }

    return results;
  }

  // YouTube avec toutes les APIs disponibles
  private async searchYouTubeEnhanced(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`📺 YOUTUBE RECHERCHE OPTIMISÉE: "${keyword}"`);
        
        // API YouTube principal
        const response1 = await fetch(`${this.baseUrl}/api/scrape/youtube`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: keyword,
            max_videos: 100
          })
        });

        if (response1.ok) {
          const data = await response1.json();
          const videos = data.videos || data.data || data.items || [];
          results.push(...PlatformTransformers.transformYouTubeData(videos));
        }

        // API YouTube channel video
        const response2 = await fetch(`${this.baseUrl}/api/scrape/youtube-channel-video`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: keyword,
            max_videos: 80
          })
        });

        if (response2.ok) {
          const data = await response2.json();
          const videos = data.videos || data.data || data.items || [];
          results.push(...PlatformTransformers.transformYouTubeData(videos));
        }

      } catch (error) {
        console.error('❌ Erreur YouTube OPTIMISÉE:', error);
      }
    }

    return results;
  }

  // Google avec API optimisée
  private async searchGoogleEnhanced(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`🔍 GOOGLE RECHERCHE OPTIMISÉE: "${keyword}"`);
        
        const response = await fetch(`${this.baseUrl}/api/scrape/google-search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: keyword,
            max_results: 50
          })
        });

        if (response.ok) {
          const data = await response.json();
          const searchResults = data.results || data.data || data.items || [];
          results.push(...PlatformTransformers.transformGoogleData(searchResults));
        }

      } catch (error) {
        console.error('❌ Erreur Google OPTIMISÉE:', error);
      }
    }

    return results;
  }

  // Web avec toutes les APIs disponibles
  private async searchWebEnhanced(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`🌐 WEB RECHERCHE OPTIMISÉE: "${keyword}"`);
        
        // API Cheerio
        const response1 = await fetch(`${this.baseUrl}/api/scrape/cheerio`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startUrls: [`https://www.google.com/search?q=${encodeURIComponent(keyword)}`],
            max_pages: 15
          })
        });

        if (response1.ok) {
          const data = await response1.json();
          const webResults = data.results || data.data || data.items || [];
          results.push(...PlatformTransformers.transformWebData(webResults));
        }

        // API Website content
        const response2 = await fetch(`${this.baseUrl}/api/scrape/website-content`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startUrls: [`https://news.google.com/search?q=${encodeURIComponent(keyword)}`]
          })
        });

        if (response2.ok) {
          const data = await response2.json();
          const webResults = data.results || data.data || data.items || [];
          results.push(...PlatformTransformers.transformWebData(webResults));
        }

        // API Blog content
        const response3 = await fetch(`${this.baseUrl}/api/scrape/blog-content`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startUrls: [`https://www.lemonde.fr/recherche/?keywords=${encodeURIComponent(keyword)}`]
          })
        });

        if (response3.ok) {
          const data = await response3.json();
          const blogResults = data.results || data.data || data.items || [];
          results.push(...PlatformTransformers.transformWebData(blogResults));
        }

      } catch (error) {
        console.error('❌ Erreur Web OPTIMISÉE:', error);
      }
    }

    return results;
  }
}
