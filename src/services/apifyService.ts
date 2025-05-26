
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
    }>;
  };
}

class ApifyService {
  private apiToken: string;
  private baseUrl = 'https://api.apify.com/v2';

  constructor(apiToken: string) {
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

  async scrapeTikTok(username: string): Promise<EngagementData[]> {
    const actorId = 'apify/tiktok-scraper';
    const runInput = {
      profiles: [username],
      resultsPerPage: 50
    };

    return this.runActor(actorId, runInput, 'tiktok');
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

  private transformResults(results: any[], platform: string): EngagementData[] {
    return results.map((item, index) => ({
      likes: item.likeCount || item.likesCount || item.reactions || 0,
      comments: item.commentCount || item.commentsCount || 0,
      shares: item.shareCount || item.sharesCount || item.retweetCount || 0,
      platform,
      postId: item.id || item.postId || `${platform}_${index}`,
      author: item.author?.userName || item.username || item.author || 'Inconnu',
      content: item.text || item.caption || item.description || '',
      url: item.url || item.link || '',
      timestamp: item.createdAt || item.timestamp || new Date().toISOString(),
    }));
  }
}

export default ApifyService;
