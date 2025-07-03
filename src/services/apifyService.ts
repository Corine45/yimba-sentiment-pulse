
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
      console.log(`🚀 Appel API RÉEL ${platform} vers: ${this.backendUrl}/api/scrape/${path}`);
      console.log(`📤 Payload envoyé:`, payload);
      
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
        console.error(`❌ Erreur API ${platform}:`, {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        return []; // Retourner tableau vide en cas d'erreur
      }

      const data = await response.json();
      console.log(`✅ ${platform} - Réponse API RÉELLE reçue:`, data);
      
      // Utiliser la structure exacte de votre API
      const items = data?.data?.items || [];
      console.log(`📊 ${platform} - Items RÉELS extraits de l'API:`, items.length);
      
      return Array.isArray(items) ? items : [];
    } catch (error) {
      console.error(`❌ Erreur appel API ${platform}:`, error);
      return []; // Retourner tableau vide en cas d'erreur
    }
  }

  async scrapeTikTok(searchTerm: string, language: string = 'fr', period: string = '7d'): Promise<EngagementData[]> {
    console.log(`🎵 APPEL API TIKTOK RÉEL - Recherche: "${searchTerm}" (${language}, ${period})`);
    
    const hashtags = searchTerm.split(',').map(term => term.trim().replace('#', ''));
    const items = await this.postData('tiktok', { hashtags }, 'TikTok');

    if (items.length === 0) {
      console.log('⚠️ Aucune donnée TikTok retournée par votre API');
      return [];
    }

    return items.map((item: any) => ({
      likes: item.diggCount ?? item.likes ?? 0,
      comments: item.commentCount ?? item.comments ?? 0,
      shares: item.shareCount ?? item.shares ?? 0,
      views: item.playCount ?? item.views ?? 0,
      platform: 'TikTok',
      postId: item.id ?? item.postId ?? `tiktok_${Date.now()}_${Math.random()}`,
      author: item.authorMeta?.name ?? item.author ?? item.username ?? 'Utilisateur TikTok',
      content: item.text ?? item.content ?? item.desc ?? '',
      url: item.webVideoUrl ?? item.url ?? `https://tiktok.com/@${item.author}`,
      timestamp: item.createTime ? new Date(item.createTime * 1000).toISOString() : (item.timestamp ?? new Date().toISOString()),
    }));
  }

  async scrapeInstagram(searchTerm: string, language: string = 'fr', period: string = '7d'): Promise<EngagementData[]> {
    console.log(`📸 APPEL API INSTAGRAM RÉEL - Recherche: "${searchTerm}" (${language}, ${period})`);
    
    const usernames = searchTerm.split(',').map(term => term.trim().replace('@', ''));
    const items = await this.postData('instagram', { usernames }, 'Instagram');

    if (items.length === 0) {
      console.log('⚠️ Aucune donnée Instagram retournée par votre API');
      return [];
    }

    // Traitement des données Instagram selon votre structure API
    return items.map((item: any) => ({
      likes: 0, // Instagram API ne retourne pas de likes dans cette structure
      comments: 0,
      shares: 0,
      views: 0,
      platform: 'Instagram',
      postId: item.id ?? `instagram_${Date.now()}_${Math.random()}`,
      author: item.username ?? 'Utilisateur Instagram',
      content: item.biography ?? item.fullName ?? '',
      url: item.url ?? `https://instagram.com/${item.username}`,
      timestamp: new Date().toISOString(),
    }));
  }

  async scrapeFacebook(searchTerm: string, language: string = 'fr', period: string = '7d'): Promise<EngagementData[]> {
    console.log(`📘 APPEL API FACEBOOK RÉEL - Recherche: "${searchTerm}" (${language}, ${period})`);
    
    const keywords = searchTerm.split(',').map(term => term.trim());
    const items = await this.postData('facebook', { keywords }, 'Facebook');

    if (items.length === 0) {
      console.log('⚠️ Aucune donnée Facebook retournée par votre API');
      return [];
    }

    return items.map((item: any) => ({
      likes: item.reactions?.like ?? item.likes ?? item.likesCount ?? 0,
      comments: item.commentsCount ?? item.comments ?? 0,
      shares: item.sharesCount ?? item.shares ?? 0,
      views: item.views ?? 0,
      platform: 'Facebook',
      postId: item.postId ?? item.id ?? `facebook_${Date.now()}_${Math.random()}`,
      author: item.username ?? item.author ?? item.from?.name ?? 'Utilisateur Facebook',
      content: item.text ?? item.content ?? item.message ?? '',
      url: item.url ?? item.permalink_url ?? `https://facebook.com/${item.postId}`,
      timestamp: item.timestamp ?? item.created_time ?? new Date().toISOString(),
    }));
  }

  async scrapeTwitter(searchTerm: string, language: string = 'fr', period: string = '7d'): Promise<EngagementData[]> {
    console.log(`🐦 APPEL API TWITTER RÉEL - Recherche: "${searchTerm}" (${language}, ${period})`);
    
    const keywords = searchTerm.split(',').map(term => term.trim());
    const items = await this.postData('twitter', { keywords }, 'Twitter');

    if (items.length === 0) {
      console.log('⚠️ Aucune donnée Twitter retournée par votre API');
      return [];
    }

    return items.map((item: any) => ({
      likes: item.likes ?? item.favorite_count ?? 0,
      comments: item.replies ?? item.reply_count ?? 0,
      shares: item.retweets ?? item.retweet_count ?? 0,
      views: item.views ?? item.view_count ?? 0,
      platform: 'Twitter',
      postId: item.id ?? item.id_str ?? `twitter_${Date.now()}_${Math.random()}`,
      author: item.username ?? item.user?.screen_name ?? item.author ?? 'Utilisateur Twitter',
      content: item.text ?? item.full_text ?? item.content ?? '',
      url: item.url ?? `https://twitter.com/${item.username}/status/${item.id}`,
      timestamp: item.timestamp ?? item.created_at ?? new Date().toISOString(),
    }));
  }

  async scrapeYouTube(searchTerm: string, language: string = 'fr', period: string = '7d'): Promise<EngagementData[]> {
    console.log(`📺 APPEL API YOUTUBE RÉEL - Recherche: "${searchTerm}" (${language}, ${period})`);
    
    const keywords = searchTerm.split(',').map(term => term.trim());
    const items = await this.postData('youtube', { keywords }, 'YouTube');

    if (items.length === 0) {
      console.log('⚠️ Aucune donnée YouTube retournée par votre API');
      return [];
    }

    return items.map((item: any) => ({
      likes: item.likes ?? item.likeCount ?? 0,
      comments: item.comments ?? item.commentCount ?? 0,
      shares: 0,
      views: item.views ?? item.viewCount ?? 0,
      platform: 'YouTube',
      postId: item.id ?? item.videoId ?? `youtube_${Date.now()}_${Math.random()}`,
      author: item.channel ?? item.channelTitle ?? item.author ?? 'Chaîne YouTube',
      content: item.title ?? item.content ?? item.description ?? '',
      url: item.url ?? `https://youtube.com/watch?v=${item.id}`,
      timestamp: item.publishedAt ?? item.timestamp ?? new Date().toISOString(),
    }));
  }
}

export default ApifyService;
