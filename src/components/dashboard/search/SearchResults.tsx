
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SearchResultsData {
  totalMentions: number;
  platforms: {
    twitter: number;
    facebook: number;
    instagram: number;
    tiktok: number;
  };
  sentiments: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

interface SearchResultsProps {
  searchResults: SearchResultsData | null;
}

export const SearchResults = ({ searchResults }: SearchResultsProps) => {
  if (!searchResults) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Résultats de recherche</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{searchResults.totalMentions}</div>
            <div className="text-sm text-blue-800">Mentions totales</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{searchResults.sentiments.positive}%</div>
            <div className="text-sm text-green-800">Sentiment positif</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{searchResults.sentiments.negative}%</div>
            <div className="text-sm text-red-800">Sentiment négatif</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-600">{searchResults.sentiments.neutral}%</div>
            <div className="text-sm text-gray-800">Sentiment neutre</div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Répartition par plateforme</h4>
          <div className="space-y-2">
            {Object.entries(searchResults.platforms).map(([platform, count]) => (
              <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="capitalize font-medium">{platform}</span>
                <span className="text-blue-600 font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
