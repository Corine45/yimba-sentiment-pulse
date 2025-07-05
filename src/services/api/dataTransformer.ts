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
      sentiment: DataTransformer.calculateAdvancedSentiment(item),
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
    if (endpoint.includes('google-search')) return 'Google';
    if (endpoint.includes('cheerio')) return 'Web';
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

  private static calculateAdvancedSentiment(item: any): 'positive' | 'negative' | 'neutral' {
    console.log('🎭 ANALYSE SENTIMENT AVANCÉE pour item:', item.id || 'unknown');
    
    // 1. Si le sentiment est déjà fourni par l'API (priorité absolue)
    if (item.sentiment) {
      const sentiment = item.sentiment.toLowerCase();
      console.log('📊 Sentiment API fourni:', sentiment);
      
      if (sentiment.includes('positive') || sentiment.includes('pos') || sentiment === 'positive') {
        console.log('✅ Sentiment API: POSITIVE');
        return 'positive';
      }
      if (sentiment.includes('negative') || sentiment.includes('neg') || sentiment === 'negative') {
        console.log('❌ Sentiment API: NEGATIVE');
        return 'negative';
      }
      if (sentiment.includes('neutral') || sentiment === 'neutral') {
        console.log('⚪ Sentiment API: NEUTRAL');
        return 'neutral';
      }
    }
    
    // 2. Analyse textuelle avancée du contenu
    const content = DataTransformer.extractContent(item, '').toLowerCase();
    console.log('📝 Analyse contenu:', content.substring(0, 100) + '...');
    
    // Mots-clés positifs enrichis (multilingues)
    const positiveKeywords = [
      // Français
      'excellent', 'super', 'génial', 'parfait', 'merveilleux', 'fantastique', 'formidable',
      'bravo', 'félicitations', 'merci', 'magnifique', 'extraordinaire', 'remarquable',
      'incroyable', 'splendide', 'fabuleux', 'sensationnel', 'admirable', 'exceptionnel',
      'réussi', 'brillant', 'impressionnant', 'satisfait', 'heureux', 'joie', 'bonheur',
      'content', 'ravi', 'enchanté', 'top', 'cool', 'bien', 'bon', 'beau', 'belle',
      
      // Anglais
      'love', 'amazing', 'awesome', 'great', 'wonderful', 'fantastic', 'excellent',
      'perfect', 'outstanding', 'brilliant', 'superb', 'magnificent', 'marvelous',
      'incredible', 'spectacular', 'remarkable', 'exceptional', 'impressive',
      'thanks', 'grateful', 'happy', 'joy', 'blessed', 'satisfied', 'pleased',
      'delighted', 'thrilled', 'excited', 'best', 'good', 'nice', 'beautiful',
      
      // Emojis positifs
      '😍', '😊', '😃', '😄', '😁', '🤩', '🥰', '😘', '👍', '👏', '🙌', '💪',
      '❤️', '💕', '💖', '💯', '🔥', '⭐', '🌟', '✨', '🎉', '🎊', '🥳', '👌'
    ];
    
    // Mots-clés négatifs enrichis (multilingues)
    const negativeKeywords = [
      // Français
      'horrible', 'nul', 'mauvais', 'décevant', 'terrible', 'affreux', 'catastrophe',
      'problème', 'erreur', 'bug', 'panne', 'échec', 'raté', 'moche', 'laid',
      'dégoûtant', 'insupportable', 'inacceptable', 'scandaleux', 'honteux',
      'irritant', 'agaçant', 'ennuyeux', 'triste', 'déçu', 'mécontent', 'fâché',
      'colère', 'furieux', 'énervé', 'frustré', 'inquiet', 'stressé', 'peur',
      
      // Anglais
      'hate', 'awful', 'terrible', 'horrible', 'disgusting', 'worst', 'bad', 'poor',
      'disappointing', 'disappointing', 'frustrating', 'annoying', 'irritating',
      'unacceptable', 'pathetic', 'useless', 'broken', 'failed', 'disaster',
      'sorry', 'problem', 'issue', 'error', 'bug', 'wrong', 'fail', 'sad',
      'angry', 'mad', 'upset', 'disappointed', 'worried', 'scared', 'afraid',
      
      // Emojis négatifs
      '😢', '😭', '😠', '😡', '🤬', '😤', '😞', '😔', '😟', '😕', '🙁', '☹️',
      '👎', '💔', '😰', '😨', '😱', '🤮', '🤢', '😵', '💀', '👿', '😈'
    ];
    
    let positiveCount = 0;
    let negativeCount = 0;
    let positiveScore = 0;
    let negativeScore = 0;
    
    // Comptage avec pondération
    positiveKeywords.forEach(keyword => {
      const matches = (content.match(new RegExp(keyword, 'gi')) || []).length;
      if (matches > 0) {
        positiveCount += matches;
        positiveScore += matches * (keyword.length > 5 ? 2 : 1); // Mots longs = plus de poids
        console.log(`✅ Mot positif trouvé "${keyword}": ${matches} fois`);
      }
    });
    
    negativeKeywords.forEach(keyword => {
      const matches = (content.match(new RegExp(keyword, 'gi')) || []).length;
      if (matches > 0) {
        negativeCount += matches;
        negativeScore += matches * (keyword.length > 5 ? 2 : 1);
        console.log(`❌ Mot négatif trouvé "${keyword}": ${matches} fois`);
      }
    });
    
    // 3. Analyse de l'engagement et des métriques
    const engagement = DataTransformer.extractEngagement(item, '');
    const totalEngagement = engagement.likes + engagement.comments + engagement.shares;
    const views = engagement.views || 0;
    const engagementRate = views > 0 ? (totalEngagement / views) * 100 : 0;
    
    console.log('📊 Métriques engagement:', {
      likes: engagement.likes,
      comments: engagement.comments,
      shares: engagement.shares,
      views: views,
      total: totalEngagement,
      rate: engagementRate.toFixed(2) + '%'
    });
    
    // 4. Logique de décision du sentiment avec score pondéré
    const sentimentDifference = positiveScore - negativeScore;
    const confidenceThreshold = 2;
    
    console.log(`🎯 Scores: Positif=${positiveScore}, Négatif=${negativeScore}, Différence=${sentimentDifference}`);
    
    if (sentimentDifference > confidenceThreshold) {
      console.log(`✅ SENTIMENT FINAL: POSITIVE (score: ${positiveScore} vs ${negativeScore})`);
      return 'positive';
    }
    
    if (sentimentDifference < -confidenceThreshold) {
      console.log(`❌ SENTIMENT FINAL: NEGATIVE (score: ${positiveScore} vs ${negativeScore})`);
      return 'negative';
    }
    
    // 5. Analyse contextuelle pour les cas ambigus
    if (Math.abs(sentimentDifference) <= confidenceThreshold) {
      // Utiliser l'engagement comme indicateur
      if (engagementRate > 5 || totalEngagement > 100) {
        console.log(`✅ SENTIMENT FINAL: POSITIVE (engagement élevé: ${engagementRate.toFixed(2)}%)`);
        return 'positive';
      }
      
      if (engagementRate < 1 && totalEngagement < 10) {
        console.log(`❌ SENTIMENT FINAL: NEGATIVE (engagement faible: ${engagementRate.toFixed(2)}%)`);
        return 'negative';
      }
      
      // Analyser la longueur du contenu
      if (content.length > 200) {
        console.log(`⚪ SENTIMENT FINAL: NEUTRAL (contenu long et équilibré)`);
        return 'neutral';
      }
    }
    
    console.log('⚪ SENTIMENT FINAL: NEUTRAL (par défaut)');
    return 'neutral';
  }

  private static calculateInfluenceScore(item: any): number {
    const engagement = DataTransformer.extractEngagement(item, '');
    const total = engagement.likes + engagement.comments * 2 + engagement.shares * 3;
    const views = engagement.views || 0;
    
    // Score basé sur l'engagement, les vues et la récence
    let score = Math.min(Math.round((total + views / 100) / 50), 10);
    
    // Bonus pour les contenus récents
    const timestamp = new Date(DataTransformer.extractTimestamp(item));
    const now = new Date();
    const daysDifference = (now.getTime() - timestamp.getTime()) / (1000 * 3600 * 24);
    
    if (daysDifference < 1) score += 1; // Bonus pour contenu très récent
    if (daysDifference < 7) score += 0.5; // Bonus pour contenu récent
    
    score = Math.max(1, Math.min(10, score));
    
    console.log(`🎯 Score d'influence calculé: ${score} (engagement: ${total}, vues: ${views}, âge: ${daysDifference.toFixed(1)} jours)`);
    
    return Math.round(score);
  }
}
