
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import RealApiService, { MentionResult } from '@/services/realApiService';

export const useRealSearch = () => {
  const [mentions, setMentions] = useState<MentionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const executeSearch = async (
    keywords: string[],
    selectedPlatforms: string[]
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
    setMentions([]);

    try {
      const apiService = new RealApiService();
      const allMentions: MentionResult[] = [];

      console.log('🔍 RECHERCHE API BACKEND UNIQUEMENT');
      console.log('📝 Mots-clés:', keywords);
      console.log('🎯 Plateformes:', selectedPlatforms);

      for (const platform of selectedPlatforms) {
        try {
          let platformMentions: MentionResult[] = [];

          switch (platform.toLowerCase()) {
            case 'tiktok':
              // Pour TikTok, convertir les mots-clés en hashtags
              const hashtags = keywords.map(k => k.replace('#', ''));
              platformMentions = await apiService.scrapeTikTok(hashtags);
              break;

            case 'facebook':
              // Pour Facebook, joindre les mots-clés en une requête
              const fbQuery = keywords.join(' ');
              platformMentions = await apiService.scrapeFacebook(fbQuery);
              break;

            case 'twitter':
              // Pour Twitter, joindre les mots-clés
              const twitterQuery = keywords.join(' ');
              platformMentions = await apiService.scrapeTwitter(twitterQuery);
              break;

            case 'youtube':
              // Pour YouTube, joindre les mots-clés
              const youtubeQuery = keywords.join(' ');
              platformMentions = await apiService.scrapeYouTube(youtubeQuery);
              break;

            case 'instagram':
              // Pour Instagram, utiliser les mots-clés comme usernames
              platformMentions = await apiService.scrapeInstagram(keywords);
              break;

            default:
              console.log(`⚠️ Plateforme ${platform} non supportée`);
              continue;
          }

          console.log(`✅ ${platform}: ${platformMentions.length} mentions récupérées`);
          allMentions.push(...platformMentions);

        } catch (platformError) {
          console.error(`❌ Erreur ${platform}:`, platformError);
          toast({
            title: `Erreur ${platform}`,
            description: `Impossible de récupérer les données de ${platform}`,
            variant: "destructive",
          });
        }
      }

      setMentions(allMentions);

      if (allMentions.length > 0) {
        toast({
          title: "Recherche terminée",
          description: `${allMentions.length} mention(s) trouvée(s) via votre API backend`,
        });
      } else {
        toast({
          title: "Aucun résultat",
          description: "Aucune mention trouvée pour ces critères de recherche",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('❌ Erreur générale:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue pendant la recherche",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mentions,
    isLoading,
    executeSearch
  };
};
