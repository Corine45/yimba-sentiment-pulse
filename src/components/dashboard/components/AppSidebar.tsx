import { Eye, Bell, TrendingUp, FileText, Users, Settings, Activity, User, BarChart3, RefreshCw } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { ActivityIndicator } from "@/components/ui/ActivityIndicator";
import { useSidebarData } from "@/hooks/useSidebarData";
import { useNavigate } from "react-router-dom";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  user: any;
  permissions: any;
}

export const AppSidebar = ({ activeTab, onTabChange, user, permissions }: AppSidebarProps) => {
  const navigate = useNavigate();
  const { sidebarData, loading, refetch } = useSidebarData();

  const getAvailableTabs = () => {
    const tabs = [];
    
    if (permissions.canSearch) {
      tabs.push({
        value: "search",
        label: "Recherche",
        icon: Eye,
        description: permissions.searchLevel === "advanced" ? "Recherches avancées" : "Recherches simples",
        indicator: sidebarData.activeSearches
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
        label: "Analyses",
        icon: TrendingUp,
        description: "Consultation des analyses de sentiments"
      });
    }
    
    tabs.push({
      value: "alerts",
      label: permissions.canManageAlerts ? "Alertes" : "Notifications",
      icon: Bell,
      description: permissions.canManageAlerts ? "Gestion des alertes" : "Réception des alertes",
      indicator: sidebarData.unreadAlerts
    });
    
    tabs.push({
      value: "reports",
      label: permissions.canGenerateReports ? "Rapports" : "Documents",
      icon: FileText,
      description: permissions.canGenerateReports ? "Génération de rapports" : "Consultation des documents et rapports",
      indicator: sidebarData.recentActivity.find(a => a.type === 'report')?.count || 0
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
        description: "Configuration de la plateforme",
        indicator: sidebarData.pendingTasks
      });
    }
    
    return tabs;
  };

  const availableTabs = getAvailableTabs();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <div>
              <h2 className="font-semibold text-lg">YIMBA</h2>
              <p className="text-xs text-gray-500">Tableau de bord</p>
            </div>
          </div>
          
          {/* Indicateur de notifications global */}
          {sidebarData.notifications > 0 && (
            <Badge className="bg-red-500 text-white h-5 w-5 p-0 flex items-center justify-center text-xs">
              {sidebarData.notifications > 99 ? '99+' : sidebarData.notifications}
            </Badge>
          )}
        </div>

        {/* Activité récente */}
        <div className="mt-3 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Activité récente</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={refetch}
              disabled={loading}
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="flex items-center justify-around">
            <ActivityIndicator type="search" count={sidebarData.activeSearches} variant="minimal" />
            <ActivityIndicator type="alert" count={sidebarData.unreadAlerts} variant="minimal" />
            <ActivityIndicator type="report" count={sidebarData.recentActivity.find(a => a.type === 'report')?.count || 0} variant="minimal" />
          </div>
          {sidebarData.recentActivity.some(a => a.count > 0) && (
            <div className="mt-2 text-xs text-gray-500">
              Dernière: {sidebarData.recentActivity.find(a => a.count > 0)?.lastUpdate || 'Aucune'}
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {availableTabs.map((tab) => (
                <SidebarMenuItem key={tab.value}>
                  <SidebarMenuButton 
                    onClick={() => onTabChange(tab.value)}
                    isActive={activeTab === tab.value}
                    tooltip={tab.description}
                    className="w-full justify-start"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <tab.icon className="w-4 h-4 mr-2" />
                        <span>{tab.label}</span>
                      </div>
                      {tab.indicator && tab.indicator > 0 && (
                        <Badge className="bg-red-500 text-white h-4 w-4 p-0 flex items-center justify-center text-xs ml-2">
                          {tab.indicator > 99 ? '99+' : tab.indicator}
                        </Badge>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Autres</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate('/status')}
                  className="w-full justify-start"
                  tooltip="Vue d'ensemble de la plateforme"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>État des lieux</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-3">
          <Separator />
          
          {/* Statut utilisateur */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Statut</span>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                sidebarData.userStatus === 'online' ? 'bg-green-50 text-green-700 border-green-200' :
                sidebarData.userStatus === 'busy' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                sidebarData.userStatus === 'away' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              {sidebarData.userStatus === 'online' ? 'En ligne' :
               sidebarData.userStatus === 'busy' ? 'Occupé' :
               sidebarData.userStatus === 'away' ? 'Absent' : 'Hors ligne'}
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="w-full justify-start"
          >
            <User className="w-4 h-4 mr-2" />
            Mon Profil
          </Button>
          
          <div className="flex items-center space-x-3">
            <UserAvatar 
              user={user} 
              status={sidebarData.userStatus}
              size="md"
              showStatus={true}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {user.role}
                </Badge>
                {sidebarData.notifications > 0 && (
                  <ActivityIndicator type="activity" count={sidebarData.notifications} variant="minimal" />
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
