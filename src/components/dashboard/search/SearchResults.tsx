
import { useEffect } from "react";
import { useSearchResults } from "@/hooks/useSearchResults";
import { useSocialMediaData } from "@/hooks/useSocialMediaData";
import { SearchLoadingState } from "./SearchLoadingState";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchResultsMetrics } from "./SearchResultsMetrics";
import { PlatformDistribution } from "./PlatformDistribution";
import { DetailedMentions } from "./DetailedMentions";
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
  const { searchResults, loading: resultsLoading } = useSearchResults();
  const { posts, loading: postsLoading } = useSocialMediaData(searchTerm);

  // Calculate metrics from search results
  const totalMentions = searchResults.reduce((sum, result) => sum + result.total_mentions, 0);
  const totalReach = searchResults.reduce((sum, result) => sum + result.total_reach, 0);
  const totalEngagement = searchResults.reduce((sum, result) => sum + result.total_engagement, 0);
  
  const totalSentiment = searchResults.reduce((acc, result) => ({
    positive: acc.positive + result.positive_sentiment,
    negative: acc.negative + result.negative_sentiment,
    neutral: acc.neutral + result.neutral_sentiment
  }), { positive: 0, negative: 0, neutral: 0 });

  const positivePercentage = totalMentions > 0 
    ? Math.round((totalSentiment.positive / totalMentions) * 100) 
    : 0;

  // Platform distribution from search results
  const platformCounts = searchResults.reduce((acc, result) => {
    acc[result.platform] = (acc[result.platform] || 0) + result.total_mentions;
    return acc;
  }, {} as Record<string, number>);

  if (isSearching || resultsLoading) {
    return <SearchLoadingState searchTerm={searchTerm} />;
  }

  if (!searchTerm && searchResults.length === 0) {
    return <SearchEmptyState />;
  }

  return (
    <div className="space-y-4">
      <SearchResultsMetrics
        totalMentions={totalMentions}
        positivePercentage={positivePercentage}
        totalReach={totalReach}
        totalEngagement={totalEngagement}
        userRole={userRole}
        canExportData={permissions.canExportData}
        searchTerm={searchTerm}
      />

      <PlatformDistribution platformCounts={platformCounts} />

      <DetailedMentions posts={posts} />

      <ApiIntegrationNote />
    </div>
  );
};
