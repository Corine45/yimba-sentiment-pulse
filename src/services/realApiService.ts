
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
    return this.postData('/api/scrape/instagram/comments', { postUrl }, filters);
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
            const fbQuery = keywords.join(' ');
            platformResults = await this.scrapeFacebook(fbQuery, filters);
            break;
          case 'twitter':
            const twitterQuery = keywords.join(' ');
            platformResults = await this.scrapeTwitter(twitterQuery, filters);
            break;
          case 'youtube':
            const youtubeQuery = keywords.join(' ');
            platformResults = await this.scrapeYouTube(youtubeQuery, filters);
            break;
          case 'instagram':
            platformResults = await this.scrapeInstagram(keywords, filters);
            break;
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
export { MentionResult, SearchFilters, CachedResult };
