
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, User, MessageSquare } from "lucide-react";

interface Mention {
  id: string;
  platform: string;
  author: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  url?: string;
  verified?: boolean;
}

interface RecentMentionsProps {
  mentions: Mention[];
}

export const RecentMentions = ({ mentions }: RecentMentionsProps) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
          Mentions récentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {mentions.map((mention) => (
            <div key={mention.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={getPlatformColor(mention.platform)}>
                    {mention.platform}
                  </Badge>
                  <Badge variant="outline" className={getSentimentColor(mention.sentiment)}>
                    {mention.sentiment === 'positive' ? 'Positif' : 
                     mention.sentiment === 'negative' ? 'Négatif' : 'Neutre'}
                  </Badge>
                  {mention.verified && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      ✓ Vérifié
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(mention.timestamp).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">@{mention.author}</span>
              </div>

              <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                {mention.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    ❤️ {mention.engagement.likes}
                  </span>
                  <span className="flex items-center">
                    💬 {mention.engagement.comments}
                  </span>
                  <span className="flex items-center">
                    🔄 {mention.engagement.shares}
                  </span>
                </div>
                {mention.url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={mention.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Voir
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
