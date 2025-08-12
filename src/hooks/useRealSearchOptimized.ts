import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import RealApiService from '@/services/realApiService';
import { MentionResult, SearchFilters } from '@/services/api/types';
import { useSavedMentions } from './useSavedMentions';
import { useRealtimeSearch } from './useRealtimeSearch';

export const useRealSearchOptimized = () => {
  const [mentions, setMentions] = useState<MentionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [platformCounts, setPlatformCounts] = useState<{ [key: string]: number }>({});
  const [totalMentions, setTotalMentions] = useState(0);
  const [fromCache, setFromCache] = useState(false);
  const [sentimentStats, setSentimentStats] = useState({ positive: 0, neutral: 0, negative: 0 });
  const [totalEngagement, setTotalEngagement] = useState(0);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const { toast } = useToast();
  const { saveMentions } = useSavedMentions();

  // Callback pour gérer les nouvelles mentions en temps réel
  const handleNewMentions = useCallback((newMentions: MentionResult[]) => {
    console.log(`🆕 MISE À JOUR TEMPS RÉEL: ${newMentions.length} nouvelles mentions`);
    
    // Fusionner avec les mentions existantes en évitant les doublons
    setMentions(currentMentions => {
      const existingIds = new Set(currentMentions.map(m => `${m.id}-${m.platform}`));
      const reallyNewMentions = newMentions.filter(m => 
        !existingIds.has(`${m.id}-${m.platform}`)
      );
      
      if (reallyNewMentions.length > 0) {
        const updatedMentions = [...reallyNewMentions, ...currentMentions]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        // Recalculer les statistiques
        const positive = updatedMentions.filter(m => m.sentiment === 'positive').length;
        const neutral = updatedMentions.filter(m => m.sentiment === 'neutral').length;
        const negative = updatedMentions.filter(m => m.sentiment === 'negative').length;
        const engagement = updatedMentions.reduce((sum, m) => 
          sum + m.engagement.likes + m.engagement.comments + m.engagement.shares, 0
        );
        
        // Mettre à jour les statistiques
        setSentimentStats({ positive, neutral, negative });
        setTotalEngagement(engagement);
        setTotalMentions(updatedMentions.length);
        
        // Calculer les comptes par plateforme
        const counts: { [key: string]: number } = {};
        updatedMentions.forEach(result => {
          counts[result.platform] = (counts[result.platform] || 0) + 1;
        });
        setPlatformCounts(counts);
        
        toast({
          title: "Nouvelles mentions",
          description: `${reallyNewMentions.length} nouvelle(s) mention(s) ajoutée(s)`,
        });
        
        return updatedMentions;
      }
      
      return currentMentions;
    });
  }, [toast]);

  // État pour les paramètres de surveillance temps réel
  const [currentKeywords, setCurrentKeywords] = useState<string[]>([]);
  const [currentPlatforms, setCurrentPlatforms] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});

  // Hook pour la surveillance temps réel avec les vrais paramètres
  useRealtimeSearch({
    keywords: currentKeywords,
    platforms: currentPlatforms,
    filters: currentFilters,
    onNewMentions: handleNewMentions,
    isEnabled: realtimeEnabled
  });

  const executeSearch = async (
    keywords: string[],
    selectedPlatforms: string[],
    filters: SearchFilters = {}
  ) => {
    if (keywords.length === 0 || selectedPlatforms.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir des mots-clés et sélectionner au moins une plateforme.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const apiService = new RealApiService();
      
      console.log('🔍 RECHERCHE OPTIMISÉE AVEC CACHE 15 MIN ET TEMPS RÉEL');
      console.log('📝 Mots-clés:', keywords);
      console.log('🎯 Plateformes:', selectedPlatforms);
      console.log('🔧 Filtres:', filters);

      const { results, fromCache: cacheUsed, platformCounts: counts } = await apiService.searchWithCache(
        keywords,
        selectedPlatforms,
        filters
      );

      console.log(`🏁 TOTAL: ${results.length} mentions récupérées`);
      console.log(`📦 Cache (15 min): ${cacheUsed ? 'Utilisé' : 'Nouvelle requête'}`);
      console.log(`📊 Répartition par plateforme:`, counts);

      // Calculer les statistiques de sentiment
      const positive = results.filter(m => m.sentiment === 'positive').length;
      const neutral = results.filter(m => m.sentiment === 'neutral').length;
      const negative = results.filter(m => m.sentiment === 'negative').length;
      const engagement = results.reduce((sum, m) => 
        sum + m.engagement.likes + m.engagement.comments + m.engagement.shares, 0
      );

      setMentions(results);
      setPlatformCounts(counts);
      setTotalMentions(results.length);
      setFromCache(cacheUsed);
      setSentimentStats({ positive, neutral, negative });
      setTotalEngagement(engagement);

      // Activer la surveillance temps réel avec les vrais paramètres de recherche
      setCurrentKeywords(keywords);
      setCurrentPlatforms(selectedPlatforms);
      setCurrentFilters(filters);
      setRealtimeEnabled(true);

      if (results.length > 0) {
        toast({
          title: "Recherche terminée",
          description: `${results.length} mention(s) trouvée(s) ${cacheUsed ? '(cache 15 min)' : 'via API backend'} • Surveillance temps réel activée`,
        });
      } else {
        toast({
          title: "Aucun résultat",
          description: "Votre API backend n'a retourné aucune mention pour ces critères",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('❌ Erreur générale:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue pendant la recherche via votre API backend",
        variant: "destructive",
      });
      setMentions([]);
      setPlatformCounts({});
      setTotalMentions(0);
      setFromCache(false);
      setSentimentStats({ positive: 0, neutral: 0, negative: 0 });
      setTotalEngagement(0);
      setRealtimeEnabled(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMentions = async (
    mentionsToSave: MentionResult[],
    keywords: string[],
    platforms: string[],
    filters: SearchFilters,
    format: 'json' | 'pdf' | 'csv' = 'json'
  ) => {
    try {
      const result = await saveMentions(mentionsToSave, keywords, platforms, filters, format);
      
      if (result.success) {
        toast({
          title: "Mentions sauvegardées",
          description: `${mentionsToSave.length} mention(s) sauvegardée(s) en format ${format.toUpperCase()}`,
        });
      } else {
        toast({
          title: "Erreur de sauvegarde",
          description: "Impossible de sauvegarder les mentions",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      });
    }
  };

  const clearCache = () => {
    const apiService = new RealApiService();
    apiService.clearCache();
    toast({
      title: "Cache vidé",
      description: "Le cache des recherches (15 min) a été vidé avec succès",
    });
  };

  const toggleRealtimeSearch = () => {
    setRealtimeEnabled(prev => {
      const newState = !prev;
      toast({
        title: newState ? "Surveillance temps réel activée" : "Surveillance temps réel désactivée",
        description: newState ? "Les nouvelles mentions seront détectées automatiquement" : "La surveillance automatique est arrêtée",
      });
      return newState;
    });
  };

  return {
    mentions,
    isLoading,
    platformCounts,
    totalMentions,
    fromCache,
    sentimentStats,
    totalEngagement,
    realtimeEnabled,
    executeSearch,
    saveMentions: handleSaveMentions,
    clearCache,
    toggleRealtimeSearch
  };
};