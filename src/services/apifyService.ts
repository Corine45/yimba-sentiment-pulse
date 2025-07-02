
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
    // Premier acteur Instagram
    try {
      console.log(`📸 Recherche Instagram avec premier acteur pour: "${searchTerm}"`);
      const result1 = await this.runInstagramActor('apify/instagram-api-scraper', searchTerm, language, period);
      if (result1.length > 0) return result1;
    } catch (error) {
      console.warn('Premier acteur Instagram échoué, tentative avec le second:', error);
    }

    // Deuxième acteur Instagram en fallback
    try {
      console.log(`📸 Recherche Instagram avec second acteur pour: "${searchTerm}"`);
      return await this.runInstagramActor('apify/instagram-post-scraper', searchTerm, language, period);
    } catch (error) {
      console.error('❌ Tous les acteurs Instagram ont échoué:', error);
      throw error;
    }
  }

  private async runInstagramActor(actorId: string, searchTerm: string, language: string, period: string): Promise<EngagementData[]> {
    const runInput = {
      searchHashtags: [searchTerm],
      resultsLimit: this.getResultsLimit(period),
      language: language,
      period: period
    };

    const syncResponse = await fetch(`${this.baseUrl}/acts/${actorId}/run-sync?token=${this.apiToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(runInput),
    });

    if (!syncResponse.ok) {
      throw new Error(`Erreur lors du scraping Instagram ${actorId}: ${syncResponse.statusText}`);
    }

    const results = await syncResponse.json();
    return this.transformInstagramResults(Array.isArray(results) ? results : []);
  }

  async scrapeTwitter(searchTerm: string, language: string = 'fr', period: string = '7d'): Promise<EngagementData[]> {
    const actorId = 'apidojo/twitter-scraper-lite';
    const runInput = {
      searchTerms: [searchTerm],
      maxTweets: this.getResultsLimit(period),
      language: language
    };

    try {
      console.log(`🐦 Démarrage du scraping Twitter RÉEL pour: "${searchTerm}"`);
      
      const syncResponse = await fetch(`${this.baseUrl}/acts/${actorId}/run-sync?token=${this.apiToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(runInput),
      });

      if (!syncResponse.ok) {
        console.error('❌ Erreur réponse Apify Twitter:', syncResponse.status, syncResponse.statusText);
        throw new Error(`Erreur lors du scraping Twitter: ${syncResponse.statusText}`);
      }

      const results = await syncResponse.json();
      console.log(`✅ Scraping Twitter RÉEL terminé, ${results.length} résultats trouvés`);
      
      return this.transformTwitterResults(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error(`❌ Erreur lors du scraping Twitter RÉEL:`, error);
      throw error;
    }
  }

  async scrapeYouTube(searchTerm: string, language: string = 'fr', period: string = '7d'): Promise<EngagementData[]> {
    const actorId = 'streamers/youtube-scraper';
    const runInput = {
      searchKeywords: [searchTerm],
      maxResults: this.getResultsLimit(period),
      language: language,
      period: period
    };

    try {
      console.log(`📺 Démarrage du scraping YouTube RÉEL pour: "${searchTerm}"`);
      
      const syncResponse = await fetch(`${this.baseUrl}/acts/${actorId}/run-sync?token=${this.apiToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(runInput),
      });

      if (!syncResponse.ok) {
        console.error('❌ Erreur réponse Apify YouTube:', syncResponse.status, syncResponse.statusText);
        throw new Error(`Erreur lors du scraping YouTube: ${syncResponse.statusText}`);
      }

      const results = await syncResponse.json();
      console.log(`✅ Scraping YouTube RÉEL terminé, ${results.length} résultats trouvés`);
      
      return this.transformYouTubeResults(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error(`❌ Erreur lors du scraping YouTube RÉEL:`, error);
      throw error;
    }
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
      
      return this.transformFacebookResults(Array.isArray(results) ? results : []);
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
      
      const transformedResults = this.transformTikTokResults(Array.isArray(results) ? results : []);
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

  private transformTwitterResults(results: any[]): EngagementData[] {
    return results.map((item, index) => ({
      likes: item.likeCount || item.favoriteCount || 0,
      comments: item.replyCount || item.commentCount || 0,
      shares: item.retweetCount || item.shareCount || 0,
      platform: 'Twitter',
      postId: item.id || item.tweetId || `twitter_${index}`,
      author: item.author?.username || item.username || 'Utilisateur Twitter',
      content: item.text || item.fullText || 'Tweet',
      url: item.url || `https://twitter.com/status/${item.id}` || '',
      timestamp: item.createdAt || item.timestamp || new Date().toISOString(),
      views: item.viewCount || 0,
    }));
  }

  private transformYouTubeResults(results: any[]): EngagementData[] {
    return results.map((item, index) => ({
      likes: item.likeCount || 0,
      comments: item.commentCount || 0,
      shares: item.shareCount || 0,
      platform: 'YouTube',
      postId: item.id || item.videoId || `youtube_${index}`,
      author: item.channelTitle || item.author || 'Chaîne YouTube',
      content: item.title || item.description || 'Vidéo YouTube',
      url: item.url || `https://youtube.com/watch?v=${item.id}` || '',
      timestamp: item.publishedAt || item.timestamp || new Date().toISOString(),
      views: item.viewCount || 0,
    }));
  }
}

export default ApifyService;
