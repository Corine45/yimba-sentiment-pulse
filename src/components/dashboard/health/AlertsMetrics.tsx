
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, TrendingUp, Clock, CheckCircle, 
  MapPin, Activity, BarChart3, Users 
} from "lucide-react";

interface Alert {
  id: string;
  disease: string;
  location: string;
  severity: string;
  status: string;
  timestamp: string;
  source: string;
  verified: boolean;
  assignedTo: string | null;
}

interface AlertsMetricsProps {
  alerts: Alert[];
}

export const AlertsMetrics = ({ alerts }: AlertsMetricsProps) => {
  // Calculs des métriques
  const totalAlerts = alerts.length;
  const newAlerts = alerts.filter(a => a.status === 'nouveau').length;
  const inProgressAlerts = alerts.filter(a => a.status === 'en_cours').length;
  const resolvedAlerts = alerts.filter(a => a.status === 'resolu').length;
  const verifiedAlerts = alerts.filter(a => a.verified).length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critique').length;
  const unassignedAlerts = alerts.filter(a => !a.assignedTo).length;

  // Pourcentages
  const verificationRate = totalAlerts > 0 ? (verifiedAlerts / totalAlerts) * 100 : 0;
  const resolutionRate = totalAlerts > 0 ? (resolvedAlerts / totalAlerts) * 100 : 0;
  const criticalRate = totalAlerts > 0 ? (criticalAlerts / totalAlerts) * 100 : 0;

  // Top maladies
  const diseaseCount = alerts.reduce((acc, alert) => {
    acc[alert.disease] = (acc[alert.disease] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topDiseases = Object.entries(diseaseCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Top localisations
  const locationCount = alerts.reduce((acc, alert) => {
    acc[alert.location] = (acc[alert.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topLocations = Object.entries(locationCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total alertes</p>
                <p className="text-2xl font-bold">{totalAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nouvelles</p>
                <p className="text-2xl font-bold text-blue-600">{newAlerts}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-orange-600">{inProgressAlerts}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critiques</p>
                <p className="text-2xl font-bold text-red-600">{criticalAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Taux et progression */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Taux de vérification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{verificationRate.toFixed(1)}%</span>
                <Badge variant="outline" className="text-xs">
                  {verifiedAlerts}/{totalAlerts}
                </Badge>
              </div>
              <Progress value={verificationRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Taux de résolution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{resolutionRate.toFixed(1)}%</span>
                <Badge variant="outline" className="text-xs">
                  {resolvedAlerts}/{totalAlerts}
                </Badge>
              </div>
              <Progress value={resolutionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Non assignées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-yellow-600">{unassignedAlerts}</span>
                <Users className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-xs text-gray-600">
                {totalAlerts > 0 ? ((unassignedAlerts / totalAlerts) * 100).toFixed(1) : 0}% du total
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top maladies et localisations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Top maladies signalées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topDiseases.map(([disease, count], index) => (
                <div key={disease} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      {index + 1}. {disease}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {count} cas
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              Top zones affectées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topLocations.map(([location, count], index) => (
                <div key={location} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      {index + 1}. {location}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {count} alertes
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
