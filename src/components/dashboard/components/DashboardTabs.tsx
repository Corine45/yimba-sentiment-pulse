
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchPanel } from "../SearchPanel";
import { SentimentAnalysis } from "../SentimentAnalysis";
import { AlertsPanel } from "../AlertsPanel";
import { ReportsPanel } from "../ReportsPanel";
import { UserManagement } from "../UserManagement";
import { HealthSurveillance } from "../HealthSurveillance";
import { Eye, Bell, TrendingUp, FileText, Users, Settings, Activity } from "lucide-react";
import { HealthRole } from "../utils/healthPermissions";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  user: any;
  permissions: any;
}

export const DashboardTabs = ({ activeTab, onTabChange, user, permissions }: DashboardTabsProps) => {
  const getAvailableTabs = () => {
    const tabs = [];
    
    if (permissions.canSearch) {
      tabs.push({
        value: "search",
        label: "Recherche",
        icon: Eye,
        description: permissions.searchLevel === "advanced" ? "Recherches avancées" : "Recherches simples"
      });
    }
    
    if (permissions.canAnalyze) {
      tabs.push({
        value: "analysis",
        label: "Analyse",
        icon: TrendingUp,
        description: "Analyse des sentiments complète"
      });
    } else if (user.role === "observateur") {
      tabs.push({
        value: "analysis",
        label: "Consultation",
        icon: TrendingUp,
        description: "Consultation des analyses"
      });
    }
    
    tabs.push({
      value: "alerts",
      label: permissions.canManageAlerts ? "Alertes" : "Notifications",
      icon: Bell,
      description: permissions.canManageAlerts ? "Gestion des alertes" : "Réception des alertes"
    });
    
    tabs.push({
      value: "reports",
      label: permissions.canGenerateReports ? "Rapports" : "Consultation",
      icon: FileText,
      description: permissions.canGenerateReports ? "Génération de rapports" : "Consultation des rapports"
    });

    if (permissions.canAccessHealthSurveillance) {
      tabs.push({
        value: "health",
        label: "Veille Sanitaire",
        icon: Activity,
        description: permissions.canConfigureHealthSources ? "Surveillance sanitaire complète" : user.role === "analyste" ? "Analyse sanitaire + export" : "Consultation sanitaire"
      });
    }
    
    if (permissions.canManageUsers) {
      tabs.push({
        value: "users",
        label: "Utilisateurs",
        icon: Users,
        description: "Gestion des utilisateurs"
      });
    }
    
    if (permissions.canAccessSettings) {
      tabs.push({
        value: "settings",
        label: "Paramètres",
        icon: Settings,
        description: "Configuration de la plateforme"
      });
    }
    
    return tabs;
  };

  const availableTabs = getAvailableTabs();

  // Simuler un profil utilisateur pour le module santé
  // En production, ceci devrait venir de la base de données
  const healthUserProfile = {
    name: user.name,
    email: user.email || `${user.name.toLowerCase().replace(' ', '.')}@example.com`,
    healthRole: "admin_sante" as HealthRole // Par défaut, ajuster selon la logique métier
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className={`grid w-full bg-white p-1 shadow-sm`} style={{gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)`}}>
        {availableTabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="flex items-center space-x-2" title={tab.description}>
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {permissions.canSearch && (
        <TabsContent value="search" className="space-y-6">
          <SearchPanel userRole={user.role} permissions={permissions} />
        </TabsContent>
      )}

      <TabsContent value="analysis" className="space-y-6">
        <SentimentAnalysis userRole={user.role} permissions={permissions} />
      </TabsContent>

      <TabsContent value="alerts" className="space-y-6">
        <AlertsPanel userRole={user.role} permissions={permissions} />
      </TabsContent>

      <TabsContent value="reports" className="space-y-6">
        <ReportsPanel userRole={user.role} permissions={permissions} />
      </TabsContent>

      {permissions.canAccessHealthSurveillance && (
        <TabsContent value="health" className="space-y-6">
          <HealthSurveillance 
            healthRole={healthUserProfile.healthRole}
            userProfile={healthUserProfile}
          />
        </TabsContent>
      )}

      {permissions.canManageUsers && (
        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>
      )}

      {permissions.canAccessSettings && (
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres administrateur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h3 className="font-medium text-blue-900 mb-2">Configuration de la plateforme</h3>
                  <p className="text-sm text-blue-700">Gestion des paramètres généraux, des intégrations API et des politiques de sécurité.</p>
                </div>
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <h3 className="font-medium text-green-900 mb-2">Monitoring système</h3>
                  <p className="text-sm text-green-700">Surveillance des performances, logs système et métriques d'utilisation.</p>
                </div>
                <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <h3 className="font-medium text-yellow-900 mb-2">Sauvegardes et sécurité</h3>
                  <p className="text-sm text-yellow-700">Gestion des sauvegardes automatiques et des politiques de sécurité.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  );
};
