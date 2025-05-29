
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

interface HealthSettingsProps {
  userRole: string;
  permissions: any;
}

export const HealthSettings = ({ userRole, permissions }: HealthSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 mr-2 text-gray-600" />
          Configuration et sources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Paramètres administrateur</h3>
          <p className="text-gray-600 mb-4">
            Configuration des sources de données et paramètres de surveillance.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>✓ Gestion des sources (Twitter, Facebook, etc.)</p>
            <p>✓ Configuration des mots-clés</p>
            <p>✓ Paramètres d'alerte automatique</p>
            <p>✓ Intégration DHIS2/FHIR</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
