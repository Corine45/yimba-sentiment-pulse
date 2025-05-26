
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Heart, Share, TrendingUp, Download, Eye } from "lucide-react";

interface SearchResultsProps {
  userRole: string;
  permissions: {
    canExportData: boolean;
  };
  isSearching: boolean;
}

export const SearchResults = ({ userRole, permissions, isSearching }: SearchResultsProps) => {
  const mockResults = [
    {
      id: 1,
      platform: "Twitter",
      content: "YIMBA est vraiment une excellente plateforme de veille ! Très satisfait du service 👍",
      author: "@user123",
      date: "Il y a 2 heures",
      sentiment: "positive",
      engagement: { likes: 15, shares: 3, comments: 2 },
      reach: 1250
    },
    {
      id: 2,
      platform: "Facebook",
      content: "J'ai des difficultés avec l'interface de YIMBA, elle pourrait être plus intuitive...",
      author: "Marie Dupont",
      date: "Il y a 4 heures",
      sentiment: "negative",
      engagement: { likes: 8, shares: 1, comments: 5 },
      reach: 890
    },
    {
      id: 3,
      platform: "Instagram",
      content: "Test de la nouvelle fonctionnalité YIMBA - plutôt pas mal pour l'instant",
      author: "@influencer_tech",
      date: "Il y a 6 heures",
      sentiment: "neutral",
      engagement: { likes: 42, shares: 12, comments: 8 },
      reach: 3200
    }
  ];

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Badge className="bg-green-100 text-green-800">Positif</Badge>;
      case "negative":
        return <Badge className="bg-red-100 text-red-800">Négatif</Badge>;
      case "neutral":
        return <Badge className="bg-gray-100 text-gray-800">Neutre</Badge>;
      default:
        return <Badge variant="outline">{sentiment}</Badge>;
    }
  };

  if (isSearching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recherche en cours...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Analyse des réseaux sociaux en cours...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Résultats de recherche</span>
            </CardTitle>
            {permissions.canExportData && (
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter les résultats
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-600">Mentions trouvées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">68%</div>
              <div className="text-sm text-gray-600">Sentiment positif</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">25K</div>
              <div className="text-sm text-gray-600">Portée totale</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">3.2K</div>
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

      {/* Individual Results */}
      <Card>
        <CardHeader>
          <CardTitle>Mentions détaillées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockResults.map((result) => (
              <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{result.platform}</Badge>
                    {getSentimentBadge(result.sentiment)}
                    <span className="text-sm text-gray-500">{result.date}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Portée: {result.reach.toLocaleString()}
                  </div>
                </div>
                
                <p className="text-gray-800 mb-3">{result.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Par <span className="font-medium">{result.author}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{result.engagement.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share className="w-4 h-4" />
                      <span>{result.engagement.shares}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{result.engagement.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
