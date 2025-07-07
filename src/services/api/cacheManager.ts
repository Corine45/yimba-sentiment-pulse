
import { CachedResult, SearchFilters, MentionResult } from './types';

export class CacheManager {
  private cache: Map<string, CachedResult> = new Map();
  private cacheExpiration = 5 * 60 * 1000; // 🔧 RÉDUCTION: 5 minutes au lieu de 10

  getCacheKey(keywords: string[], platforms: string[], filters: SearchFilters): string {
    // 🔧 AMÉLIORATION: Clé de cache plus spécifique
    const sortedKeywords = [...keywords].sort();
    const sortedPlatforms = [...platforms].sort();
    const filterHash = JSON.stringify(filters, Object.keys(filters).sort());
    
    return `search:${sortedKeywords.join(',')}:${sortedPlatforms.join(',')}:${filterHash}`;
  }

  isValidCache(cached: CachedResult): boolean {
    const isValid = Date.now() - cached.timestamp < this.cacheExpiration;
    
    if (!isValid) {
      console.log('🗑️ Cache expiré, suppression automatique');
    } else {
      const remainingTime = Math.round((this.cacheExpiration - (Date.now() - cached.timestamp)) / 1000);
      console.log(`✅ Cache valide, reste ${remainingTime}s`);
    }
    
    return isValid;
  }

  getCache(key: string): CachedResult | undefined {
    const cached = this.cache.get(key);
    
    if (cached && this.isValidCache(cached)) {
      console.log(`🎯 CACHE HIT: ${cached.data.length} mentions récupérées du cache`);
      return cached;
    } else if (cached) {
      // Supprimer le cache expiré
      this.cache.delete(key);
      console.log('🗑️ Cache expiré supprimé');
    }
    
    console.log('❌ CACHE MISS: Nouvelle requête nécessaire');
    return undefined;
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
    console.log(`💾 CACHE SAVED: ${data.length} mentions mises en cache pour 5 minutes`);
    console.log(`📊 Taille du cache: ${this.cache.size} entrées`);
  }

  clearCache(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`🧹 Cache vidé: ${size} entrées supprimées`);
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  // 🔧 NOUVEAU: Nettoyage automatique des caches expirés
  cleanExpiredCache(): void {
    let cleaned = 0;
    for (const [key, cached] of this.cache.entries()) {
      if (!this.isValidCache(cached)) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Nettoyage automatique: ${cleaned} caches expirés supprimés`);
    }
  }

  // 🔧 NOUVEAU: Statistiques du cache
  getCacheStats(): { size: number; oldestEntry: number; newestEntry: number } {
    const entries = Array.from(this.cache.values());
    const timestamps = entries.map(e => e.timestamp);
    
    return {
      size: this.cache.size,
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : 0,
      newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : 0
    };
  }
}
