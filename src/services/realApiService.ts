import { DataTransformer } from './api/dataTransformer';
import { MentionResult, SearchFilters, CachedResult } from './api/types';

const CACHE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

export default class RealApiService {
  private baseUrl: string;
  private cache: Map<string, CachedResult>;

  constructor() {
    this.baseUrl = 'https://yimbapulseapi.a-car.ci';
    this.cache = new Map();
  }

  private generateCacheKey(
    keywords: string[],
    platforms: string[],
    filters: SearchFilters
  ): string {
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
      console.log('📝 Mots-clés:', keywords);
      console.log('🎯 Plateformes sélectionnées:', platforms);
      console.log('🔧 Filtres appliqués:', filters);

      const allResults: MentionResult[] = [];
      const platformCounts: { [key: string]: number } = {};
      
      // Traitement harmonisé pour chaque plateforme
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
            case 'tiktok':
              platformResults = await this.searchTikTokEnriched(keywords, filters);
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
            console.log(`✅ ${platform}: ${platformResults.length} résultats récupérés`);
          } else {
            console.log(`⚪ ${platform}: Aucun résultat`);
            platformCounts[platform] = 0;
          }
          
        } catch (error) {
          console.error(`❌ Erreur ${platform}:`, error);
          platformCounts[platform] = 0;
        }
      }

      // Application des filtres avancés sur tous les résultats
      const filteredResults = this.applyAdvancedFilters(allResults, filters);
      
      console.log(`\n🏁 RÉSULTAT FINAL HARMONISÉ:`);
      console.log(`📊 Total mentions: ${filteredResults.length}`);
      console.log(`🎯 Répartition:`, platformCounts);

      // Mise en cache
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

  private async searchFacebookEnriched(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    console.log('📘 FACEBOOK ENRICHI - Utilisation facebook-posts-ideal');
    
    try {
      const results: MentionResult[] = [];
      
      // 1. API facebook-posts-ideal pour pages spécifiques et recherche générale
      for (const keyword of keywords) {
        console.log(`🔍 Facebook Posts Ideal pour: "${keyword}"`);
        
        // Détection si c'est une URL de page Facebook
        let searchInput = keyword;
        if (keyword.includes('facebook.com') || keyword.includes('fb.com')) {
          searchInput = keyword;
          console.log('🎯 URL Facebook détectée, recherche directe');
        } else {
          // Recherche par mot-clé
          console.log('🔤 Mot-clé détecté, recherche textuelle');
        }
        
        try {
          const response = await fetch(`${this.baseUrl}/api/scrape/facebook-posts-ideal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: searchInput.includes('facebook.com') ? searchInput : `https://www.facebook.com/search/posts/?q=${encodeURIComponent(searchInput)}`,
              max_posts: 50
            })
          });

          if (response.ok) {
            const data = await response.json();
            const transformed = DataTransformer.transformToMentions(data.posts || data.data || [], 'facebook-posts-ideal');
            results.push(...transformed);
            console.log(`✅ Facebook Posts Ideal: ${transformed.length} posts`);
          }
        } catch (error) {
          console.error('❌ Erreur Facebook Posts Ideal:', error);
        }
      }

      return results;

    } catch (error) {
      console.error('❌ Erreur Facebook enrichi:', error);
      return [];
    }
  }

  private async searchInstagramEnriched(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    console.log('📷 INSTAGRAM ENRICHI - Utilisation instagram-profile');
    
    try {
      const results: MentionResult[] = [];
      
      for (const keyword of keywords) {
        console.log(`🔍 Instagram Profile pour: "${keyword}"`);
        
        // Détecter si c'est un username ou un mot-clé
        let username = keyword;
        if (keyword.includes('instagram.com')) {
          // Extraire le username de l'URL
          const match = keyword.match(/instagram\.com\/([^\/\?]+)/);
          username = match ? match[1] : keyword;
        } else if (!keyword.startsWith('@')) {
          // Si ce n'est pas une URL ni un @username, rechercher comme hashtag
          username = keyword;
        }

        try {
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
            const transformed = DataTransformer.transformToMentions(data.posts || data.data || [], 'instagram-profile');
            results.push(...transformed);
            console.log(`✅ Instagram Profile: ${transformed.length} posts`);
          }
        } catch (error) {
          console.error('❌ Erreur Instagram Profile:', error);
        }
      }

      return results;

    } catch (error) {
      console.error('❌ Erreur Instagram enrichi:', error);
      return [];
    }
  }

  private async searchGoogleEnriched(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    console.log('🔍 GOOGLE SEARCH ENRICHI');
    
    try {
      const results: MentionResult[] = [];
      
      for (const keyword of keywords) {
        console.log(`🔍 Google Search pour: "${keyword}"`);
        
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
            const transformed = DataTransformer.transformToMentions(data.results || data.data || [], 'google-search');
            results.push(...transformed);
            console.log(`✅ Google Search: ${transformed.length} résultats`);
          }
        } catch (error) {
          console.error('❌ Erreur Google Search:', error);
        }
      }

      return results;

    } catch (error) {
      console.error('❌ Erreur Google enrichi:', error);
      return [];
    }
  }

  private async searchWebEnriched(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    console.log('🌐 WEB SCRAPING ENRICHI - Cheerio');
    
    try {
      const results: MentionResult[] = [];
      
      // URLs par défaut pour le web scraping basées sur les mots-clés
      const baseUrls = [
        'https://news.google.com',
        'https://www.bbc.com',
        'https://www.lemonde.fr',
        'https://www.rfi.fr'
      ];
      
      for (const keyword of keywords) {
        console.log(`🔍 Web Scraping pour: "${keyword}"`);
        
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
            const transformed = DataTransformer.transformToMentions(data.results || data.data || [], 'cheerio');
            results.push(...transformed);
            console.log(`✅ Web Scraping: ${transformed.length} pages`);
          }
        } catch (error) {
          console.error('❌ Erreur Web Scraping:', error);
        }
      }

      return results;

    } catch (error) {
      console.error('❌ Erreur Web enrichi:', error);
      return [];
    }
  }

  private async searchYouTubeEnriched(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    console.log('📺 YOUTUBE ENRICHI - Channel Video');
    
    try {
      const results: MentionResult[] = [];
      
      for (const keyword of keywords) {
        console.log(`🔍 YouTube Channel pour: "${keyword}"`);
        
        // Détecter si c'est une URL de chaîne ou un mot-clé
        let query = keyword;
        if (!keyword.includes('youtube.com')) {
          query = `https://www.youtube.com/results?search_query=${encodeURIComponent(keyword)}`;
        }
        
        try {
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
            const transformed = DataTransformer.transformToMentions(data.videos || data.data || [], 'youtube-channel-video');
            results.push(...transformed);
            console.log(`✅ YouTube Channel: ${transformed.length} vidéos`);
          }
        } catch (error) {
          console.error('❌ Erreur YouTube Channel:', error);
        }
      }

      return results;

    } catch (error) {
      console.error('❌ Erreur YouTube enrichi:', error);
      return [];
    }
  }

  private async searchTwitterEnriched(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    console.log('🐦 TWITTER/X ENRICHI');
    try {
      const results: MentionResult[] = [];
  
      for (const keyword of keywords) {
        console.log(`🔍 Twitter/X pour: "${keyword}"`);
  
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
            const transformed = DataTransformer.transformToMentions(data.tweets || data.data || [], 'x-twitter');
            results.push(...transformed);
            console.log(`✅ Twitter/X: ${transformed.length} tweets`);
          }
        } catch (error) {
          console.error('❌ Erreur Twitter/X:', error);
        }
      }
  
      return results;
  
    } catch (error) {
      console.error('❌ Erreur Twitter/X enrichi:', error);
      return [];
    }
  }

  private async searchTikTokEnriched(keywords: string[], filters: SearchFilters): Promise<MentionResult[]> {
    console.log('🎵 TIKTOK ENRICHI');
    try {
      const results: MentionResult[] = [];
  
      for (const keyword of keywords) {
        console.log(`🔍 TikTok pour: "${keyword}"`);
  
        try {
          const response = await fetch(`${this.baseUrl}/api/scrape/tiktok`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: keyword,
              max_videos: 30
            })
          });
  
          if (response.ok) {
            const data = await response.json();
            const transformed = DataTransformer.transformToMentions(data.videos || data.data || [], 'tiktok');
            results.push(...transformed);
            console.log(`✅ TikTok: ${transformed.length} vidéos`);
          }
        } catch (error) {
          console.error('❌ Erreur TikTok:', error);
        }
      }
  
      return results;
  
    } catch (error) {
      console.error('❌ Erreur TikTok enrichi:', error);
      return [];
    }
  }

  private applyAdvancedFilters(mentions: MentionResult[], filters: SearchFilters): MentionResult[] {
    let filteredResults = [...mentions];
  
    if (filters.sentiment) {
      filteredResults = filteredResults.filter(mention => mention.sentiment === filters.sentiment);
    }
  
    if (filters.minInfluenceScore) {
      filteredResults = filteredResults.filter(mention => (mention.influenceScore || 0) >= filters.minInfluenceScore!);
    }
  
    if (filters.maxInfluenceScore) {
      filteredResults = filteredResults.filter(mention => (mention.influenceScore || 0) <= filters.maxInfluenceScore!);
    }
  
    if (filters.language) {
      filteredResults = filteredResults.filter(mention => mention.content.includes(filters.language!));
    }
  
    // Ajoutez ici d'autres filtres avancés selon les besoins
  
    return filteredResults;
  }
}
