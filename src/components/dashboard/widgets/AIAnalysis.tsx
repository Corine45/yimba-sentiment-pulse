
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Search, AlertTriangle } from "lucide-react";

export const AIAnalysis = () => {
  const topicsData = [
    { topic: "Éducation", confidence: 95, mentions: 456, sentiment: "positive" },
    { topic: "Politique", confidence: 88, mentions: 334, sentiment: "negative" },
    { topic: "Économie", confidence: 92, mentions: 298, sentiment: "neutral" },
    { topic: "Santé", confidence: 97, mentions: 234, sentiment: "positive" },
    { topic: "Emploi", confidence: 85, mentions: 187, sentiment: "negative" },
  ];

  const emotionData = [
    { name: "Joie", value: 35 },
    { name: "Colère", value: 25 },
    { name: "Tristesse", value: 20 },
    { name: "Peur", value: 15 },
    { name: "Surprise", value: 5 },
  ];

  const alerts = [
    {
      type: "high",
      message: "Pic de mentions négatives détecté sur 'politique'",
      time: "Il y a 15 min",
      confidence: 94
    },
    {
      type: "medium",
      message: "Nouvelle tendance émergente : 'formation professionnelle'",
      time: "Il y a 1h",
      confidence: 78
    },
    {
      type: "low",
      message: "Baisse d'activité sur les réseaux sociaux",
      time: "Il y a 2h",
      confidence: 65
    }
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Topic Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-blue-600" />
            <span>Détection automatique de sujets (IA)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topicsData.map((topic, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{topic.topic}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      topic.sentiment === "positive" ? "bg-green-100 text-green-800" :
                      topic.sentiment === "negative" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {topic.sentiment === "positive" ? "Positif" :
                       topic.sentiment === "negative" ? "Négatif" : "Neutre"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {topic.mentions} mentions • Confiance IA: {topic.confidence}%
                  </div>
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${topic.confidence}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emotion Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse des émotions (IA)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={emotionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* AI Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span>Alertes intelligentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm opacity-75 mt-1">{alert.time}</p>
                  </div>
                  <span className="text-sm font-medium">
                    {alert.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
