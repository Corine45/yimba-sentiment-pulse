import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Eye, Heart, MessageSquare, Share2, Users, Globe, Calendar, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface MentionData {
  id: string;
  content: string;
  author: string;
  platform: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  engagement: number;
  reach: number;
  created_at: string;
  url?: string;
}

interface InfluencerProfile {
  name: string;
  platform: string;
  followers: number;
  mentions: number;
  engagement_rate: number;
  influence_score: number;
}

export const Brand24Dashboard = () => {
  const { user } = useAuth();
  const [mentionsData, setMentionsData] = useState<MentionData[]>([]);
  const [influencers, setInfluencers] = useState<InfluencerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalMentions: 0,
    positiveCount: 0,
    negativeCount: 0,
    neutralCount: 0,
    totalEngagement: 0,
    totalReach: 0,
    growth: { mentions: 0, engagement: 0, reach: 0 }
  });

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Charger les mentions sauvegardées
      const { data: mentionSaves } = await supabase
        .from('mention_saves')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Charger les données d'influenceurs
      const { data: influencerData } = await supabase
        .from('influencer_data')
        .select('*')
        .eq('user_id', user.id)
        .order('influence_score', { ascending: false })
        .limit(10);

      // Transformer les données pour le dashboard
      const allMentions: MentionData[] = [];
      let totalPositive = 0, totalNegative = 0, totalNeutral = 0;
      let totalEngagement = 0, totalReach = 0;

      mentionSaves?.forEach(save => {
        if (Array.isArray(save.mentions_data)) {
          const mentions = save.mentions_data.map((mention: any) => ({
            id: `${save.id}-${mention.id || Math.random()}`,
            content: mention.content || mention.text || '',
            author: mention.author || mention.username || 'Utilisateur anonyme',
            platform: mention.platform || 'unknown',
            sentiment: mention.sentiment || 'neutral',
            engagement: mention.engagement_count || mention.likes || 0,
            reach: mention.reach || mention.views || mention.engagement_count * 10,
            created_at: mention.created_at || save.created_at,
            url: mention.url || mention.link
          }));
          allMentions.push(...mentions);
        }
        
        totalPositive += save.positive_mentions || 0;
        totalNegative += save.negative_mentions || 0;
        totalNeutral += save.neutral_mentions || 0;
        totalEngagement += save.total_engagement || 0;
      });

      // Calculer la portée totale estimée
      totalReach = allMentions.reduce((sum, mention) => sum + mention.reach, 0);

      // Transformer les données influenceurs avec mentions calculées
      const transformedInfluencers = influencerData?.map(inf => ({
        name: inf.name,
        platform: inf.platform,
        followers: inf.followers,
        mentions: allMentions.filter(m => m.author === inf.name).length,
        engagement_rate: inf.engagement_rate,
        influence_score: inf.influence_score
      })) || [];

      setMentionsData(allMentions.slice(0, 100)); // Limiter à 100 mentions pour les performances
      setInfluencers(transformedInfluencers);
      setMetrics({
        totalMentions: allMentions.length,
        positiveCount: totalPositive,
        negativeCount: totalNegative,
        neutralCount: totalNeutral,
        totalEngagement,
        totalReach,
        growth: {
          mentions: Math.random() * 20 - 10, // Simulé pour l'exemple
          engagement: Math.random() * 30 - 15,
          reach: Math.random() * 25 - 12
        }
      });

    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Données pour les graphiques
  const sentimentData = [
    { name: 'Positif', value: metrics.positiveCount, color: '#22c55e' },
    { name: 'Négatif', value: metrics.negativeCount, color: '#ef4444' },
    { name: 'Neutre', value: metrics.neutralCount, color: '#6b7280' }
  ];

  const timeSeriesData = mentionsData
    .reduce((acc: any[], mention) => {
      const date = new Date(mention.created_at).toISOString().split('T')[0];
      const existing = acc.find(item => item.date === date);
      if (existing) {
        existing.mentions += 1;
        existing.engagement += mention.engagement;
      } else {
        acc.push({ date, mentions: 1, engagement: mention.engagement });
      }
      return acc;
    }, [])
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30); // 30 derniers jours

  const platformData = mentionsData.reduce((acc: any[], mention) => {
    const existing = acc.find(item => item.platform === mention.platform);
    if (existing) {
      existing.mentions += 1;
      existing.engagement += mention.engagement;
    } else {
      acc.push({ 
        platform: mention.platform, 
        mentions: 1, 
        engagement: mention.engagement,
        growth: Math.random() * 40 - 20 // Simulé
      });
    }
    return acc;
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métriques principales - Style Brand24 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total mentions</p>
                <p className="text-2xl font-bold text-blue-900">{metrics.totalMentions.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {metrics.growth.mentions >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                  )}
                  <span className={`text-xs ${metrics.growth.mentions >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(metrics.growth.mentions).toFixed(1)}%
                  </span>
                </div>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Mentions positives</p>
                <p className="text-2xl font-bold text-green-900">{metrics.positiveCount}</p>
                <p className="text-xs text-green-600">
                  {metrics.totalMentions > 0 ? Math.round((metrics.positiveCount / metrics.totalMentions) * 100) : 0}%
                </p>
              </div>
              <Heart className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Engagement total</p>
                <p className="text-2xl font-bold text-purple-900">{metrics.totalEngagement.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {metrics.growth.engagement >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                  )}
                  <span className={`text-xs ${metrics.growth.engagement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(metrics.growth.engagement).toFixed(1)}%
                  </span>
                </div>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Portée sociale</p>
                <p className="text-2xl font-bold text-emerald-900">{(metrics.totalReach / 1000000).toFixed(1)}M</p>
                <div className="flex items-center mt-1">
                  {metrics.growth.reach >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                  )}
                  <span className={`text-xs ${metrics.growth.reach >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(metrics.growth.reach).toFixed(1)}%
                  </span>
                </div>
              </div>
              <Globe className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Influenceurs</p>
                <p className="text-2xl font-bold text-orange-900">{influencers.length}</p>
                <p className="text-xs text-orange-600">Profils actifs</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">📊 Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="mentions">🗨️ Mentions</TabsTrigger>
          <TabsTrigger value="sentiment">😊 Sentiment</TabsTrigger>
          <TabsTrigger value="influencers">👥 Influenceurs</TabsTrigger>
          <TabsTrigger value="platforms">📱 Plateformes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>📈 Volume des mentions</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="mentions" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎯 Répartition des sentiments</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {sentimentData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mentions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🗨️ Mentions les plus récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {mentionsData.slice(0, 50).map((mention) => (
                  <div key={mention.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-sm">{mention.author}</span>
                          <Badge variant="outline" className="text-xs">
                            {mention.platform}
                          </Badge>
                          <Badge 
                            variant={
                              mention.sentiment === 'positive' ? 'default' : 
                              mention.sentiment === 'negative' ? 'destructive' : 'secondary'
                            }
                            className="text-xs"
                          >
                            {mention.sentiment}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{mention.content.substring(0, 200)}...</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            {mention.engagement}
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {mention.reach}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(mention.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      {mention.url && (
                        <a href={mention.url} target="_blank" rel="noopener noreferrer" className="ml-4">
                          <ExternalLink className="w-4 h-4 text-blue-600 hover:text-blue-800" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>😊 Évolution du sentiment</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="engagement" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="influencers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>👥 Profils d'influenceurs les plus actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {influencers.map((influencer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {influencer.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{influencer.name}</h4>
                        <p className="text-sm text-gray-600">{influencer.platform}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        <span className="font-medium">{influencer.followers.toLocaleString()}</span>
                        <span className="text-gray-600 ml-1">followers</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Score: {influencer.influence_score}/100
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>📱 Mentions par plateforme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformData.map((platform, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{platform.platform}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{platform.mentions} mentions</span>
                        <div className="flex items-center">
                          {platform.growth >= 0 ? (
                            <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                          )}
                          <span className={`text-xs ${platform.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {Math.abs(platform.growth).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={(platform.mentions / Math.max(...platformData.map(p => p.mentions))) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};