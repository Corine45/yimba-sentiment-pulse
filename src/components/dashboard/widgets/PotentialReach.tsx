
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Users, TrendingUp, Target, Zap } from "lucide-react";
import { useSearchResults } from "@/hooks/useSearchResults";
import { useInfluencerData } from "@/hooks/useInfluencerData";

export const PotentialReach = () => {
  const { searchResults, loading } = useSearchResults();
  const { influencers } = useInfluencerData();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-orange-600" />
            Portée et Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculer la portée totale basée sur les résultats de recherche
  const totalReach = searchResults.reduce((sum, result) => sum + (result.total_reach || 0), 0);
  const totalEngagement = searchResults.reduce((sum, result) => sum + (result.total_engagement || 0), 0);
  const totalMentions = searchResults.reduce((sum, result) => sum + (result.total_mentions || 0), 0);

  // Calculer le taux d'engagement moyen
  const avgEngagementRate = totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0;

  // Préparer les données pour les graphiques
  const reachData = searchResults.slice(-7).map((result, index) => ({
    date: new Date(result.created_at).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    reach: result.total_reach || 0,
    engagement: result.total_engagement || 0,
    mentions: result.total_mentions || 0
  }));

  // Calculer la portée des influenceurs
  const influencerReach = influencers.reduce((sum, inf) => sum + inf.followers, 0);
  const avgInfluencerEngagement = influencers.length > 0 
    ? influencers.reduce((sum, inf) => sum + inf.engagement_rate, 0) / influencers.length 
    : 0;

  // Données par plateforme
  const platformReach = searchResults.reduce((acc, result) => {
    const platform = result.platform || 'Autre';
    if (!acc[platform]) {
      acc[platform] = { reach: 0, engagement: 0, mentions: 0 };
    }
    acc[platform].reach += result.total_reach || 0;
    acc[platform].engagement += result.total_engagement || 0;
    acc[platform].mentions += result.total_mentions || 0;
    return acc;
  }, {} as Record<string, { reach: number; engagement: number; mentions: number }>);

  const platformData = Object.entries(platformReach).map(([platform, data]) => ({
    platform,
    reach: data.reach,
    engagement: data.engagement,
    mentions: data.mentions,
    engagementRate: data.reach > 0 ? (data.engagement / data.reach) * 100 : 0
  }));

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Portée Totale</p>
                <p className="text-2xl font-bold text-blue-600">{formatNumber(totalReach)}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engagement Total</p>
                <p className="text-2xl font-bold text-green-600">{formatNumber(totalEngagement)}</p>
              </div>
              <Zap className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux d'Engagement</p>
                <p className="text-2xl font-bold text-purple-600">{avgEngagementRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Portée Influenceurs</p>
                <p className="text-2xl font-bold text-orange-600">{formatNumber(influencerReach)}</p>
              </div>
              <Target className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {totalReach === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">Aucune donnée de portée disponible</p>
            <p className="text-sm text-gray-500 mt-2">
              Effectuez des recherches pour voir l'impact et la portée
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Évolution de la portée */}
          {reachData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Évolution de la portée</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reachData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [formatNumber(value as number), name]} />
                    <Line type="monotone" dataKey="reach" stroke="#3B82F6" strokeWidth={2} name="Portée" />
                    <Line type="monotone" dataKey="engagement" stroke="#10B981" strokeWidth={2} name="Engagement" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Portée par plateforme */}
          {platformData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Portée par plateforme</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [formatNumber(value as number), name]} />
                    <Bar dataKey="reach" fill="#3B82F6" name="Portée" />
                    <Bar dataKey="engagement" fill="#10B981" name="Engagement" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Analyse d'impact */}
          <Card>
            <CardHeader>
              <CardTitle>Analyse d'impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Portée Directe</h4>
                    <p className="text-2xl font-bold text-blue-600">{formatNumber(totalReach)}</p>
                    <p className="text-sm text-blue-700">Personnes atteintes directement</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Portée Potentielle</h4>
                    <p className="text-2xl font-bold text-green-600">{formatNumber(totalReach * 2.5)}</p>
                    <p className="text-sm text-green-700">Estimation avec partages et recommandations</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">💡 Insights sur l'impact</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Portée totale de {formatNumber(totalReach)} personnes sur vos recherches</li>
                    <li>• Taux d'engagement moyen de {avgEngagementRate.toFixed(1)}%</li>
                    <li>• {influencers.length} influenceurs identifiés avec {formatNumber(influencerReach)} followers</li>
                    <li>• Engagement moyen des influenceurs : {avgInfluencerEngagement.toFixed(1)}%</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
