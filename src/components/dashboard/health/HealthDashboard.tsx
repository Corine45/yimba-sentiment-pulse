
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthDashboardHeader } from "./HealthDashboardHeader";
import { HealthMapPanel } from "./HealthMapPanel";
import { HealthAlertsPanel } from "./HealthAlertsPanel";
import { HealthMetrics } from "./HealthMetrics";
import { HealthTrends } from "./HealthTrends";
import { TrendingUp } from "lucide-react";
import { HealthRole, HealthPermissions } from "../utils/healthPermissions";
import { useHealthSurveillanceData } from "@/hooks/useHealthSurveillanceData";

interface HealthDashboardProps {
  healthRole: HealthRole;
  healthPermissions: HealthPermissions;
}

export const HealthDashboard = ({ healthRole, healthPermissions }: HealthDashboardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Utiliser les vraies données de Supabase
  const { alerts: healthAlerts, loading } = useHealthSurveillanceData();

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 2000);
  };

  // Filtrer les alertes selon le rôle - les observateurs ne voient que les alertes vérifiées
  const visibleAlerts = healthRole === "observateur_partenaire" 
    ? healthAlerts.filter(alert => alert.verified)
    : healthAlerts;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HealthDashboardHeader
        healthRole={healthRole}
        healthPermissions={healthPermissions}
        lastUpdate={lastUpdate}
        isLoading={isLoading}
        onRefresh={handleRefresh}
      />

      <HealthMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthMapPanel alerts={visibleAlerts} />
        <HealthAlertsPanel alerts={visibleAlerts} />
      </div>

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
