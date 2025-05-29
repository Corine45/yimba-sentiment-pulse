
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchPanel } from "./SearchPanel";
import { SentimentAnalysis } from "./SentimentAnalysis";
import { AlertsPanel } from "./AlertsPanel";
import { ReportsPanel } from "./ReportsPanel";
import { UserManagement } from "./UserManagement";
import { LogOut, Eye, Bell, TrendingUp, FileText, Users, Settings } from "lucide-react";

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("search");

  // Définir les permissions par rôle
  const getRolePermissions = (role: string) => {
    switch (role) {
      case "admin":
        return {
          canSearch: true,
          canAnalyze: true,
          canManageAlerts: true,
          canGenerateReports: true,
          canManageUsers: true,
          canAccessSettings: true,
          canExportData: true,
          searchLevel: "advanced", // recherches avancées
        };
      case "analyste":
        return {
          canSearch: true,
          canAnalyze: true,
          canManageAlerts: true,
          canGenerateReports: true,
          canManageUsers: false,
          canAccessSettings: false,
          canExportData: true,
          searchLevel: "advanced", // recherches avancées
        };
      case "observateur":
        return {
          canSearch: true,
          canAnalyze: false, // lecture seule des analyses
          canManageAlerts: false, // réception uniquement
          canGenerateReports: false, // consultation uniquement
          canManageUsers: false,
          canAccessSettings: false,
          canExportData: false,
          searchLevel: "basic", // recherches simples
        };
      default:
        return {
          canSearch: false,
          canAnalyze: false,
          canManageAlerts: false,
          canGenerateReports: false,
          canManageUsers: false,
          canAccessSettings: false,
          canExportData: false,
          searchLevel: "none",
        };
    }
  };

  const permissions = getRolePermissions(user.role);

  // Définir les onglets disponibles selon le rôle
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

  // Fonction pour obtenir la couleur du badge selon le rôle
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "analyste":
        return "bg-blue-100 text-blue-800";
      case "observateur":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fonction pour obtenir le label du rôle en français
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrateur";
      case "analyste":
        return "Analyste";
      case "observateur":
        return "Observateur";
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/a22a86d5-8372-43c1-b810-1514798e3569.png" 
                    alt="YIMBA Logo" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  YIMBA
                </h1>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-sm text-gray-600">Tableau de bord {getRoleLabel(user.role)}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user.name}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Role-specific welcome message */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Bienvenue, {user.name}
          </h2>
          <p className="text-blue-700 text-sm">
            {user.role === "admin" && "Vous avez accès à toutes les fonctionnalités de la plateforme, y compris la gestion des utilisateurs et la configuration."}
            {user.role === "analyste" && "Vous pouvez créer des recherches avancées, générer des rapports et analyser les sentiments."}
            {user.role === "observateur" && "Vous pouvez consulter les rapports, effectuer des recherches simples et recevoir des alertes."}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
      </div>
    </div>
  );
};
