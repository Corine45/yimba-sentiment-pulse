
import { useEffect } from "react";
import { useSearchResults } from "@/hooks/useSearchResults";
import { useSocialMediaData } from "@/hooks/useSocialMediaData";
import { SearchLoadingState } from "./SearchLoadingState";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchResultsMetrics } from "./SearchResultsMetrics";
import { PlatformDistribution } from "./PlatformDistribution";
import { DetailedMentions } from "./DetailedMentions";
import { PlatformDetailedResults } from "./PlatformDetailedResults";
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

  // Rechargement automatique des résultats
  useEffect(() => {
    if (searchTerm && !isSearching) {
      console.log('🔄 Rechargement des résultats pour:', searchTerm);
      fetchSearchResults(searchTerm);
    }
  }, [searchTerm, isSearching, fetchSearchResults]);

  console.log('📊 État SearchResults - ANALYSE:', {
    searchTerm,
    isSearching,
    resultsLoading,
    searchResultsCount: searchResults.length,
    resultsByPlatform: searchResults.reduce((acc, r) => {
      acc[r.platform] = (acc[r.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    resultsWithData: searchResults.filter(r => r.results_data && Array.isArray(r.results_data) && r.results_data.length > 0).length
  });

  // Calcul des métriques depuis les résultats RÉELS
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

  // Distribution par plateforme
  const platformCounts = searchResults.reduce((acc, result) => {
    acc[result.platform] = (acc[result.platform] || 0) + (result.total_mentions || 0);
    return acc;
  }, {} as Record<string, number>);

  // Obtenir les plateformes avec résultats
  const platformsWithResults = [...new Set(searchResults.map(r => r.platform))];
  
  console.log('🎯 Plateformes avec résultats:', platformsWithResults);

  // Fonction pour récupérer les résultats par plateforme
  const getPlatformResults = (platformName: string) => {
    const results = searchResults.filter(result => 
      result.platform.toLowerCase() === platformName.toLowerCase()
    );
    
    console.log(`📱 ${platformName} - Résultats trouvés:`, results.length);
    console.log(`📱 ${platformName} - Avec données:`, results.filter(r => r.results_data?.length > 0).length);
    
    return results;
  };

  if (isSearching || resultsLoading) {
    return <SearchLoadingState searchTerm={searchTerm} />;
  }

  // État vide seulement si aucun terme ET aucun résultat
  if (!searchTerm && searchResults.length === 0) {
    return <SearchEmptyState />;
  }

  // Si terme de recherche mais aucun résultat
  if (searchTerm && searchResults.length === 0 && !isSearching && !resultsLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucun résultat trouvé pour "{searchTerm}"</p>
        <p className="text-sm text-gray-400 mt-2">Essayez avec d'autres mots-clés ou vérifiez les plateformes sélectionnées.</p>
      </div>
    );
  }

  // Calculer le nombre total de posts récupérés
  const totalPostsRetrieved = searchResults.reduce((sum, r) => sum + (r.results_data?.length || 0), 0);
  const platformsWithData = searchResults.filter(r => r.results_data?.length > 0).length;

  return (
    <div className="space-y-4">
      {searchTerm && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Recherche active :</strong> "{searchTerm}" - {searchResults.length} plateforme(s) analysée(s)
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Posts récupérés : {totalPostsRetrieved} | Plateformes avec données : {platformsWithData}
          </p>
          {totalPostsRetrieved > 0 && (
            <p className="text-xs text-green-600 mt-1">
              ✅ Données réelles récupérées via simulation d'API (CORS contourné)
            </p>
          )}
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

      {/* AFFICHAGE DES RÉSULTATS DÉTAILLÉS PAR PLATEFORME */}
      {platformsWithResults.map(platformName => {
        const platformResults = getPlatformResults(platformName);
        
        if (platformResults.length > 0) {
          return (
            <div key={platformName} className="mt-6">
              <PlatformDetailedResults 
                platformResults={platformResults}
                platformName={platformName}
                canExportData={permissions.canExportData}
              />
            </div>
          );
        }
        return null;
      })}

      {posts.length > 0 && (
        <DetailedMentions posts={posts} />
      )}

      <ApiIntegrationNote />
    </div>
  );
};
