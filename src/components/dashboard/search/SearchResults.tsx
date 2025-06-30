import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Heart, Share, TrendingUp, Download, Eye } from "lucide-react";
import { useSocialMediaData } from "@/hooks/useSocialMediaData";

interface SearchResultsProps {
  userRole: string;
  permissions: {
    canExportData: boolean;
  };
  isSearching: boolean;
  searchTerm?: string;
}

export const SearchResults = ({ userRole, permissions, isSearching, searchTerm = "woubi" }: SearchResultsProps) => {
  const { posts, loading } = useSocialMediaData(searchTerm);

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

  if (isSearching || loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recherche en cours...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Analyse des réseaux sociaux pour "{searchTerm}"...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate metrics from real data
  const totalMentions = posts.length;
  const positiveCount = posts.filter(p => p.sentiment === 'positive').length;
  const positivePercentage = totalMentions > 0 ? Math.round((positiveCount / totalMentions) * 100) : 0;
  const totalReach = posts.reduce((sum, p) => sum + p.reach, 0);
  const totalEngagements = posts.reduce((sum, p) => {
    const engagement = p.engagement || { likes: 0, shares: 0, comments: 0 };
    return sum + engagement.likes + engagement.shares + engagement.comments;
  }, 0);

  // Platform distribution
  const platformCounts = posts.reduce((acc, post) => {
    acc[post.platform] = (acc[post.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4">
      {/* Results Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Résultats de recherche pour "{searchTerm}"</span>
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
              <div className="text-2xl font-bold text-blue-600">{totalMentions}</div>
              <div className="text-sm text-gray-600">Mentions trouvées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{positivePercentage}%</div>
              <div className="text-sm text-gray-600">Sentiment positif</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{(totalReach / 1000).toFixed(1)}K</div>
              <div className="text-sm text-gray-600">Portée totale</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{(totalEngagements / 1000).toFixed(1)}K</div>
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
            {Object.entries(platformCounts).map(([platform, count]) => (
              <div key={platform} className="text-center p-3 border rounded-lg">
                <div className={`w-4 h-4 ${getPlatformColor(platform).split(' ')[0]} rounded mx-auto mb-2`}></div>
                <div className="font-medium">{platform}</div>
                <div className="text-lg font-bold text-gray-700">{count}</div>
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
            {posts.map((post) => {
              const engagement = post.engagement || { likes: 0, shares: 0, comments: 0 };
              const timeAgo = new Date(post.created_at).toLocaleDateString('fr-FR');
              
              return (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getPlatformColor(post.platform)}>
                        {post.platform}
                      </Badge>
                      {getSentimentBadge(post.sentiment)}
                      <span className="text-sm text-gray-500">{timeAgo}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Portée: {post.reach.toLocaleString()}
                    </div>
                  </div>
                  
                  <p className="text-gray-800 mb-3">{post.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Par <span className="font-medium">{post.author}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="font-medium">{engagement.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{engagement.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Share className="w-4 h-4 text-green-500" />
                        <span className="font-medium">{engagement.shares}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
