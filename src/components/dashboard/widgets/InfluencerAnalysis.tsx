
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, TrendingUp, MessageCircle, Share2, Heart, ExternalLink } from "lucide-react";

interface Influencer {
  id: string;
  name: string;
  username: string;
  platform: string;
  avatar?: string;
  followers: number;
  posts: number;
  totalEngagement: number;
  averageEngagement: number;
  reach: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  verified: boolean;
  topPost: {
    content: string;
    engagement: number;
    url: string;
  };
}

export const InfluencerAnalysis = () => {
  const influencers: Influencer[] = [
    {
      id: "1",
      name: "Dr. Marie Kouassi",
      username: "@dr_marie_ci",
      platform: "Twitter",
      followers: 125000,
      posts: 15,
      totalEngagement: 45000,
      averageEngagement: 3000,
      reach: 890000,
      sentiment: "positive",
      verified: true,
      topPost: {
        content: "Les nouvelles mesures de santé publique montrent des résultats encourageants...",
        engagement: 8500,
        url: "#"
      }
    },
    {
      id: "2",
      name: "Actualités CI",
      username: "@actu_ci",
      platform: "Facebook",
      followers: 89000,
      posts: 23,
      totalEngagement: 67000,
      averageEngagement: 2913,
      reach: 1200000,
      sentiment: "neutral",
      verified: true,
      topPost: {
        content: "Point sur la situation économique en Côte d'Ivoire cette semaine",
        engagement: 12000,
        url: "#"
      }
    },
    {
      id: "3",
      name: "Jeunesse Abidjan",
      username: "@jeunesse_abj",
      platform: "Instagram",
      followers: 67000,
      posts: 8,
      totalEngagement: 34000,
      averageEngagement: 4250,
      reach: 450000,
      sentiment: "positive",
      verified: false,
      topPost: {
        content: "Les jeunes entrepreneurs ivoiriens à l'honneur ! 🇨🇮",
        engagement: 9800,
        url: "#"
      }
    },
    {
      id: "4",
      name: "Info Politique CI",
      username: "@infopolitique_ci",
      platform: "Twitter",
      followers: 45000,
      posts: 31,
      totalEngagement: 23000,
      averageEngagement: 742,
      reach: 230000,
      sentiment: "negative",
      verified: false,
      topPost: {
        content: "Analyse critique des dernières décisions gouvernementales",
        engagement: 3200,
        url: "#"
      }
    }
  ];

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Twitter': return 'bg-blue-500';
      case 'Facebook': return 'bg-blue-600';
      case 'Instagram': return 'bg-pink-500';
      case 'YouTube': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Top Influenceurs
          </div>
          <Badge variant="outline">{influencers.length} influenceurs</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {influencers.map((influencer) => (
            <div key={influencer.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={influencer.avatar} />
                    <AvatarFallback>{influencer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{influencer.name}</h4>
                      {influencer.verified && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                          Vérifié
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{influencer.username}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${getPlatformColor(influencer.platform)}`} />
                      <span className="text-xs text-gray-500">{influencer.platform}</span>
                    </div>
                  </div>
                </div>
                <Badge className={getSentimentColor(influencer.sentiment)}>
                  {influencer.sentiment === 'positive' ? 'Positif' : 
                   influencer.sentiment === 'negative' ? 'Négatif' : 'Neutre'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{formatNumber(influencer.followers)}</div>
                  <div className="text-xs text-gray-500">Abonnés</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{influencer.posts}</div>
                  <div className="text-xs text-gray-500">Publications</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{formatNumber(influencer.totalEngagement)}</div>
                  <div className="text-xs text-gray-500">Engagement</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{formatNumber(influencer.reach)}</div>
                  <div className="text-xs text-gray-500">Portée</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="text-sm font-medium mb-1">Publication la plus engageante :</h5>
                    <p className="text-sm text-gray-700 line-clamp-2">{influencer.topPost.content}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        {formatNumber(influencer.topPost.engagement)}
                      </span>
                      <span>Engagement moyen: {formatNumber(influencer.averageEngagement)}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="ml-3">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Insights clés</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Dr. Marie Kouassi génère le plus d'engagement par publication (3K en moyenne)</li>
            <li>• Actualités CI a la plus grande portée (1.2M de personnes atteintes)</li>
            <li>• 75% des top influenceurs ont un sentiment positif</li>
            <li>• Twitter et Facebook dominent les discussions influentes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
