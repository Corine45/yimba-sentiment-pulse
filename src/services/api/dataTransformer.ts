
import { MentionResult } from './types';
import { PlatformTransformers } from './platformTransformers';

export class DataTransformer {
  static transformToMentions(items: any[], endpoint: string): MentionResult[] {
    const platform = this.getPlatformFromEndpoint(endpoint);
    
    console.log(`🔄 Transformation ${platform}: ${items.length} éléments`);
    
    switch (platform.toLowerCase()) {
      case 'facebook':
        return PlatformTransformers.transformFacebookData(items);
      case 'instagram':
        return PlatformTransformers.transformInstagramData(items);
      case 'twitter':
        return PlatformTransformers.transformTwitterData(items);
      case 'youtube':
        return PlatformTransformers.transformYouTubeData(items);
      case 'google':
        return PlatformTransformers.transformGoogleData(items);
      case 'web':
        return PlatformTransformers.transformWebData(items);
      default:
        console.warn(`⚠️ Plateforme non supportée: ${platform}`);
        return [];
    }
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
}
