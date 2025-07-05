
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import RealApiService from '@/services/realApiService';
import { MentionResult, SearchFilters } from '@/services/api/types';
import { useSavedMentions } from './useSavedMentions';

export const useRealSearch = () => {
  const [mentions, setMentions] = useState<MentionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [platformCounts, setPlatformCounts] = useState<{ [key: string]: number }>({});
  const [totalMentions, setTotalMentions] = useState(0);
  const [fromCache, setFromCache] = useState(false);
  const [sentimentStats, setSentimentStats] = useState({ positive: 0, neutral: 0, negative: 0 });
  const [totalEngagement, setTotalEngagement] = useState(0);
  const { toast } = useToast();
  const { saveMentions } = useSavedMentions();

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
      
      console.log('🔍 RECHERCHE API BACKEND AVEC CACHE 10 MIN ET FILTRES AVANCÉS');
      console.log('📝 Mots-clés:', keywords);
      console.log('🎯 Plateformes:', selectedPlatforms);
      console.log('🔧 Filtres:', filters);

      const { results, fromCache: cacheUsed, platformCounts: counts } = await apiService.searchWithCache(
        keywords,
        selectedPlatforms,
        filters
      );

      console.log(`🏁 TOTAL: ${results.length} mentions récupérées`);
      console.log(`📦 Cache (10 min): ${cacheUsed ? 'Utilisé' : 'Nouvelle requête'}`);
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

      if (results.length > 0) {
        toast({
          title: "Recherche terminée",
          description: `${results.length} mention(s) trouvée(s) ${cacheUsed ? '(cache 10 min)' : 'via API backend'} • Positif: ${positive} • Neutre: ${neutral} • Négatif: ${negative}`,
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
      description: "Le cache des recherches (10 min) a été vidé avec succès",
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
    executeSearch,
    saveMentions: handleSaveMentions,
    clearCache
  };
};
