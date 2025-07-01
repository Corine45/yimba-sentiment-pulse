
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Heart, Share } from "lucide-react";

interface Post {
  id: string;
  platform: string;
  content: string;
  author: string;
  sentiment: string;
  reach: number;
  created_at: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

interface DetailedMentionsProps {
  posts: Post[];
}

export const DetailedMentions = ({ posts }: DetailedMentionsProps) => {
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
        return 'bg-pink-500';
      case 'twitter':
        return 'bg-blue-500';
      case 'facebook':
        return 'bg-indigo-500';
      case 'tiktok':
        return 'bg-purple-500';
      case 'youtube':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentions détaillées</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.slice(0, 10).map((post) => {
            const engagement = post.engagement || { likes: 0, shares: 0, comments: 0 };
            const timeAgo = new Date(post.created_at).toLocaleDateString('fr-FR');
            
            return (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={`${getPlatformColor(post.platform)} text-white`}>
                      {post.platform}
                    </Badge>
                    {getSentimentBadge(post.sentiment)}
                    <span className="text-sm text-gray-500">{timeAgo}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Portée: {post.reach.toLocaleString()}
                  </div>
                </div>
                
                <p className="text-gray-800 mb-3 line-clamp-3">{post.content}</p>
                
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
  );
};
