
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { useSearchResults } from "@/hooks/useSearchResults";
import { useAlertsData } from "@/hooks/useAlertsData";

export const SentimentOverview = () => {
  const { searchResults, loading } = useSearchResults();
  const { alerts } = useAlertsData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-l-4 border-l-gray-300 animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculer les sentiments basés sur les résultats de recherche réels
  const totalMentions = searchResults.reduce((sum, result) => sum + (result.total_mentions || 0), 0);
  const totalPositive = searchResults.reduce((sum, result) => sum + (result.positive_sentiment || 0), 0);
  const totalNegative = searchResults.reduce((sum, result) => sum + (result.negative_sentiment || 0), 0);

  const positivePercentage = totalMentions > 0 ? Math.round((totalPositive / totalMentions) * 100) : 0;
  const negativePercentage = totalMentions > 0 ? Math.round((totalNegative / totalMentions) * 100) : 0;

  // Calculer la tendance (comparaison avec les résultats précédents)
  const recentResults = searchResults.slice(-7); // 7 derniers résultats
  const olderResults = searchResults.slice(-14, -7); // 7 résultats précédents
  
  const recentPositive = recentResults.reduce((sum, result) => sum + (result.positive_sentiment || 0), 0);
  const olderPositive = olderResults.reduce((sum, result) => sum + (result.positive_sentiment || 0), 0);
  const recentTotal = recentResults.reduce((sum, result) => sum + (result.total_mentions || 0), 0);
  const olderTotal = olderResults.reduce((sum, result) => sum + (result.total_mentions || 0), 0);

  const recentPositiveRate = recentTotal > 0 ? (recentPositive / recentTotal) * 100 : 0;
  const olderPositiveRate = olderTotal > 0 ? (olderPositive / olderTotal) * 100 : 0;
  const positiveTrend = recentPositiveRate - olderPositiveRate;

  const recentNegativeRate = recentTotal > 0 ? (searchResults.slice(-7).reduce((sum, result) => sum + (result.negative_sentiment || 0), 0) / recentTotal) * 100 : 0;
  const olderNegativeRate = olderTotal > 0 ? (searchResults.slice(-14, -7).reduce((sum, result) => sum + (result.negative_sentiment || 0), 0) / olderTotal) * 100 : 0;
  const negativeTrend = recentNegativeRate - olderNegativeRate;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-green-700 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Sentiment Positif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{positivePercentage}%</div>
          <p className="text-sm text-green-700 mt-1">
            {positiveTrend >= 0 ? '+' : ''}{positiveTrend.toFixed(1)}% par rapport à la période précédente
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-red-700 flex items-center">
            <TrendingDown className="w-4 h-4 mr-2" />
            Sentiment Négatif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">{negativePercentage}%</div>
          <p className="text-sm text-red-700 mt-1">
            {negativeTrend >= 0 ? '+' : ''}{negativeTrend.toFixed(1)}% par rapport à la période précédente
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-yellow-700 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Alertes Actives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-600">{alerts.length}</div>
          <p className="text-sm text-yellow-700 mt-1">Basées sur vos recherches</p>
        </CardContent>
      </Card>
    </div>
  );
};
