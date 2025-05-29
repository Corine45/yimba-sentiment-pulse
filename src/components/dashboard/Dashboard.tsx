
import { useState } from "react";
import { DashboardHeader } from "./components/DashboardHeader";
import { WelcomeMessage } from "./components/WelcomeMessage";
import { DashboardTabs } from "./components/DashboardTabs";
import { getRolePermissions } from "./utils/dashboardUtils";

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("search");

  const permissions = getRolePermissions(user.role);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} onLogout={onLogout} />

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
  );
};
