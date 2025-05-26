
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, AlertTriangle, TrendingUp, Globe } from "lucide-react";

interface RealTimeData {
  timestamp: string;
  mentions: number;
  sentiment: number;
  engagement: number;
}

interface Alert {
  id: string;
  type: 'crisis' | 'opportunity' | 'trend';
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
}

export const RealTimeDashboard = () => {
  const [isLive, setIsLive] = useState(true);
  const [realtimeData, setRealtimeData] = useState<RealTimeData[]>([
    { timestamp: "10:00", mentions: 45, sentiment: 0.7, engagement: 85 },
    { timestamp: "10:15", mentions: 52, sentiment: 0.6, engagement: 90 },
    { timestamp: "10:30", mentions: 38, sentiment: 0.8, engagement: 75 },
    { timestamp: "10:45", mentions: 61, sentiment: 0.5, engagement: 95 },
    { timestamp: "11:00", mentions: 49, sentiment: 0.9, engagement: 88 },
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "crisis",
      message: "Pic de mentions négatives détecté sur le hashtag #education",
      severity: "high",
      timestamp: "Il y a 5 min"
    },
    {
      id: "2",
      type: "opportunity",
      message: "Tendance positive émergente sur #innovation",
      severity: "medium",
      timestamp: "Il y a 12 min"
    },
    {
      id: "3",
      type: "trend",
      message: "Nouveau mot-clé viral: #futuretech",
      severity: "low",
      timestamp: "Il y a 25 min"
    }
  ]);

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        const newData = {
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          mentions: Math.floor(Math.random() * 50) + 30,
          sentiment: Math.random(),
          engagement: Math.floor(Math.random() * 30) + 70
        };
        
        setRealtimeData(prev => [...prev.slice(-4), newData]);
      }, 15000); // Update every 15 seconds

      return () => clearInterval(interval);
    }
  }, [isLive]);

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
                {realtimeData[realtimeData.length - 1]?.mentions || 0}
              </div>
              <div className="text-sm text-blue-800">Mentions/15min</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((realtimeData[realtimeData.length - 1]?.sentiment || 0) * 100)}%
              </div>
              <div className="text-sm text-green-800">Sentiment positif</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {realtimeData[realtimeData.length - 1]?.engagement || 0}%
              </div>
              <div className="text-sm text-purple-800">Taux d'engagement</div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={realtimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="mentions" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="engagement" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Alertes en temps réel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
            Alertes récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type, alert.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">{getAlertIcon(alert.type)}</span>
                    <div>
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs opacity-75 mt-1">{alert.timestamp}</p>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Instagram', mentions: 1234, change: +12, color: 'pink' },
              { name: 'Twitter', mentions: 987, change: -3, color: 'blue' },
              { name: 'Facebook', mentions: 756, change: +8, color: 'indigo' },
              { name: 'TikTok', mentions: 543, change: +25, color: 'purple' }
            ].map((platform) => (
              <div key={platform.name} className="text-center p-3 border rounded-lg">
                <div className="font-medium text-gray-900">{platform.name}</div>
                <div className="text-lg font-bold text-gray-700">{platform.mentions}</div>
                <div className={`text-xs flex items-center justify-center ${
                  platform.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {platform.change >= 0 ? '+' : ''}{platform.change}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
