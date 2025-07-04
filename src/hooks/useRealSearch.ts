
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
    setMentions([]); // Reset des résultats précédents

    try {
      const apiService = new RealApiService();
      const allMentions: MentionResult[] = [];

      console.log('🔍 RECHERCHE API BACKEND UNIQUEMENT - ZÉRO DONNÉES STATIQUES');
      console.log('📝 Mots-clés:', keywords);
      console.log('🎯 Plateformes:', selectedPlatforms);

      for (const platform of selectedPlatforms) {
        try {
          console.log(`\n🚀 === APPEL ${platform.toUpperCase()} API ===`);
          let platformMentions: MentionResult[] = [];

          switch (platform.toLowerCase()) {
            case 'tiktok':
              // Pour TikTok, convertir les mots-clés en hashtags
              const hashtags = keywords.map(k => k.replace('#', ''));
              console.log(`📤 TikTok payload:`, { hashtags });
              platformMentions = await apiService.scrapeTikTok(hashtags);
              break;

            case 'facebook':
              // Pour Facebook, joindre les mots-clés en une requête
              const fbQuery = keywords.join(' ');
              console.log(`📤 Facebook payload:`, { query: fbQuery });
              platformMentions = await apiService.scrapeFacebook(fbQuery);
              break;

            case 'twitter':
              // Pour Twitter, joindre les mots-clés
              const twitterQuery = keywords.join(' ');
              console.log(`📤 Twitter payload:`, { query: twitterQuery });
              platformMentions = await apiService.scrapeTwitter(twitterQuery);
              break;

            case 'youtube':
              // Pour YouTube, joindre les mots-clés
              const youtubeQuery = keywords.join(' ');
              console.log(`📤 YouTube payload:`, { searchKeywords: youtubeQuery });
              platformMentions = await apiService.scrapeYouTube(youtubeQuery);
              break;

            case 'instagram':
              // Pour Instagram, utiliser les mots-clés comme usernames
              console.log(`📤 Instagram payload:`, { usernames: keywords });
              platformMentions = await apiService.scrapeInstagram(keywords);
              break;

            default:
              console.log(`⚠️ Plateforme ${platform} non supportée`);
              continue;
          }

          console.log(`✅ ${platform}: ${platformMentions.length} mentions RÉELLES récupérées`);
          
          if (platformMentions.length > 0) {
            allMentions.push(...platformMentions);
            console.log(`📊 Aperçu données ${platform}:`, platformMentions[0]);
          } else {
            console.log(`⚠️ ${platform}: Aucune donnée retournée par l'API`);
          }

        } catch (platformError) {
          console.error(`❌ Erreur ${platform}:`, platformError);
          toast({
            title: `Erreur ${platform}`,
            description: `Impossible de récupérer les données de ${platform}: ${platformError instanceof Error ? platformError.message : 'Erreur inconnue'}`,
            variant: "destructive",
          });
        }
      }

      console.log(`🏁 TOTAL: ${allMentions.length} mentions RÉELLES de votre API`);
      setMentions(allMentions);

      if (allMentions.length > 0) {
        toast({
          title: "Recherche terminée",
          description: `${allMentions.length} mention(s) trouvée(s) via votre API backend (AUCUNE donnée statique)`,
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
      setMentions([]); // S'assurer qu'aucune donnée statique n'est affichée
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
