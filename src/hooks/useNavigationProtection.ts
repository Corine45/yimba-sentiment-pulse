
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimpleAuth } from './useSimpleAuth';

export const useNavigationProtection = () => {
  const { user } = useSimpleAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fonction pour gérer l'événement popstate (bouton retour)
    const handlePopState = (event: PopStateEvent) => {
      if (!user) {
        // Si l'utilisateur n'est pas connecté, empêcher la navigation
        event.preventDefault();
        navigate('/auth', { replace: true });
        return;
      }
    };

    // Ajouter l'écouteur d'événement
    window.addEventListener('popstate', handlePopState);

    // Nettoyer l'écouteur lors du démontage
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [user, navigate]);

  // Fonction pour déconnexion sécurisée
  const secureLogout = () => {
    // Effacer l'historique de navigation
    window.history.replaceState(null, '', '/auth');
    
    // Naviguer vers la page d'authentification
    navigate('/auth', { replace: true });
  };

  return { secureLogout };
};
