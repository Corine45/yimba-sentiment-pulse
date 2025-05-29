
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, TrendingUp, Globe, Users, Clock } from "lucide-react";

export const HealthMetrics = () => {
  const metrics = [
    {
      title: "Alertes actives",
      value: "24",
      change: "+3",
      changeType: "increase" as const,
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Signaux détectés",
      value: "156",
      change: "+12",
      changeType: "increase" as const,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Régions surveillées",
      value: "19",
      change: "0",
      changeType: "stable" as const,
      icon: Globe,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Population couverte",
      value: "26.4M",
      change: "+0.2M",
      changeType: "increase" as const,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Temps de réponse",
      value: "8 min",
      change: "-2 min",
      changeType: "decrease" as const,
      icon: Clock,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Taux de vérification",
      value: "87%",
      change: "+5%",
      changeType: "increase" as const,
      icon: TrendingUp,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50"
    }
  ];

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return '↗';
      case 'decrease': return '↘';
      case 'stable': return '→';
      default: return '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              {metric.change !== "0" && (
                <Badge variant="outline" className={`text-xs ${getChangeColor(metric.changeType)}`}>
                  {getChangeIcon(metric.changeType)} {metric.change}
                </Badge>
              )}
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-sm text-gray-600 mt-1">{metric.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
