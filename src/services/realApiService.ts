import { PlatformTransformers } from './api/platformTransformers';
import { MentionResult, SearchFilters, CachedResult } from './api/types';
import { FiltersManager } from './api/filtersManager';

const CACHE_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes pour cache plus long

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
      console.log('🚀 NOUVELLE RECHERCHE API BACKEND FIABLE - YIMBA PULSE API');
      console.log('🔗 Base URL:', this.baseUrl);
      console.log('📝 Mots-clés:', keywords);
      console.log('🎯 Plateformes sélectionnées:', platforms);
      console.log('🔧 Filtres appliqués:', Object.keys(filters).length > 0 ? filters : 'Aucun filtre (données brutes)');
      
      const allResults: MentionResult[] = [];
      const platformCounts: { [key: string]: number } = {};
      
      // Traitement séquentiel pour éviter la surcharge des APIs
      for (const platform of platforms) {
        console.log(`\n🎯 === RECHERCHE ${platform.toUpperCase()} AVEC APIS MULTIPLES ===`);
        
        try {
          let platformResults: MentionResult[] = [];
          
          switch (platform.toLowerCase()) {
            case 'tiktok':
              platformResults = await this.searchTikTokWithAllAPIs(keywords, filters);
              break;
            case 'facebook':
              platformResults = await this.searchFacebookWithAllAPIs(keywords, filters);
              break;
            case 'instagram':
              platformResults = await this.searchInstagramWithAllAPIs(keywords, filters);
              break;
            case 'twitter':
            case 'x-post':
              platformResults = await this.searchTwitterWithAllAPIs(keywords, filters);
              break;
            case 'youtube':
              platformResults = await this.searchYouTubeWithAllAPIs(keywords, filters);
              break;
            case 'google':
              platformResults = await this.searchGoogleWithAllAPIs(keywords, filters);
              break;
            case 'web':
              platformResults = await this.searchWebWithAllAPIs(keywords, filters);
              break;
            default:
              console.warn(`⚠️ Plateforme non supportée: ${platform}`);
          }

          console.log(`✅ ${platform.toUpperCase()} TOTAL: ${platformResults.length} résultats via APIs multiples`);
          allResults.push(...platformResults);
          platformCounts[platform] = platformResults.length;
          
          // Délai entre plateformes pour éviter la surcharge
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`❌ Erreur ${platform} COMPLET:`, error);
          platformCounts[platform] = 0;
        }
      }

      // Application des filtres seulement si spécifiés
      const filteredResults = Object.keys(filters).length > 0 ? 
        FiltersManager.applyFilters(allResults, filters) : allResults;
      
      // Mise en cache des résultats
      this.cache.set(cacheKey, {
        data: filteredResults,
        timestamp: Date.now(),
        filters,
        keywords,
        platforms
      });

      console.log(`🏁 RECHERCHE YIMBA PULSE TERMINÉE: ${filteredResults.length} mentions ${Object.keys(filters).length > 0 ? 'après filtrage' : 'brutes'}`);
      console.log(`📊 Répartition finale:`, this.calculatePlatformCounts(filteredResults));

      return {
        results: filteredResults,
        fromCache: false,
        platformCounts: this.calculatePlatformCounts(filteredResults)
      };

    } catch (error) {
      console.error('❌ Erreur générale YIMBA PULSE API:', error);
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

  // === TIKTOK AVEC TOUTES LES APIs DISPONIBLES - CORRECTION DU PARSING ===
  private async searchTikTokWithAllAPIs(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`🎵 TIKTOK - Recherche pour "${keyword}" avec APIs multiples`);
        
        // API 1: /api/scrape/tiktok (principal par hashtags)
        try {
          const response1 = await fetch(`${this.baseUrl}/api/scrape/tiktok`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              hashtags: [keyword.startsWith('#') ? keyword : `#${keyword}`]
            })
          });

          if (response1.ok) {
            const data = await response1.json();
            console.log('🎵 TikTok hashtag API response:', data);
            
            // CORRECTION: Traiter la vraie structure de données
            if (data && data.status && data.data) {
              const items = data.data.items || data.data || [];
              console.log(`🎵 TikTok items found: ${items.length}`);
              
              if (items.length > 0) {
                const transformed = PlatformTransformers.transformTikTokData(items);
                results.push(...transformed);
                console.log(`✅ TikTok hashtag: ${transformed.length} résultats transformés`);
              }
            }
          } else {
            console.warn(`⚠️ TikTok hashtag API erreur: ${response1.status}`);
          }
        } catch (error) {
          console.warn('⚠️ TikTok hashtag API inaccessible:', error);
        }

        // API 2: /api/scrape/tiktok/location (par géolocalisation si filtres géo)
        if (filters.country || filters.geography) {
          try {
            const response2 = await fetch(`${this.baseUrl}/api/scrape/tiktok/location`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                latitude: filters.geography?.latitude || 5.316667, // Abidjan par défaut
                longitude: filters.geography?.longitude || -4.033333,
                radius: filters.geography?.radius || 1000
              })
            });

            if (response2.ok) {
              const data = await response2.json();
              if (data && data.status && data.data) {
                const items = data.data.items || data.data || [];
                if (items.length > 0) {
                  const transformed = PlatformTransformers.transformTikTokData(items);
                  results.push(...transformed);
                  console.log(`✅ TikTok location: ${transformed.length} résultats`);
                }
              }
            }
          } catch (error) {
            console.warn('⚠️ TikTok location API inaccessible:', error);
          }
        }

        // Petit délai entre les APIs
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error('❌ Erreur TikTok globale:', error);
      }
    }

    return results;
  }

  // === FACEBOOK AVEC TOUTES LES APIs DISPONIBLES ===
  private async searchFacebookWithAllAPIs(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`📘 FACEBOOK - Recherche pour "${keyword}" avec 7 APIs différentes`);
        
        // API 1: /api/scrape/facebook-posts-ideal
        try {
          const response1 = await fetch(`${this.baseUrl}/api/scrape/facebook-posts-ideal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              urls: [`https://www.facebook.com/search/posts/?q=${encodeURIComponent(keyword)}`]
            })
          });

          if (response1.ok) {
            const data = await response1.json();
            if (data && (data.posts || data.data || data.items || data.results)) {
              const posts = data.posts || data.data || data.items || data.results || [];
              if (posts.length > 0) {
                const transformed = PlatformTransformers.transformFacebookData(posts);
                results.push(...transformed);
                console.log(`✅ Facebook posts ideal: ${transformed.length} résultats`);
              }
            }
          }
        } catch (error) {
          console.warn('⚠️ Facebook posts ideal inaccessible:', error);
        }

        // API 2: /api/scrape/facebook-posts
        try {
          const response2 = await fetch(`${this.baseUrl}/api/scrape/facebook-posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: keyword
            })
          });

          if (response2.ok) {
            const data = await response2.json();
            if (data && (data.posts || data.data || data.items || data.results)) {
              const posts = data.posts || data.data || data.items || data.results || [];
              if (posts.length > 0) {
                const transformed = PlatformTransformers.transformFacebookData(posts);
                results.push(...transformed);
                console.log(`✅ Facebook posts: ${transformed.length} résultats`);
              }
            }
          }
        } catch (error) {
          console.warn('⚠️ Facebook posts inaccessible:', error);
        }

        // API 3: /api/scrape/facebook (général)
        try {
          const response3 = await fetch(`${this.baseUrl}/api/scrape/facebook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: keyword
            })
          });

          if (response3.ok) {
            const data = await response3.json();
            if (data && (data.posts || data.data || data.items || data.results)) {
              const posts = data.posts || data.data || data.items || data.results || [];
              if (posts.length > 0) {
                const transformed = PlatformTransformers.transformFacebookData(posts);
                results.push(...transformed);
                console.log(`✅ Facebook général: ${transformed.length} résultats`);
              }
            }
          }
        } catch (error) {
          console.warn('⚠️ Facebook général inaccessible:', error);
        }

        // API 4: /api/scrape/facebook/page-search
        try {
          const response4 = await fetch(`${this.baseUrl}/api/scrape/facebook/page-search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              keywords: [keyword]
            })
          });

          if (response4.ok) {
            const data = await response4.json();
            if (data && (data.pages || data.data || data.items || data.results)) {
              const pages = data.pages || data.data || data.items || data.results || [];
              if (pages.length > 0) {
                const transformed = PlatformTransformers.transformFacebookData(pages);
                results.push(...transformed);
                console.log(`✅ Facebook page search: ${transformed.length} résultats`);
              }
            }
          }
        } catch (error) {
          console.warn('⚠️ Facebook page search inaccessible:', error);
        }

        // Petit délai entre les APIs
        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (error) {
        console.error('❌ Erreur Facebook globale:', error);
      }
    }

    return results;
  }

  // === INSTAGRAM AVEC TOUTES LES APIs DISPONIBLES ===
  private async searchInstagramWithAllAPIs(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`📸 INSTAGRAM - Recherche pour "${keyword}" avec 8 APIs différentes`);
        
        // API 1: /api/scrape/instagram-general
        try {
          const response1 = await fetch(`${this.baseUrl}/api/scrape/instagram-general`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              searchType: "hashtag",
              searchInput: keyword.startsWith('#') ? keyword : `#${keyword}`
            })
          });

          if (response1.ok) {
            const data = await response1.json();
            if (data && (data.posts || data.data || data.items || data.results)) {
              const posts = data.posts || data.data || data.items || data.results || [];
              if (posts.length > 0) {
                const transformed = PlatformTransformers.transformInstagramData(posts);
                results.push(...transformed);
                console.log(`✅ Instagram général: ${transformed.length} résultats`);
              }
            }
          }
        } catch (error) {
          console.warn('⚠️ Instagram général inaccessible:', error);
        }

        // API 2: /api/scrape/instagram/hashtag
        try {
          const response2 = await fetch(`${this.baseUrl}/api/scrape/instagram/hashtag`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              hashtag: keyword.startsWith('#') ? keyword : `#${keyword}`
            })
          });

          if (response2.ok) {
            const data = await response2.json();
            if (data && (data.posts || data.data || data.items || data.results)) {
              const posts = data.posts || data.data || data.items || data.results || [];
              if (posts.length > 0) {
                const transformed = PlatformTransformers.transformInstagramData(posts);
                results.push(...transformed);
                console.log(`✅ Instagram hashtag: ${transformed.length} résultats`);
              }
            }
          }
        } catch (error) {
          console.warn('⚠️ Instagram hashtag inaccessible:', error);
        }

        // API 3: /api/scrape/instagram/api (officielle)
        try {
          const response3 = await fetch(`${this.baseUrl}/api/scrape/instagram/api`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              usernames: [keyword] // Recherche par nom d'utilisateur si applicable
            })
          });

          if (response3.ok) {
            const data = await response3.json();
            if (data && (data.posts || data.data || data.items || data.results)) {
              const posts = data.posts || data.data || data.items || data.results || [];
              if (posts.length > 0) {
                const transformed = PlatformTransformers.transformInstagramData(posts);
                results.push(...transformed);
                console.log(`✅ Instagram API officielle: ${transformed.length} résultats`);
              }
            }
          }
        } catch (error) {
          console.warn('⚠️ Instagram API officielle inaccessible:', error);
        }

        // Petit délai entre les APIs
        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (error) {
        console.error('❌ Erreur Instagram globale:', error);
      }
    }

    return results;
  }

  // === TWITTER/X AVEC TOUTES LES APIs DISPONIBLES ===
  private async searchTwitterWithAllAPIs(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];

    for (const keyword of keywords) {
      try {
        console.log(`🐦 TWITTER/X - Recherche pour "${keyword}" avec 3 APIs différentes`);
        
        // API 1: /api/scrape/twitter
        try {
          const response1 = await fetch(`${this.baseUrl}/api/scrape/twitter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: keyword
            })
          });

          if (response1.ok) {
            const data = await response1.json();
            if (data && (data.tweets || data.data || data.items || data.results)) {
              const tweets = data.tweets || data.data || data.items || data.results || [];
              if (tweets.length > 0) {
                const transformed = PlatformTransformers.transformTwitterData(tweets);
                results.push(...transformed);
                console.log(`✅ Twitter principal: ${transformed.length} résultats`);
              }
            }
          }
        } catch (error) {
          console.warn('⚠️ Twitter principal inaccessible:', error);
        }

        // API 2: /api/scrape/twitter/tweets (par utilisateur si applicable)
        try {
          const response2 = await fetch(`${this.baseUrl}/api/scrape/twitter/tweets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: keyword // Si le keyword est un nom d'utilisateur
            })
          });

          if (response2.ok) {
            const data = await response2.json();
            if (data && (data.tweets || data.data || data.items || data.results)) {
              const tweets = data.tweets || data.data || data.items || data.results || [];
              if (tweets.length > 0) {
                const transformed = PlatformTransformers.transformTwitterData(tweets);
                results.push(...transformed);
                console.log(`✅ Twitter tweets: ${transformed.length} résultats`);
              }
            }
          }
        } catch (error) {
          console.warn('⚠️ Twitter tweets inaccessible:', error);
        }

        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (error) {
        console.error('❌ Erreur Twitter globale:', error);
      }
    }

    return results;
  }

  // === YOUTUBE AVEC TOUTES LES APIs DISPONIBLES ===
  private async searchYouTubeWithAllAPIs(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {  
        console.log(`📺 YOUTUBE - Recherche pour "${keyword}" avec 3 APIs différentes`);
        
        // API 1: /api/scrape/youtube
        try {
          const response1 = await fetch(`${this.baseUrl}/api/scrape/youtube`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              searchKeywords: keyword
            })
          });

          if (response1.ok) {
            const data = await response1.json();
            if (data && (data.videos || data.data || data.items || data.results)) {
              const videos = data.videos || data.data || data.items || data.results || [];
              if (videos.length > 0) {
                const transformed = PlatformTransformers.transformYouTubeData(videos);
                results.push(...transformed);
                console.log(`✅ YouTube principal: ${transformed.length} résultats`);
              }
            }
          }
        } catch (error) {
          console.warn('⚠️ YouTube principal inaccessible:', error);
        }

        // API 2: /api/scrape/youtube-channel-video
        try {
          const response2 = await fetch(`${this.baseUrl}/api/scrape/youtube-channel-video`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `https://www.youtube.com/results?search_query=${encodeURIComponent(keyword)}`
            })
          });

          if (response2.ok) {
            const data = await response2.json();
            if (data && (data.videos || data.data || data.items || data.results)) {
              const videos = data.videos || data.data || data.items || data.results || [];
              if (videos.length > 0) {
                const transformed = PlatformTransformers.transformYouTubeData(videos);
                results.push(...transformed);
                console.log(`✅ YouTube channel: ${transformed.length} résultats`);
              }
            }
          }
        } catch (error) {
          console.warn('⚠️ YouTube channel inaccessible:', error);
        }

        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (error) {
        console.error('❌ Erreur YouTube globale:', error);
      }
    }

    return results;
  }

  // === GOOGLE AVEC TOUTES LES APIs DISPONIBLES ===
  private async searchGoogleWithAllAPIs(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`🔍 GOOGLE - Recherche pour "${keyword}"`);
        
        const response = await fetch(`${this.baseUrl}/api/scrape/google-search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: keyword
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

        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (error) {
        console.error('❌ Erreur Google:', error);
      }
    }

    return results;
  }

  // === WEB AVEC TOUTES LES APIs DISPONIBLES ===
  private async searchWebWithAllAPIs(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    const results: MentionResult[] = [];
    
    for (const keyword of keywords) {
      try {
        console.log(`🌐 WEB - Recherche pour "${keyword}" avec 4 APIs différentes`);
        
        // API 1: /api/scrape/cheerio
        try {
          const response1 = await fetch(`${this.baseUrl}/api/scrape/cheerio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              startUrls: [`https://www.google.com/search?q=${encodeURIComponent(keyword)}`]
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
        } catch (error) {
          console.warn('⚠️ Web cheerio inaccessible:', error);
        }

        // API 2: /api/scrape/website-content
        try {
          const response2 = await fetch(`${this.baseUrl}/api/scrape/website-content`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
          console.warn('⚠️ Web content inaccessible:', error);
        }

        // API 3: /api/scrape/blog-content
        try {
          const response3 = await fetch(`${this.baseUrl}/api/scrape/blog-content`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              startUrls: [`https://www.blogger.com/search?q=${encodeURIComponent(keyword)}`]
            })
          });

          if (response3.ok) {
            const data = await response3.json();
            if (data && (data.results || data.data || data.items)) {
              const webResults = data.results || data.data || data.items || [];
              if (webResults.length > 0) {
                const transformed = PlatformTransformers.transformWebData(webResults);
                results.push(...transformed);
                console.log(`✅ Blog content: ${transformed.length} résultats`);
              }
            }
          }
        } catch (error) {
          console.warn('⚠️ Blog content inaccessible:', error);
        }

        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (error) {
        console.error('❌ Erreur Web globale:', error);
      }
    }

    return results;
  }
}
