
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
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Réponse API complète:`, data);
      
      // AUCUNE donnée statique - seules les données de l'API
      const items = data?.data?.items || data?.items || data || [];
      
      if (!Array.isArray(items)) {
        console.log('⚠️ Données API non-array, retour vide');
        return [];
      }
      
      if (items.length === 0) {
        console.log('⚠️ API retourne 0 éléments');
        return [];
      }
      
      return this.transformToMentions(items, endpoint);
    } catch (error) {
      console.error(`❌ Erreur réseau:`, error);
      throw error; // Propager l'erreur au lieu de retourner un tableau vide
    }
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
    
    // Construire URL basée sur la plateforme et les données réelles
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
    // Utiliser le sentiment si disponible dans les données API
    if (item.sentiment) {
      const sentiment = item.sentiment.toLowerCase();
      if (sentiment.includes('positive') || sentiment.includes('pos')) return 'positive';
      if (sentiment.includes('negative') || sentiment.includes('neg')) return 'negative';
    }
    
    // Sinon, calculer basé sur l'engagement réel
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
    return Math.max(1, score); // Minimum 1, maximum 10
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
