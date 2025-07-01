
import { useToast } from '@/hooks/use-toast';
import { useSearchResults } from '@/hooks/useSearchResults';
import { usePlatforms } from '@/hooks/usePlatforms';
import ApifyService from '@/services/apifyService';

export const useSearchExecution = () => {
  const { createSearchResult, fetchSearchResults } = useSearchResults();
  const { platforms } = usePlatforms();
  const { toast } = useToast();

  const executeSearch = async (
    keywords: string[],
    selectedPlatforms: string[],
    apifyToken: string,
    setIsSearching: (searching: boolean) => void,
    setCurrentSearchTerm: (term: string) => void
  ) => {
    if (keywords.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins un mot-clé.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins une plateforme.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    const searchTerm = keywords.join(', ');
    setCurrentSearchTerm(searchTerm);

    try {
      console.log('Démarrage de la recherche avec Apify...');
      
      if (apifyToken) {
        await executeRealSearch(searchTerm, selectedPlatforms, apifyToken);
      } else {
        await executeSimulatedSearch(searchTerm, selectedPlatforms);
      }

      await fetchSearchResults(searchTerm);
      
      toast({
        title: "Recherche terminée",
        description: `Recherche effectuée pour "${searchTerm}" sur ${selectedPlatforms.length} plateformes.`,
      });
    } catch (error) {
      console.error('Erreur générale lors de la recherche:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue pendant la recherche.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const executeRealSearch = async (searchTerm: string, selectedPlatforms: string[], apifyToken: string) => {
    const apifyService = new ApifyService(apifyToken);
    
    for (const platformName of selectedPlatforms) {
      const platform = platforms.find(p => p.name === platformName);
      
      if (platform?.apify_actor_id) {
        try {
          console.log(`Recherche sur ${platformName} avec l'acteur ${platform.apify_actor_id}`);
          
          let engagementData = [];
          
          switch (platformName.toLowerCase()) {
            case 'instagram':
              engagementData = await apifyService.scrapeInstagram(searchTerm);
              break;
            case 'twitter':
              engagementData = await apifyService.scrapeTwitter(searchTerm);
              break;
            case 'facebook':
              engagementData = await apifyService.scrapeFacebook(searchTerm);
              break;
            case 'tiktok':
              engagementData = await apifyService.scrapeTikTok(searchTerm);
              break;
            default:
              console.log(`Plateforme ${platformName} non supportée`);
              continue;
          }

          const totalMentions = engagementData.length;
          const totalEngagement = engagementData.reduce((sum, item) => 
            sum + item.likes + item.comments + item.shares, 0);
          const totalReach = engagementData.reduce((sum, item) => 
            sum + (item.likes * 10), 0);
          
          const positiveSentiment = Math.floor(totalMentions * 0.4);
          const negativeSentiment = Math.floor(totalMentions * 0.2);
          const neutralSentiment = totalMentions - positiveSentiment - negativeSentiment;

          await createSearchResult({
            search_id: null,
            search_term: searchTerm,
            platform: platformName,
            total_mentions: totalMentions,
            positive_sentiment: positiveSentiment,
            negative_sentiment: negativeSentiment,
            neutral_sentiment: neutralSentiment,
            total_reach: totalReach,
            total_engagement: totalEngagement,
            results_data: engagementData
          });

          console.log(`Données récupérées pour ${platformName}: ${totalMentions} mentions`);
          
        } catch (platformError) {
          console.error(`Erreur lors de la recherche sur ${platformName}:`, platformError);
          await createSimulatedResult(searchTerm, platformName);
        }
      } else {
        console.log(`Pas d'acteur Apify configuré pour ${platformName}, utilisation de données simulées`);
        await createSimulatedResult(searchTerm, platformName);
      }
    }
  };

  const executeSimulatedSearch = async (searchTerm: string, selectedPlatforms: string[]) => {
    console.log('Pas de token Apify configuré, utilisation de données simulées');
    
    for (const platform of selectedPlatforms) {
      await createSimulatedResult(searchTerm, platform);
    }
  };

  const createSimulatedResult = async (searchTerm: string, platform: string) => {
    await createSearchResult({
      search_id: null,
      search_term: searchTerm,
      platform: platform,
      total_mentions: Math.floor(Math.random() * 1000) + 100,
      positive_sentiment: Math.floor(Math.random() * 50) + 30,
      negative_sentiment: Math.floor(Math.random() * 30) + 10,
      neutral_sentiment: Math.floor(Math.random() * 40) + 20,
      total_reach: Math.floor(Math.random() * 100000) + 10000,
      total_engagement: Math.floor(Math.random() * 5000) + 500,
      results_data: []
    });
  };

  return {
    executeSearch,
  };
};
