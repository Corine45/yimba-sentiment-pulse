import { MentionResult } from './types';
import { SentimentAnalyzer } from '../sentiment/sentimentAnalyzer';

export class PlatformTransformers {
  
  static transformTikTokData(items: any[]): MentionResult[] {
    console.log(`🎵 TRANSFORMATION TIKTOK RÉELLE: ${items.length} éléments de votre API`);
    
    return items.map((item, index) => {
      // UTILISATION DES VRAIES DONNÉES DE VOTRE API TIKTOK
      const likes = item.likes || item.diggCount || item.stats?.diggCount || 0;
      const comments = item.comments || item.commentCount || item.stats?.commentCount || 0;
      const shares = item.shares || item.shareCount || item.stats?.shareCount || 0;
      const views = item.plays || item.playCount || item.stats?.playCount || 0;
      
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
        id: item.id || item.video_id || `tiktok-${Date.now()}-${index}`,
        platform: 'TikTok',
        content: item.text || item.desc || item.description || '',
        author: item.username || item.authorMeta?.name || item.author || 'Utilisateur TikTok',
        created_at: item.created_at || item.createTimeISO || new Date().toISOString(),
        timestamp: item.created_at || item.createTimeISO || new Date().toISOString(),
        engagement,
        sentiment,
        url: item.video_url || item.url || `https://www.tiktok.com/@${item.username || item.authorMeta?.name}/video/${item.id}`,
        author_url: item.author_url || item.authorMeta?.profileUrl || `https://www.tiktok.com/@${item.username}`,
        location: item.locationCreated ? { city: item.locationCreated } : undefined,
        influence_score: this.calculateInfluenceScore(totalEngagement, item.authorMeta?.followerCount || 0),
        tags: this.extractHashtags(item.text || '')
      };
    });
  }

  static transformFacebookData(items: any[]): MentionResult[] {
    console.log(`📘 TRANSFORMATION FACEBOOK RÉELLE: ${items.length} éléments de votre API`);
    
    return items.map((item, index) => {
      // UTILISATION DES VRAIES DONNÉES DE VOTRE API FACEBOOK
      const likes = item.reactions_count || item.likes || item.reactions?.like || 0;
      const comments = item.comments_count || item.comments || 0;
      const shares = item.reshare_count || item.shares || 0;
      
      const engagement = { likes, comments, shares, views: 0 };
      const totalEngagement = likes + comments + shares;
      const sentiment = SentimentAnalyzer.analyzeSentiment(item.message || item.text || '', engagement);
      
      console.log(`Facebook ${index}: Engagement total=${totalEngagement}, Sentiment: ${sentiment}`);
      
      const createdAt = item.created_time || new Date().toISOString();
      const postId = item.post_id || item.id || `facebook-${Date.now()}-${index}`;
      
      // URL FACEBOOK RÉELLE DE VOTRE API
      const facebookUrl = item.url || item.permalink_url || `https://www.facebook.com/posts/${postId}`;
      
      return {
        id: postId,
        platform: 'Facebook',
        content: item.message || item.text || item.story || '',
        author: item.author?.name || item.from?.name || 'Utilisateur Facebook',
        created_at: item.timestamp || item.created_time || createdAt,
        timestamp: item.timestamp || item.created_time || createdAt,
        engagement,
        sentiment,
        url: facebookUrl, // ✅ URL Facebook directe
        author_url: item.author?.url || `https://facebook.com/${item.from?.id || item.from?.username}`,
        location: item.place?.name ? { city: item.place.name } : undefined,
        influence_score: this.calculateInfluenceScore(totalEngagement, 0),
        tags: this.extractHashtags(item.message || item.text || '')
      };
    });
  }

  static transformTwitterData(items: any[]): MentionResult[] {
    console.log(`🐦 TRANSFORMATION TWITTER RÉELLE: ${items.length} éléments de votre API`);
    
    return items.map((item, index) => {
      // UTILISATION DES VRAIES DONNÉES DE VOTRE API TWITTER
      const metrics = item.public_metrics || {};
      const likes = item.favorite_count || metrics.like_count || item.likes || 0;
      const comments = item.reply_count || metrics.reply_count || item.comments || 0;
      const shares = item.retweet_count || metrics.retweet_count || item.shares || 0;
      
      const engagement = { likes, comments, shares, views: 0 };
      const totalEngagement = likes + comments + shares;
      const sentiment = SentimentAnalyzer.analyzeSentiment(item.text || '', engagement);
      
      console.log(`Twitter ${index}: Engagement total=${totalEngagement}, Sentiment: ${sentiment}`);
      
      const createdAt = item.created_at || new Date().toISOString();
      
      return {
        id: item.id || `twitter-${index}`,
        platform: 'Twitter',
        content: item.text || '',
        author: item.author?.username || item.user?.screen_name || 'Utilisateur Twitter',
        created_at: createdAt,
        timestamp: createdAt,
        engagement,
        sentiment,
        url: `https://twitter.com/${item.author?.username}/status/${item.id}`,
        author_url: `https://twitter.com/${item.author?.username}`,
        location: item.geo?.place_id ? { city: item.geo.place_id } : undefined,
        influence_score: this.calculateInfluenceScore(totalEngagement, item.author?.public_metrics?.followers_count || 0),
        tags: this.extractHashtags(item.text || '')
      };
    });
  }

  static transformInstagramData(items: any[]): MentionResult[] {
    console.log(`📸 TRANSFORMATION INSTAGRAM RÉELLE: ${items.length} éléments de votre API`);
    
    return items.map((item, index) => {
      // UTILISATION DES VRAIES DONNÉES DE VOTRE API INSTAGRAM
      const likes = item.like_count || item.likes || 0;
      const comments = item.comments_count || item.comment_count || item.comments || 0;
      const shares = item.shares || 0;
      
      const engagement = { likes, comments, shares, views: 0 };
      const totalEngagement = likes + comments + shares;
      const sentiment = SentimentAnalyzer.analyzeSentiment(item.caption || '', engagement);
      
      console.log(`Instagram ${index}: Engagement total=${totalEngagement}, Sentiment: ${sentiment}`);
      
      const createdAt = item.taken_at ? new Date(item.taken_at * 1000).toISOString() : new Date().toISOString();
      
      return {
        id: item.id || `instagram-${index}`,
        platform: 'Instagram',
        content: item.caption || '',
        author: item.user?.username || 'Utilisateur Instagram',
        created_at: createdAt,
        timestamp: createdAt,
        engagement,
        sentiment,
        url: `https://instagram.com/p/${item.code}`,
        author_url: `https://instagram.com/${item.user?.username}`,
        location: item.location?.name ? { city: item.location.name } : undefined,
        influence_score: this.calculateInfluenceScore(totalEngagement, item.user?.follower_count || 0),
        tags: this.extractHashtags(item.caption || '')
      };
    });
  }

  static transformYouTubeData(items: any[]): MentionResult[] {
    console.log(`🎥 TRANSFORMATION YOUTUBE RÉELLE: ${items.length} éléments de votre API`);
    
    return items.map((item, index) => {
      // UTILISATION DES VRAIES DONNÉES DE VOTRE API YOUTUBE
      const statistics = item.statistics || {};
      const likes = parseInt(statistics.likeCount || '0') || item.likes || 0;
      const comments = parseInt(statistics.commentCount || '0') || item.comments || 0;
      const views = parseInt(statistics.viewCount || '0') || item.views || 0;
      const shares = item.shares || Math.floor(views * 0.01) || 0;
      
      const engagement = { likes, comments, shares, views };
      const totalEngagement = likes + comments + shares;
      const sentiment = SentimentAnalyzer.analyzeSentiment(item.snippet?.title + ' ' + item.snippet?.description || '', engagement);
      
      console.log(`YouTube ${index}: Engagement total=${totalEngagement}, Vues: ${views}, Sentiment: ${sentiment}`);
      
      const createdAt = item.snippet?.publishedAt || new Date().toISOString();
      
      return {
        id: item.id?.videoId || item.id || `youtube-${index}`,
        platform: 'YouTube',
        content: (item.snippet?.title || '') + ' - ' + (item.snippet?.description || ''),
        author: item.snippet?.channelTitle || 'Chaîne YouTube',
        created_at: createdAt,
        timestamp: createdAt,
        engagement,
        sentiment,
        url: `https://youtube.com/watch?v=${item.id?.videoId || item.id}`,
        author_url: `https://youtube.com/channel/${item.snippet?.channelId}`,
        location: undefined,
        influence_score: this.calculateInfluenceScore(totalEngagement, 0),
        tags: this.extractHashtags(item.snippet?.title + ' ' + item.snippet?.description || '')
      };
    });
  }

  static transformGoogleData(items: any[]): MentionResult[] {
    console.log(`🔍 TRANSFORMATION GOOGLE RÉELLE: ${items.length} éléments de votre API`);
    
    return items.map((item, index) => {
      // UTILISATION DES VRAIES DONNÉES DE VOTRE API GOOGLE
      const likes = item.likes || 0;
      const comments = item.comments || 0; 
      const shares = item.shares || 0;
      
      const engagement = { likes, comments, shares, views: 0 };
      const totalEngagement = likes + comments + shares;
      const sentiment = SentimentAnalyzer.analyzeSentiment(item.title + ' ' + item.snippet || '', engagement);
      
      console.log(`Google ${index}: Engagement total=${totalEngagement}, Sentiment: ${sentiment}`);
      
      const timestamp = new Date().toISOString();
      
      return {
        id: `google-${index}`,
        platform: 'Google',
        content: (item.title || '') + ' - ' + (item.snippet || ''),
        author: new URL(item.link || 'https://example.com').hostname,
        created_at: timestamp,
        timestamp,
        engagement,
        sentiment,
        url: item.link || '',
        author_url: item.link || '',
        location: undefined,
        influence_score: this.calculateInfluenceScore(totalEngagement, 0),
        tags: this.extractHashtags(item.title + ' ' + item.snippet || '')
      };
    });
  }

  static transformWebData(items: any[]): MentionResult[] {
    console.log(`🌐 TRANSFORMATION WEB RÉELLE: ${items.length} éléments de votre API`);
    
    return items.map((item, index) => {
      // UTILISATION DES VRAIES DONNÉES DE VOTRE API WEB
      const likes = item.likes || 0;
      const comments = item.comments || 0;
      const shares = item.shares || 0;
      
      const engagement = { likes, comments, shares, views: 0 };
      const totalEngagement = likes + comments + shares;
      const sentiment = SentimentAnalyzer.analyzeSentiment(item.title + ' ' + item.content || '', engagement);
      
      console.log(`Web ${index}: Engagement total=${totalEngagement}, Sentiment: ${sentiment}`);
      
      const createdAt = item.publishedAt || new Date().toISOString();
      
      return {
        id: `web-${index}`,
        platform: 'Web',
        content: (item.title || '') + ' - ' + (item.content || item.description || ''),
        author: item.domain || new URL(item.url || 'https://example.com').hostname,
        created_at: createdAt,
        timestamp: createdAt,
        engagement,
        sentiment,
        url: item.url || '',
        author_url: item.url || '',
        location: undefined,
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
