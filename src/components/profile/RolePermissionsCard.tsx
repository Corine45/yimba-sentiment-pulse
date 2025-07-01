
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getRoleBadgeColor, getRoleLabel } from "@/components/dashboard/utils/dashboardUtils";
import { Settings } from "lucide-react";

interface RolePermissionsCardProps {
  role: string;
}

export const RolePermissionsCard = ({ role }: RolePermissionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Rôle et permissions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Rôle actuel</Label>
          <div className="mt-2">
            <Badge className={getRoleBadgeColor(role)}>
              {getRoleLabel(role)}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="text-sm text-gray-600">
          <p className="font-medium mb-2">Permissions :</p>
          <ul className="space-y-1">
            {role === 'admin' && (
              <>
                <li>✓ Accès complet à toutes les fonctionnalités</li>
                <li>✓ Gestion des utilisateurs</li>
                <li>✓ Configuration de la plateforme</li>
              </>
            )}
            {role === 'analyste' && (
              <>
                <li>✓ Recherches avancées</li>
                <li>✓ Analyse des sentiments</li>
                <li>✓ Génération de rapports</li>
                <li>✗ Gestion des utilisateurs</li>
              </>
            )}
            {role === 'observateur' && (
              <>
                <li>✓ Consultation des données</li>
                <li>✓ Recherches simples</li>
                <li>✗ Analyse avancée</li>
                <li>✗ Génération de rapports</li>
              </>
            )}
          </ul>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Note :</strong> Seuls les administrateurs peuvent modifier les rôles des utilisateurs.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
