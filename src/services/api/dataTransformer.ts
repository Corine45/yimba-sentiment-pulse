
import { MentionResult } from './types';

export class DataTransformer {
  static transformToMentions(items: any[], endpoint: string): MentionResult[] {
    const platform = DataTransformer.getPlatformFromEndpoint(endpoint);
    
    return items.map((item, index) => ({
      id: item.id || item._id || `${platform}_${Date.now()}_${index}`,
      platform,
      content: DataTransformer.extractContent(item, platform),
      author: DataTransformer.extractAuthor(item, platform),
      url: DataTransformer.extractUrl(item, platform),
      timestamp: DataTransformer.extractTimestamp(item),
      engagement: DataTransformer.extractEngagement(item, platform),
      sentiment: DataTransformer.calculateSentiment(item),
      influenceScore: DataTransformer.calculateInfluenceScore(item),
      sourceUrl: item.sourceUrl || item.url || '',
      location: DataTransformer.extractLocation(item)
    }));
  }

  private static extractLocation(item: any): MentionResult['location'] | undefined {
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

  private static getPlatformFromEndpoint(endpoint: string): string {
    if (endpoint.includes('tiktok')) return 'TikTok';
    if (endpoint.includes('facebook')) return 'Facebook';
    if (endpoint.includes('twitter') || endpoint.includes('x-post')) return 'Twitter';
    if (endpoint.includes('youtube')) return 'YouTube';
    if (endpoint.includes('instagram')) return 'Instagram';
    return 'Unknown';
  }

  private static extractContent(item: any, platform: string): string {
    const contentFields = ['text', 'content', 'desc', 'message', 'title', 'description', 'caption'];
    for (const field of contentFields) {
      if (item[field] && typeof item[field] === 'string') return item[field];
    }
    return item.text || item.content || `Contenu ${platform}`;
  }

  private static extractAuthor(item: any, platform: string): string {
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

  private static extractUrl(item: any, platform: string): string {
    if (item.url) return item.url;
    if (item.webVideoUrl) return item.webVideoUrl;
    if (item.permalink_url) return item.permalink_url;
    
    const author = DataTransformer.extractAuthor(item, platform);
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

  private static extractTimestamp(item: any): string {
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

  private static extractEngagement(item: any, platform: string): MentionResult['engagement'] {
    return {
      likes: DataTransformer.extractNumber(item, ['likes', 'diggCount', 'likesCount', 'favorite_count', 'likeCount']),
      comments: DataTransformer.extractNumber(item, ['comments', 'commentCount', 'commentsCount', 'reply_count']),
      shares: DataTransformer.extractNumber(item, ['shares', 'shareCount', 'sharesCount', 'retweet_count']),
      views: DataTransformer.extractNumber(item, ['views', 'playCount', 'viewCount', 'view_count']) || undefined
    };
  }

  private static extractNumber(item: any, fields: string[]): number {
    for (const field of fields) {
      if (typeof item[field] === 'number') return item[field];
      if (typeof item[field] === 'string') {
        const num = parseInt(item[field], 10);
        if (!isNaN(num)) return num;
      }
    }
    return 0;
  }

  private static calculateSentiment(item: any): 'positive' | 'negative' | 'neutral' {
    console.log('🎭 CALCUL SENTIMENT pour item:', item.id || 'unknown');
    
    // 1. Si le sentiment est déjà fourni par l'API
    if (item.sentiment) {
      const sentiment = item.sentiment.toLowerCase();
      console.log('📊 Sentiment API fourni:', sentiment);
      
      if (sentiment.includes('positive') || sentiment.includes('pos') || sentiment === 'positive') {
        console.log('✅ Sentiment détecté: POSITIVE');
        return 'positive';
      }
      if (sentiment.includes('negative') || sentiment.includes('neg') || sentiment === 'negative') {
        console.log('❌ Sentiment détecté: NEGATIVE');
        return 'negative';
      }
      if (sentiment.includes('neutral') || sentiment === 'neutral') {
        console.log('⚪ Sentiment détecté: NEUTRAL');
        return 'neutral';
      }
    }
    
    // 2. Analyse du contenu textuel
    const content = DataTransformer.extractContent(item, '').toLowerCase();
    console.log('📝 Analyse contenu:', content.substring(0, 100) + '...');
    
    // Mots-clés positifs
    const positiveKeywords = [
      'excellent', 'super', 'génial', 'parfait', 'merveilleux', 'fantastique',
      'bravo', 'félicitations', 'love', 'amazing', 'awesome', 'great', 'wonderful',
      '😍', '😊', '😃', '👍', '❤️', '🔥', '💪', '🎉', '✨', '👏',
      'merci', 'thanks', 'grateful', 'happy', 'joy', 'best', 'good', 'nice'
    ];
    
    // Mots-clés négatifs
    const negativeKeywords = [
      'horrible', 'nul', 'décevant', 'catastrophe', 'problème', 'erreur',
      'hate', 'awful', 'terrible', 'worst', 'bad', 'disappointed', 'angry',
      '😢', '😠', '😡', '👎', '💔', '😞', '😤', '🤬', '😭',
      'sorry', 'problem', 'issue', 'wrong', 'fail', 'broken', 'bug'
    ];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveKeywords.forEach(keyword => {
      if (content.includes(keyword)) {
        positiveCount++;
        console.log(`✅ Mot positif trouvé: ${keyword}`);
      }
    });
    
    negativeKeywords.forEach(keyword => {
      if (content.includes(keyword)) {
        negativeCount++;
        console.log(`❌ Mot négatif trouvé: ${keyword}`);
      }
    });
    
    // 3. Analyse basée sur l'engagement
    const engagement = DataTransformer.extractEngagement(item, '');
    const totalEngagement = engagement.likes + engagement.comments + engagement.shares;
    const views = engagement.views || 0;
    
    console.log('📊 Métriques engagement:', {
      likes: engagement.likes,
      comments: engagement.comments,
      shares: engagement.shares,
      views: views,
      total: totalEngagement
    });
    
    // 4. Logique de décision du sentiment
    if (positiveCount > negativeCount) {
      console.log(`✅ SENTIMENT FINAL: POSITIVE (pos:${positiveCount} vs neg:${negativeCount})`);
      return 'positive';
    }
    
    if (negativeCount > positiveCount) {
      console.log(`❌ SENTIMENT FINAL: NEGATIVE (pos:${positiveCount} vs neg:${negativeCount})`);
      return 'negative';
    }
    
    // Si égalité, on regarde l'engagement
    if (totalEngagement > 50 || views > 1000) {
      console.log(`✅ SENTIMENT FINAL: POSITIVE (engagement élevé: ${totalEngagement})`);
      return 'positive';
    }
    
    if (totalEngagement < 5 && views < 100) {
      console.log(`❌ SENTIMENT FINAL: NEGATIVE (engagement faible: ${totalEngagement})`);
      return 'negative';  
    }
    
    console.log('⚪ SENTIMENT FINAL: NEUTRAL (par défaut)');
    return 'neutral';
  }

  private static calculateInfluenceScore(item: any): number {
    const engagement = DataTransformer.extractEngagement(item, '');
    const total = engagement.likes + engagement.comments * 2 + engagement.shares * 3;
    const views = engagement.views || 0;
    
    // Score basé sur l'engagement et les vues
    let score = Math.min(Math.round((total + views / 100) / 50), 10);
    score = Math.max(1, score);
    
    console.log(`🎯 Score d'influence calculé: ${score} (engagement: ${total}, vues: ${views})`);
    
    return score;
  }
}
