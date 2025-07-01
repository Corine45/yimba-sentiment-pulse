
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const RolePermissions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions par rôle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-red-600">Administrateur</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Gestion complète des utilisateurs</li>
              <li>• Accès à tous les rapports</li>
              <li>• Configuration de la plateforme</li>
              <li>• Gestion des alertes critiques</li>
              <li>• Export de données</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-blue-600">Analyste</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Création de recherches avancées</li>
              <li>• Génération de rapports</li>
              <li>• Analyse des sentiments</li>
              <li>• Gestion des alertes</li>
              <li>• Export limité</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-gray-600">Observateur</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Consultation des rapports</li>
              <li>• Vue des tableaux de bord</li>
              <li>• Recherches simples</li>
              <li>• Réception d'alertes</li>
              <li>• Pas d'export</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
