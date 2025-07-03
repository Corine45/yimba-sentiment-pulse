
export interface EngagementData {
  likes: number;
  comments: number;
  shares: number;
  views: number;
  platform: string;
  postId: string;
  author: string;
  content: string;
  url: string;
  timestamp: string;
}

class ApifyService {
  private backendUrl: string;

  constructor(backendUrl: string = 'https://yimbapulseapi.a-car.ci') {
    this.backendUrl = backendUrl;
  }

  private async postData(path: string, payload: any, platform: string): Promise<any[]> {
    try {
      console.log(`🚀 Appel API ${platform} vers: ${this.backendUrl}/api/scrape/${path}`);
      console.log(`📤 Payload:`, payload);
      
      const response = await fetch(`${this.backendUrl}/api/scrape/${path}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Backend ${platform} Error:`, {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        throw new Error(`Échec récupération ${platform}: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ ${platform} - Réponse RÉELLE reçue:`, data);
      
      // Utiliser la structure exacte de votre API : data.data.items
      const items = data?.data?.items || [];
      console.log(`📊 ${platform} - Items RÉELS extraits:`, items.length);
      
      return Array.isArray(items) ? items : [];
    } catch (error) {
      console.error(`❌ Erreur ${platform}:`, error);
      return [];
    }
  }

  async scrapeTikTok(searchTerm: string, language: string = 'fr', period: string = '7d'): Promise<EngagementData[]> {
    console.log(`🎵 TikTok API RÉELLE - Recherche: "${searchTerm}" (${language}, ${period})`);
    
    const hashtags = searchTerm.split(',').map(term => term.trim().replace('#', ''));
    const items = await this.postData('tiktok', { hashtags }, 'TikTok');

    return items.map((item: any) => ({
      likes: item.diggCount ?? item.likes ?? 0,
      comments: item.commentCount ?? item.comments ?? 0,
      shares: item.shareCount ?? item.shares ?? 0,
      views: item.playCount ?? item.views ?? 0,
      platform: 'TikTok',
      postId: item.id ?? item.postId ?? `tiktok_${Date.now()}`,
      author: item.authorMeta?.name ?? item.author ?? item.username ?? 'Utilisateur TikTok',
      content: item.text ?? item.content ?? item.desc ?? '',
      url: item.webVideoUrl ?? item.url ?? `https://tiktok.com/@${item.author}`,
      timestamp: item.createTime ? new Date(item.createTime * 1000).toISOString() : (item.timestamp ?? new Date().toISOString()),
    }));
  }

  async scrapeInstagram(searchTerm: string, language: string = 'fr', period: string = '7d'): Promise<EngagementData[]> {
    console.log(`📸 Instagram API RÉELLE - Recherche: "${searchTerm}" (${language}, ${period})`);
    
    const usernames = searchTerm.split(',').map(term => term.trim().replace('@', ''));
    const items = await this.postData('instagram', { usernames }, 'Instagram');

    return items.map((item: any) => ({
      likes: item.likes ?? item.likesCount ?? 0,
      comments: item.comments ?? item.commentsCount ?? 0,
      shares: 0, // Instagram n'a pas de partages publics
      views: item.views ?? item.viewsCount ?? 0,
      platform: 'Instagram',
      postId: item.id ?? item.postId ?? `instagram_${Date.now()}`,
      author: item.username ?? item.author ?? 'Utilisateur Instagram',
      content: item.caption ?? item.content ?? item.text ?? item.biography ?? '',
      url: item.url ?? item.permalink ?? `https://instagram.com/${item.username}`,
      timestamp: item.timestamp ?? item.taken_at_timestamp ? new Date(item.taken_at_timestamp * 1000).toISOString() : new Date().toISOString(),
    }));
  }

  async scrapeFacebook(searchTerm: string, language: string = 'fr', period: string = '7d'): Promise<EngagementData[]> {
    console.log(`📘 Facebook API RÉELLE - Recherche: "${searchTerm}" (${language}, ${period})`);
    
    const keywords = searchTerm.split(',').map(term => term.trim());
    const items = await this.postData('facebook', { keywords }, 'Facebook');

    return items.map((item: any) => ({
      likes: item.reactions?.like ?? item.likes ?? item.likesCount ?? 0,
      comments: item.commentsCount ?? item.comments ?? 0,
      shares: item.sharesCount ?? item.shares ?? 0,
      views: item.views ?? 0,
      platform: 'Facebook',
      postId: item.postId ?? item.id ?? `facebook_${Date.now()}`,
      author: item.username ?? item.author ?? item.from?.name ?? 'Utilisateur Facebook',
      content: item.text ?? item.content ?? item.message ?? '',
      url: item.url ?? item.permalink_url ?? `https://facebook.com/${item.postId}`,
      timestamp: item.timestamp ?? item.created_time ?? new Date().toISOString(),
    }));
  }

  async scrapeTwitter(searchTerm: string, language: string = 'fr', period: string = '7d'): Promise<EngagementData[]> {
    console.log(`🐦 Twitter API RÉELLE - Recherche: "${searchTerm}" (${language}, ${period})`);
    
    const keywords = searchTerm.split(',').map(term => term.trim());
    const items = await this.postData('twitter', { keywords }, 'Twitter');

    return items.map((item: any) => ({
      likes: item.likes ?? item.favorite_count ?? 0,
      comments: item.replies ?? item.reply_count ?? 0,
      shares: item.retweets ?? item.retweet_count ?? 0,
      views: item.views ?? item.view_count ?? 0,
      platform: 'Twitter',
      postId: item.id ?? item.id_str ?? `twitter_${Date.now()}`,
      author: item.username ?? item.user?.screen_name ?? item.author ?? 'Utilisateur Twitter',
      content: item.text ?? item.full_text ?? item.content ?? '',
      url: item.url ?? `https://twitter.com/${item.username}/status/${item.id}`,
      timestamp: item.timestamp ?? item.created_at ?? new Date().toISOString(),
    }));
  }

  async scrapeYouTube(searchTerm: string, language: string = 'fr', period: string = '7d'): Promise<EngagementData[]> {
    console.log(`📺 YouTube API RÉELLE - Recherche: "${searchTerm}" (${language}, ${period})`);
    
    const keywords = searchTerm.split(',').map(term => term.trim());
    const items = await this.postData('youtube', { keywords }, 'YouTube');

    return items.map((item: any) => ({
      likes: item.likes ?? item.likeCount ?? 0,
      comments: item.comments ?? item.commentCount ?? 0,
      shares: 0, // YouTube n'expose pas les partages dans l'API
      views: item.views ?? item.viewCount ?? 0,
      platform: 'YouTube',
      postId: item.id ?? item.videoId ?? `youtube_${Date.now()}`,
      author: item.channel ?? item.channelTitle ?? item.author ?? 'Chaîne YouTube',
      content: item.title ?? item.content ?? item.description ?? '',
      url: item.url ?? `https://youtube.com/watch?v=${item.id}`,
      timestamp: item.publishedAt ?? item.timestamp ?? new Date().toISOString(),
    }));
  }
}

export default ApifyService;
