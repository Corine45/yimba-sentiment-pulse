
import { MentionResult, SearchFilters } from './types';

export class FiltersManager {
  static applyFilters(results: MentionResult[], filters: SearchFilters): MentionResult[] {
    let filtered = [...results];
    const originalCount = filtered.length;
    
    console.log('🔧 APPLICATION DES FILTRES AVANCÉS:', filters);
    console.log(`📊 Résultats avant filtrage: ${originalCount}`);

    // Filtrer par sentiment avec support array/string
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

    // Filtrer par score d'influence (range)
    if (filters.influenceScore !== undefined || filters.minInfluenceScore !== undefined || filters.maxInfluenceScore !== undefined) {
      const beforeInfluence = filtered.length;
      const minScore = filters.minInfluenceScore || filters.influenceScore || 0;
      const maxScore = filters.maxInfluenceScore || 10;
      
      filtered = filtered.filter(item => {
        const itemScore = item.influenceScore || 0;
        const matches = itemScore >= minScore && itemScore <= maxScore;
        if (!matches) {
          console.log(`🚫 Item exclu par influence: ${item.id} (score ${itemScore} pas entre ${minScore}-${maxScore})`);
        }
        return matches;
      });
      console.log(`🎯 Filtre influence appliqué: ${beforeInfluence} → ${filtered.length} (score: ${minScore}-${maxScore})`);
    }

    // Filtrer par engagement
    if (filters.minEngagement !== undefined) {
      const beforeEngagement = filtered.length;
      filtered = filtered.filter(item => {
        const totalEngagement = item.engagement.likes + item.engagement.comments + item.engagement.shares;
        const matches = totalEngagement >= filters.minEngagement!;
        if (!matches) {
          console.log(`🚫 Item exclu par engagement min: ${item.id} (${totalEngagement} < ${filters.minEngagement})`);
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

    // Filtrer par langue
    if (filters.language) {
      const beforeLanguage = filtered.length;
      filtered = filtered.filter(item => {
        // Logique simple de détection de langue basée sur le contenu
        const content = item.content.toLowerCase();
        if (filters.language === 'fr') {
          return content.includes('le ') || content.includes('la ') || content.includes('et ') || content.includes('de ');
        } else if (filters.language === 'en') {
          return content.includes('the ') || content.includes('and ') || content.includes('of ') || content.includes('to ');
        }
        return true; // Par défaut, inclure
      });
      console.log(`🗣️ Filtre langue appliqué: ${beforeLanguage} → ${filtered.length} (langue: ${filters.language})`);
    }

    // Filtrer par auteur
    if (filters.author) {
      const beforeAuthor = filtered.length;
      const authorFilter = filters.author.toLowerCase();
      filtered = filtered.filter(item => 
        item.author.toLowerCase().includes(authorFilter)
      );
      console.log(`👤 Filtre auteur appliqué: ${beforeAuthor} → ${filtered.length} (auteur: ${filters.author})`);
    }

    // Filtrer par domaine
    if (filters.domain) {
      const beforeDomain = filtered.length;
      const domainFilter = filters.domain.toLowerCase();
      filtered = filtered.filter(item => 
        item.url.toLowerCase().includes(domainFilter)
      );
      console.log(`🌐 Filtre domaine appliqué: ${beforeDomain} → ${filtered.length} (domaine: ${filters.domain})`);
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
        const beforePeriod = filtered.length;
        const cutoffDate = new Date(now.getTime() - periodMs);
        filtered = filtered.filter(item => new Date(item.timestamp) >= cutoffDate);
        console.log(`📅 Filtre période appliqué: ${beforePeriod} → ${filtered.length} (période: ${filters.period})`);
      }
    }

    // Filtrer par dates spécifiques
    if (filters.dateFrom || filters.dateTo) {
      const beforeDate = filtered.length;
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.timestamp);
        if (filters.dateFrom && itemDate < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && itemDate > new Date(filters.dateTo)) return false;
        return true;
      });
      console.log(`📆 Filtre dates appliqué: ${beforeDate} → ${filtered.length}`);
    }

    // Filtrer par géographie
    if (filters.geography && (filters.geography.country || filters.geography.city)) {
      const beforeGeo = filtered.length;
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
      console.log(`🌍 Filtre géographie appliqué: ${beforeGeo} → ${filtered.length}`);
    }

    // Trier les résultats selon le critère demandé
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'recent':
          filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          console.log('📅 Tri par date récente appliqué');
          break;
        case 'popular':
        case 'engagement':
          filtered.sort((a, b) => {
            const aEngagement = a.engagement.likes + a.engagement.comments + a.engagement.shares;
            const bEngagement = b.engagement.likes + b.engagement.comments + b.engagement.shares;
            return bEngagement - aEngagement;
          });
          console.log('🔥 Tri par popularité/engagement appliqué');
          break;
        case 'influence':
          filtered.sort((a, b) => (b.influenceScore || 0) - (a.influenceScore || 0));
          console.log('⭐ Tri par influence appliqué');
          break;
      }
    }

    console.log(`✅ FILTRAGE AVANCÉ TERMINÉ: ${originalCount} → ${filtered.length} résultats`);
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
