
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { getRoleBadgeColor, getRoleLabel } from "../utils/dashboardUtils";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  user: any;
  onLogout: () => void;
}

export const DashboardHeader = ({ user, onLogout }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
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
            <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
              <User className="w-4 h-4 mr-2" />
              Profil
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
