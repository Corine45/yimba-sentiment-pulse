
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { AlertCard } from "./AlertCard";
import { HealthPermissions } from "../utils/healthPermissions";

interface Alert {
  id: string;
  disease: string;
  location: string;
  severity: string;
  status: string;
  timestamp: string;
  source: string;
  description: string;
  verified: boolean;
  assignedTo: string | null;
  rawText: string;
  reporterName?: string;
  reporterContact?: string;
  createdAt?: string;
}

interface AlertsListProps {
  alerts: Alert[];
  healthPermissions: HealthPermissions;
  onViewDetails: (alert: Alert) => void;
  onUpdateAlert: (alert: Alert) => void;
}

export const AlertsList = ({ 
  alerts, 
  healthPermissions, 
  onViewDetails,
  onUpdateAlert 
}: AlertsListProps) => {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune alerte trouvée</h3>
          <p className="text-gray-600">Aucune alerte ne correspond aux critères de recherche.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <AlertCard 
          key={alert.id} 
          alert={alert} 
          healthPermissions={healthPermissions}
          onViewDetails={onViewDetails}
          onUpdateAlert={onUpdateAlert}
        />
      ))}
    </div>
  );
};
