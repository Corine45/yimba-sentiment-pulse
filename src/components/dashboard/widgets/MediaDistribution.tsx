
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Share2, TrendingUp, Users, MessageCircle } from "lucide-react";

interface MediaData {
  platform: string;
  posts: number;
  engagement: number;
  reach: number;
  users: number;
  color: string;
  icon: string;
  growth: number;
}

export const MediaDistribution = () => {
  const mediaData: MediaData[] = [
    {
      platform: 'Facebook',
      posts: 2845,
      engagement: 125000,
      reach: 890000,
      users: 1250,
      color: '#1877F2',
      icon: '📘',
      growth: 12.5
    },
    {
      platform: 'Twitter',
      posts: 1923,
      engagement: 89000,
      reach: 450000,
      users: 987,
      color: '#1DA1F2',
      icon: '🐦',
      growth: -3.2
    },
    {
      platform: 'Instagram',
      posts: 1456,
      engagement: 67000,
      reach: 320000,
      users: 654,
      color: '#E4405F',
      icon: '📸',
      growth: 18.7
    },
    {
      platform: 'YouTube',
      posts: 234,
      engagement: 45000,
      reach: 280000,
      users: 123,
      color: '#FF0000',
      icon: '📹',
      growth: 25.3
    },
    {
      platform: 'TikTok',
      posts: 567,
      engagement: 78000,
      reach: 190000,
      users: 234,
      color: '#000000',
      icon: '🎵',
      growth: 45.2
    },
    {
      platform: 'LinkedIn',
      posts: 189,
      engagement: 12000,
      reach: 65000,
      users: 89,
      color: '#0A66C2',
      icon: '💼',
      growth: 8.9
    }
  ];

  const pieData = mediaData.map(item => ({
    name: item.platform,
    value: item.posts,
    color: item.color
  }));

  const engagementData = mediaData.map(item => ({
    platform: item.platform,
    engagement: item.engagement,
    reach: item.reach
  }));

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const totalPosts = mediaData.reduce((sum, item) => sum + item.posts, 0);
  const totalEngagement = mediaData.reduce((sum, item) => sum + item.engagement, 0);
  const totalReach = mediaData.reduce((sum, item) => sum + item.reach, 0);

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Publications</p>
                <p className="text-2xl font-bold">{formatNumber(totalPosts)}</p>
              </div>
              <Share2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engagement Total</p>
                <p className="text-2xl font-bold">{formatNumber(totalEngagement)}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Portée Totale</p>
                <p className="text-2xl font-bold">{formatNumber(totalReach)}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et répartition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique en secteurs */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des publications par média</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value, percent }) => 
                    `${name}: ${((percent || 0) * 100).toFixed(1)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatNumber(value as number), 'Publications']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Graphique engagement vs portée */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement vs Portée par plateforme</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="platform" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value, name) => [
                    formatNumber(value as number), 
                    name === 'engagement' ? 'Engagement' : 'Portée'
                  ]}
                />
                <Bar dataKey="engagement" fill="#10B981" radius={[2, 2, 0, 0]} />
                <Bar dataKey="reach" fill="#3B82F6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tableau détaillé */}
      <Card>
        <CardHeader>
          <CardTitle>Détail par plateforme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mediaData.map((media) => (
              <div key={media.platform} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{media.icon}</span>
                    <div>
                      <h4 className="font-medium">{media.platform}</h4>
                      <p className="text-sm text-gray-600">
                        {((media.posts / totalPosts) * 100).toFixed(1)}% du total
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      className={`${media.growth > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      <TrendingUp className={`w-3 h-3 mr-1 ${media.growth < 0 ? 'rotate-180' : ''}`} />
                      {media.growth > 0 ? '+' : ''}{media.growth}%
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Publications</p>
                    <p className="text-lg font-semibold" style={{ color: media.color }}>
                      {formatNumber(media.posts)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Engagement</p>
                    <p className="text-lg font-semibold" style={{ color: media.color }}>
                      {formatNumber(media.engagement)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Portée</p>
                    <p className="text-lg font-semibold" style={{ color: media.color }}>
                      {formatNumber(media.reach)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Auteurs uniques</p>
                    <p className="text-lg font-semibold" style={{ color: media.color }}>
                      {formatNumber(media.users)}
                    </p>
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
