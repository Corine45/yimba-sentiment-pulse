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

    // Vérifier les nouvelles données toutes les 5 minutes
    const checkForNewMentions = async () => {
      try {
        const now = Date.now();
        const fiveMinutesAgo = now - (5 * 60 * 1000);
        
        // Éviter les recherches trop fréquentes
        if (now - lastSearchRef.current < 60000) { // 1 minute minimum entre les vérifications
          return;
        }
        
        lastSearchRef.current = now;

        console.log('🔄 VÉRIFICATION TEMPS RÉEL: Recherche de nouvelles mentions...');
        
        // Ici on pourrait appeler une API spécialisée pour les mises à jour temps réel
        // Pour l'instant, on utilise le système de cache intelligent existant
        
      } catch (error) {
        console.error('❌ Erreur lors de la vérification temps réel:', error);
      }
    };

    // Démarrer la vérification périodique
    intervalRef.current = setInterval(checkForNewMentions, 5 * 60 * 1000); // 5 minutes

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