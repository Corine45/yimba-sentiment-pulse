
import { CachedResult, SearchFilters, MentionResult } from './types';

export class CacheManager {
  private cache: Map<string, CachedResult> = new Map();
  private cacheExpiration = 15 * 60 * 1000; // Cache de 15 minutes
  private lastUpdateCheck: Map<string, number> = new Map(); // Suivi des dernières vérifications

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
    this.lastUpdateCheck.set(key, Date.now());
    console.log(`💾 CACHE SAVED: ${data.length} mentions mises en cache pour 15 minutes`);
    console.log(`📊 Taille du cache: ${this.cache.size} entrées`);
  }

  // 🆕 Fusion intelligente des nouvelles données avec le cache existant
  mergeNewDataWithCache(key: string, newData: MentionResult[], keywords: string[], platforms: string[], filters: SearchFilters): MentionResult[] {
    const cached = this.getCache(key);
    
    if (!cached || !cached.data) {
      console.log('🆕 Pas de cache existant, utilisation des nouvelles données');
      this.setCache(key, newData, filters, keywords, platforms);
      return newData;
    }

    // Créer un Set des IDs existants pour éviter les doublons
    const existingIds = new Set(cached.data.map(mention => `${mention.id}-${mention.platform}`));
    
    // Filtrer les nouvelles données pour ne garder que les vraiment nouvelles
    const actuallyNewData = newData.filter(mention => 
      !existingIds.has(`${mention.id}-${mention.platform}`)
    );

    if (actuallyNewData.length > 0) {
      console.log(`🔄 FUSION: ${actuallyNewData.length} nouvelles mentions ajoutées au cache existant (${cached.data.length} déjà présentes)`);
      
      // Fusionner et trier par timestamp décroissant (plus récent en premier)
      const mergedData = [...actuallyNewData, ...cached.data]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      this.setCache(key, mergedData, filters, keywords, platforms);
      return mergedData;
    } else {
      console.log('✅ Aucune nouvelle donnée trouvée, utilisation du cache existant');
      return cached.data;
    }
  }

  // 🆕 Vérifier si une mise à jour est nécessaire (toutes les 2 minutes)
  shouldCheckForUpdates(key: string): boolean {
    const lastCheck = this.lastUpdateCheck.get(key);
    const updateInterval = 2 * 60 * 1000; // Vérifier les mises à jour toutes les 2 minutes
    
    if (!lastCheck || Date.now() - lastCheck > updateInterval) {
      this.lastUpdateCheck.set(key, Date.now());
      return true;
    }
    
    return false;
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
