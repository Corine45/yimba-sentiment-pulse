
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, Clock } from "lucide-react";
import { useHealthSurveillanceData } from "@/hooks/useHealthSurveillanceData";

interface HealthAlertsPanelProps {
  alerts?: any[];
}

export const HealthAlertsPanel = ({ alerts: propAlerts }: HealthAlertsPanelProps) => {
  const { alerts: supabaseAlerts, loading } = useHealthSurveillanceData();
  
  // Utiliser les alertes passées en props ou celles de Supabase
  const alerts = propAlerts || supabaseAlerts;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critique': return 'bg-red-100 text-red-800 border-red-200';
      case 'modéré': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'faible': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
            Alertes récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentAlerts = alerts.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
          Alertes récentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune alerte récente</p>
              <p className="text-sm">Les nouvelles alertes apparaîtront ici</p>
            </div>
          ) : (
            recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {alert.disease}
                    </h4>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mb-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="truncate">{alert.location}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
