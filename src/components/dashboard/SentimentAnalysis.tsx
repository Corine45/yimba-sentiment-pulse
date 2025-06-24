import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, Eye, Users, Globe, Brain, Target } from "lucide-react";
import { EngagementStats } from "./widgets/EngagementStats";
import { RecentMentions } from "./widgets/RecentMentions";
import { RealTimeDashboard } from "./widgets/RealTimeDashboard";
import { InfluencerAnalysis } from "./widgets/InfluencerAnalysis";
import { MediaDistribution } from "./widgets/MediaDistribution";
import { SourceDiversity } from "./widgets/SourceDiversity";
import { GeographicDistribution } from "./widgets/GeographicDistribution";
import { AIContextGenerator } from "./widgets/AIContextGenerator";
import { PotentialReach } from "./widgets/PotentialReach";

interface SentimentAnalysisProps {
  userRole: string;
  permissions: {
    canAnalyze: boolean;
    canExportData: boolean;
  };
}

export const SentimentAnalysis = ({ userRole, permissions }: SentimentAnalysisProps) => {
  const sentimentData = [
    { name: "Lun", positif: 45, negatif: 25, neutre: 30 },
    { name: "Mar", positif: 52, negatif: 28, neutre: 20 },
    { name: "Mer", positif: 38, negatif: 35, neutre: 27 },
    { name: "Jeu", positif: 61, negatif: 22, neutre: 17 },
    { name: "Ven", positif: 49, negatif: 31, neutre: 20 },
    { name: "Sam", positif: 55, negatif: 25, neutre: 20 },
    { name: "Dim", positif: 42, negatif: 33, neutre: 25 },
  ];

  const pieData = [
    { name: "Positif", value: 45, color: "#10B981" },
    { name: "Négatif", value: 28, color: "#EF4444" },
    { name: "Neutre", value: 27, color: "#6B7280" },
  ];

  const trendingTopics = [
    { topic: "éducation", mentions: 1234, sentiment: "positive", change: "+15%" },
    { topic: "politique", mentions: 987, sentiment: "negative", change: "-8%" },
    { topic: "économie", mentions: 756, sentiment: "neutral", change: "+3%" },
    { topic: "santé", mentions: 654, sentiment: "positive", change: "+22%" },
  ];

  const engagementData = {
    likes: 145678,
    comments: 23456,
    shares: 8901,
    views: 567890,
    likesChange: 12.5,
    commentsChange: -3.2,
    sharesChange: 8.7,
    viewsChange: 15.3
  };

  const recentMentions = [
    {
      id: "1",
      platform: "Instagram",
      author: "marie_dupont",
      content: "Excellente initiative pour l'éducation! Bravo pour cette innovation qui va vraiment aider nos enfants à mieux apprendre.",
      sentiment: "positive" as const,
      timestamp: "2024-05-26T10:30:00Z",
      engagement: { likes: 45, comments: 12, shares: 8 },
      url: "https://instagram.com/p/example",
      verified: true
    },
    {
      id: "2",
      platform: "Twitter",
      author: "tech_expert",
      content: "Je ne suis pas convaincu par cette nouvelle approche. Il manque encore beaucoup de fonctionnalités essentielles.",
      sentiment: "negative" as const,
      timestamp: "2024-05-26T09:45:00Z",
      engagement: { likes: 23, comments: 34, shares: 5 },
      url: "https://twitter.com/example"
    },
    {
      id: "3",
      platform: "Facebook",
      author: "parent_actif",
      content: "Intéressant mais j'attends de voir les résultats concrets avant de me prononcer.",
      sentiment: "neutral" as const,
      timestamp: "2024-05-26T08:20:00Z",
      engagement: { likes: 12, comments: 7, shares: 3 },
      verified: false
    }
  ];

  return (
    <div className="space-y-6">
      {userRole === "observateur" && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <Eye className="w-4 h-4 inline mr-1" />
            Mode consultation - Vous consultez les analyses en lecture seule
          </p>
        </div>
      )}

      {/* Contexte IA en premier */}
      <AIContextGenerator />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="influencers">Influenceurs</TabsTrigger>
          <TabsTrigger value="media">Médias</TabsTrigger>
          <TabsTrigger value="geographic">Géographie</TabsTrigger>
          <TabsTrigger value="reach">Impact</TabsTrigger>
          <TabsTrigger value="realtime">Temps réel</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-green-700 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Sentiment Positif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">45%</div>
                <p className="text-sm text-green-700 mt-1">+5% par rapport à la semaine dernière</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-red-700 flex items-center">
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Sentiment Négatif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">28%</div>
                <p className="text-sm text-red-700 mt-1">-2% par rapport à la semaine dernière</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-yellow-700 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Alertes Actives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">12</div>
                <p className="text-sm text-yellow-700 mt-1">Mots-clés sensibles détectés</p>
              </CardContent>
            </Card>
          </div>

          {/* Diversité des sources */}
          <SourceDiversity />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution des sentiments (7 jours)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="positif" fill="#10B981" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="negatif" fill="#EF4444" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="neutre" fill="#6B7280" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition globale des sentiments</CardTitle>
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
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle>Sujets tendances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium capitalize">#{topic.topic}</div>
                      <div className="text-sm text-gray-600">{topic.mentions} mentions</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        topic.sentiment === "positive" ? "bg-green-100 text-green-800" :
                        topic.sentiment === "negative" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {topic.sentiment === "positive" ? "Positif" :
                         topic.sentiment === "negative" ? "Négatif" : "Neutre"}
                      </span>
                      <span className={`text-sm font-medium ${
                        topic.change.startsWith("+") ? "text-green-600" : "text-red-600"
                      }`}>
                        {topic.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="influencers" className="space-y-6">
          <InfluencerAnalysis />
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <MediaDistribution />
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <GeographicDistribution />
        </TabsContent>

        <TabsContent value="reach" className="space-y-6">
          <PotentialReach />
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <RealTimeDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};
