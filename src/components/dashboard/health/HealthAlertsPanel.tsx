
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface HealthAlert {
  id: string;
  disease: string;
  location: string;
  severity: 'faible' | 'modéré' | 'critique';
  timestamp: string;
  source: string;
  verified: boolean;
}

interface HealthAlertsPanelProps {
  alerts: HealthAlert[];
}

export const HealthAlertsPanel = ({ alerts }: HealthAlertsPanelProps) => {
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

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
            Alertes récentes
          </div>
          <Badge variant="outline" className="text-xs">
            {alerts.length} visibles
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {alerts.map((alert) => (
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
  );
};
