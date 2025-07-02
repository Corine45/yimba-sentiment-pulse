
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

  console.log('📊 État SearchResults complet:', {
    searchTerm,
    isSearching,
    resultsLoading,
    searchResultsCount: searchResults.length,
    detailedResults: searchResults.map(r => ({
      id: r.id,
      platform: r.platform,
      mentions: r.total_mentions,
      dataLength: r.results_data?.length || 0,
      hasActualData: r.results_data && Array.isArray(r.results_data) && r.results_data.length > 0,
      firstItem: r.results_data?.[0] ? Object.keys(r.results_data[0]) : 'N/A'
    }))
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

  // Distribution par plateforme depuis les résultats RÉELS
  const platformCounts = searchResults.reduce((acc, result) => {
    acc[result.platform] = (acc[result.platform] || 0) + (result.total_mentions || 0);
    return acc;
  }, {} as Record<string, number>);

  // Plateformes avec données détaillées disponibles
  const platformsWithData = ['TikTok', 'Instagram', 'Facebook', 'Twitter', 'YouTube'];
  
  const getPlatformResults = (platformName: string) => {
    const results = searchResults.filter(result => {
      const isPlatform = result.platform.toLowerCase() === platformName.toLowerCase();
      
      console.log(`🎯 ${platformName} - Filtrage:`, {
        resultPlatform: result.platform,
        targetPlatform: platformName,
        isPlatform,
        totalMentions: result.total_mentions,
        dataLength: result.results_data?.length || 0,
        hasRealData: result.results_data && Array.isArray(result.results_data) && result.results_data.length > 0,
        sampleData: result.results_data?.[0] ? 'Present' : 'None'
      });
      
      return isPlatform;
    });
    
    console.log(`📱 ${platformName} - Résultats filtrés:`, results.length, 'avec données réelles:', results.filter(r => r.results_data?.length > 0).length);
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
        <p className="text-sm text-gray-400 mt-2">Vérifiez la configuration des APIs ou essayez d'autres mots-clés.</p>
      </div>
    );
  }

  // Calculer le nombre total de posts récupérés
  const totalPostsRetrieved = searchResults.reduce((sum, r) => sum + (r.results_data?.length || 0), 0);

  return (
    <div className="space-y-4">
      {searchTerm && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Recherche active :</strong> "{searchTerm}" - {searchResults.length} plateforme(s) analysée(s)
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Total des posts récupérés : {totalPostsRetrieved}
          </p>
          {totalPostsRetrieved === 0 && (
            <p className="text-xs text-orange-600 mt-1">
              ⚠️ Aucune donnée récupérée - vérifiez les logs de la console pour plus de détails
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

      {/* LISTES DÉTAILLÉES PAR PLATEFORME */}
      {platformsWithData.map(platformName => {
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
