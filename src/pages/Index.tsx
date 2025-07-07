
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
    if (!loading && !profileLoading) {
      if (!user || !profile) {
        console.log('Utilisateur non connecté, redirection vers /auth');
        navigate('/auth', { replace: true });
      } else {
        // Si l'utilisateur est connecté et qu'on est sur /login, rediriger vers /dashboard
        if (window.location.pathname === '/login') {
          console.log('Redirection de /login vers /dashboard');
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
