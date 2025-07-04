
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import RealApiService, { MentionResult, SearchFilters } from '@/services/realApiService';

export const useRealSearch = () => {
  const [mentions, setMentions] = useState<MentionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [platformCounts, setPlatformCounts] = useState<{ [key: string]: number }>({});
  const [totalMentions, setTotalMentions] = useState(0);
  const [fromCache, setFromCache] = useState(false);
  const { toast } = useToast();

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
      
      console.log('🔍 RECHERCHE API BACKEND AVEC CACHE ET FILTRES');
      console.log('📝 Mots-clés:', keywords);
      console.log('🎯 Plateformes:', selectedPlatforms);
      console.log('🔧 Filtres:', filters);

      const { results, fromCache: cacheUsed, platformCounts: counts } = await apiService.searchWithCache(
        keywords,
        selectedPlatforms,
        filters
      );

      console.log(`🏁 TOTAL: ${results.length} mentions récupérées`);
      console.log(`📦 Depuis le cache: ${cacheUsed ? 'Oui' : 'Non'}`);
      console.log(`📊 Répartition par plateforme:`, counts);

      setMentions(results);
      setPlatformCounts(counts);
      setTotalMentions(results.length);
      setFromCache(cacheUsed);

      if (results.length > 0) {
        toast({
          title: "Recherche terminée",
          description: `${results.length} mention(s) trouvée(s) ${cacheUsed ? '(depuis le cache)' : 'via votre API backend'}`,
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
    } finally {
      setIsLoading(false);
    }
  };

  const saveMentions = async (mentionsToSave: MentionResult[]) => {
    try {
      const dataStr = JSON.stringify(mentionsToSave, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mentions_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Mentions sauvegardées",
        description: `${mentionsToSave.length} mention(s) sauvegardée(s) avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les mentions",
        variant: "destructive",
      });
    }
  };

  const clearCache = () => {
    const apiService = new RealApiService();
    apiService.clearCache();
    toast({
      title: "Cache vidé",
      description: "Le cache des recherches a été vidé avec succès",
    });
  };

  return {
    mentions,
    isLoading,
    platformCounts,
    totalMentions,
    fromCache,
    executeSearch,
    saveMentions,
    clearCache
  };
};
