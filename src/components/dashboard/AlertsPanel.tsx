
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Eye, ExternalLink } from "lucide-react";

export const AlertsPanel = () => {
  const alerts = [
    {
      id: 1,
      type: "crisis",
      title: "Pic de mentions négatives détecté",
      description: "Le mot-clé 'éducation' montre une augmentation de 300% des mentions négatives",
      timestamp: "Il y a 15 minutes",
      platform: "Twitter",
      severity: "high",
      keywords: ["éducation", "grève", "protestation"]
    },
    {
      id: 2,
      type: "trending",
      title: "Sujet émergent identifié",
      description: "Nouvelle tendance détectée autour du hashtag #EconomieVerte",
      timestamp: "Il y a 1 heure",
      platform: "Instagram",
      severity: "medium",
      keywords: ["économie", "environnement", "développement"]
    },
    {
      id: 3,
      type: "sentiment",
      title: "Changement de sentiment",
      description: "Sentiment général passé de positif à neutre pour le sujet 'santé publique'",
      timestamp: "Il y a 3 heures",
      platform: "Facebook",
      severity: "low",
      keywords: ["santé", "hôpital", "médecine"]
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "crisis":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "trending":
        return <Bell className="w-5 h-5 text-blue-600" />;
      default:
        return <Eye className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">3</div>
            <div className="text-sm text-red-800">Alertes critiques</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">8</div>
            <div className="text-sm text-yellow-800">Alertes moyennes</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">15</div>
            <div className="text-sm text-green-800">Alertes faibles</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">26</div>
            <div className="text-sm text-blue-800">Total aujourd'hui</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <span>Alertes actives</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getTypeIcon(alert.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{alert.timestamp}</span>
                        <span>•</span>
                        <span>{alert.platform}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity === "high" ? "Critique" : 
                     alert.severity === "medium" ? "Moyen" : "Faible"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {alert.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Analyser
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Voir la source
                    </Button>
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
