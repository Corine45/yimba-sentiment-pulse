
import { Eye, Bell, TrendingUp, FileText, Users, Settings, Activity, User, BarChart3 } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  user: any;
  permissions: any;
}

export const AppSidebar = ({ activeTab, onTabChange, user, permissions }: AppSidebarProps) => {
  const navigate = useNavigate();

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

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Y</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg">YIMBA</h2>
            <p className="text-xs text-gray-500">Tableau de bord</p>
          </div>
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
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
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
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <Badge variant="outline" className="text-xs">
                {user.role}
              </Badge>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
