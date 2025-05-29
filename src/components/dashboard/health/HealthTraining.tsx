
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Users, BarChart, Settings } from "lucide-react";
import { HealthRole, HealthPermissions } from "../utils/healthPermissions";

interface HealthTrainingProps {
  healthRole: HealthRole;
  healthPermissions: HealthPermissions;
}

export const HealthTraining = ({ healthRole, healthPermissions }: HealthTrainingProps) => {
  // Contenu de formation selon le rôle
  const getTrainingContent = () => {
    if (healthPermissions.canManageTrainingContent) {
      // Vue formateur/accompagnateur
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-purple-600" />
                Gestion des contenus de formation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-auto p-4 flex flex-col items-start space-y-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <h4 className="font-medium">Modules pédagogiques</h4>
                    <p className="text-sm text-gray-600">Créer et modifier les contenus</p>
                  </div>
                </Button>
                
                <Button className="h-auto p-4 flex flex-col items-start space-y-2" variant="outline">
                  <BarChart className="w-6 h-6 text-green-600" />
                  <div className="text-left">
                    <h4 className="font-medium">Statistiques d'usage</h4>
                    <p className="text-sm text-gray-600">Suivi des formations</p>
                  </div>
                </Button>
                
                <Button className="h-auto p-4 flex flex-col items-start space-y-2" variant="outline">
                  <Users className="w-6 h-6 text-orange-600" />
                  <div className="text-left">
                    <h4 className="font-medium">Accompagnement</h4>
                    <p className="text-sm text-gray-600">Support aux utilisateurs</p>
                  </div>
                </Button>
                
                <Button className="h-auto p-4 flex flex-col items-start space-y-2" variant="outline">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                  <div className="text-left">
                    <h4 className="font-medium">Certifications</h4>
                    <p className="text-sm text-gray-600">Gestion des parcours</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logs d'utilisation anonymes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">24</div>
                    <div className="text-sm text-blue-800">Utilisateurs actifs</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">87%</div>
                    <div className="text-sm text-green-800">Taux de completion</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-sm text-purple-800">Modules actifs</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      // Vue utilisateur standard
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                  Modules de formation disponibles
                </div>
                <Badge variant="outline" className="text-purple-600">
                  {healthRole === "admin_sante" ? "Niveau Expert" : 
                   healthRole === "analyste_sanitaire" ? "Niveau Avancé" : "Niveau Débutant"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Introduction à la veille sanitaire</h4>
                    <p className="text-sm text-gray-600 mb-3">Concepts de base et méthodologie de surveillance</p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-100 text-green-800">Terminé</Badge>
                      <Button size="sm" variant="outline">Réviser</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">Interprétation des signaux</h4>
                    <p className="text-sm text-gray-600 mb-3">Comment analyser et valider les alertes</p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>
                      <Button size="sm">Continuer</Button>
                    </div>
                  </CardContent>
                </Card>

                {(healthRole === "admin_sante" || healthRole === "analyste_sanitaire") && (
                  <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-red-900 mb-2">Gestion de crise sanitaire</h4>
                      <p className="text-sm text-gray-600 mb-3">Procédures d'escalade et coordination</p>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-gray-100 text-gray-800">Non commencé</Badge>
                        <Button size="sm" variant="outline">Démarrer</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-green-900 mb-2">Utilisation de la plateforme</h4>
                    <p className="text-sm text-gray-600 mb-3">Guide pratique des fonctionnalités</p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-100 text-blue-800">Recommandé</Badge>
                      <Button size="sm">Accéder</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ressources complémentaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Guide méthodologique OMS</h4>
                      <p className="text-sm text-gray-600">Surveillance épidémiologique</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Télécharger</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Protocoles nationaux CI</h4>
                      <p className="text-sm text-gray-600">Procédures locales adaptées</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Consulter</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {healthPermissions.canManageTrainingContent ? "Centre de formation - Gestion" : "Centre de formation"}
          </h2>
          <p className="text-gray-600">
            {healthPermissions.canManageTrainingContent 
              ? "Gestion des contenus pédagogiques et suivi des utilisateurs"
              : "Formations et ressources pour la veille sanitaire"
            }
          </p>
        </div>
      </div>

      {getTrainingContent()}
    </div>
  );
};
