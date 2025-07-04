import { MentionResult, SearchFilters } from './types';

export class FiltersManager {
  static applyFilters(results: MentionResult[], filters: SearchFilters): MentionResult[] {
    let filtered = [...results];
    const originalCount = filtered.length;
    
    console.log('🔧 APPLICATION DES FILTRES:', filters);
    console.log(`📊 Résultats avant filtrage: ${originalCount}`);

    // Filtrer par sentiment
    if (filters.sentiment) {
      const sentimentFilter = Array.isArray(filters.sentiment) ? filters.sentiment : [filters.sentiment];
      
      if (sentimentFilter.length > 0) {
        const beforeSentiment = filtered.length;
        filtered = filtered.filter(item => {
          const itemSentiment = item.sentiment || 'neutral';
          const matches = sentimentFilter.includes(itemSentiment);
          if (!matches) {
            console.log(`🚫 Item exclu par sentiment: ${item.id} (${itemSentiment} not in [${sentimentFilter.join(', ')}])`);
          }
          return matches;
        });
        console.log(`🎭 Filtre sentiment appliqué: ${beforeSentiment} → ${filtered.length} (critères: [${sentimentFilter.join(', ')}])`);
      }
    }

    // Filtrer par score d'influence
    if (filters.influenceScore !== undefined && filters.influenceScore > 0) {
      const beforeInfluence = filtered.length;
      filtered = filtered.filter(item => {
        const itemScore = item.influenceScore || 0;
        const matches = itemScore >= filters.influenceScore!;
        if (!matches) {
          console.log(`🚫 Item exclu par influence: ${item.id} (score ${itemScore} < ${filters.influenceScore})`);
        }
        return matches;
      });
      console.log(`🎯 Filtre influence appliqué: ${beforeInfluence} → ${filtered.length} (score min: ${filters.influenceScore})`);
    }

    // Filtrer par engagement
    if (filters.minEngagement !== undefined) {
      const beforeEngagement = filtered.length;
      filtered = filtered.filter(item => {
        const totalEngagement = item.engagement.likes + item.engagement.comments + item.engagement.shares;
        const matches = totalEngagement >= filters.minEngagement!;
        if (!matches) {
          console.log(`🚫 Item exclu par engagement: ${item.id} (${totalEngagement} < ${filters.minEngagement})`);
        }
        return matches;
      });
      console.log(`📈 Filtre engagement min appliqué: ${beforeEngagement} → ${filtered.length} (min: ${filters.minEngagement})`);
    }

    if (filters.maxEngagement !== undefined) {
      const beforeMaxEngagement = filtered.length;
      filtered = filtered.filter(item => {
        const totalEngagement = item.engagement.likes + item.engagement.comments + item.engagement.shares;
        return totalEngagement <= filters.maxEngagement!;
      });
      console.log(`📉 Filtre engagement max appliqué: ${beforeMaxEngagement} → ${filtered.length} (max: ${filters.maxEngagement})`);
    }

    // Filtrer par période
    if (filters.period) {
      const now = new Date();
      const periodMap: { [key: string]: number } = {
        '1d': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '3m': 90 * 24 * 60 * 60 * 1000
      };
      
      const periodMs = periodMap[filters.period];
      if (periodMs) {
        const cutoffDate = new Date(now.getTime() - periodMs);
        filtered = filtered.filter(item => new Date(item.timestamp) >= cutoffDate);
      }
    }

    // Filtrer par géographie
    if (filters.geography && (filters.geography.country || filters.geography.city)) {
      filtered = filtered.filter(item => {
        if (!item.location) return false;
        
        if (filters.geography?.country && item.location.country !== filters.geography.country) {
          return false;
        }
        
        if (filters.geography?.city && item.location.city !== filters.geography.city) {
          return false;
        }
        
        // Filtrage par coordonnées et rayon si spécifiés
        if (filters.geography?.latitude && filters.geography?.longitude && filters.geography?.radius) {
          if (!item.location.latitude || !item.location.longitude) return false;
          
          const distance = FiltersManager.calculateDistance(
            filters.geography.latitude,
            filters.geography.longitude,
            item.location.latitude,
            item.location.longitude
          );
          
          return distance <= filters.geography.radius;
        }
        
        return true;
      });
    }

    // Trier les résultats
    if (filters.sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      console.log('📅 Tri par date récente appliqué');
    } else if (filters.sortBy === 'popular') {
      filtered.sort((a, b) => {
        const aEngagement = a.engagement.likes + a.engagement.comments + a.engagement.shares;
        const bEngagement = b.engagement.likes + b.engagement.comments + b.engagement.shares;
        return bEngagement - aEngagement;
      });
      console.log('🔥 Tri par popularité appliqué');
    }

    console.log(`✅ FILTRAGE TERMINÉ: ${originalCount} → ${filtered.length} résultats`);
    return filtered;
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = FiltersManager.deg2rad(lat2 - lat1);
    const dLon = FiltersManager.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(FiltersManager.deg2rad(lat1)) * Math.cos(FiltersManager.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}
