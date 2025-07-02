
export interface EngagementData {
  likes: number;
  comments: number;
  shares: number;
  platform: string;
  postId: string;
  author: string;
  content: string;
  url: string;
  timestamp: string;
  views?: number;
}

export interface ApifyResponse {
  data: {
    items: Array<{
      id: string;
      text: string;
      author: {
        userName: string;
      };
      likeCount: number;
      commentCount: number;
      shareCount: number;
      url: string;
      createdAt: string;
      viewCount?: number;
    }>;
  };
}

class ApifyService {
  private apiToken: string;
  private baseUrl = 'https://api.apify.com/v2';

  constructor(apiToken: string = 'apify_api_JP5bjoQMQYYZ36blKD7yfm2gDRYNng3W7h69') {
    this.apiToken = apiToken;
  }

  async scrapeInstagram(searchTerm: string, language: string = 'fr', period: string = '7d'): Promise<EngagementData[]> {
    const actorId = 'apify/instagram-api-scraper';
    const runInput = {
      searchHashtags: [searchTerm],
      resultsLimit: this.getResultsLimit(period),
      language: language,
      period: period
    };

    try {
      console.log(`📸 Démarrage du scraping Instagram RÉEL pour: "${searchTerm}"`);
      
      const syncResponse = await fetch(`${this.baseUrl}/acts/${actorId}/run-sync?token=${this.apiToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(runInput),
      });

      if (!syncResponse.ok) {
        console.error('❌ Erreur réponse Apify Instagram:', syncResponse.status, syncResponse.statusText);
        throw new Error(`Erreur lors du scraping Instagram: ${syncResponse.statusText}`);
      }

      const results = await syncResponse.json();
      console.log(`✅ Scraping Instagram RÉEL terminé, ${results.length} résultats trouvés`);
      
      if (!Array.isArray(results)) {
        console.warn('⚠️ Format de réponse Instagram inattendu:', results);
        return [];
      }
      
      return this.transformInstagramResults(results);
    } catch (error) {
      console.error(`❌ Erreur lors du scraping Instagram RÉEL:`, error);
      throw error;
    }
  }

  async scrapeTwitter(searchTerm: string, language: string = 'fr', period: string = '7d'): Promise<EngagementData[]> {
    const actorId = 'apify/twitter-scraper';
    const runInput = {
      searchTerms: [searchTerm],
      maxTweets: this.getResultsLimit(period),
      language: language
    };

    return this.runActorSync(actorId, runInput, 'twitter');
  }

  async scrapeFacebook(searchTerm: string, language: string = 'fr', period: string = '7d'): Promise<EngagementData[]> {
    const actorId = 'easyapi/facebook-posts-search-scraper';
    const runInput = {
      searchTerms: [searchTerm],
      maxPosts: this.getResultsLimit(period),
      language: language,
      period: period
    };

    try {
      console.log(`📘 Démarrage du scraping Facebook RÉEL pour: "${searchTerm}"`);
      
      const syncResponse = await fetch(`${this.baseUrl}/acts/${actorId}/run-sync?token=${this.apiToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(runInput),
      });

      if (!syncResponse.ok) {
        console.error('❌ Erreur réponse Apify Facebook:', syncResponse.status, syncResponse.statusText);
        throw new Error(`Erreur lors du scraping Facebook: ${syncResponse.statusText}`);
      }

      const results = await syncResponse.json();
      console.log(`✅ Scraping Facebook RÉEL terminé, ${results.length} résultats trouvés`);
      
      if (!Array.isArray(results)) {
        console.warn('⚠️ Format de réponse Facebook inattendu:', results);
        return [];
      }
      
      return this.transformFacebookResults(results);
    } catch (error) {
      console.error(`❌ Erreur lors du scraping Facebook RÉEL:`, error);
      throw error;
    }
  }

  async scrapeTikTok(searchTerm: string, language: string = 'fr', period: string = '7d'): Promise<EngagementData[]> {
    const actorId = 'clockworks/tiktok-scraper';
    const runInput = {
      hashtags: [searchTerm],
      resultsPerPage: this.getResultsLimit(period),
      language: language,
      period: period,
      shouldDownloadCovers: false,
      shouldDownloadVideos: false,
      shouldDownloadSubtitles: false
    };

    try {
      console.log(`🎵 Démarrage du scraping TikTok RÉEL pour: "${searchTerm}"`);
      
      const syncResponse = await fetch(`${this.baseUrl}/acts/${actorId}/run-sync?token=${this.apiToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(runInput),
      });

      if (!syncResponse.ok) {
        console.error('❌ Erreur réponse Apify TikTok:', syncResponse.status, syncResponse.statusText);
        throw new Error(`Erreur lors du scraping TikTok: ${syncResponse.statusText}`);
      }

      const results = await syncResponse.json();
      console.log(`✅ Scraping TikTok RÉEL terminé, ${results.length} résultats trouvés`);
      
      if (!Array.isArray(results)) {
        console.warn('⚠️ Format de réponse TikTok inattendu:', results);
        return [];
      }
      
      const transformedResults = this.transformTikTokResults(results);
      console.log('📊 Données TikTok RÉELLES transformées:', transformedResults.length, 'posts');
      
      return transformedResults;
    } catch (error) {
      console.error(`❌ Erreur lors du scraping TikTok RÉEL:`, error);
      throw error;
    }
  }

  private getResultsLimit(period: string): number {
    switch (period) {
      case '1d': return 10;
      case '7d': return 20;
      case '30d': return 50;
      case '3m': return 100;
      default: return 20;
    }
  }

  private async runActorSync(actorId: string, runInput: any, platform: string): Promise<EngagementData[]> {
    try {
      console.log(`Démarrage du scraping ${platform} avec Apify...`);
      
      const syncResponse = await fetch(`${this.baseUrl}/acts/${actorId}/run-sync?token=${this.apiToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(runInput),
      });

      if (!syncResponse.ok) {
        throw new Error(`Erreur lors du scraping ${platform}: ${syncResponse.statusText}`);
      }

      const results = await syncResponse.json();
      console.log(`✅ Scraping ${platform} terminé, ${results.length} résultats trouvés`);
      
      return this.transformResults(results, platform);
    } catch (error) {
      console.error(`Erreur lors du scraping ${platform}:`, error);
      throw error;
    }
  }

  private transformTikTokResults(results: any[]): EngagementData[] {
    return results.map((item, index) => {
      console.log(`Transformation TikTok item ${index}:`, {
        id: item.id || item.webVideoUrl,
        author: item.authorMeta?.name || item.author,
        likes: item.diggCount,
        comments: item.commentCount,
        shares: item.shareCount,
        views: item.playCount
      });

      return {
        likes: item.diggCount || item.likeCount || 0,
        comments: item.commentCount || 0,
        shares: item.shareCount || 0,
        platform: 'TikTok',
        postId: item.id || item.webVideoUrl || `tiktok_${index}`,
        author: item.authorMeta?.name || item.author?.userName || item.username || 'Utilisateur TikTok',
        content: item.desc || item.text || item.description || 'Contenu TikTok',
        url: item.webVideoUrl || item.url || '',
        timestamp: item.createTime ? new Date(item.createTime * 1000).toISOString() : 
                  item.createdAt || new Date().toISOString(),
        views: item.playCount || item.viewCount || 0,
      };
    });
  }

  private transformInstagramResults(results: any[]): EngagementData[] {
    return results.map((item, index) => ({
      likes: item.likesCount || item.likeCount || 0,
      comments: item.commentsCount || item.commentCount || 0,
      shares: item.sharesCount || item.shareCount || 0,
      platform: 'Instagram',
      postId: item.id || item.shortCode || `instagram_${index}`,
      author: item.ownerUsername || item.username || 'Utilisateur Instagram',
      content: item.caption || item.text || 'Post Instagram',
      url: item.url || item.displayUrl || '',
      timestamp: item.timestamp || new Date().toISOString(),
      views: item.videoViewCount || item.viewCount || 0,
    }));
  }

  private transformFacebookResults(results: any[]): EngagementData[] {
    return results.map((item, index) => ({
      likes: item.likes || item.likesCount || item.reactions || 0,
      comments: item.comments || item.commentsCount || 0,
      shares: item.shares || item.sharesCount || 0,
      platform: 'Facebook',
      postId: item.id || item.postId || `facebook_${index}`,
      author: item.author || item.pageName || 'Utilisateur Facebook',
      content: item.text || item.message || 'Post Facebook',
      url: item.url || item.link || '',
      timestamp: item.createdTime || item.timestamp || new Date().toISOString(),
      views: item.viewCount || 0,
    }));
  }

  private transformResults(results: any[], platform: string): EngagementData[] {
    switch (platform.toLowerCase()) {
      case 'tiktok':
        return this.transformTikTokResults(results);
      case 'instagram':
        return this.transformInstagramResults(results);
      case 'facebook':
        return this.transformFacebookResults(results);
      default:
        return results.map((item, index) => ({
          likes: item.likeCount || item.likesCount || item.reactions || item.diggCount || 0,
          comments: item.commentCount || item.commentsCount || 0,
          shares: item.shareCount || item.sharesCount || item.retweetCount || 0,
          platform,
          postId: item.id || item.postId || item.webVideoUrl || `${platform}_${index}`,
          author: item.author?.userName || item.username || item.author || item.authorMeta?.name || `Utilisateur ${platform}`,
          content: item.text || item.caption || item.description || item.desc || `Contenu ${platform}`,
          url: item.url || item.link || item.webVideoUrl || '',
          timestamp: item.createdAt || item.timestamp || item.createTime || new Date().toISOString(),
          views: item.viewCount || item.playCount || 0,
        }));
    }
  }
}

export default ApifyService;
