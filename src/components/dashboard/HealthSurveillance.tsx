
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HealthDashboard } from "./health/HealthDashboard";
import { HealthAlerts } from "./health/HealthAlerts";
import { HealthCaseTracking } from "./health/HealthCaseTracking";
import { HealthSettings } from "./health/HealthSettings";
import { HealthTraining } from "./health/HealthTraining";
import { Activity, AlertTriangle, FileText, Settings, GraduationCap, UserCheck } from "lucide-react";
import { HealthRole, getHealthPermissions, getHealthRoleLabel, getHealthRoleBadgeColor, getHealthRoleDescription } from "./utils/healthPermissions";

interface HealthSurveillanceProps {
  // Nouveau: utilise le rôle santé spécifique au lieu du rôle YIMBA général
  healthRole: HealthRole;
  userProfile: {
    name: string;
    email: string;
    healthRole: HealthRole;
  };
}

export const HealthSurveillance = ({ healthRole: initialHealthRole, userProfile }: HealthSurveillanceProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // État pour permettre de changer de rôle (pour test)
  const [currentHealthRole, setCurrentHealthRole] = useState<HealthRole>(initialHealthRole);
  
  // Utilise les nouvelles permissions spécifiques au module santé
  const healthPermissions = getHealthPermissions(currentHealthRole);

  const getAvailableTabs = () => {
    const tabs = [];

    // Tableau de bord - accessible sauf aux formateurs
    if (healthPermissions.canViewDashboard) {
      tabs.push({
        value: "dashboard",
        label: "Tableau de bord",
        icon: Activity,
        description: "Vue d'ensemble des signaux sanitaires"
      });
    }

    // Alertes - accessible selon les permissions
    if (healthPermissions.canViewAlerts) {
      tabs.push({
        value: "alerts",
        label: "Alertes",
        icon: AlertTriangle,
        description: healthPermissions.canEditAlerts ? "Gestion des alertes sanitaires" : "Consultation des alertes"
      });
    }

    // Suivi des cas - accessible selon les permissions
    if (healthPermissions.canTrackCases || healthPermissions.canCreateCaseFiles) {
      tabs.push({
        value: "cases",
        label: "Cas suivis",
        icon: FileText,
        description: "Suivi des interventions"
      });
    }

    // Paramètres - réservé aux admins santé
    if (healthPermissions.canConfigureSources || healthPermissions.canManageHealthUsers) {
      tabs.push({
        value: "settings",
        label: "Paramètres",
        icon: Settings,
        description: "Configuration des sources et gestion des utilisateurs"
      });
    }

    // Formation - accessible aux formateurs et utilisateurs
    if (healthPermissions.canAccessTraining) {
      tabs.push({
        value: "training",
        label: "Formation",
        icon: GraduationCap,
        description: healthPermissions.canManageTrainingContent ? "Gestion de la formation" : "Accès à la formation"
      });
    }

    return tabs;
  };

  const availableTabs = getAvailableTabs();

  // Si aucun onglet n'est disponible, afficher un message d'erreur
  if (availableTabs.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Accès non autorisé</h3>
          <p className="text-gray-600">Votre profil ne vous permet pas d'accéder aux fonctionnalités de ce module.</p>
          <Badge className={`mt-4 ${getHealthRoleBadgeColor(currentHealthRole)}`}>
            {getHealthRoleLabel(currentHealthRole)}
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header du module avec badge de rôle et sélecteur de test */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-xl">
                <Activity className="w-6 h-6 mr-3 text-green-600" />
                Module Veille Sanitaire et Suivi Pandémique
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Détection, alertes et suivi des signaux de crises sanitaires
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                <Badge className={`text-xs ${getHealthRoleBadgeColor(currentHealthRole)}`}>
                  {getHealthRoleLabel(currentHealthRole)}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-600">Surveillance active</span>
              </div>
            </div>
          </div>
          
          {/* Sélecteur de rôle pour test */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-yellow-900 mb-1">Mode Test - Changement de profil</h4>
                <p className="text-xs text-yellow-700">Sélectionnez un profil pour tester les différents accès</p>
              </div>
              <div className="flex items-center space-x-3">
                <UserCheck className="w-4 h-4 text-yellow-600" />
                <Select value={currentHealthRole} onValueChange={(value: HealthRole) => setCurrentHealthRole(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin_sante">Admin Santé</SelectItem>
                    <SelectItem value="analyste_sanitaire">Analyste Sanitaire</SelectItem>
                    <SelectItem value="observateur_partenaire">Observateur/Partenaire</SelectItem>
                    <SelectItem value="formateur_accompagnateur">Formateur/Accompagnateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-2 text-xs text-yellow-600">
              <strong>Rôle actuel:</strong> {getHealthRoleDescription(currentHealthRole)}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation des sous-modules */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid w-full bg-white p-1 shadow-sm`} style={{gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)`}}>
          {availableTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center space-x-2" title={tab.description}>
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {healthPermissions.canViewDashboard && (
          <TabsContent value="dashboard" className="space-y-6">
            <HealthDashboard healthRole={currentHealthRole} healthPermissions={healthPermissions} />
          </TabsContent>
        )}

        {healthPermissions.canViewAlerts && (
          <TabsContent value="alerts" className="space-y-6">
            <HealthAlerts healthRole={currentHealthRole} healthPermissions={healthPermissions} />
          </TabsContent>
        )}

        {(healthPermissions.canTrackCases || healthPermissions.canCreateCaseFiles) && (
          <TabsContent value="cases" className="space-y-6">
            <HealthCaseTracking healthRole={currentHealthRole} healthPermissions={healthPermissions} />
          </TabsContent>
        )}

        {(healthPermissions.canConfigureSources || healthPermissions.canManageHealthUsers) && (
          <TabsContent value="settings" className="space-y-6">
            <HealthSettings healthRole={currentHealthRole} healthPermissions={healthPermissions} />
          </TabsContent>
        )}

        {healthPermissions.canAccessTraining && (
          <TabsContent value="training" className="space-y-6">
            <HealthTraining healthRole={currentHealthRole} healthPermissions={healthPermissions} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};
