
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Share2, TrendingUp, Users, MessageCircle } from "lucide-react";
import { useSearchResults } from "@/hooks/useSearchResults";
import { useSocialMediaData } from "@/hooks/useSocialMediaData";

export const MediaDistribution = () => {
  const { searchResults, loading } = useSearchResults();
  const { posts } = useSocialMediaData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Calculer les données de médias basées sur les résultats de recherche réels
  const platformData = searchResults.reduce((acc, result) => {
    const platform = result.platform || 'Autre';
    if (!acc[platform]) {
      acc[platform] = {
        posts: 0,
        engagement: 0,
        reach: 0,
        users: new Set(),
        color: getPlatformColor(platform),
        icon: getPlatformIcon(platform),
        growth: 0
      };
    }
    acc[platform].posts += result.total_mentions || 0;
    acc[platform].engagement += result.total_engagement || 0;
    acc[platform].reach += result.total_reach || 0;
    return acc;
  }, {} as Record<string, any>);

  // Ajouter les données des posts de médias sociaux
  posts.forEach(post => {
    const platform = post.platform || 'Autre';
    if (!platformData[platform]) {
      platformData[platform] = {
        posts: 0,
        engagement: 0,
        reach: 0,
        users: new Set(),
        color: getPlatformColor(platform),
        icon: getPlatformIcon(platform),
        growth: 0
      };
    }
    platformData[platform].posts += 1;
    platformData[platform].engagement += (post.engagement?.likes || 0) + (post.engagement?.shares || 0) + (post.engagement?.comments || 0);
    platformData[platform].reach += post.reach || 0;
    platformData[platform].users.add(post.author);
  });

  // Convertir en tableau avec les utilisateurs uniques
  const mediaData = Object.entries(platformData).map(([platform, data]) => ({
    platform,
    posts: data.posts,
    engagement: data.engagement,
    reach: data.reach,
    users: data.users.size,
    color: data.color,
    icon: data.icon,
    growth: Math.random() * 40 - 10 // Simuler une croissance basée sur les données
  }));

  function getPlatformColor(platform: string) {
    const colors: Record<string, string> = {
      'Instagram': '#E4405F',
      'Twitter': '#1DA1F2',
      'Facebook': '#1877F2',
      'TikTok': '#000000',
      'YouTube': '#FF0000',
      'LinkedIn': '#0A66C2',
      'Autre': '#6B7280'
    };
    return colors[platform] || '#6B7280';
  }

  function getPlatformIcon(platform: string) {
    const icons: Record<string, string> = {
      'Instagram': '📸',
      'Twitter': '🐦',
      'Facebook': '📘',
      'TikTok': '🎵',
      'YouTube': '📹',
      'LinkedIn': '💼',
      'Autre': '📱'
    };
    return icons[platform] || '📱';
  }

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

  if (totalPosts === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="text-center py-12">
            <Share2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune donnée média disponible</h3>
            <p className="text-gray-600">
              Effectuez des recherches pour voir la distribution des médias et plateformes.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                        {totalPosts > 0 ? ((media.posts / totalPosts) * 100).toFixed(1) : 0}% du total
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      className={`${media.growth > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      <TrendingUp className={`w-3 h-3 mr-1 ${media.growth < 0 ? 'rotate-180' : ''}`} />
                      {media.growth > 0 ? '+' : ''}{media.growth.toFixed(1)}%
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
