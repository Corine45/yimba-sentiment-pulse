
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
      platform: "Instagram",
      content: "Le woubi est une danse traditionnelle ivoirienne magnifique ! 💃 #woubi #tradition #cotedivoire",
      author: "@danse_ivoirienne",
      date: "Il y a 1 heure",
      sentiment: "positive",
      engagement: { likes: 245, shares: 56, comments: 23 },
      reach: 3450
    },
    {
      id: 2,
      platform: "Twitter",
      content: "Spectacle de woubi ce soir à Abidjan ! Venez nombreux découvrir cette danse ancestrale #woubi #abidjan",
      author: "@culture_ci",
      date: "Il y a 2 heures",
      sentiment: "positive",
      engagement: { likes: 89, shares: 34, comments: 12 },
      reach: 1890
    },
    {
      id: 3,
      platform: "Facebook",
      content: "Cours de woubi pour débutants tous les samedis ! Une belle façon de découvrir notre patrimoine culturel",
      author: "Centre Culturel Ivoirien",
      date: "Il y a 3 heures",
      sentiment: "positive",
      engagement: { likes: 156, shares: 78, comments: 45 },
      reach: 2340
    },
    {
      id: 4,
      platform: "TikTok",
      content: "Tutoriel woubi - Apprendre les pas de base 🎵 #woubi #dance #tutorial #africa",
      author: "@danse_afrique",
      date: "Il y a 4 heures",
      sentiment: "positive",
      engagement: { likes: 892, shares: 234, comments: 67 },
      reach: 12500
    },
    {
      id: 5,
      platform: "YouTube",
      content: "Documentaire : L'histoire du woubi en Côte d'Ivoire - Patrimoine culturel africain",
      author: "Documentaires Afrique",
      date: "Il y a 6 heures",
      sentiment: "neutral",
      engagement: { likes: 345, shares: 89, comments: 78 },
      reach: 5670
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

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'bg-pink-100 text-pink-800';
      case 'twitter':
        return 'bg-blue-100 text-blue-800';
      case 'facebook':
        return 'bg-indigo-100 text-indigo-800';
      case 'tiktok':
        return 'bg-purple-100 text-purple-800';
      case 'youtube':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
            <span className="ml-3 text-gray-600">Analyse des réseaux sociaux pour "woubi"...</span>
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
              <span>Résultats de recherche pour "woubi"</span>
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
              <div className="text-2xl font-bold text-blue-600">267</div>
              <div className="text-sm text-gray-600">Mentions trouvées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">92%</div>
              <div className="text-sm text-gray-600">Sentiment positif</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">25.8K</div>
              <div className="text-sm text-gray-600">Portée totale</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">1.8K</div>
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

      {/* Platform Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par plateforme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { platform: 'Instagram', count: 67, color: 'bg-pink-500' },
              { platform: 'TikTok', count: 89, color: 'bg-purple-500' },
              { platform: 'Facebook', count: 45, color: 'bg-indigo-500' },
              { platform: 'Twitter', count: 34, color: 'bg-blue-500' },
              { platform: 'YouTube', count: 32, color: 'bg-red-500' }
            ].map((item) => (
              <div key={item.platform} className="text-center p-3 border rounded-lg">
                <div className={`w-4 h-4 ${item.color} rounded mx-auto mb-2`}></div>
                <div className="font-medium">{item.platform}</div>
                <div className="text-lg font-bold text-gray-700">{item.count}</div>
                <div className="text-xs text-gray-500">mentions</div>
              </div>
            ))}
          </div>
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
              <div key={result.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getPlatformColor(result.platform)}>
                      {result.platform}
                    </Badge>
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
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="font-medium">{result.engagement.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{result.engagement.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{result.engagement.shares}</span>
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
