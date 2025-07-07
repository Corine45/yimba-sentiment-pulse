
import { useSimpleAuth } from "@/hooks/useSimpleAuth";
import { Dashboard as DashboardComponent } from "@/components/dashboard/Dashboard";
import { useNavigationProtection } from "@/hooks/useNavigationProtection";

const Dashboard = () => {
  const { user, profile, loading } = useSimpleAuth();
  const { secureLogout } = useNavigationProtection();

  console.log('📊 Dashboard Simple:', { 
    user: user?.email, 
    profile: profile?.role, 
    loading,
    hasUser: !!user,
    hasProfile: !!profile
  });

  if (loading) {
    console.log('⏳ Dashboard loading...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-muted-foreground">Chargement...</span>
      </div>
    );
  }

  if (!user || !profile) {
    console.log('❌ Dashboard: Redirection vers auth');
    window.location.href = '/auth';
    return null;
  }

  console.log('✅ Dashboard: Rendu du composant principal');
  return (
    <DashboardComponent 
      user={profile} 
      onLogout={secureLogout} 
    />
  );
};

export default Dashboard;
