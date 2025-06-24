
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { HealthRole, HealthPermissions } from "../utils/healthPermissions";

interface HealthDashboardHeaderProps {
  healthRole: HealthRole;
  healthPermissions: HealthPermissions;
  lastUpdate: Date;
  isLoading: boolean;
  onRefresh: () => void;
}

export const HealthDashboardHeader = ({
  healthRole,
  healthPermissions,
  lastUpdate,
  isLoading,
  onRefresh
}: HealthDashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tableau de bord sanitaire</h2>
        <p className="text-gray-600">
          Surveillance en temps réel - Côte d'Ivoire
          {healthRole === "observateur_partenaire" && (
            <Badge className="ml-2 text-xs bg-blue-100 text-blue-800">
              Alertes vérifiées uniquement
            </Badge>
          )}
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-500">
          Dernière MAJ: {lastUpdate.toLocaleTimeString('fr-FR')}
        </span>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
        {healthPermissions.canExportData && (
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        )}
      </div>
    </div>
  );
};
