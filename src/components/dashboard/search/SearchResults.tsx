
import { useEffect } from "react";
import { useSearchResults } from "@/hooks/useSearchResults";
import { useSocialMediaData } from "@/hooks/useSocialMediaData";
import { SearchLoadingState } from "./SearchLoadingState";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchResultsMetrics } from "./SearchResultsMetrics";
import { PlatformDistribution } from "./PlatformDistribution";
import { DetailedMentions } from "./DetailedMentions";
import { TikTokDetailedResults } from "./TikTokDetailedResults";
import { ApiIntegrationNote } from "./ApiIntegrationNote";

interface SearchResultsProps {
  userRole: string;
  permissions: {
    canExportData: boolean;
  };
  isSearching: boolean;
  searchTerm?: string;
}

export const SearchResults = ({ userRole, permissions, isSearching, searchTerm = "" }: SearchResultsProps) => {
  const { searchResults, loading: resultsLoading, fetchSearchResults } = useSearchResults();
  const { posts, loading: postsLoading } = useSocialMediaData(searchTerm);

  // Rechargement automatique des résultats quand le terme de recherche change
  useEffect(() => {
    if (searchTerm && !isSearching) {
      console.log('🔄 Rechargement des résultats pour:', searchTerm);
      fetchSearchResults(searchTerm);
    }
  }, [searchTerm, isSearching, fetchSearchResults]);

  console.log('📊 État actuel des résultats:', {
    searchTerm,
    isSearching,
    resultsLoading,
    searchResultsCount: searchResults.length,
    postsCount: posts.length
  });

  // Calcul des métriques depuis les résultats de recherche
  const totalMentions = searchResults.reduce((sum, result) => sum + (result.total_mentions || 0), 0);
  const totalReach = searchResults.reduce((sum, result) => sum + (result.total_reach || 0), 0);
  const totalEngagement = searchResults.reduce((sum, result) => sum + (result.total_engagement || 0), 0);
  
  const totalSentiment = searchResults.reduce((acc, result) => ({
    positive: acc.positive + (result.positive_sentiment || 0),
    negative: acc.negative + (result.negative_sentiment || 0),
    neutral: acc.neutral + (result.neutral_sentiment || 0)
  }), { positive: 0, negative: 0, neutral: 0 });

  const positivePercentage = totalMentions > 0 
    ? Math.round((totalSentiment.positive / totalMentions) * 100) 
    : 0;

  const negativePercentage = totalMentions > 0 
    ? Math.round((totalSentiment.negative / totalMentions) * 100) 
    : 0;

  const neutralPercentage = totalMentions > 0 
    ? Math.round((totalSentiment.neutral / totalMentions) * 100) 
    : 0;

  // Distribution par plateforme depuis les résultats de recherche
  const platformCounts = searchResults.reduce((acc, result) => {
    acc[result.platform] = (acc[result.platform] || 0) + (result.total_mentions || 0);
    return acc;
  }, {} as Record<string, number>);

  // Résultats TikTok spécifiques avec données détaillées - CORRECTION ICI
  const tikTokResults = searchResults.filter(result => {
    const isTikTok = result.platform.toLowerCase() === 'tiktok';
    const hasData = result.results_data && Array.isArray(result.results_data) && result.results_data.length > 0;
    
    console.log(`🔍 Vérification TikTok pour ${result.platform}:`, {
      isTikTok,
      hasData,
      dataLength: result.results_data?.length || 0,
      totalMentions: result.total_mentions
    });
    
    return isTikTok && (hasData || result.total_mentions > 0);
  });

  console.log('🎵 Résultats TikTok trouvés:', tikTokResults.length);
  tikTokResults.forEach((result, index) => {
    console.log(`TikTok ${index + 1}:`, {
      mentions: result.total_mentions,
      dataLength: result.results_data?.length || 0,
      searchTerm: result.search_term,
      hasValidData: result.results_data && Array.isArray(result.results_data)
    });
  });

  if (isSearching || resultsLoading) {
    return <SearchLoadingState searchTerm={searchTerm} />;
  }

  // Afficher l'état vide seulement si aucun terme de recherche ET aucun résultat
  if (!searchTerm && searchResults.length === 0) {
    return <SearchEmptyState />;
  }

  // Si on a un terme de recherche mais aucun résultat
  if (searchTerm && searchResults.length === 0 && !isSearching && !resultsLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucun résultat trouvé pour "{searchTerm}"</p>
        <p className="text-sm text-gray-400 mt-2">Essayez avec d'autres mots-clés ou vérifiez la configuration des plateformes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searchTerm && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Recherche active :</strong> "{searchTerm}" - {searchResults.length} plateforme(s) analysée(s)
          </p>
        </div>
      )}

      <SearchResultsMetrics
        totalMentions={totalMentions}
        positivePercentage={positivePercentage}
        negativePercentage={negativePercentage}
        neutralPercentage={neutralPercentage}
        totalReach={totalReach}
        totalEngagement={totalEngagement}
        userRole={userRole}
        canExportData={permissions.canExportData}
        searchTerm={searchTerm}
        searchResults={searchResults}
      />

      {Object.keys(platformCounts).length > 0 && (
        <PlatformDistribution platformCounts={platformCounts} />
      )}

      {/* SECTION TIKTOK DÉTAILLÉE - TOUJOURS AFFICHER SI DES RÉSULTATS TIKTOK */}
      {tikTokResults.length > 0 && (
        <div className="mt-6">
          <TikTokDetailedResults 
            tikTokResults={tikTokResults}
            canExportData={permissions.canExportData}
          />
        </div>
      )}

      {posts.length > 0 && (
        <DetailedMentions posts={posts} />
      )}

      <ApiIntegrationNote />
    </div>
  );
};
