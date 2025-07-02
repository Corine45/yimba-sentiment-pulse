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

  async scrapeInstagram(username: string): Promise<EngagementData[]> {
    const actorId = 'apify/instagram-scraper';
    const runInput = {
      usernames: [username],
      resultsLimit: 50
    };

    return this.runActor(actorId, runInput, 'instagram');
  }

  async scrapeTwitter(username: string): Promise<EngagementData[]> {
    const actorId = 'apify/twitter-scraper';
    const runInput = {
      handles: [username],
      tweetsDesired: 50
    };

    return this.runActor(actorId, runInput, 'twitter');
  }

  async scrapeFacebook(pageUrl: string): Promise<EngagementData[]> {
    const actorId = 'apify/facebook-posts-scraper';
    const runInput = {
      startUrls: [{ url: pageUrl }],
      maxPosts: 50
    };

    return this.runActor(actorId, runInput, 'facebook');
  }

  async scrapeTikTok(keywords: string): Promise<EngagementData[]> {
    const actorId = 'clockworks/tiktok-scraper';
    const runInput = {
      hashtags: [keywords],
      resultsPerPage: 20,
      shouldDownloadCovers: false,
      shouldDownloadVideos: false,
      shouldDownloadSubtitles: false
    };

    try {
      console.log(`🎵 Démarrage du scraping TikTok pour: "${keywords}"`);
      
      // Utiliser l'endpoint synchrone pour TikTok
      const syncResponse = await fetch(`${this.baseUrl}/acts/${actorId}/run-sync?token=${this.apiToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(runInput),
      });

      if (!syncResponse.ok) {
        console.error('Erreur réponse Apify:', syncResponse.status, syncResponse.statusText);
        throw new Error(`Erreur lors du scraping TikTok: ${syncResponse.statusText}`);
      }

      const results = await syncResponse.json();
      console.log(`✅ Scraping TikTok terminé, ${results.length} résultats trouvés`);
      
      if (!Array.isArray(results)) {
        console.warn('Format de réponse inattendu:', results);
        return [];
      }
      
      const transformedResults = this.transformTikTokResults(results);
      console.log('📊 Données transformées:', transformedResults.length, 'posts');
      
      return transformedResults;
    } catch (error) {
      console.error(`❌ Erreur lors du scraping TikTok:`, error);
      throw error;
    }
  }

  private async runActor(actorId: string, runInput: any, platform: string): Promise<EngagementData[]> {
    try {
      console.log(`Démarrage du scraping ${platform} avec Apify...`);
      
      // Démarrer l'exécution de l'acteur
      const runResponse = await fetch(`${this.baseUrl}/acts/${actorId}/runs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(runInput),
      });

      if (!runResponse.ok) {
        throw new Error(`Erreur lors du démarrage du scraping: ${runResponse.statusText}`);
      }

      const runData = await runResponse.json();
      const runId = runData.data.id;

      console.log(`Run ID: ${runId} - Attente des résultats...`);

      // Attendre que l'exécution soit terminée
      let isFinished = false;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes maximum

      while (!isFinished && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Attendre 5 secondes
        
        const statusResponse = await fetch(`${this.baseUrl}/actor-runs/${runId}`, {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
          },
        });

        const statusData = await statusResponse.json();
        isFinished = statusData.data.status === 'SUCCEEDED';
        
        if (statusData.data.status === 'FAILED') {
          throw new Error('Le scraping a échoué');
        }
        
        attempts++;
      }

      if (!isFinished) {
        throw new Error('Timeout: Le scraping prend trop de temps');
      }

      // Récupérer les résultats
      const resultsResponse = await fetch(`${this.baseUrl}/actor-runs/${runId}/dataset/items`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
      });

      if (!resultsResponse.ok) {
        throw new Error(`Erreur lors de la récupération des résultats: ${resultsResponse.statusText}`);
      }

      const results = await resultsResponse.json();
      
      return this.transformResults(results, platform);
    } catch (error) {
      console.error(`Erreur lors du scraping ${platform}:`, error);
      throw error;
    }
  }

  private transformTikTokResults(results: any[]): EngagementData[] {
    return results.map((item, index) => {
      console.log(`Transformation item ${index}:`, {
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
        platform: 'tiktok',
        postId: item.id || item.webVideoUrl || `tiktok_${index}`,
        author: item.authorMeta?.name || item.author?.userName || item.username || 'Inconnu',
        content: item.desc || item.text || item.description || '',
        url: item.webVideoUrl || item.url || '',
        timestamp: item.createTime ? new Date(item.createTime * 1000).toISOString() : 
                  item.createdAt || new Date().toISOString(),
        views: item.playCount || item.viewCount || 0,
      };
    });
  }

  private transformResults(results: any[], platform: string): EngagementData[] {
    if (platform === 'tiktok') {
      return this.transformTikTokResults(results);
    }

    return results.map((item, index) => ({
      likes: item.likeCount || item.likesCount || item.reactions || item.diggCount || 0,
      comments: item.commentCount || item.commentsCount || 0,
      shares: item.shareCount || item.sharesCount || item.retweetCount || 0,
      platform,
      postId: item.id || item.postId || item.webVideoUrl || `${platform}_${index}`,
      author: item.author?.userName || item.username || item.author || item.authorMeta?.name || 'Inconnu',
      content: item.text || item.caption || item.description || item.desc || '',
      url: item.url || item.link || item.webVideoUrl || '',
      timestamp: item.createdAt || item.timestamp || item.createTime || new Date().toISOString(),
      views: item.viewCount || item.playCount || 0,
    }));
  }
}

export default ApifyService;
