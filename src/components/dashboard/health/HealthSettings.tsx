
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Users, Database, AlertTriangle, Key } from "lucide-react";
import { HealthRole, HealthPermissions } from "../utils/healthPermissions";

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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-600" />
              Configuration des sources de données
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h4 className="font-medium text-blue-900 mb-2">Réseaux sociaux</h4>
                  <p className="text-sm text-blue-700 mb-3">Configuration Twitter, Facebook, Instagram</p>
                  <Button size="sm" variant="outline">
                    <Key className="w-4 h-4 mr-2" />
                    Configurer APIs
                  </Button>
                </div>
                
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <h4 className="font-medium text-green-900 mb-2">Forums et sites web</h4>
                  <p className="text-sm text-green-700 mb-3">Surveillance de sites spécialisés</p>
                  <Button size="sm" variant="outline">
                    Gérer les sources
                  </Button>
                </div>
                
                <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <h4 className="font-medium text-yellow-900 mb-2">Mots-clés et expressions</h4>
                  <p className="text-sm text-yellow-700 mb-3">Définition des termes de surveillance</p>
                  <Button size="sm" variant="outline">
                    Éditer les mots-clés
                  </Button>
                </div>
                
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-medium text-red-900 mb-2">Seuils d'alerte</h4>
                  <p className="text-sm text-red-700 mb-3">Paramétrage des niveaux de déclenchement</p>
                  <Button size="sm" variant="outline">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Configurer seuils
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gestion des utilisateurs du module santé */}
      {healthPermissions.canManageHealthUsers && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-600" />
              Gestion des utilisateurs du module
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Statistiques des utilisateurs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-xl font-bold text-red-600">1</div>
                  <div className="text-sm text-red-800">Admin Santé</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-blue-800">Analystes</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">8</div>
                  <div className="text-sm text-green-800">Observateurs</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">1</div>
                  <div className="text-sm text-purple-800">Formateur</div>
                </div>
              </div>

              {/* Actions de gestion */}
              <div className="flex flex-wrap gap-3">
                <Button>
                  <Users className="w-4 h-4 mr-2" />
                  Ajouter un utilisateur
                </Button>
                <Button variant="outline">
                  Gérer les rôles
                </Button>
                <Button variant="outline">
                  Historique des accès
                </Button>
                <Button variant="outline">
                  Exporter la liste
                </Button>
              </div>

              {/* Description des rôles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Rôles disponibles</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Admin Santé</span>
                      <span className="text-red-600">Accès complet</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Analyste Sanitaire</span>
                      <span className="text-blue-600">Analyse + Export</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Observateur/Partenaire</span>
                      <span className="text-green-600">Lecture seule</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Formateur</span>
                      <span className="text-purple-600">Formation</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Permissions spéciales</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Gestion isolée des accès au module</p>
                    <p>• Indépendant des rôles YIMBA existants</p>
                    <p>• Traçabilité des actions par rôle</p>
                    <p>• Assignation flexible des responsabilités</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paramètres système */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2 text-gray-600" />
            Paramètres système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Fréquence de surveillance</h4>
                <p className="text-sm text-gray-600 mb-3">Intervalle de vérification des sources</p>
                <div className="text-sm">
                  <span className="font-medium">Actuel:</span> Toutes les 15 minutes
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Rétention des données</h4>
                <p className="text-sm text-gray-600 mb-3">Durée de conservation des signaux</p>
                <div className="text-sm">
                  <span className="font-medium">Actuel:</span> 12 mois
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline">Modifier la configuration</Button>
              <Button variant="outline">Sauvegarder les paramètres</Button>
              <Button variant="outline">Réinitialiser</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
