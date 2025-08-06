import { MentionResult, SearchFilters } from '@/services/api/types';
import { PlatformTransformers } from '@/services/api/platformTransformers';
import { FiltersManager } from '@/services/api/filtersManager';
import { CacheManager } from '@/services/api/cacheManager';

export default class RealApiService {
  private baseUrl: string;
  private cacheManager = new CacheManager();

  constructor() {
    this.baseUrl = 'https://yimbapulseapi.a-car.ci';
  }

  clearCache(): void {
    this.cacheManager.clearCache();
    console.log('🧹 Cache complètement vidé');
  }

  async searchWithCache(
    keywords: string[],
    platforms: string[],
    filters: SearchFilters = {}
  ): Promise<{ results: MentionResult[], fromCache: boolean, platformCounts: { [key: string]: number } }> {
    // Nettoyage automatique des caches expirés
    this.cacheManager.cleanExpiredCache();
    
    const cacheKey = this.cacheManager.getCacheKey(keywords, platforms, filters);
    console.log(`🔍 RECHERCHE AVEC CACHE (15 min): ${cacheKey}`);
    
    // Vérifier le cache d'abord
    const cached = this.cacheManager.getCache(cacheKey);
    
    // Si on a du cache ET qu'il faut vérifier les mises à jour
    if (cached && this.cacheManager.shouldCheckForUpdates(cacheKey)) {
      console.log(`🔄 MISE À JOUR INCRÉMENTALE: Recherche de nouvelles données`);
      
      try {
        // Rechercher de nouvelles données
        const newResults = await this.searchAllPlatforms(keywords, platforms, filters);
        
        // Fusionner avec le cache existant
        const mergedResults = this.cacheManager.mergeNewDataWithCache(cacheKey, newResults, keywords, platforms, filters);
        
        const platformCounts = this.calculatePlatformCounts(mergedResults);
        return {
          results: mergedResults,
          fromCache: false, // Données mises à jour
          platformCounts
        };
      } catch (error) {
        console.warn('⚠️ Erreur lors de la mise à jour, utilisation du cache existant', error);
        const platformCounts = this.calculatePlatformCounts(cached.data);
        return {
          results: cached.data,
          fromCache: true,
          platformCounts
        };
      }
    }
    
    // Cache valide et récent
    if (cached) {
      console.log(`✅ DONNÉES RÉCUPÉRÉES DU CACHE: ${cached.data.length} mentions`);
      
      const platformCounts = this.calculatePlatformCounts(cached.data);
      return {
        results: cached.data,
        fromCache: true,
        platformCounts
      };
    }

    // Nouvelle recherche nécessaire
    console.log('🚀 NOUVELLE RECHERCHE: Aucun cache valide trouvé');
    const newResults = await this.searchAllPlatforms(keywords, platforms, filters);
    this.cacheManager.setCache(cacheKey, newResults, filters, keywords, platforms);
    
    const platformCounts = this.calculatePlatformCounts(newResults);
    return {
      results: newResults,
      fromCache: false,
      platformCounts
    };
  }

  // 🆕 Méthode dédiée pour la recherche sur toutes les plateformes
  private async searchAllPlatforms(keywords: string[], platforms: string[], filters: SearchFilters): Promise<MentionResult[]> {
    try {
      console.log('🚀 RECHERCHE API BACKEND - YIMBA PULSE API AVEC OPTIMISATIONS');
      console.log('🔗 Base URL:', this.baseUrl);
      console.log('📝 Mots-clés:', keywords);
      console.log('🎯 Plateformes sélectionnées:', platforms);
      console.log('🔧 Filtres appliqués:', Object.keys(filters).length > 0 ? filters : 'Aucun filtre (données brutes)');
      
      const allResults: MentionResult[] = [];
      
      // Traitement en parallèle pour maximiser les résultats
      const platformPromises = platforms.map(async (platform) => {
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
          return platformResults;
          
        } catch (error) {
          console.error(`❌ Erreur ${platform} COMPLET:`, error);
          return [];
        }
      });

      // Attendre tous les résultats en parallèle
      const allPlatformResults = await Promise.all(platformPromises);
      allPlatformResults.forEach(results => allResults.push(...results));

      // Application des filtres seulement si spécifiés
      const filteredResults = Object.keys(filters).length > 0 ? 
        FiltersManager.applyFilters(allResults, filters) : allResults;
      
      console.log(`🏁 RECHERCHE YIMBA PULSE TERMINÉE: ${filteredResults.length} mentions ${Object.keys(filters).length > 0 ? 'après filtrage' : 'brutes'}`);
      console.log(`📊 Répartition finale:`, this.calculatePlatformCounts(filteredResults));

      return filteredResults;

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
              hashtags: [keyword.startsWith('#') ? keyword : `#${keyword}`],
              searchQueries: [keyword],
              resultsPerPage: 500,
              maxResults: 1000,
              scrapeOptions: {
                maxRequestRetries: 3,
                requestTimeoutSecs: 30
              }
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

        // API 2: TikTok Search API avec plus de paramètres
        try {
          const response2 = await fetch(`${this.baseUrl}/api/scrape/tiktok/search`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              search: keyword,
              searchQueries: [keyword],
              hashtags: [keyword.startsWith('#') ? keyword : `#${keyword}`],
              maxResults: 1000,
              resultsPerPage: 500,
              scrapeOptions: {
                maxRequestRetries: 3,
                requestTimeoutSecs: 30
              }
            })
          });

          if (response2.ok) {
            const data = await response2.json();
            if (data && data.data) {
              const items = Array.isArray(data.data) ? data.data : [];
              if (items.length > 0) {
                const transformed = PlatformTransformers.transformTikTokData(items);
                results.push(...transformed);
                console.log(`✅ TikTok Free: ${transformed.length} résultats`);
              }
            }
          }
        } catch (error) {
          console.warn('⚠️ TikTok Free API inaccessible:', error);
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
        console.log(`📘 FACEBOOK - Recherche pour "${keyword}" avec APIs différentes`);
        
        // API 1: Facebook Search Scraper  
        try {
          const response1 = await fetch(`${this.baseUrl}/api/scrape/facebook/search-scraper`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: keyword,
              search: keyword,
              resultsPerPage: 500,
              maxResults: 1000,
              scrapeOptions: {
                maxRequestRetries: 3,
                requestTimeoutSecs: 30
              }
            })
          });

          if (response1.ok) {
            const data = await response1.json();
            if (data && data.data) {
              const posts = Array.isArray(data.data) ? data.data : [];
              if (posts.length > 0) {
                const transformed = PlatformTransformers.transformFacebookData(posts);
                results.push(...transformed);
                console.log(`✅ Facebook Search Scraper: ${transformed.length} résultats`);
              }
            }
          }
        } catch (error) {
          console.warn('⚠️ Facebook Search Scraper inaccessible:', error);
        }

        // API 2: /api/scrape/facebook (général)
        try {
          const response2 = await fetch(`${this.baseUrl}/api/scrape/facebook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: keyword,
              search: keyword,
              resultsPerPage: 100,
              maxResults: 200
            })
          });

          if (response2.ok) {
            const data = await response2.json();
            if (data && (data.items || data.data)) {
              const posts = data.items || data.data || [];
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

        // API 3: /api/scrape/facebook/page-search
        try {
          const response3 = await fetch(`${this.baseUrl}/api/scrape/facebook/page-search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              keywords: [keyword]
            })
          });

          if (response3.ok) {
            const data = await response3.json();
            if (data && data.data) {
              const pages = Array.isArray(data.data) ? data.data : [];
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
        console.log(`📸 INSTAGRAM - Recherche pour "${keyword}" avec APIs différentes`);
        
        // API 1: /api/scrape/instagram-general
        try {
          const response1 = await fetch(`${this.baseUrl}/api/scrape/instagram-general`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              searchType: "hashtag",
              searchInput: keyword.startsWith('#') ? keyword : `#${keyword}`,
              resultsLimit: 200,
              resultsPerPage: 100
            })
          });

          if (response1.ok) {
            const data = await response1.json();
            if (data && data.data) {
              const posts = Array.isArray(data.data) ? data.data : [];
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

        // API 2: /api/scrape/instagram/api (officielle)
        try {
          const response2 = await fetch(`${this.baseUrl}/api/scrape/instagram/api`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              usernames: [keyword],
              hashtags: [keyword.startsWith('#') ? keyword : `#${keyword}`],
              resultsLimit: 200,
              resultsPerPage: 100
            })
          });

          if (response2.ok) {
            const data = await response2.json();
            if (data && data.data) {
              const posts = Array.isArray(data.data) ? data.data : [];
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
        console.log(`🐦 TWITTER/X - Recherche pour "${keyword}"`);
        
        // API 1: /api/scrape/twitter
        try {
          const response1 = await fetch(`${this.baseUrl}/api/scrape/twitter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: keyword,
              search: keyword,
              searchQueries: [keyword],
              maxResults: 200,
              resultsPerPage: 100
            })
          });

          if (response1.ok) {
            const data = await response1.json();
            if (data && (data.tweets || data.data)) {
              const tweets = data.tweets || data.data || [];
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
        console.log(`📺 YOUTUBE - Recherche pour "${keyword}"`);
        
        // API 1: /api/scrape/youtube
        try {
          const response1 = await fetch(`${this.baseUrl}/api/scrape/youtube`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              searchKeywords: keyword,
              maxItems: 200,
              resultsPerPage: 100
            })
          });

          if (response1.ok) {
            const data = await response1.json();
            if (data && data.data && data.data.items) {
              const videos = data.data.items || [];
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
            query: keyword,
            maxResults: 200,
            resultsPerPage: 100
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.data) {
            const searchResults = Array.isArray(data.data) ? data.data : [];
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
        console.log(`🌐 WEB - Recherche pour "${keyword}"`);
        
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
            if (data && data.data) {
              const webResults = Array.isArray(data.data) ? data.data : [];
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

        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (error) {
        console.error('❌ Erreur Web globale:', error);
      }
    }

    return results;
  }
}