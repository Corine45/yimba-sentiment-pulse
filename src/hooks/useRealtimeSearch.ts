import { useEffect, useRef } from 'react';
import { MentionResult, SearchFilters } from '@/services/api/types';

interface RealtimeSearchProps {
  keywords: string[];
  platforms: string[];
  filters: SearchFilters;
  onNewMentions: (newMentions: MentionResult[]) => void;
  isEnabled: boolean;
}

export const useRealtimeSearch = ({
  keywords,
  platforms,
  filters,
  onNewMentions,
  isEnabled
}: RealtimeSearchProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSearchRef = useRef<number>(0);

  useEffect(() => {
    if (!isEnabled || keywords.length === 0 || platforms.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Vérifier les nouvelles données toutes les 2 minutes
    const checkForNewMentions = async () => {
      try {
        const now = Date.now();
        
        // Éviter les recherches trop fréquentes
        if (now - lastSearchRef.current < 30000) { // 30 secondes minimum entre les vérifications
          return;
        }
        
        lastSearchRef.current = now;

        console.log('🔄 VÉRIFICATION TEMPS RÉEL: Recherche de nouvelles mentions...');
        
        // Utiliser le cache manager pour vérifier les mises à jour
        const RealApiService = await import('@/services/realApiService');
        const apiService = new RealApiService.default();
        
        try {
          const { results, fromCache } = await apiService.searchWithCache(keywords, platforms, filters);
          
          if (!fromCache && results.length > 0) {
            console.log(`🆕 NOUVELLES DONNÉES DÉTECTÉES: ${results.length} mentions`);
            onNewMentions(results);
          }
        } catch (error) {
          console.warn('⚠️ Erreur lors de la vérification automatique:', error);
        }
        
      } catch (error) {
        console.error('❌ Erreur lors de la vérification temps réel:', error);
      }
    };

    // Démarrer la vérification périodique toutes les 2 minutes
    intervalRef.current = setInterval(checkForNewMentions, 2 * 60 * 1000); // 2 minutes

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [keywords, platforms, filters, isEnabled, onNewMentions]);

  return {
    // Pour l'instant, on retourne juste l'état
    isMonitoring: isEnabled && intervalRef.current !== null
  };
};