
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardHeader } from "./components/DashboardHeader";
import { WelcomeMessage } from "./components/WelcomeMessage";
import { DashboardTabs } from "./components/DashboardTabs";
import { AppSidebar } from "./components/AppSidebar";
import { getRolePermissions } from "./utils/dashboardUtils";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("search");

  const permissions = getRolePermissions(user.role);

  // Synchroniser l'onglet actif avec l'URL
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    } else {
      // Si pas d'onglet dans l'URL, rediriger vers search par défaut
      navigate('/dashboard/search', { replace: true });
    }
  }, [tab, navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          user={user}
          permissions={permissions}
        />
        
        <SidebarInset className="flex-1">
          <div className="min-h-screen bg-gray-50">
            <div className="flex items-center justify-between p-4 bg-white border-b">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold">Tableau de bord YIMBA</h1>
              </div>
              <DashboardHeader user={user} onLogout={onLogout} />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">
              <WelcomeMessage user={user} />
              
              <DashboardTabs 
                activeTab={activeTab}
                onTabChange={setActiveTab}
                user={user}
                permissions={permissions}
              />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
