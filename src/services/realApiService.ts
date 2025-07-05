
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
      console.log('🚀 NOUVELLE RECHERCHE API BACKEND FIABLE');
      console.log('🔗 Endpoint:', this.baseUrl);
      console.log('📝 Mots-clés:', keywords);
      console.log('🎯 Plateformes:', platforms);
      console.log('🔧 Filtres (optionnels):', filters);
      
      const allResults: MentionResult[] = [];
      const platformCounts: { [key: string]: number } = {};
      
      // Traitement séquentiel pour éviter la surcharge
      for (const platform of platforms) {
        console.log(`\n🔍 TRAITEMENT ${platform.toUpperCase()} - FIABLE`);
        
        try {
          let platformResults: MentionResult[] = [];
          
          switch (platform.toLowerCase()) {
            case 'tiktok':
              platformResults = await this.searchTikTokReliable(keywords, filters);
              break;
            case 'facebook':
              platformResults = await this.searchFacebookReliable(keywords, filters);
              break;
            case 'instagram':
              platformResults = await this.searchInstagramReliable(keywords, filters);
              break;
            case 'twitter':
            case 'x-post':
              platformResults = await this.searchTwitterReliable(keywords, filters);
              break;
            case 'youtube':
              platformResults = await this.searchYouTubeReliable(keywords, filters);
              break;
            case 'google':
              platformResults = await this.searchGoogleReliable(keywords, filters);
              break;
            case 'web':
              platformResults = await this.searchWebReliable(keywords, filters);
              break;
            default:
              console.warn(`⚠️ Plateforme non supportée: ${platform}`);
          }

          console.log(`✅ ${platform} FIABLE: ${platformResults.length} résultats`);
          allResults.push(...platformResults);
          platformCounts[platform] = platformResults.length;
          
          // Petit délai entre les appels API
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`❌ Erreur ${platform} FIABLE:`, error);
          platformCounts[platform] = 0;
        }
      }

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

      console.log(`🏁 RECHERCHE FIABLE TERMINÉE: ${filteredResults.length} mentions ${Object.keys(filters).length > 0 ? 'après filtrage' : 'brutes'}`);

      return {
        results: filteredResults,
        fromCache: false,
        platformCounts: this.calculatePlatformCounts(filteredResults)
      };

    } catch (error) {
      console.error('❌ Erreur générale de recherche FIABLE:', error);
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

  // TikTok fiable avec gestion d'erreur
  private async searchTikTokReliable(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`🎵 TIKTOK RECHERCHE FIABLE: "${keyword}"`);
        
        // API principale TikTok
        const response1 = await fetch(`${this.baseUrl}/api/scrape/tiktok`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            hashtag: keyword.startsWith('#') ? keyword : `#${keyword}`,
            max_posts: 100
          })
        });

        if (response1.ok) {
          const data = await response1.json();
          if (data && (data.posts || data.data || data.items)) {
            const posts = data.posts || data.data || data.items || [];
            if (posts.length > 0) {
              const transformed = PlatformTransformers.transformTikTokData(posts);
              results.push(...transformed);
              console.log(`✅ TikTok API principale: ${transformed.length} résultats`);
            }
          }
        } else {
          console.warn(`⚠️ TikTok API principale erreur: ${response1.status}`);
        }

        // API TikTok par géolocalisation si disponible
        if (filters.geography) {
          try {
            const response2 = await fetch(`${this.baseUrl}/api/scrape/tiktok/location`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                hashtag: keyword,
                location: filters.geography.country || filters.geography.city,
                max_posts: 50
              })
            });

            if (response2.ok) {
              const data = await response2.json();
              if (data && (data.posts || data.data || data.items)) {
                const posts = data.posts || data.data || data.items || [];
                if (posts.length > 0) {
                  const transformed = PlatformTransformers.transformTikTokData(posts);
                  results.push(...transformed);
                  console.log(`✅ TikTok géolocalisation: ${transformed.length} résultats`);
                }
              }
            }
          } catch (error) {
            console.warn('⚠️ TikTok géolocalisation non disponible:', error);
          }
        }

      } catch (error) {
        console.error('❌ Erreur TikTok FIABLE:', error);
      }
    }

    return results;
  }

  // Facebook fiable avec toutes les APIs
  private async searchFacebookReliable(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`📘 FACEBOOK RECHERCHE FIABLE: "${keyword}"`);
        
        // API Facebook posts ideal
        const response1 = await fetch(`${this.baseUrl}/api/scrape/facebook-posts-ideal`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            query: keyword,
            max_posts: 80
          })
        });

        if (response1.ok) {
          const data = await response1.json();
          if (data && (data.posts || data.data || data.items)) {
            const posts = data.posts || data.data || data.items || [];
            if (posts.length > 0) {
              const transformed = PlatformTransformers.transformFacebookData(posts);
              results.push(...transformed);
              console.log(`✅ Facebook posts ideal: ${transformed.length} résultats`);
            }
          }
        }

        // API Facebook général
        const response2 = await fetch(`${this.baseUrl}/api/scrape/facebook`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            query: keyword,
            max_posts: 60
          })
        });

        if (response2.ok) {
          const data = await response2.json();
          if (data && (data.posts || data.data || data.items)) {
            const posts = data.posts || data.data || data.items || [];
            if (posts.length > 0) {
              const transformed = PlatformTransformers.transformFacebookData(posts);
              results.push(...transformed);
              console.log(`✅ Facebook général: ${transformed.length} résultats`);
            }
          }
        }

        // API Facebook page search
        const response3 = await fetch(`${this.baseUrl}/api/scrape/facebook/page-search`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            query: keyword,
            max_results: 40
          })
        });

        if (response3.ok) {
          const data = await response3.json();
          if (data && (data.pages || data.data || data.items)) {
            const pages = data.pages || data.data || data.items || [];
            if (pages.length > 0) {
              const transformed = PlatformTransformers.transformFacebookData(pages);
              results.push(...transformed);
              console.log(`✅ Facebook page search: ${transformed.length} résultats`);
            }
          }
        }

      } catch (error) {
        console.error('❌ Erreur Facebook FIABLE:', error);
      }
    }

    return results;
  }

  // Instagram fiable
  private async searchInstagramReliable(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`📸 INSTAGRAM RECHERCHE FIABLE: "${keyword}"`);
        
        // API Instagram général
        const response1 = await fetch(`${this.baseUrl}/api/scrape/instagram-general`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            query: keyword,
            max_posts: 80
          })
        });

        if (response1.ok) {
          const data = await response1.json();
          if (data && (data.posts || data.data || data.items)) {
            const posts = data.posts || data.data || data.items || [];
            if (posts.length > 0) {
              const transformed = PlatformTransformers.transformInstagramData(posts);
              results.push(...transformed);
              console.log(`✅ Instagram général: ${transformed.length} résultats`);
            }
          }
        }

        // API Instagram hashtag
        const response2 = await fetch(`${this.baseUrl}/api/scrape/instagram/hashtag`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            hashtag: keyword.startsWith('#') ? keyword : `#${keyword}`,
            max_posts: 60
          })
        });

        if (response2.ok) {
          const data = await response2.json();
          if (data && (data.posts || data.data || data.items)) {
            const posts = data.posts || data.data || data.items || [];
            if (posts.length > 0) {
              const transformed = PlatformTransformers.transformInstagramData(posts);
              results.push(...transformed);
              console.log(`✅ Instagram hashtag: ${transformed.length} résultats`);
            }
          }
        }

      } catch (error) {
        console.error('❌ Erreur Instagram FIABLE:', error);
      }
    }

    return results;
  }

  // Twitter fiable
  private async searchTwitterReliable(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];

    for (const keyword of keywords) {
      try {
        console.log(`🐦 TWITTER RECHERCHE FIABLE: "${keyword}"`);
        
        // API Twitter principal
        const response1 = await fetch(`${this.baseUrl}/api/scrape/twitter`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            query: keyword,
            max_tweets: 80
          })
        });

        if (response1.ok) {
          const data = await response1.json();
          if (data && (data.tweets || data.data || data.items)) {
            const tweets = data.tweets || data.data || data.items || [];
            if (tweets.length > 0) {
              const transformed = PlatformTransformers.transformTwitterData(tweets);
              results.push(...transformed);
              console.log(`✅ Twitter principal: ${transformed.length} résultats`);
            }
          }
        }

        // API X-post replies
        const response2 = await fetch(`${this.baseUrl}/api/scrape/x-post-replies`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            query: keyword,
            max_replies: 50
          })
        });

        if (response2.ok) {
          const data = await response2.json();
          if (data && (data.replies || data.data || data.items)) {
            const replies = data.replies || data.data || data.items || [];
            if (replies.length > 0) {
              const transformed = PlatformTransformers.transformTwitterData(replies);
              results.push(...transformed);
              console.log(`✅ Twitter replies: ${transformed.length} résultats`);
            }
          }
        }

      } catch (error) {
        console.error('❌ Erreur Twitter FIABLE:', error);
      }
    }

    return results;
  }

  // YouTube fiable
  private async searchYouTubeReliable(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {  
        console.log(`📺 YOUTUBE RECHERCHE FIABLE: "${keyword}"`);
        
        // API YouTube principal
        const response1 = await fetch(`${this.baseUrl}/api/scrape/youtube`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            query: keyword,
            max_videos: 60
          })
        });

        if (response1.ok) {
          const data = await response1.json();
          if (data && (data.videos || data.data || data.items)) {
            const videos = data.videos || data.data || data.items || [];
            if (videos.length > 0) {
              const transformed = PlatformTransformers.transformYouTubeData(videos);
              results.push(...transformed);
              console.log(`✅ YouTube principal: ${transformed.length} résultats`);
            }
          }
        }

        // API YouTube channel video
        const response2 = await fetch(`${this.baseUrl}/api/scrape/youtube-channel-video`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            query: keyword,
            max_videos: 40
          })
        });

        if (response2.ok) {
          const data = await response2.json();
          if (data && (data.videos || data.data || data.items)) {
            const videos = data.videos || data.data || data.items || [];
            if (videos.length > 0) {
              const transformed = PlatformTransformers.transformYouTubeData(videos);
              results.push(...transformed);
              console.log(`✅ YouTube channel: ${transformed.length} résultats`);
            }
          }
        }

      } catch (error) {
        console.error('❌ Erreur YouTube FIABLE:', error);
      }
    }

    return results;
  }

  // Google fiable
  private async searchGoogleReliable(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`🔍 GOOGLE RECHERCHE FIABLE: "${keyword}"`);
        
        const response = await fetch(`${this.baseUrl}/api/scrape/google-search`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            query: keyword,
            max_results: 30
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data && (data.results || data.data || data.items)) {
            const searchResults = data.results || data.data || data.items || [];
            if (searchResults.length > 0) {
              const transformed = PlatformTransformers.transformGoogleData(searchResults);
              results.push(...transformed);
              console.log(`✅ Google search: ${transformed.length} résultats`);
            }
          }
        }

      } catch (error) {
        console.error('❌ Erreur Google FIABLE:', error);
      }
    }

    return results;
  }

  // Web fiable
  private async searchWebReliable(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`🌐 WEB RECHERCHE FIABLE: "${keyword}"`);
        
        // API Cheerio
        const response1 = await fetch(`${this.baseUrl}/api/scrape/cheerio`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            startUrls: [`https://www.google.com/search?q=${encodeURIComponent(keyword)}`],
            max_pages: 10
          })
        });

        if (response1.ok) {
          const data = await response1.json();
          if (data && (data.results || data.data || data.items)) {
            const webResults = data.results || data.data || data.items || [];
            if (webResults.length > 0) {
              const transformed = PlatformTransformers.transformWebData(webResults);
              results.push(...transformed);
              console.log(`✅ Web cheerio: ${transformed.length} résultats`);
            }
          }
        }

        // API Website content
        const response2 = await fetch(`${this.baseUrl}/api/scrape/website-content`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            startUrls: [`https://news.google.com/search?q=${encodeURIComponent(keyword)}`]
          })
        });

        if (response2.ok) {
          const data = await response2.json();
          if (data && (data.results || data.data || data.items)) {
            const webResults = data.results || data.data || data.items || [];
            if (webResults.length > 0) {
              const transformed = PlatformTransformers.transformWebData(webResults);
              results.push(...transformed);
              console.log(`✅ Web content: ${transformed.length} résultats`);
            }
          }
        }

      } catch (error) {
        console.error('❌ Erreur Web FIABLE:', error);
      }
    }

    return results;
  }
}
