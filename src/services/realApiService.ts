import { MentionResult, SearchFilters, CachedResult } from './api/types';
import { CacheManager } from './api/cacheManager';
import { DataTransformer } from './api/dataTransformer';
import { FiltersManager } from './api/filtersManager';

class RealApiService {
  private backendUrl: string;
  private cacheManager: CacheManager;

  constructor(backendUrl: string = 'https://yimbapulseapi.a-car.ci') {
    this.backendUrl = backendUrl;
    this.cacheManager = new CacheManager();
  }

  private async postData(endpoint: string, payload: any, filters?: SearchFilters): Promise<MentionResult[]> {
    try {
      console.log(`🚀 APPEL API RÉEL vers: ${this.backendUrl}${endpoint}`);
      console.log(`📤 Payload:`, payload);
      
      const response = await fetch(`${this.backendUrl}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error(`❌ Erreur API:`, response.status, response.statusText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Réponse API complète:`, data);
      
      const items = data?.data?.items || data?.items || data || [];
      
      if (!Array.isArray(items)) {
        console.log('⚠️ Données API non-array, retour vide');
        return [];
      }
      
      if (items.length === 0) {
        console.log('⚠️ API retourne 0 éléments');
        return [];
      }
      
      let results = DataTransformer.transformToMentions(items, endpoint);
      
      // Appliquer les filtres
      if (filters) {
        results = FiltersManager.applyFilters(results, filters);
      }
      
      return results;
    } catch (error) {
      console.error(`❌ Erreur réseau:`, error);
      throw error;
    }
  }

  async scrapeTikTok(hashtags: string[], filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/tiktok', { hashtags }, filters);
  }

  async scrapeTikTokByLocation(latitude: number, longitude: number, radius: number, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/tiktok/location', { latitude, longitude, radius }, filters);
  }

  async scrapeFacebook(query: string, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/facebook', { query }, filters);
  }

  async scrapeFacebookByUrl(url: string, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/facebook-url-id', { url }, filters);
  }

  async scrapeFacebookPagePosts(page: string, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/facebook-page-posts', { page }, filters);
  }

  async scrapeFacebookPageLikes(page: string, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/facebook-page-likes', { page }, filters);
  }

  async scrapeFacebookPageSearch(keywords: string[], filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/facebook/page-search', { keywords }, filters);
  }

  async scrapeFacebookPosts(query: string, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/facebook-posts', { query }, filters);
  }

  async scrapeFacebookReviews(query: string, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/facebook-reviews', { query }, filters);
  }

  async scrapeTwitter(query: string, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/twitter', { query }, filters);
  }

  async scrapeTwitterTweets(username: string, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/twitter/tweets', { username }, filters);
  }

  async scrapeTwitterReplies(postId: string, maxReplies: number = 100, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/x-post-replies', { postId, maxReplies }, filters);
  }

  async scrapeYouTube(searchKeywords: string, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/youtube', { searchKeywords }, filters);
  }

  async scrapeYouTubeComments(videoId: string, maxComments: number = 50, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/youtube-comments', { videoId, maxComments }, filters);
  }

  async scrapeInstagram(usernames: string[], filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/instagram', { usernames }, filters);
  }

  async scrapeInstagramPosts(username: string, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/instagram-posts', { username }, filters);
  }

  async scrapeInstagramGeneral(searchType: string, searchInput: string, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/instagram-general', { searchType, searchInput }, filters);
  }

  async scrapeInstagramComments(postUrl: string, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/instagram-comments', { postUrl }, filters);
  }

  async scrapeInstagramHashtag(hashtag: string, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/instagram/hashtag', { hashtag }, filters);
  }

  async scrapeInstagramApi(usernames: string[], filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/instagram/api', { usernames }, filters);
  }

  async scrapeInstagramReels(usernames: string[], filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/instagram/reels', { usernames }, filters);
  }

  async scrapeInstagramLocation(locationIds: string[], filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/instagram/location', { locationIds }, filters);
  }

  async scrapeSocialEmails(keyword: string, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/social-emails', { keyword }, filters);
  }

  async scrapeSocialAnalytics(profiles: string[], filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/social/analytics', { profiles }, filters);
  }

  async scrapeWebsiteContent(startUrls: string[], filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/website-content', { startUrls }, filters);
  }

  async scrapeBlogContent(startUrls: string[], filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/blog-content', { startUrls }, filters);
  }

  async scrapeFacebookPostsIdeal(pageUrl: string, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/facebook-posts-ideal', { pageUrl }, filters);
  }

  async searchWithCache(
    keywords: string[], 
    platforms: string[], 
    filters: SearchFilters = {}
  ): Promise<{ results: MentionResult[]; fromCache: boolean; platformCounts: { [key: string]: number } }> {
    const cacheKey = this.cacheManager.getCacheKey(keywords, platforms, filters);
    const cached = this.cacheManager.getCache(cacheKey);

    if (cached && this.cacheManager.isValidCache(cached)) {
      console.log('📦 Résultats récupérés du cache (valide 10 minutes)');
      const platformCounts = this.calculatePlatformCounts(cached.data);
      return { results: cached.data, fromCache: true, platformCounts };
    }

    const allResults: MentionResult[] = [];
    
    for (const platform of platforms) {
      try {
        let platformResults: MentionResult[] = [];

        switch (platform.toLowerCase()) {
          case 'tiktok':
            platformResults = await this.scrapeTikTok(keywords, filters);
            break;
            
          case 'facebook':
            console.log('🔍 RECHERCHE FACEBOOK ENRICHIE AVEC TOUTES LES APIs');
            const fbQuery = keywords.join(' ');
            
            // 1. Recherche générale Facebook
            const generalResults = await this.scrapeFacebook(fbQuery, filters);
            platformResults.push(...generalResults);
            
            // 2. API: Posts Facebook
            try {
              const postsResults = await this.scrapeFacebookPosts(fbQuery, filters);
              platformResults.push(...postsResults);
              console.log(`✅ Facebook Posts: ${postsResults.length} résultats`);
            } catch (error) {
              console.error('❌ Erreur Facebook Posts:', error);
            }
            
            // 3. NOUVELLE API: Posts Facebook Ideal
            try {
              // Essayer avec des URLs Facebook si disponibles dans les mots-clés
              const facebookUrls = keywords.filter(k => k.includes('facebook.com/'));
              for (const url of facebookUrls) {
                const idealResults = await this.scrapeFacebookPostsIdeal(url, filters);
                platformResults.push(...idealResults);
                console.log(`✅ Facebook Posts Ideal pour ${url}: ${idealResults.length} résultats`);
              }
            } catch (error) {
              console.error('❌ Erreur Facebook Posts Ideal:', error);
            }
            
            // 4. API: Reviews Facebook
            try {
              const reviewsResults = await this.scrapeFacebookReviews(fbQuery, filters);
              platformResults.push(...reviewsResults);
              console.log(`✅ Facebook Reviews: ${reviewsResults.length} résultats`);
            } catch (error) {
              console.error('❌ Erreur Facebook Reviews:', error);
            }
            
            // 5. Recherche de pages spécifiques si mots-clés contiennent @
            if (keywords.some(k => k.startsWith('@') || k.includes('facebook.com/'))) {
              const pageNames = keywords.filter(k => k.startsWith('@')).map(k => k.substring(1));
              for (const page of pageNames) {
                try {
                  const pagePosts = await this.scrapeFacebookPagePosts(page, filters);
                  platformResults.push(...pagePosts);
                  
                  if (filters.includePageLikes) {
                    const pageLikes = await this.scrapeFacebookPageLikes(page, filters);
                    platformResults.push(...pageLikes);
                  }
                } catch (error) {
                  console.error(`❌ Erreur page ${page}:`, error);
                }
              }
            }
            
            // 6. Recherche additionnelle dans les pages
            if (filters.includePageSearch) {
              try {
                const pageSearchResults = await this.scrapeFacebookPageSearch(keywords, filters);
                platformResults.push(...pageSearchResults);
              } catch (error) {
                console.error('❌ Erreur Facebook Page Search:', error);
              }
            }
            
            console.log(`🎯 FACEBOOK ENRICHI TOTAL: ${platformResults.length} résultats combinés`);
            break;
            
          case 'instagram':
            console.log('🔍 RECHERCHE INSTAGRAM ENRICHIE AVEC TOUTES LES APIs');
            
            // 1. Recherche générale Instagram
            const instagramResults = await this.scrapeInstagram(keywords, filters);
            platformResults.push(...instagramResults);
            
            // 2. Recherche par posts
            for (const keyword of keywords) {
              try {
                const postsResults = await this.scrapeInstagramPosts(keyword, filters);
                platformResults.push(...postsResults);
              } catch (error) {
                console.error(`❌ Erreur Instagram Posts ${keyword}:`, error);
              }
            }
            
            // 3. API: Commentaires Instagram
            const instagramUrls = platformResults
              .filter(r => r.platform === 'Instagram' && r.url)
              .slice(0, 5);
              
            for (const result of instagramUrls) {
              try {
                const commentsResults = await this.scrapeInstagramComments(result.url, filters);
                platformResults.push(...commentsResults);
                console.log(`✅ Instagram Comments pour ${result.url}: ${commentsResults.length} résultats`);
              } catch (error) {
                console.error(`❌ Erreur Instagram Comments:`, error);
              }
            }
            
            // 4. Recherche par hashtags
            for (const keyword of keywords) {
              if (keyword.startsWith('#')) {
                try {
                  const hashtagResults = await this.scrapeInstagramHashtag(keyword.substring(1), filters);
                  platformResults.push(...hashtagResults);
                } catch (error) {
                  console.error(`❌ Erreur Instagram Hashtag ${keyword}:`, error);
                }
              }
            }
            
            console.log(`🎯 INSTAGRAM ENRICHI TOTAL: ${platformResults.length} résultats combinés`);
            break;
            
          case 'twitter':
            const twitterQuery = keywords.join(' ');
            platformResults = await this.scrapeTwitter(twitterQuery, filters);
            break;
            
          case 'youtube':
            const youtubeQuery = keywords.join(' ');
            platformResults = await this.scrapeYouTube(youtubeQuery, filters);
            break;
        }

        // Filtrer les résultats selon les critères avancés
        if (platformResults.length > 0) {
          platformResults = this.applyAdvancedFilters(platformResults, filters);
        }

        allResults.push(...platformResults);
      } catch (error) {
        console.error(`Erreur pour ${platform}:`, error);
      }
    }

    this.cacheManager.setCache(cacheKey, allResults, filters, keywords, platforms);

    const platformCounts = this.calculatePlatformCounts(allResults);
    return { results: allResults, fromCache: false, platformCounts };
  }

  private applyAdvancedFilters(results: MentionResult[], filters: SearchFilters): MentionResult[] {
    let filtered = [...results];

    // Filtrer par auteur si spécifié
    if (filters.author) {
      const authorFilter = filters.author.toLowerCase().replace('@', '');
      filtered = filtered.filter(item => 
        item.author.toLowerCase().includes(authorFilter)
      );
    }

    // Filtrer par domaine si spécifié
    if (filters.domain) {
      filtered = filtered.filter(item => 
        item.url.toLowerCase().includes(filters.domain!.toLowerCase())
      );
    }

    // Filtrer par engagement minimum
    if (filters.minEngagement) {
      filtered = filtered.filter(item => {
        const totalEngagement = item.engagement.likes + item.engagement.comments + item.engagement.shares;
        return totalEngagement >= filters.minEngagement!;
      });
    }

    // Filtrer par score d'influence
    if (filters.minInfluenceScore) {
      filtered = filtered.filter(item => 
        (item.influenceScore || 0) >= filters.minInfluenceScore!
      );
    }

    return filtered;
  }

  private calculatePlatformCounts(results: MentionResult[]): { [key: string]: number } {
    const counts: { [key: string]: number } = {};
    results.forEach(result => {
      counts[result.platform] = (counts[result.platform] || 0) + 1;
    });
    return counts;
  }

  clearCache(): void {
    this.cacheManager.clearCache();
  }

  getCacheSize(): number {
    return this.cacheManager.getCacheSize();
  }
}

export default RealApiService;
export type { MentionResult, SearchFilters, CachedResult };
