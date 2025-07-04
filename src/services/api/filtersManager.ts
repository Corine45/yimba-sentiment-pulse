
import { MentionResult, SearchFilters } from './types';

export class FiltersManager {
  static applyFilters(results: MentionResult[], filters: SearchFilters): MentionResult[] {
    let filtered = [...results];

    // Filtrer par sentiment
    if (filters.sentiment) {
      filtered = filtered.filter(item => item.sentiment === filters.sentiment);
    }

    // Filtrer par engagement
    if (filters.minEngagement !== undefined) {
      filtered = filtered.filter(item => 
        (item.engagement.likes + item.engagement.comments + item.engagement.shares) >= filters.minEngagement
      );
    }

    if (filters.maxEngagement !== undefined) {
      filtered = filtered.filter(item => 
        (item.engagement.likes + item.engagement.comments + item.engagement.shares) <= filters.maxEngagement
      );
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
    } else if (filters.sortBy === 'popular') {
      filtered.sort((a, b) => {
        const aEngagement = a.engagement.likes + a.engagement.comments + a.engagement.shares;
        const bEngagement = b.engagement.likes + b.engagement.comments + b.engagement.shares;
        return bEngagement - aEngagement;
      });
    }

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
