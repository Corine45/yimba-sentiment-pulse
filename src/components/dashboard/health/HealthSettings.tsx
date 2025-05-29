
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { HealthRole, HealthPermissions } from "../utils/healthPermissions";
import { SourceConfiguration } from "./settings/SourceConfiguration";
import { HealthUserManagement } from "./settings/HealthUserManagement";
import { KeywordManager } from "./settings/KeywordManager";
import { ThresholdConfig } from "./settings/ThresholdConfig";
import { SystemSettings } from "./settings/SystemSettings";

interface HealthSettingsProps {
  healthRole: HealthRole;
  healthPermissions: HealthPermissions;
}

export const HealthSettings = ({ healthRole, healthPermissions }: HealthSettingsProps) => {
  if (!healthPermissions.canConfigureSources && !healthPermissions.canManageHealthUsers) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Accès non autorisé</h3>
          <p className="text-gray-600">Vous n'avez pas les permissions pour accéder aux paramètres.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Paramètres du module Veille Sanitaire</h2>
        <p className="text-gray-600">Configuration des sources, utilisateurs et paramètres du système</p>
      </div>

      {/* Configuration des sources */}
      {healthPermissions.canConfigureSources && (
        <SourceConfiguration />
      )}

      {/* Gestion des mots-clés */}
      {healthPermissions.canManageKeywords && (
        <KeywordManager />
      )}

      {/* Configuration des seuils */}
      {healthPermissions.canSetThresholds && (
        <ThresholdConfig />
      )}

      {/* Gestion des utilisateurs du module santé */}
      {healthPermissions.canManageHealthUsers && (
        <HealthUserManagement />
      )}

      {/* Paramètres système */}
      <SystemSettings />
    </div>
  );
};
