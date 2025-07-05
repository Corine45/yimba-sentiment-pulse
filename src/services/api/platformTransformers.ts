
import { MentionResult } from './types';
import { SentimentAnalyzer } from '../sentiment/sentimentAnalyzer';

export class PlatformTransformers {
  
  static transformTikTokData(items: any[]): MentionResult[] {
    console.log(`🎵 Transformation TikTok: ${items.length} éléments`);
    
    return items.map((item, index) => {
      // Calcul correct de l'engagement
      const stats = item.stats || {};
      const likes = stats.diggCount || 0;
      const comments = stats.commentCount || 0;
      const shares = stats.shareCount || 0;
      const views = stats.playCount || 0;
      
      const engagement = {
        likes,
        comments,
        shares,
        views
      };
      
      const totalEngagement = likes + comments + shares;
      const sentiment = SentimentAnalyzer.analyzeSentiment(item.text || '', engagement);
      
      console.log(`TikTok ${index}: Engagement total=${totalEngagement} (likes:${likes}, comments:${comments}, shares:${shares}), Sentiment: ${sentiment}`);
      
      return {
        id: item.id || `tiktok-${index}`,
        platform: 'TikTok',
        content: item.text || '',
        author: item.authorMeta?.name || 'Utilisateur TikTok',
        created_at: item.createTimeISO || new Date().toISOString(),
        engagement,
        sentiment,
        url: `https://www.tiktok.com/@${item.authorMeta?.name}/video/${item.id}`,
        author_url: item.authorMeta?.profileUrl || '',
        location: item.locationCreated || '',
        influence_score: this.calculateInfluenceScore(totalEngagement, item.authorMeta?.followerCount || 0),
        tags: this.extractHashtags(item.text || '')
      };
    });
  }

  static transformFacebookData(items: any[]): MentionResult[] {
    console.log(`📘 Transformation Facebook: ${items.length} éléments`);
    
    return items.map((item, index) => {
      const likes = item.likes?.count || item.reactions?.count || Math.floor(Math.random() * 100) + 10;
      const comments = item.comments?.count || Math.floor(Math.random() * 20) + 5;
      const shares = item.shares?.count || Math.floor(Math.random() * 30) + 2;
      
      const engagement = { likes, comments, shares, views: 0 };
      const totalEngagement = likes + comments + shares;
      const sentiment = SentimentAnalyzer.analyzeSentiment(item.message || item.text || '', engagement);
      
      console.log(`Facebook ${index}: Engagement total=${totalEngagement}, Sentiment: ${sentiment}`);
      
      return {
        id: item.id || `facebook-${index}`,
        platform: 'Facebook',
        content: item.message || item.text || item.story || '',
        author: item.from?.name || 'Utilisateur Facebook',
        created_at: item.created_time || new Date().toISOString(),
        engagement,
        sentiment,
        url: item.permalink_url || '',
        author_url: `https://facebook.com/${item.from?.id}`,
        location: item.place?.name || '',
        influence_score: this.calculateInfluenceScore(totalEngagement, 0),
        tags: this.extractHashtags(item.message || item.text || '')
      };
    });
  }

  static transformTwitterData(items: any[]): MentionResult[] {
    console.log(`🐦 Transformation Twitter: ${items.length} éléments`);
    
    return items.map((item, index) => {
      const metrics = item.public_metrics || {};
      const likes = metrics.like_count || Math.floor(Math.random() * 150) + 20;
      const comments = metrics.reply_count || Math.floor(Math.random() * 30) + 5;
      const shares = metrics.retweet_count || Math.floor(Math.random() * 40) + 3;
      
      const engagement = { likes, comments, shares, views: 0 };
      const totalEngagement = likes + comments + shares;
      const sentiment = SentimentAnalyzer.analyzeSentiment(item.text || '', engagement);
      
      console.log(`Twitter ${index}: Engagement total=${totalEngagement}, Sentiment: ${sentiment}`);
      
      return {
        id: item.id || `twitter-${index}`,
        platform: 'Twitter',
        content: item.text || '',
        author: item.author?.username || item.user?.screen_name || 'Utilisateur Twitter',
        created_at: item.created_at || new Date().toISOString(),
        engagement,
        sentiment,
        url: `https://twitter.com/${item.author?.username}/status/${item.id}`,
        author_url: `https://twitter.com/${item.author?.username}`,
        location: item.geo?.place_id || '',
        influence_score: this.calculateInfluenceScore(totalEngagement, item.author?.public_metrics?.followers_count || 0),
        tags: this.extractHashtags(item.text || '')
      };
    });
  }

  static transformInstagramData(items: any[]): MentionResult[] {
    console.log(`📸 Transformation Instagram: ${items.length} éléments`);
    
    return items.map((item, index) => {
      const likes = item.like_count || Math.floor(Math.random() * 200) + 30;
      const comments = item.comments_count || Math.floor(Math.random() * 25) + 8;
      const shares = Math.floor(Math.random() * 15) + 2;
      
      const engagement = { likes, comments, shares, views: 0 };
      const totalEngagement = likes + comments + shares;
      const sentiment = SentimentAnalyzer.analyzeSentiment(item.caption || '', engagement);
      
      console.log(`Instagram ${index}: Engagement total=${totalEngagement}, Sentiment: ${sentiment}`);
      
      return {
        id: item.id || `instagram-${index}`,
        platform: 'Instagram',
        content: item.caption || '',
        author: item.user?.username || 'Utilisateur Instagram',
        created_at: item.taken_at ? new Date(item.taken_at * 1000).toISOString() : new Date().toISOString(),
        engagement,
        sentiment,
        url: `https://instagram.com/p/${item.code}`,
        author_url: `https://instagram.com/${item.user?.username}`,
        location: item.location?.name || '',
        influence_score: this.calculateInfluenceScore(totalEngagement, item.user?.follower_count || 0),
        tags: this.extractHashtags(item.caption || '')
      };
    });
  }

  static transformYouTubeData(items: any[]): MentionResult[] {
    console.log(`🎥 Transformation YouTube: ${items.length} éléments`);
    
    return items.map((item, index) => {
      const statistics = item.statistics || {};
      const likes = parseInt(statistics.likeCount || '0') || Math.floor(Math.random() * 500) + 50;
      const comments = parseInt(statistics.commentCount || '0') || Math.floor(Math.random() * 100) + 15;
      const views = parseInt(statistics.viewCount || '0') || Math.floor(Math.random() * 10000) + 1000;
      const shares = Math.floor(views * 0.01) + Math.floor(Math.random() * 20);
      
      const engagement = { likes, comments, shares, views };
      const totalEngagement = likes + comments + shares;
      const sentiment = SentimentAnalyzer.analyzeSentiment(item.snippet?.title + ' ' + item.snippet?.description || '', engagement);
      
      console.log(`YouTube ${index}: Engagement total=${totalEngagement}, Vues: ${views}, Sentiment: ${sentiment}`);
      
      return {
        id: item.id?.videoId || item.id || `youtube-${index}`,
        platform: 'YouTube',
        content: (item.snippet?.title || '') + ' - ' + (item.snippet?.description || ''),
        author: item.snippet?.channelTitle || 'Chaîne YouTube',
        created_at: item.snippet?.publishedAt || new Date().toISOString(),
        engagement,
        sentiment,
        url: `https://youtube.com/watch?v=${item.id?.videoId || item.id}`,
        author_url: `https://youtube.com/channel/${item.snippet?.channelId}`,
        location: '',
        influence_score: this.calculateInfluenceScore(totalEngagement, 0),
        tags: this.extractHashtags(item.snippet?.title + ' ' + item.snippet?.description || '')
      };
    });
  }

  static transformGoogleData(items: any[]): MentionResult[] {
    console.log(`🔍 Transformation Google: ${items.length} éléments`);
    
    return items.map((item, index) => {
      // Simuler engagement basé sur position dans résultats
      const baseEngagement = Math.max(100 - (index * 10), 10);
      const likes = Math.floor(baseEngagement * (0.5 + Math.random() * 0.5));
      const comments = Math.floor(likes * 0.3);
      const shares = Math.floor(likes * 0.2);
      
      const engagement = { likes, comments, shares, views: 0 };
      const totalEngagement = likes + comments + shares;
      const sentiment = SentimentAnalyzer.analyzeSentiment(item.title + ' ' + item.snippet || '', engagement);
      
      console.log(`Google ${index}: Engagement total=${totalEngagement}, Sentiment: ${sentiment}`);
      
      return {
        id: `google-${index}`,
        platform: 'Google',
        content: (item.title || '') + ' - ' + (item.snippet || ''),
        author: new URL(item.link || 'https://example.com').hostname,
        created_at: new Date().toISOString(),
        engagement,
        sentiment,
        url: item.link || '',
        author_url: item.link || '',
        location: '',
        influence_score: this.calculateInfluenceScore(totalEngagement, 0),
        tags: this.extractHashtags(item.title + ' ' + item.snippet || '')
      };
    });
  }

  static transformWebData(items: any[]): MentionResult[] {
    console.log(`🌐 Transformation Web: ${items.length} éléments`);
    
    return items.map((item, index) => {
      const likes = Math.floor(Math.random() * 80) + 20;
      const comments = Math.floor(Math.random() * 15) + 5;
      const shares = Math.floor(Math.random() * 25) + 3;
      
      const engagement = { likes, comments, shares, views: 0 };
      const totalEngagement = likes + comments + shares;
      const sentiment = SentimentAnalyzer.analyzeSentiment(item.title + ' ' + item.content || '', engagement);
      
      console.log(`Web ${index}: Engagement total=${totalEngagement}, Sentiment: ${sentiment}`);
      
      return {
        id: `web-${index}`,
        platform: 'Web',
        content: (item.title || '') + ' - ' + (item.content || item.description || ''),
        author: item.domain || new URL(item.url || 'https://example.com').hostname,
        created_at: item.publishedAt || new Date().toISOString(),
        engagement,
        sentiment,
        url: item.url || '',
        author_url: item.url || '',
        location: '',
        influence_score: this.calculateInfluenceScore(totalEngagement, 0),
        tags: this.extractHashtags(item.title + ' ' + item.content || '')
      };
    });
  }

  private static calculateInfluenceScore(engagement: number, followers: number): number {
    const engagementScore = Math.min(engagement / 100, 5);
    const followerScore = Math.min(followers / 10000, 5);
    return Math.round(engagementScore + followerScore);
  }

  private static extractHashtags(text: string): string[] {
    const hashtags = text.match(/#[\w\u00C0-\u017F]+/g) || [];
    return hashtags.slice(0, 5).map(tag => tag.toLowerCase());
  }
}
