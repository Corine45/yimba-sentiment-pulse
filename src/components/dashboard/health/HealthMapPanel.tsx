
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertTriangle } from "lucide-react";
import { useHealthSurveillanceData } from "@/hooks/useHealthSurveillanceData";

interface HealthAlert {
  id: string;
  disease: string;
  location: string;
  severity: 'faible' | 'modéré' | 'critique';
  status: string;
  timestamp: string;
  source: string;
  description: string;
  verified: boolean;
  assignedTo: string | null;
  rawText: string;
  reporterName?: string;
  reporterContact?: string;
  createdAt: string;
}

interface HealthMapPanelProps {
  alerts?: HealthAlert[];
}

export const HealthMapPanel = ({ alerts: propAlerts }: HealthMapPanelProps) => {
  const { alerts: supabaseAlerts, loading } = useHealthSurveillanceData();
  
  // Utiliser les alertes passées en props ou celles de Supabase
  const alerts = propAlerts || supabaseAlerts;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critique': return 'bg-red-500';
      case 'modéré': return 'bg-yellow-500';
      case 'faible': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Cartographie des signaux
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grouper les alertes par localisation
  const locationGroups = alerts.reduce((acc: Record<string, HealthAlert[]>, alert) => {
    const location = alert.location;
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(alert);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          Cartographie des signaux
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.keys(locationGroups).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune localisation détectée</p>
              <p className="text-sm">Les signaux géolocalisés apparaîtront ici</p>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-4 min-h-[200px] relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-4">Aperçu des localisations détectées</p>
                </div>
              </div>
              
              {/* Simulation de points sur la carte */}
              <div className="relative h-48">
                {Object.entries(locationGroups).map(([location, locationAlerts], index) => {
                  const criticalCount = locationAlerts.filter((a: HealthAlert) => a.severity === 'critique').length;
                  const moderateCount = locationAlerts.filter((a: HealthAlert) => a.severity === 'modéré').length;
                  const lowCount = locationAlerts.filter((a: HealthAlert) => a.severity === 'faible').length;
                  
                  // Position simulée pour chaque localisation
                  const positions = [
                    { top: '20%', left: '30%' },
                    { top: '40%', left: '60%' },
                    { top: '60%', left: '20%' },
                    { top: '30%', left: '80%' },
                    { top: '70%', left: '70%' }
                  ];
                  
                  const position = positions[index % positions.length];
                  
                  return (
                    <div
                      key={location}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ top: position.top, left: position.left }}
                    >
                      <div className="relative group cursor-pointer">
                        <div className={`w-4 h-4 rounded-full ${getSeverityColor(
                          criticalCount > 0 ? 'critique' : 
                          moderateCount > 0 ? 'modéré' : 'faible'
                        )} shadow-lg`}></div>
                        
                        {/* Tooltip au survol */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          <div className="font-medium">{location}</div>
                          <div>{locationAlerts.length} alerte(s)</div>
                          {criticalCount > 0 && <div className="text-red-300">{criticalCount} critique(s)</div>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Légende des localisations */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Localisations détectées:</h4>
            {Object.entries(locationGroups).map(([location, locationAlerts]) => (
              <div key={location} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getSeverityColor(
                    locationAlerts.some((a: HealthAlert) => a.severity === 'critique') ? 'critique' : 
                    locationAlerts.some((a: HealthAlert) => a.severity === 'modéré') ? 'modéré' : 'faible'
                  )}`}></div>
                  <span className="text-gray-700">{location}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {locationAlerts.length} alerte{locationAlerts.length > 1 ? 's' : ''}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
