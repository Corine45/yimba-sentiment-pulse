
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageSquare, Share, Eye, Download, ExternalLink, Save } from "lucide-react";

interface Brand24ResultsProps {
  results: any[];
  isLoading: boolean;
  searchTerm: string;
  onSaveSearch: () => void;
  canExport: boolean;
}

export const Brand24Results = ({ results, isLoading, searchTerm, onSaveSearch, canExport }: Brand24ResultsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyse en cours via API Backend...</p>
            <p className="text-sm text-gray-500 mt-2">https://yimbapulseapi.a-car.ci</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun résultat trouvé</h3>
          <p className="text-gray-600">
            Aucune mention trouvée pour votre recherche via l'API Backend.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalMentions = results.reduce((sum, r) => sum + (r.mentions || 0), 0);
  const totalEngagement = results.reduce((sum, r) => sum + (r.engagement || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header avec métriques style Brand24 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <span>📊</span>
              <span>Résultats pour "{searchTerm}"</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={onSaveSearch}>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
              {canExport && (
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalMentions}</div>
              <div className="text-sm text-blue-800">Mentions totales</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{results.length}</div>
              <div className="text-sm text-green-800">Plateformes</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{totalEngagement}</div>
              <div className="text-sm text-purple-800">Engagements</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {results.filter(r => r.sentiment === 'positive').length}
              </div>
              <div className="text-sm text-orange-800">Posts positifs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résultats par plateforme style Brand24 */}
      {results.map((platformResult, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>{getPlatformIcon(platformResult.platform)}</span>
              <span>{platformResult.platform}</span>
              <Badge variant="secondary">{platformResult.posts?.length || 0} posts</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {platformResult.posts && platformResult.posts.length > 0 ? (
              <div className="space-y-4">
                {platformResult.posts.map((post: any, postIndex: number) => (
                  <div key={postIndex} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {getPlatformIcon(platformResult.platform)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">@{post.author}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(post.timestamp).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      {post.url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={post.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-3">
                      {post.content}
                    </p>

                    <Separator className="my-3" />

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4 text-sm">
                        <div className="flex items-center space-x-1 text-red-500">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-blue-500">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.comments?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-green-500">
                          <Share className="w-4 h-4" />
                          <span>{post.shares?.toLocaleString() || 0}</span>
                        </div>
                        {post.views && (
                          <div className="flex items-center space-x-1 text-purple-500">
                            <Eye className="w-4 h-4" />
                            <span>{post.views.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      <Badge 
                        variant={post.sentiment === 'positive' ? 'default' : post.sentiment === 'negative' ? 'destructive' : 'secondary'}
                      >
                        {post.sentiment || 'neutre'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Aucune donnée retournée par l'API {platformResult.platform}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

function getPlatformIcon(platform: string): string {
  switch (platform?.toLowerCase()) {
    case 'tiktok': return '🎵';
    case 'facebook': return '📘';
    case 'twitter': return '🐦';
    case 'youtube': return '📺';
    case 'instagram': return '📸';
    default: return '📱';
  }
}
