
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { HealthRole, HealthPermissions } from "../utils/healthPermissions";

interface AlertsHeaderProps {
  healthRole: HealthRole;
  healthPermissions: HealthPermissions;
  alertsCount: number;
}

export const AlertsHeader = ({ healthRole, healthPermissions, alertsCount }: AlertsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestion des alertes sanitaires</h2>
        <p className="text-gray-600">
          {healthPermissions.canEditAlerts ? "Gérez et suivez les alertes" : "Consultez les alertes en cours"}
          {healthRole === "observateur_partenaire" && " - Alertes vérifiées uniquement"}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {healthPermissions.canCreateAlerts && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle alerte
          </Button>
        )}
        <Badge variant="outline" className="text-xs">
          {alertsCount} alertes
        </Badge>
      </div>
    </div>
  );
};
