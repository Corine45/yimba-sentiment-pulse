
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Heart, MessageSquare, Share, Eye, Download, ExternalLink } from "lucide-react";

interface TikTokPost {
  likes: number;
  comments: number;
  shares: number;
  views?: number;
  platform: string;
  postId: string;
  author: string;
  content: string;
  url: string;
  timestamp: string;
}

interface TikTokDetailedResultsProps {
  tikTokResults: Array<{
    search_term: string;
    platform: string;
    total_mentions: number;
    results_data: TikTokPost[];
  }>;
  canExportData: boolean;
}

export const TikTokDetailedResults = ({ tikTokResults, canExportData }: TikTokDetailedResultsProps) => {
  const allTikTokPosts = tikTokResults.flatMap(result => result.results_data || []);

  console.log('📊 Posts TikTok à afficher:', allTikTokPosts.length);

  const exportTikTokData = () => {
    const dataStr = JSON.stringify(allTikTokPosts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tiktok_results_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (allTikTokPosts.length === 0) {
    return (
      <Card className="border-pink-200 bg-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-pink-600" />
            <span>Résultats TikTok</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Aucune vidéo TikTok trouvée pour cette recherche.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-pink-200 bg-pink-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-pink-600" />
            <span>Résultats TikTok détaillés ({allTikTokPosts.length} vidéos)</span>
          </CardTitle>
          {canExportData && (
            <Button variant="outline" onClick={exportTikTokData}>
              <Download className="w-4 h-4 mr-2" />
              Exporter TikTok
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {allTikTokPosts.map((post, index) => (
            <div key={`${post.postId}-${index}`} className="border border-pink-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-pink-500 text-white">
                    TikTok
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {post.timestamp ? new Date(post.timestamp).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Date inconnue'}
                  </span>
                </div>
                {post.url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={post.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Voir
                    </a>
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-gray-900">@{post.author || 'Auteur inconnu'}</span>
              </div>

              <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                {post.content || 'Contenu non disponible'}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-red-600">
                    <Heart className="w-4 h-4" />
                    <span className="font-medium">{(post.likes || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-600">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">{(post.comments || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600">
                    <Share className="w-4 h-4" />
                    <span className="font-medium">{(post.shares || 0).toLocaleString()}</span>
                  </div>
                  {post.views && (
                    <div className="flex items-center space-x-1 text-purple-600">
                      <Eye className="w-4 h-4" />
                      <span className="font-medium">{post.views.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
