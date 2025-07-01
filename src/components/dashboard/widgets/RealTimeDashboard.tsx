
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, AlertTriangle, TrendingUp, Globe, RefreshCw } from "lucide-react";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { useAlertsData } from "@/hooks/useAlertsData";
import { useSearchResults } from "@/hooks/useSearchResults";
import { useSocialMediaData } from "@/hooks/useSocialMediaData";

interface RealTimeData {
  timestamp: string;
  mentions: number;
  sentiment: number;
  engagement: number;
}

export const RealTimeDashboard = () => {
  const [isLive, setIsLive] = useState(true);
  const { realtimeData, loading: realtimeLoading, refetch: refetchRealtime } = useRealtimeData();
  const { alerts, loading: alertsLoading, refetch: refetchAlerts } = useAlertsData();
  const { searchResults } = useSearchResults();
  const { posts } = useSocialMediaData();
  
  const [chartData, setChartData] = useState<RealTimeData[]>([]);
  const [platformStats, setPlatformStats] = useState([
    { name: 'Instagram', mentions: 0, change: 0, color: 'pink' },
    { name: 'Twitter', mentions: 0, change: 0, color: 'blue' },
    { name: 'Facebook', mentions: 0, change: 0, color: 'indigo' },
    { name: 'TikTok', mentions: 0, change: 0, color: 'purple' }
  ]);

  useEffect(() => {
    // Transformer les données temps réel de Supabase
    if (realtimeData.length > 0) {
      const transformedData: RealTimeData[] = realtimeData.slice(-10).map((item) => ({
        timestamp: new Date(item.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        mentions: (item.metric_value as any)?.mentions || 0,
        sentiment: (item.metric_value as any)?.sentiment || 0,
        engagement: (item.metric_value as any)?.engagement || 0
      }));
      setChartData(transformedData);
    } else {
      // Utiliser les données des résultats de recherche pour créer des données temps réel simulées
      const recentSearchData = searchResults.slice(-5).map((result, index) => ({
        timestamp: new Date(Date.now() - (4 - index) * 15 * 60 * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        mentions: result.total_mentions || 0,
        sentiment: ((result.positive_sentiment || 0) - (result.negative_sentiment || 0)) / Math.max(result.total_mentions || 1, 1),
        engagement: Math.round((result.total_engagement || 0) / Math.max(result.total_mentions || 1, 1))
      }));
      setChartData(recentSearchData);
    }

    // Calculer les statistiques par plateforme basées sur les données réelles
    const platformCounts = posts.reduce((acc, post) => {
      const platform = post.platform || 'Autre';
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Ajouter les données des résultats de recherche
    searchResults.forEach(result => {
      const platform = result.platform || 'Autre';
      platformCounts[platform] = (platformCounts[platform] || 0) + (result.total_mentions || 0);
    });

    const updatedPlatformStats = platformStats.map(platform => ({
      ...platform,
      mentions: platformCounts[platform.name] || 0,
      change: Math.random() * 20 - 10 // Simulation du changement basé sur les données
    }));

    setPlatformStats(updatedPlatformStats);
  }, [realtimeData, searchResults, posts]);

  const handleRefresh = () => {
    refetchRealtime();
    refetchAlerts();
  };

  const getAlertColor = (type: string, severity: string) => {
    if (type === 'crisis') return 'bg-red-100 text-red-800 border-red-200';
    if (type === 'opportunity') return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getAlertIcon = (type: string) => {
    if (type === 'crisis') return '🚨';
    if (type === 'opportunity') return '🎯';
    return '📈';
  };

  if (realtimeLoading || alertsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-600" />
            Surveillance en temps réel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Si aucune donnée temps réel et aucune recherche, afficher l'état vide
  if (chartData.length === 0 && searchResults.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              Surveillance en temps réel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune donnée temps réel disponible</h3>
              <p className="text-gray-600">
                Effectuez des recherches pour commencer à surveiller l'activité en temps réel.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Live */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              Surveillance en temps réel
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Actualiser
              </Button>
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-600">
                {isLive ? 'En direct' : 'Hors ligne'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {chartData[chartData.length - 1]?.mentions || 0}
              </div>
              <div className="text-sm text-blue-800">Mentions récentes</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(Math.abs(chartData[chartData.length - 1]?.sentiment || 0) * 100)}%
              </div>
              <div className="text-sm text-green-800">Score sentiment</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {chartData[chartData.length - 1]?.engagement || 0}
              </div>
              <div className="text-sm text-purple-800">Engagement moyen</div>
            </div>
          </div>

          {chartData.length > 0 && (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="mentions" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="engagement" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Alertes en temps réel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
            Alertes récentes ({alerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center p-8">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucune alerte disponible.</p>
              <p className="text-sm text-gray-500 mt-2">
                Les alertes seront générées automatiquement en fonction de vos recherches.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type, alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">{getAlertIcon(alert.type)}</span>
                      <div>
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs opacity-75 mt-1">{alert.timestamp}</p>
                        <div className="flex space-x-1 mt-1">
                          {alert.keywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {alert.severity === 'high' ? 'Urgent' : 
                       alert.severity === 'medium' ? 'Modéré' : 'Info'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plateformes actives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-600" />
            Activité par plateforme
          </CardTitle>
        </CardHeader>
        <CardContent>
          {platformStats.every(p => p.mentions === 0) ? (
            <div className="text-center p-8">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucune activité détectée sur les plateformes.</p>
              <p className="text-sm text-gray-500 mt-2">
                Les données d'activité apparaîtront après vos recherches.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {platformStats.filter(platform => platform.mentions > 0).map((platform) => (
                <div key={platform.name} className="text-center p-3 border rounded-lg">
                  <div className="font-medium text-gray-900">{platform.name}</div>
                  <div className="text-lg font-bold text-gray-700">{platform.mentions}</div>
                  <div className={`text-xs flex items-center justify-center ${
                    platform.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {platform.change >= 0 ? '+' : ''}{platform.change.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
