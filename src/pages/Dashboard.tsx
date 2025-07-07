
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Dashboard as DashboardComponent } from "@/components/dashboard/Dashboard";
import { useNavigationProtection } from "@/hooks/useNavigationProtection";

const Dashboard = () => {
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  const { secureLogout } = useNavigationProtection();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <DashboardComponent 
      user={profile} 
      onLogout={secureLogout} 
    />
  );
};

export default Dashboard;
