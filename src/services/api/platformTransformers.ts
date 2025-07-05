
import { MentionResult } from './types';
import { SentimentAnalyzer } from '../sentiment/sentimentAnalyzer';

export class PlatformTransformers {
  static transformTikTokData(items: any[]): MentionResult[] {
    return items.map((item, index) => ({
      id: item.id || `tiktok_${Date.now()}_${index}`,
      platform: 'TikTok',
      content: item.description || item.text || item.caption || 'Vidéo TikTok',
      author: item.username || item.author?.username || 'Utilisateur TikTok',
      url: item.url || `https://tiktok.com/@${item.username}`,
      timestamp: this.extractTimestamp(item),
      engagement: {
        likes: item.likes || item.digg_count || 0,
        comments: item.comments || item.comment_count || 0,
        shares: item.shares || item.share_count || 0,
        views: item.views || item.play_count || undefined
      },
      sentiment: SentimentAnalyzer.analyzeSentiment(item.description || item.text || ''),
      influenceScore: this.calculateInfluenceScore({ ...item, platform: 'TikTok' }),
      sourceUrl: item.url || '',
      location: this.extractLocation(item)
    }));
  }

  static transformFacebookData(items: any[]): MentionResult[] {
    return items.map((item, index) => ({
      id: item.id || `facebook_${Date.now()}_${index}`,
      platform: 'Facebook',
      content: item.text || item.message || item.content || 'Contenu Facebook',
      author: item.author?.name || item.from?.name || item.username || 'Utilisateur Facebook',
      url: item.url || item.permalink_url || `https://facebook.com/${item.id}`,
      timestamp: this.extractTimestamp(item),
      engagement: {
        likes: item.likes || item.reactions?.like || 0,
        comments: item.comments || item.comment_count || 0,
        shares: item.shares || item.share_count || 0,
        views: item.views || undefined
      },
      sentiment: SentimentAnalyzer.analyzeSentiment(item.text || item.content || ''),
      influenceScore: this.calculateInfluenceScore({ ...item, platform: 'Facebook' }),
      sourceUrl: item.url || '',
      location: this.extractLocation(item)
    }));
  }

  static transformInstagramData(items: any[]): MentionResult[] {
    return items.map((item, index) => ({
      id: item.id || `instagram_${Date.now()}_${index}`,
      platform: 'Instagram',
      content: item.caption || item.text || item.description || 'Contenu Instagram',
      author: item.username || item.owner?.username || 'Utilisateur Instagram',
      url: item.url || `https://instagram.com/p/${item.shortcode}`,
      timestamp: this.extractTimestamp(item),
      engagement: {
        likes: item.likes || item.like_count || 0,
        comments: item.comments || item.comment_count || 0,
        shares: 0,
        views: item.views || item.view_count || undefined
      },
      sentiment: SentimentAnalyzer.analyzeSentiment(item.caption || item.text || ''),
      influenceScore: this.calculateInfluenceScore({ ...item, platform: 'Instagram' }),
      sourceUrl: item.url || '',
      location: this.extractLocation(item)
    }));
  }

  static transformTwitterData(items: any[]): MentionResult[] {
    return items.map((item, index) => ({
      id: item.id || `twitter_${Date.now()}_${index}`,
      platform: 'Twitter',
      content: item.text || item.full_text || 'Tweet',
      author: item.user?.screen_name || item.author || 'Utilisateur Twitter',
      url: item.url || `https://twitter.com/${item.user?.screen_name}/status/${item.id}`,
      timestamp: this.extractTimestamp(item),
      engagement: {
        likes: item.favorite_count || item.likes || 0,
        comments: item.reply_count || 0,
        shares: item.retweet_count || 0,
        views: undefined
      },
      sentiment: SentimentAnalyzer.analyzeSentiment(item.text || item.full_text || ''),
      influenceScore: this.calculateInfluenceScore({ ...item, platform: 'Twitter' }),
      sourceUrl: item.url || '',
      location: this.extractLocation(item)
    }));
  }

  static transformYouTubeData(items: any[]): MentionResult[] {
    return items.map((item, index) => ({
      id: item.id || `youtube_${Date.now()}_${index}`,
      platform: 'YouTube',
      content: item.title || item.description || 'Vidéo YouTube',
      author: item.channelTitle || item.author || 'Chaîne YouTube',
      url: item.url || `https://youtube.com/watch?v=${item.videoId}`,
      timestamp: this.extractTimestamp(item),
      engagement: {
        likes: item.likeCount || 0,
        comments: item.commentCount || 0,
        shares: 0,
        views: item.viewCount || undefined
      },
      sentiment: SentimentAnalyzer.analyzeSentiment(item.title || item.description || ''),
      influenceScore: this.calculateInfluenceScore({ ...item, platform: 'YouTube' }),
      sourceUrl: item.url || '',
      location: this.extractLocation(item)
    }));
  }

  static transformGoogleData(items: any[]): MentionResult[] {
    return items.map((item, index) => ({
      id: item.id || `google_${Date.now()}_${index}`,
      platform: 'Google',
      content: item.title || item.snippet || item.description || 'Résultat Google',
      author: item.displayLink || item.source || 'Source Web',
      url: item.link || item.url || '#',
      timestamp: new Date().toISOString(),
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: undefined
      },
      sentiment: SentimentAnalyzer.analyzeSentiment(item.title || item.snippet || ''),
      influenceScore: this.calculateInfluenceScore({ ...item, platform: 'Google' }),
      sourceUrl: item.link || item.url || '',
      location: this.extractLocation(item)
    }));
  }

  static transformWebData(items: any[]): MentionResult[] {
    return items.map((item, index) => ({
      id: item.id || `web_${Date.now()}_${index}`,
      platform: 'Web',
      content: item.title || item.text || item.description || 'Contenu Web',
      author: item.author || item.site || 'Site Web',
      url: item.url || item.link || '#',
      timestamp: this.extractTimestamp(item),
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: undefined
      },
      sentiment: SentimentAnalyzer.analyzeSentiment(item.title || item.text || ''),
      influenceScore: this.calculateInfluenceScore({ ...item, platform: 'Web' }),
      sourceUrl: item.url || item.link || '',
      location: this.extractLocation(item)
    }));
  }

  private static extractTimestamp(item: any): string {
    const timeFields = ['timestamp', 'created_at', 'createTime', 'publishedAt', 'date', 'createdAt', 'create_time'];
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

  private static calculateInfluenceScore(item: any): number {
    const engagement = {
      likes: this.extractNumber(item, ['likes', 'like_count', 'likesCount', 'favorite_count', 'digg_count']),
      comments: this.extractNumber(item, ['comments', 'comment_count', 'commentsCount', 'reply_count']),
      shares: this.extractNumber(item, ['shares', 'share_count', 'sharesCount', 'retweet_count']),
      views: this.extractNumber(item, ['views', 'view_count', 'viewCount', 'play_count'])
    };

    const total = engagement.likes + engagement.comments * 2 + engagement.shares * 3;
    const views = engagement.views || 0;
    
    let score = Math.min(Math.round((total + views / 100) / 50), 10);
    
    // Bonus pour les contenus récents
    const timestamp = new Date(this.extractTimestamp(item));
    const now = new Date();
    const daysDifference = (now.getTime() - timestamp.getTime()) / (1000 * 3600 * 24);
    
    if (daysDifference < 1) score += 1;
    if (daysDifference < 7) score += 0.5;
    
    return Math.max(1, Math.min(10, Math.round(score)));
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
}
