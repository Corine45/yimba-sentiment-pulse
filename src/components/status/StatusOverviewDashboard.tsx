
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Users, 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  Database,
  Settings,
  Eye,
  BarChart3,
  Shield,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { getRolePermissions, getRoleBadgeColor, getRoleLabel } from "@/components/dashboard/utils/dashboardUtils";
import { SystemMetrics } from "./components/SystemMetrics";
import { UserActivity } from "./components/UserActivity";
import { PlatformStatus } from "./components/PlatformStatus";
import { SecurityOverview } from "./components/SecurityOverview";
import { DataSummary } from "./components/DataSummary";
import { useNavigate } from "react-router-dom";
import { useSearchResults } from "@/hooks/useSearchResults";
import { useAlertsData } from "@/hooks/useAlertsData";
import { useSystemMetrics } from "@/hooks/useSystemMetrics";
import { useStatusOverviewData } from "@/hooks/useStatusOverviewData";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/components/AppSidebar";

interface StatusOverviewDashboardProps {
  user: any;
  onLogout: () => void;
}

export const StatusOverviewDashboard = ({ user, onLogout }: StatusOverviewDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const permissions = getRolePermissions(user.role);
  
  // Hooks pour les données dynamiques
  const { searchResults } = useSearchResults();
  const { alerts } = useAlertsData();
  const { metrics } = useSystemMetrics();
  const { statusData, loading: statusLoading } = useStatusOverviewData();

  const getAvailableTabs = () => {
    const tabs = [];
    
    // Vue d'ensemble - accessible à tous
    tabs.push({
      value: "overview",
      label: "Vue d'ensemble",
      icon: Activity,
      description: "État général de la plateforme"
    });

    // Métriques système - accessible aux analystes et admins
    if (permissions.canAnalyze || permissions.canAccessSettings) {
      tabs.push({
        value: "metrics",
        label: "Métriques",
        icon: BarChart3,
        description: "Métriques système et performance"
      });
    }

    // Activité utilisateurs - accessible aux admins uniquement
    if (permissions.canManageUsers) {
      tabs.push({
        value: "users",
        label: "Utilisateurs",
        icon: Users,
        description: "Activité et gestion des utilisateurs"
      });
    }

    // Sécurité - accessible aux admins uniquement
    if (permissions.canAccessSettings) {
      tabs.push({
        value: "security",
        label: "Sécurité",
        icon: Shield,
        description: "Aperçu sécurité et accès"
      });
    }

    // Données - accessible selon les permissions
    if (permissions.canAnalyze || permissions.canAccessSettings) {
      tabs.push({
        value: "data",
        label: "Données",
        icon: Database,
        description: "État des données et stockage"
      });
    }

    return tabs;
  };

  const availableTabs = getAvailableTabs();

  // Calculer les statistiques dynamiques avec données réelles
  const activeSearches = statusData?.recentActivity.searches || searchResults.filter(result => 
    new Date(result.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000
  ).length;

  const totalAlerts = statusData?.platformStats.totalAlerts || alerts.length;
  const lastActivityTime = searchResults.length > 0 
    ? Math.floor((Date.now() - new Date(searchResults[0]?.created_at || Date.now()).getTime()) / (1000 * 60))
    : 0;

  if (statusLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3">Chargement de l'état des lieux...</span>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          activeTab="status"
          onTabChange={() => {}}
          user={user}
          permissions={permissions}
        />
        
        <div className="flex-1 bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className="text-sm"
                  >
                    ← Retour au tableau de bord
                  </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">État des lieux - YIMBA</h1>
                <p className="text-sm text-gray-600">Vue d'ensemble de la plateforme</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
                  <Button variant="outline" size="sm" onClick={onLogout}>
                    Déconnexion
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Restrictions d'accès pour observateurs */}
          {user.role === "observateur" && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Eye className="w-4 h-4 inline mr-1" />
                  Mode consultation - Accès limité aux informations générales selon votre profil
                </p>
              </div>
            </div>
          )}

          {/* Contenu principal */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full bg-white p-1 shadow-sm`} style={{gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)`}}>
            {availableTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center space-x-2" title={tab.description}>
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Statut global */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Statut global</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-lg font-semibold text-green-600">Opérationnel</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Tous les services fonctionnent</p>
                </CardContent>
              </Card>

              {/* Recherches actives */}
              {permissions.canSearch && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Recherches actives</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Search className="w-5 h-5 text-blue-500" />
                      <span className="text-lg font-semibold">{activeSearches}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Recherches récentes (24h)</p>
                  </CardContent>
                </Card>
              )}

              {/* Alertes */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Alertes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <span className="text-lg font-semibold">{totalAlerts}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Alertes générées</p>
                </CardContent>
              </Card>

              {/* Dernière activité */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Dernière activité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="text-lg font-semibold">
                      {lastActivityTime < 60 ? `${lastActivityTime}min` : `${Math.floor(lastActivityTime / 60)}h`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Il y a {lastActivityTime < 60 ? `${lastActivityTime} minutes` : `${Math.floor(lastActivityTime / 60)} heures`}
                  </p>
                </CardContent>
              </Card>
            </div>

            <PlatformStatus userRole={user.role} permissions={permissions} />
          </TabsContent>

          {(permissions.canAnalyze || permissions.canAccessSettings) && (
            <TabsContent value="metrics" className="space-y-6">
              <SystemMetrics userRole={user.role} permissions={permissions} />
            </TabsContent>
          )}

          {permissions.canManageUsers && (
            <TabsContent value="users" className="space-y-6">
              <UserActivity userRole={user.role} permissions={permissions} />
            </TabsContent>
          )}

          {permissions.canAccessSettings && (
            <TabsContent value="security" className="space-y-6">
              <SecurityOverview userRole={user.role} permissions={permissions} />
            </TabsContent>
          )}

          {(permissions.canAnalyze || permissions.canAccessSettings) && (
            <TabsContent value="data" className="space-y-6">
              <DataSummary userRole={user.role} permissions={permissions} />
            </TabsContent>
          )}
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
