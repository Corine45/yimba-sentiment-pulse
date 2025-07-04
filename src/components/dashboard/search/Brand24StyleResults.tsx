
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share, Eye, ExternalLink, TrendingUp } from "lucide-react";
import { MentionResult } from "@/services/realApiService";

interface Brand24StyleResultsProps {
  mentions: MentionResult[];
  isLoading: boolean;
}

export const Brand24StyleResults = ({ mentions, isLoading }: Brand24StyleResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Recherche en cours via votre API backend...</span>
      </div>
    );
  }

  if (mentions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune mention trouvée via votre API backend</p>
        <p className="text-xs text-gray-400 mt-2">Vérifiez vos mots-clés et plateformes sélectionnées</p>
      </div>
    );
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'tiktok': return 'bg-black text-white';
      case 'facebook': return 'bg-blue-600 text-white';
      case 'twitter': return 'bg-sky-500 text-white';
      case 'youtube': return 'bg-red-600 text-white';
      case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInfluenceIcon = (score?: number) => {
    if (!score) return null;
    if (score >= 8) return '🔥';
    if (score >= 6) return '⭐';
    if (score >= 4) return '👍';
    return '📝';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Mentions trouvées ({mentions.length})</span>
          <div className="text-sm text-gray-500">
            API Backend: https://yimbapulseapi.a-car.ci
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mentions.map((mention) => (
            <div key={mention.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
              {/* Header avec plateforme et date */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Badge className={getPlatformColor(mention.platform)}>
                    {mention.platform}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {mention.sourceUrl && (
                      <span className="mr-2">
                        {new URL(mention.sourceUrl).hostname}
                      </span>
                    )}
                    • {formatDate(mention.timestamp)}
                  </span>
                  {mention.influenceScore && (
                    <div className="flex items-center space-x-1">
                      <span>{getInfluenceIcon(mention.influenceScore)}</span>
                      <span className="text-xs text-gray-600">
                        Score: {mention.influenceScore}/10
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {mention.sentiment && (
                    <Badge variant="outline" className={getSentimentColor(mention.sentiment)}>
                      {mention.sentiment === 'positive' ? 'Positif' : 
                       mention.sentiment === 'negative' ? 'Négatif' : 'Neutre'}
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" asChild>
                    <a href={mention.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Auteur */}
              <div className="flex items-center mb-2">
                <span className="font-medium text-gray-900">@{mention.author}</span>
              </div>

              {/* Contenu */}
              <p className="text-gray-700 mb-4 line-clamp-3">
                {mention.content}
              </p>

              {/* Métriques d'engagement */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-6 text-sm">
                  <div className="flex items-center space-x-1 text-red-600">
                    <Heart className="w-4 h-4" />
                    <span className="font-medium">{mention.engagement.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-600">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">{mention.engagement.comments.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600">
                    <Share className="w-4 h-4" />
                    <span className="font-medium">{mention.engagement.shares.toLocaleString()}</span>
                  </div>
                  {mention.engagement.views && (
                    <div className="flex items-center space-x-1 text-purple-600">
                      <Eye className="w-4 h-4" />
                      <span className="font-medium">{mention.engagement.views.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  Engagement total: {(mention.engagement.likes + mention.engagement.comments + mention.engagement.shares).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
