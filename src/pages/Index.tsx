
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { useProfile } from "@/hooks/useProfile";
import { useNavigationProtection } from "@/hooks/useNavigationProtection";

const Index = () => {
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { secureLogout } = useNavigationProtection();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('📍 Page Index - Vérification auth:', { 
      loading, 
      profileLoading, 
      user: user?.email, 
      profile: profile?.role 
    });
    
    if (!loading && !profileLoading) {
      if (!user || !profile) {
        console.log('🔄 Redirection vers /auth - utilisateur non connecté');
        navigate('/auth', { replace: true });
      } else {
        console.log('✅ Utilisateur connecté, affichage dashboard');
        // Si l'utilisateur est connecté et qu'on est sur /login, rediriger vers /dashboard
        if (window.location.pathname === '/login') {
          console.log('🔄 Redirection de /login vers /dashboard');
          navigate('/dashboard', { replace: true });
        }
      }
    }
  }, [user, profile, loading, profileLoading, navigate]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  console.log('Utilisateur connecté:', user.email, 'Profil:', profile.role);

  return (
    <Dashboard 
      user={profile} 
      onLogout={secureLogout} 
    />
  );
};

export default Index;
