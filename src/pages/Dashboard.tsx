
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Dashboard as DashboardComponent } from "@/components/dashboard/Dashboard";
import { useNavigationProtection } from "@/hooks/useNavigationProtection";

const Dashboard = () => {
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  const { secureLogout } = useNavigationProtection();

  console.log('📊 Dashboard Page:', { 
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
        <span className="ml-3 text-muted-foreground">Chargement du profil...</span>
      </div>
    );
  }

  if (!user || !profile) {
    console.log('❌ Dashboard: Pas d\'utilisateur ou profil');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Erreur: Utilisateur ou profil non trouvé</div>
      </div>
    );
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
