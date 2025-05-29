
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HealthMap } from "./HealthMap";
import { HealthMetrics } from "./HealthMetrics";
import { HealthTrends } from "./HealthTrends";
import { Activity, AlertTriangle, MapPin, TrendingUp, Download, RefreshCw } from "lucide-react";

interface HealthDashboardProps {
  userRole: string;
  permissions: any;
}

interface HealthAlert {
  id: string;
  disease: string;
  location: string;
  severity: 'faible' | 'modéré' | 'critique';
  timestamp: string;
  source: string;
  verified: boolean;
}

export const HealthDashboard = ({ userRole, permissions }: HealthDashboardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Données simulées d'alertes sanitaires
  const [healthAlerts] = useState<HealthAlert[]>([
    {
      id: "HS001",
      disease: "COVID-19",
      location: "Abidjan, Cocody",
      severity: "modéré",
      timestamp: "Il y a 15 min",
      source: "Twitter",
      verified: true
    },
    {
      id: "HS002", 
      disease: "Paludisme",
      location: "Bouaké",
      severity: "critique",
      timestamp: "Il y a 32 min",
      source: "Facebook",
      verified: false
    },
    {
      id: "HS003",
      disease: "Dengue",
      location: "San Pedro",
      severity: "faible",
      timestamp: "Il y a 1h",
      source: "Forum local",
      verified: true
    },
    {
      id: "HS004",
      disease: "Rougeole",
      location: "Korhogo",
      severity: "modéré",
      timestamp: "Il y a 2h",
      source: "WhatsApp",
      verified: false
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critique': return 'bg-red-100 text-red-800 border-red-200';
      case 'modéré': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'faible': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDiseaseIcon = (disease: string) => {
    const icons: Record<string, string> = {
      'COVID-19': '🦠',
      'Paludisme': '🦟',
      'Dengue': '🦟',
      'Rougeole': '🔴',
      'VIH': '⚕️'
    };
    return icons[disease] || '⚕️';
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tableau de bord sanitaire</h2>
          <p className="text-gray-600">Surveillance en temps réel - Côte d'Ivoire</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            Dernière MAJ: {lastUpdate.toLocaleTimeString('fr-FR')}
          </span>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          {permissions.canExportData && (
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          )}
        </div>
      </div>

      {/* Métriques principales */}
      <HealthMetrics />

      {/* Carte et alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carte interactive */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Cartographie des signaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HealthMap alerts={healthAlerts} />
          </CardContent>
        </Card>

        {/* Alertes récentes */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                Alertes récentes
              </div>
              <Badge variant="outline" className="text-xs">
                {healthAlerts.length} actives
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {healthAlerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{getDiseaseIcon(alert.disease)}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{alert.disease}</h4>
                          {alert.verified && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                              Vérifié
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm opacity-80 mt-1">{alert.location}</p>
                        <div className="flex items-center space-x-2 mt-2 text-xs opacity-75">
                          <span>{alert.timestamp}</span>
                          <span>•</span>
                          <span>{alert.source}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques de tendances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Tendances épidémiologiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HealthTrends />
        </CardContent>
      </Card>
    </div>
  );
};
