
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { getRolePermissions } from "@/components/dashboard/utils/dashboardUtils";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'analyste' | 'observateur';
  requiredPermission?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requiredPermission 
}: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authLoading && !profileLoading) {
      // Si pas d'utilisateur connecté, rediriger vers auth
      if (!user || !profile) {
        navigate('/auth', { 
          replace: true, 
          state: { from: location.pathname } 
        });
        return;
      }

      // Vérifier le rôle requis
      if (requiredRole) {
        const roleHierarchy = {
          'observateur': 1,
          'analyste': 2,
          'admin': 3
        };

        const userRoleLevel = roleHierarchy[profile.role as keyof typeof roleHierarchy] || 0;
        const requiredRoleLevel = roleHierarchy[requiredRole];

        if (userRoleLevel < requiredRoleLevel) {
          navigate('/', { replace: true });
          return;
        }
      }

      // Vérifier les permissions spécifiques
      if (requiredPermission) {
        const permissions = getRolePermissions(profile.role);
        const hasPermission = permissions[requiredPermission as keyof typeof permissions];

        if (!hasPermission) {
          navigate('/', { replace: true });
          return;
        }
      }
    }
  }, [user, profile, authLoading, profileLoading, navigate, location.pathname, requiredRole, requiredPermission]);

  // Afficher un loader pendant la vérification
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Afficher le contenu si autorisé
  if (user && profile) {
    return <>{children}</>;
  }

  // Ne rien afficher pendant la redirection
  return null;
};
