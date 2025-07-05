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

  async scrapeFacebookPostsIdeal(pageUrl: string, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/facebook-posts-ideal', { pageUrl }, filters);
  }

  // NOUVELLES APIs AJOUTÉES
  async scrapeGoogleSearch(query: string, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/google-search', { query }, filters);
  }

  async scrapeInstagramProfile(username: string, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/instagram-profile', { username }, filters);
  }

  async scrapeCheerio(startUrls: string[], filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/cheerio', { startUrls }, filters);
  }

  async scrapeYouTubeChannelVideo(query: string, filters?: SearchFilters): Promise<MentionResult[]> {
    return this.postData('/api/scrape/youtube-channel-video', { query }, filters);
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
            console.log('🔍 RECHERCHE FACEBOOK ENRICHIE AVEC TOUTES LES APIs DISPONIBLES');
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
            
            // 3. API: Facebook Posts Ideal (URL Facebook détectées dans les mots-clés)
            try {
              const facebookUrls = keywords.filter(k => k.includes('facebook.com/') || k.includes('web.facebook.com/'));
              for (const url of facebookUrls) {
                console.log(`🎯 RECHERCHE Facebook Posts Ideal pour: ${url}`);
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
            console.log('🔍 RECHERCHE INSTAGRAM ENRICHIE AVEC TOUTES LES APIs DISPONIBLES');
            
            // 1. Recherche générale Instagram
            const instagramResults = await this.scrapeInstagram(keywords, filters);
            platformResults.push(...instagramResults);
            
            // 2. NOUVELLE API: Instagram Profile pour les profils spécifiques
            for (const keyword of keywords) {
              if (keyword.startsWith('@') || keyword.includes('instagram.com/')) {
                const username = keyword.replace('@', '').replace(/.*instagram\.com\//, '').split('/')[0];
                try {
                  const profileResults = await this.scrapeInstagramProfile(username, filters);
                  platformResults.push(...profileResults);
                  console.log(`✅ Instagram Profile pour ${username}: ${profileResults.length} résultats`);
                } catch (error) {
                  console.error(`❌ Erreur Instagram Profile ${username}:`, error);
                }
              }
            }
            
            // 3. Recherche par posts
            for (const keyword of keywords) {
              try {
                const postsResults = await this.scrapeInstagramPosts(keyword, filters);
                platformResults.push(...postsResults);
              } catch (error) {
                console.error(`❌ Erreur Instagram Posts ${keyword}:`, error);
              }
            }
            
            // 4. API: Commentaires Instagram
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
            
            // 5. Recherche par hashtags
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
            console.log('🔍 RECHERCHE YOUTUBE ENRICHIE');
            const youtubeQuery = keywords.join(' ');
            
            // 1. Recherche générale YouTube
            const youtubeResults = await this.scrapeYouTube(youtubeQuery, filters);
            platformResults.push(...youtubeResults);
            
            // 2. NOUVELLE API: YouTube Channel Video pour les chaînes spécifiques
            for (const keyword of keywords) {
              if (keyword.includes('youtube.com/@') || keyword.includes('@')) {
                try {
                  const channelResults = await this.scrapeYouTubeChannelVideo(keyword, filters);
                  platformResults.push(...channelResults);
                  console.log(`✅ YouTube Channel pour ${keyword}: ${channelResults.length} résultats`);
                } catch (error) {
                  console.error(`❌ Erreur YouTube Channel ${keyword}:`, error);
                }
              }
            }
            
            console.log(`🎯 YOUTUBE ENRICHI TOTAL: ${platformResults.length} résultats combinés`);
            break;

          case 'google':
            console.log('🔍 RECHERCHE GOOGLE SEARCH');
            const googleQuery = keywords.join(' ');
            try {
              platformResults = await this.scrapeGoogleSearch(googleQuery, filters);
              console.log(`✅ Google Search: ${platformResults.length} résultats`);
            } catch (error) {
              console.error('❌ Erreur Google Search:', error);
            }
            break;

          case 'web':
            console.log('🔍 RECHERCHE WEB AVEC CHEERIO');
            try {
              // Extraire les URLs des mots-clés ou utiliser des sites par défaut
              const webUrls = keywords.filter(k => k.includes('http'));
              if (webUrls.length > 0) {
                platformResults = await this.scrapeCheerio(webUrls, filters);
                console.log(`✅ Web Scraping: ${platformResults.length} résultats`);
              }
            } catch (error) {
              console.error('❌ Erreur Web Scraping:', error);
            }
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

    console.log('🔧 APPLICATION DES FILTRES AVANCÉS CÔTÉ SERVICE:', filters);

    // Tri par popularité/engagement
    if (filters.sortBy === 'popular' || filters.sortBy === 'engagement') {
      filtered.sort((a, b) => {
        const aEngagement = a.engagement.likes + a.engagement.comments + a.engagement.shares;
        const bEngagement = b.engagement.likes + b.engagement.comments + b.engagement.shares;
        return bEngagement - aEngagement;
      });
      console.log('🔥 Tri par popularité appliqué');
    }

    // Tri par récence
    if (filters.sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      console.log('📅 Tri par récence appliqué');
    }

    // Tri par influence
    if (filters.sortBy === 'influence') {
      filtered.sort((a, b) => (b.influenceScore || 0) - (a.influenceScore || 0));
      console.log('⭐ Tri par influence appliqué');
    }

    // Filtrer par auteur si spécifié
    if (filters.author) {
      const authorFilter = filters.author.toLowerCase().replace('@', '');
      filtered = filtered.filter(item => 
        item.author.toLowerCase().includes(authorFilter)
      );
      console.log(`👤 Filtre auteur appliqué: ${filters.author}`);
    }

    // Filtrer par domaine si spécifié
    if (filters.domain) {
      filtered = filtered.filter(item => 
        item.url.toLowerCase().includes(filters.domain!.toLowerCase())
      );
      console.log(`🌐 Filtre domaine appliqué: ${filters.domain}`);
    }

    // Filtrer par engagement minimum
    if (filters.minEngagement) {
      filtered = filtered.filter(item => {
        const totalEngagement = item.engagement.likes + item.engagement.comments + item.engagement.shares;
        return totalEngagement >= filters.minEngagement!;
      });
      console.log(`📈 Filtre engagement min appliqué: ${filters.minEngagement}`);
    }

    // Filtrer par score d'influence
    if (filters.minInfluenceScore) {
      filtered = filtered.filter(item => 
        (item.influenceScore || 0) >= filters.minInfluenceScore!
      );
      console.log(`🎯 Filtre influence min appliqué: ${filters.minInfluenceScore}`);
    }

    console.log(`✅ FILTRES AVANCÉS APPLIQUÉS: ${results.length} → ${filtered.length} résultats`);
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
