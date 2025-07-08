
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, BarChart3, RefreshCw, Star, Eye, Heart } from "lucide-react";
import { useInfluencerData } from "@/hooks/useInfluencerData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from "recharts";

export const DynamicInfluencerAnalysis = () => {
  const { influencers, loading, refetch } = useInfluencerData();

  // Calculer les métriques globales
  const totalInfluencers = influencers.length;
  const avgEngagement = influencers.length > 0 
    ? influencers.reduce((sum, inf) => sum + inf.engagement_rate, 0) / influencers.length 
    : 0;
  const totalFollowers = influencers.reduce((sum, inf) => sum + inf.followers, 0);
  const topInfluencer = influencers.length > 0 
    ? influencers.reduce((max, inf) => inf.influence_score > max.influence_score ? inf : max, influencers[0])
    : null;

  // Données pour les graphiques
  const chartData = influencers.slice(0, 10).map(inf => ({
    name: inf.name.length > 12 ? inf.name.substring(0, 12) + '...' : inf.name,
    followers: inf.followers,
    engagement: inf.engagement_rate,
    score: inf.influence_score,
    platform: inf.platform
  }));

  // Distribution par plateforme
  const platformStats = influencers.reduce((acc, inf) => {
    acc[inf.platform] = (acc[inf.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const platformData = Object.entries(platformStats).map(([platform, count]) => ({
    platform,
    count,
    avgEngagement: influencers
      .filter(inf => inf.platform === platform)
      .reduce((sum, inf) => sum + inf.engagement_rate, 0) / count
  }));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Analyse des influenceurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Influenceurs</p>
                <p className="text-2xl font-bold text-blue-600">{totalInfluencers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Engagement Moyen</p>
                <p className="text-2xl font-bold text-red-600">{avgEngagement.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Total Followers</p>
                <p className="text-2xl font-bold text-green-600">{totalFollowers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Top Score</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {topInfluencer ? topInfluencer.influence_score : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {influencers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune donnée d'influenceur disponible.</p>
            <p className="text-sm text-gray-500 mt-2">
              Les données seront générées automatiquement lors de vos prochaines recherches.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique followers vs engagement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Followers vs Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="followers" name="Followers" />
                  <YAxis dataKey="engagement" name="Engagement %" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm">Followers: {data.followers.toLocaleString()}</p>
                            <p className="text-sm">Engagement: {data.engagement.toFixed(1)}%</p>
                            <p className="text-sm">Plateforme: {data.platform}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter dataKey="engagement" fill="#3B82F6" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribution par plateforme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Distribution par plateforme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10B981" name="Nombre d'influenceurs" />
                  <Bar dataKey="avgEngagement" fill="#3B82F6" name="Engagement moyen %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Liste détaillée des top influenceurs */}
      {influencers.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Top Influenceurs
              </CardTitle>
              <Button variant="outline" size="sm" onClick={refetch}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Actualiser
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {influencers.slice(0, 10).map((influencer, index) => (
                <div key={influencer.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="font-medium text-lg">{influencer.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {influencer.platform}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{influencer.followers.toLocaleString()} followers</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{influencer.engagement_rate.toFixed(1)}% engagement</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>Score: {influencer.influence_score}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-20 bg-gray-200 rounded-full h-3 mb-1">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-600 h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min(100, (influencer.influence_score / 100) * 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      Influence
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
