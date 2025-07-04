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
}

export interface CachedResult {
  data: MentionResult[];
  timestamp: number;
  filters: SearchFilters;
  keywords: string[];
  platforms: string[];
}

class RealApiService {
  private backendUrl: string;
  private cache: Map<string, CachedResult> = new Map();
  private cacheExpiration = 5 * 60 * 1000; // 5 minutes

  constructor(backendUrl: string = 'https://yimbapulseapi.a-car.ci') {
    this.backendUrl = backendUrl;
  }

  private getCacheKey(keywords: string[], platforms: string[], filters: SearchFilters): string {
    return JSON.stringify({ keywords, platforms, filters });
  }

  private isValidCache(cached: CachedResult): boolean {
    return Date.now() - cached.timestamp < this.cacheExpiration;
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
      
      let results = this.transformToMentions(items, endpoint);
      
      // Appliquer les filtres
      if (filters) {
        results = this.applyFilters(results, filters);
      }
      
      return results;
    } catch (error) {
      console.error(`❌ Erreur réseau:`, error);
      throw error;
    }
  }

  private applyFilters(results: MentionResult[], filters: SearchFilters): MentionResult[] {
    let filtered = [...results];

    // Filtrer par sentiment
    if (filters.sentiment) {
      filtered = filtered.filter(item => item.sentiment === filters.sentiment);
    }

    // Filtrer par engagement
    if (filters.minEngagement !== undefined) {
      filtered = filtered.filter(item => 
        (item.engagement.likes + item.engagement.comments + item.engagement.shares) >= filters.minEngagement
      );
    }

    if (filters.maxEngagement !== undefined) {
      filtered = filtered.filter(item => 
        (item.engagement.likes + item.engagement.comments + item.engagement.shares) <= filters.maxEngagement
      );
    }

    // Filtrer par période
    if (filters.period) {
      const now = new Date();
      const periodMap: { [key: string]: number } = {
        '1d': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '3m': 90 * 24 * 60 * 60 * 1000
      };
      
      const periodMs = periodMap[filters.period];
      if (periodMs) {
        const cutoffDate = new Date(now.getTime() - periodMs);
        filtered = filtered.filter(item => new Date(item.timestamp) >= cutoffDate);
      }
    }

    // Trier les résultats
    if (filters.sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else if (filters.sortBy === 'popular') {
      filtered.sort((a, b) => {
        const aEngagement = a.engagement.likes + a.engagement.comments + a.engagement.shares;
        const bEngagement = b.engagement.likes + b.engagement.comments + b.engagement.shares;
        return bEngagement - aEngagement;
      });
    }

    return filtered;
  }

  private transformToMentions(items: any[], endpoint: string): MentionResult[] {
    const platform = this.getPlatformFromEndpoint(endpoint);
    
    return items.map((item, index) => ({
      id: item.id || item._id || `${platform}_${Date.now()}_${index}`,
      platform,
      content: this.extractContent(item, platform),
      author: this.extractAuthor(item, platform),
      url: this.extractUrl(item, platform),
      timestamp: this.extractTimestamp(item),
      engagement: this.extractEngagement(item, platform),
      sentiment: this.calculateSentiment(item),
      influenceScore: this.calculateInfluenceScore(item),
      sourceUrl: item.sourceUrl || item.url || '',
      location: this.extractLocation(item)
    }));
  }

  private extractLocation(item: any): MentionResult['location'] | undefined {
    if (item.location || item.geo || item.coordinates) {
      return {
        latitude: item.location?.latitude || item.geo?.lat || item.coordinates?.lat,
        longitude: item.location?.longitude || item.geo?.lng || item.coordinates?.lng,
        city: item.location?.city || item.geo?.city,
        country: item.location?.country || item.geo?.country
      };
    }
    return undefined;
  }

  private getPlatformFromEndpoint(endpoint: string): string {
    if (endpoint.includes('tiktok')) return 'TikTok';
    if (endpoint.includes('facebook')) return 'Facebook';
    if (endpoint.includes('twitter') || endpoint.includes('x-post')) return 'Twitter';
    if (endpoint.includes('youtube')) return 'YouTube';
    if (endpoint.includes('instagram')) return 'Instagram';
    return 'Unknown';
  }

  private extractContent(item: any, platform: string): string {
    const contentFields = ['text', 'content', 'desc', 'message', 'title', 'description', 'caption'];
    for (const field of contentFields) {
      if (item[field] && typeof item[field] === 'string') return item[field];
    }
    return item.text || item.content || `Contenu ${platform}`;
  }

  private extractAuthor(item: any, platform: string): string {
    const authorFields = ['author', 'username', 'user', 'channelTitle', 'from'];
    for (const field of authorFields) {
      if (item[field]) {
        return typeof item[field] === 'object' ? 
          (item[field].name || item[field].username || item[field].displayName) : 
          item[field];
      }
    }
    return item.author?.name || item.username || `User_${platform}`;
  }

  private extractUrl(item: any, platform: string): string {
    if (item.url) return item.url;
    if (item.webVideoUrl) return item.webVideoUrl;
    if (item.permalink_url) return item.permalink_url;
    
    const author = this.extractAuthor(item, platform);
    switch (platform) {
      case 'TikTok':
        return `https://tiktok.com/@${author}`;
      case 'Facebook':
        return `https://facebook.com/${item.id || 'post'}`;
      case 'Twitter':
        return `https://twitter.com/${author}/status/${item.id}`;
      case 'YouTube':
        return `https://youtube.com/watch?v=${item.id}`;
      case 'Instagram':
        return `https://instagram.com/${author}`;
      default:
        return '#';
    }
  }

  private extractTimestamp(item: any): string {
    const timeFields = ['timestamp', 'created_at', 'createTime', 'publishedAt', 'date', 'createdAt'];
    for (const field of timeFields) {
      if (item[field]) {
        const date = typeof item[field] === 'number' ? 
          new Date(item[field] * 1000) : 
          new Date(item[field]);
        if (!isNaN(date.getTime())) {
          return date.toISOString();
        }
      }
    }
    return new Date().toISOString();
  }

  private extractEngagement(item: any, platform: string): MentionResult['engagement'] {
    return {
      likes: this.extractNumber(item, ['likes', 'diggCount', 'likesCount', 'favorite_count', 'likeCount']),
      comments: this.extractNumber(item, ['comments', 'commentCount', 'commentsCount', 'reply_count']),
      shares: this.extractNumber(item, ['shares', 'shareCount', 'sharesCount', 'retweet_count']),
      views: this.extractNumber(item, ['views', 'playCount', 'viewCount', 'view_count']) || undefined
    };
  }

  private extractNumber(item: any, fields: string[]): number {
    for (const field of fields) {
      if (typeof item[field] === 'number') return item[field];
      if (typeof item[field] === 'string') {
        const num = parseInt(item[field], 10);
        if (!isNaN(num)) return num;
      }
    }
    return 0;
  }

  private calculateSentiment(item: any): 'positive' | 'negative' | 'neutral' {
    if (item.sentiment) {
      const sentiment = item.sentiment.toLowerCase();
      if (sentiment.includes('positive') || sentiment.includes('pos')) return 'positive';
      if (sentiment.includes('negative') || sentiment.includes('neg')) return 'negative';
    }
    
    const engagement = this.extractEngagement(item, '');
    const totalEngagement = engagement.likes + engagement.comments + engagement.shares;
    
    if (totalEngagement > 100) return 'positive';
    if (totalEngagement < 5) return 'negative';
    return 'neutral';
  }

  private calculateInfluenceScore(item: any): number {
    const engagement = this.extractEngagement(item, '');
    const total = engagement.likes + engagement.comments * 2 + engagement.shares * 3;
    const views = engagement.views || 0;
    
    let score = Math.min(Math.round((total + views / 100) / 50), 10);
    return Math.max(1, score);
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
    const cacheKey = this.getCacheKey(keywords, platforms, filters);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isValidCache(cached)) {
      console.log('📦 Résultats récupérés du cache');
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

    const cacheData: CachedResult = {
      data: allResults,
      timestamp: Date.now(),
      filters,
      keywords,
      platforms
    };
    this.cache.set(cacheKey, cacheData);

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
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

export default RealApiService;
