
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Eye } from "lucide-react";

interface SearchResultsMetricsProps {
  totalMentions: number;
  positivePercentage: number;
  negativePercentage: number;
  neutralPercentage: number;
  totalReach: number;
  totalEngagement: number;
  userRole: string;
  canExportData: boolean;
  searchTerm?: string;
  searchResults?: any[];
}

export const SearchResultsMetrics = ({
  totalMentions,
  positivePercentage,
  negativePercentage,
  neutralPercentage,
  totalReach,
  totalEngagement,
  userRole,
  canExportData,
  searchTerm,
  searchResults = []
}: SearchResultsMetricsProps) => {
  
  const exportAllResults = () => {
    const dataStr = JSON.stringify(searchResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resultats_${searchTerm || 'recherche'}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Résultats de recherche {searchTerm && `pour "${searchTerm}"`}</span>
          </CardTitle>
          {canExportData && searchResults.length > 0 && (
            <Button variant="outline" size="sm" onClick={exportAllResults}>
              <Download className="w-4 h-4 mr-2" />
              Exporter les résultats
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalMentions.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Mentions trouvées</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{positivePercentage}%</div>
            <div className="text-sm text-gray-600">Sentiment positif</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{negativePercentage}%</div>
            <div className="text-sm text-gray-600">Sentiment négatif</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{neutralPercentage}%</div>
            <div className="text-sm text-gray-600">Sentiment neutre</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{(totalReach / 1000).toFixed(1)}K</div>
            <div className="text-sm text-gray-600">Portée totale</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{(totalEngagement / 1000).toFixed(1)}K</div>
            <div className="text-sm text-gray-600">Engagements totaux</div>
          </div>
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{searchResults.length}</div>
            <div className="text-sm text-gray-600">Plateformes analysées</div>
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

        {searchTerm && totalMentions === 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Aucune mention trouvée pour "{searchTerm}". Vérifiez l'orthographe ou essayez d'autres mots-clés.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
