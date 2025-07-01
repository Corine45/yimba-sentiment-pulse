
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Eye } from "lucide-react";

interface SearchResultsMetricsProps {
  totalMentions: number;
  positivePercentage: number;
  totalReach: number;
  totalEngagement: number;
  userRole: string;
  canExportData: boolean;
  searchTerm?: string;
}

export const SearchResultsMetrics = ({
  totalMentions,
  positivePercentage,
  totalReach,
  totalEngagement,
  userRole,
  canExportData,
  searchTerm
}: SearchResultsMetricsProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Résultats de recherche {searchTerm && `pour "${searchTerm}"`}</span>
          </CardTitle>
          {canExportData && (
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter les résultats
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalMentions.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Mentions trouvées</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{positivePercentage}%</div>
            <div className="text-sm text-gray-600">Sentiment positif</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{(totalReach / 1000).toFixed(1)}K</div>
            <div className="text-sm text-gray-600">Portée totale</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{(totalEngagement / 1000).toFixed(1)}K</div>
            <div className="text-sm text-gray-600">Engagements</div>
          </div>
        </div>
        
        {userRole === "observateur" && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <p className="text-sm text-blue-800">
              <Eye className="w-4 h-4 inline mr-1" />
              Mode consultation - Vous visualisez les résultats en lecture seule
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
