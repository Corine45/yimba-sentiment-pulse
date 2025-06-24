
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthDashboardHeader } from "./HealthDashboardHeader";
import { HealthMapPanel } from "./HealthMapPanel";
import { HealthAlertsPanel } from "./HealthAlertsPanel";
import { HealthMetrics } from "./HealthMetrics";
import { HealthTrends } from "./HealthTrends";
import { TrendingUp } from "lucide-react";
import { HealthRole, HealthPermissions } from "../utils/healthPermissions";

interface HealthDashboardProps {
  healthRole: HealthRole;
  healthPermissions: HealthPermissions;
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

export const HealthDashboard = ({ healthRole, healthPermissions }: HealthDashboardProps) => {
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

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <HealthDashboardHeader
        healthRole={healthRole}
        healthPermissions={healthPermissions}
        lastUpdate={lastUpdate}
        isLoading={isLoading}
        onRefresh={handleRefresh}
      />

      {/* Métriques principales */}
      <HealthMetrics />

      {/* Carte et alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthMapPanel alerts={visibleAlerts} />
        <HealthAlertsPanel alerts={visibleAlerts} />
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
