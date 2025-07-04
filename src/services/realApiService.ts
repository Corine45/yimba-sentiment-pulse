
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
}

class RealApiService {
  private backendUrl: string;

  constructor(backendUrl: string = 'https://yimbapulseapi.a-car.ci') {
    this.backendUrl = backendUrl;
  }

  private async postData(endpoint: string, payload: any): Promise<MentionResult[]> {
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
        return [];
      }

      const data = await response.json();
      console.log(`✅ Réponse API complète:`, data);
      
      const items = data?.data?.items || data?.items || [];
      return Array.isArray(items) ? this.transformToMentions(items, endpoint) : [];
    } catch (error) {
      console.error(`❌ Erreur réseau:`, error);
      return [];
    }
  }

  private transformToMentions(items: any[], endpoint: string): MentionResult[] {
    const platform = this.getPlatformFromEndpoint(endpoint);
    
    return items.map((item, index) => ({
      id: item.id || `${platform}_${Date.now()}_${index}`,
      platform,
      content: this.extractContent(item, platform),
      author: this.extractAuthor(item, platform),
      url: this.extractUrl(item, platform),
      timestamp: this.extractTimestamp(item),
      engagement: this.extractEngagement(item, platform),
      sentiment: this.calculateSentiment(item),
      influenceScore: this.calculateInfluenceScore(item),
      sourceUrl: item.sourceUrl || item.url || ''
    }));
  }

  private getPlatformFromEndpoint(endpoint: string): string {
    if (endpoint.includes('tiktok')) return 'TikTok';
    if (endpoint.includes('facebook')) return 'Facebook';
    if (endpoint.includes('twitter')) return 'Twitter';
    if (endpoint.includes('youtube')) return 'YouTube';
    if (endpoint.includes('instagram')) return 'Instagram';
    return 'Unknown';
  }

  private extractContent(item: any, platform: string): string {
    const contentFields = ['text', 'content', 'desc', 'message', 'title', 'description', 'caption'];
    for (const field of contentFields) {
      if (item[field]) return item[field];
    }
    return `Contenu ${platform}`;
  }

  private extractAuthor(item: any, platform: string): string {
    const authorFields = ['author', 'username', 'user', 'channelTitle', 'from'];
    for (const field of authorFields) {
      if (item[field]) {
        return typeof item[field] === 'object' ? item[field].name || item[field].username : item[field];
      }
    }
    return `Utilisateur ${platform}`;
  }

  private extractUrl(item: any, platform: string): string {
    if (item.url) return item.url;
    if (item.webVideoUrl) return item.webVideoUrl;
    if (item.permalink_url) return item.permalink_url;
    
    // Construire URL basée sur la plateforme
    switch (platform) {
      case 'TikTok':
        return `https://tiktok.com/@${this.extractAuthor(item, platform)}`;
      case 'Facebook':
        return `https://facebook.com/${item.id || 'post'}`;
      case 'Twitter':
        return `https://twitter.com/${this.extractAuthor(item, platform)}/status/${item.id}`;
      case 'YouTube':
        return `https://youtube.com/watch?v=${item.id}`;
      case 'Instagram':
        return `https://instagram.com/${this.extractAuthor(item, platform)}`;
      default:
        return '#';
    }
  }

  private extractTimestamp(item: any): string {
    const timeFields = ['timestamp', 'created_at', 'createTime', 'publishedAt', 'date'];
    for (const field of timeFields) {
      if (item[field]) {
        const date = typeof item[field] === 'number' ? new Date(item[field] * 1000) : new Date(item[field]);
        return date.toISOString();
      }
    }
    return new Date().toISOString();
  }

  private extractEngagement(item: any, platform: string): MentionResult['engagement'] {
    return {
      likes: item.likes || item.diggCount || item.likesCount || item.favorite_count || 0,
      comments: item.comments || item.commentCount || item.commentsCount || item.reply_count || 0,
      shares: item.shares || item.shareCount || item.sharesCount || item.retweet_count || 0,
      views: item.views || item.playCount || item.viewCount || item.view_count || undefined
    };
  }

  private calculateSentiment(item: any): 'positive' | 'negative' | 'neutral' {
    // Logique simple basée sur l'engagement
    const engagement = this.extractEngagement(item, '');
    const totalEngagement = engagement.likes + engagement.comments + engagement.shares;
    
    if (totalEngagement > 1000) return 'positive';
    if (totalEngagement < 10) return 'negative';
    return 'neutral';
  }

  private calculateInfluenceScore(item: any): number {
    const engagement = this.extractEngagement(item, '');
    const total = engagement.likes + engagement.comments * 2 + engagement.shares * 3;
    return Math.min(Math.round(total / 100), 10);
  }

  // Méthodes spécifiques par plateforme avec payloads corrects
  async scrapeTikTok(hashtags: string[]): Promise<MentionResult[]> {
    return this.postData('/api/scrape/tiktok', { hashtags });
  }

  async scrapeFacebook(query: string): Promise<MentionResult[]> {
    return this.postData('/api/scrape/facebook', { query });
  }

  async scrapeTwitter(query: string): Promise<MentionResult[]> {
    return this.postData('/api/scrape/twitter', { query });
  }

  async scrapeYouTube(searchKeywords: string): Promise<MentionResult[]> {
    return this.postData('/api/scrape/youtube', { searchKeywords });
  }

  async scrapeInstagram(usernames: string[]): Promise<MentionResult[]> {
    return this.postData('/api/scrape/instagram', { usernames });
  }
}

export default RealApiService;
