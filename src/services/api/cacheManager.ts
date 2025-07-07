
import { CachedResult, SearchFilters, MentionResult } from './types';

export class CacheManager {
  private cache: Map<string, CachedResult> = new Map();
  private cacheExpiration = 10 * 60 * 1000; // 10 minutes

  getCacheKey(keywords: string[], platforms: string[], filters: SearchFilters): string {
    return JSON.stringify({ keywords, platforms, filters });
  }

  isValidCache(cached: CachedResult): boolean {
    return Date.now() - cached.timestamp < this.cacheExpiration;
  }

  getCache(key: string): CachedResult | undefined {
    return this.cache.get(key);
  }

  setCache(key: string, data: MentionResult[], filters: SearchFilters, keywords: string[], platforms: string[]): void {
    const cacheData: CachedResult = {
      data,
      timestamp: Date.now(),
      filters,
      keywords,
      platforms
    };
    this.cache.set(key, cacheData);
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}
