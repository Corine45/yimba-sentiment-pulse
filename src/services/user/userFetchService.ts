
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/types/user';
import type { AuthUser } from '../types/userServiceTypes';

export const userFetchService = {
  async fetchUsers(): Promise<User[]> {
    console.log('🔍 Début de la récupération des utilisateurs...');
    
    try {
      // Récupérer tous les profils utilisateurs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('📊 Profils récupérés:', profiles?.length || 0);

      if (profilesError) {
        console.error('Erreur lors de la récupération des profils:', profilesError);
        throw new Error("Impossible de charger les profils utilisateurs: " + profilesError.message);
      }

      if (!profiles || profiles.length === 0) {
        console.warn('⚠️ Aucun profil trouvé - Vérifiez les politiques RLS');
        return [];
      }

      // Récupérer les rôles utilisateurs
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      console.log('🔑 Rôles récupérés:', userRoles?.length || 0);
      
      if (rolesError) {
        console.error('Erreur lors de la récupération des rôles:', rolesError);
      }

      // Récupérer les sessions utilisateurs pour déterminer l'activité
      const { data: userSessions, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('user_id, session_start, session_end, is_active, updated_at')
        .order('updated_at', { ascending: false });

      console.log('📱 Sessions récupérées:', userSessions?.length || 0);
      
      if (sessionsError) {
        console.error('Erreur lors de la récupération des sessions:', sessionsError);
      }

      // Tentative de récupération des informations d'authentification (peut échouer si pas admin)
      let authUsers: AuthUser[] = [];
      try {
        const { data: authResponse, error: authError } = await supabase.auth.admin.listUsers();
        authUsers = authResponse?.users || [];
        console.log('🔐 Utilisateurs auth récupérés:', authUsers.length);
        
        if (authError) {
          console.error('Erreur lors de la récupération des utilisateurs auth:', authError);
        }
      } catch (authError) {
        console.warn('⚠️ Impossible de récupérer les données auth (permissions insuffisantes):', authError);
        // Continuer sans les données auth
      }

      // Combiner les données des profils avec les informations disponibles
      const usersWithStatus = profiles.map(profile => {
        // Trouver le rôle de l'utilisateur dans user_roles
        const userRoleEntries = userRoles?.filter(r => r.user_id === profile.id) || [];
        let finalRole = profile.role; // Rôle par défaut du profil
        
        // Si l'utilisateur a des rôles dans user_roles, prendre le plus élevé
        if (userRoleEntries.length > 0) {
          const roleHierarchy = { 'admin': 3, 'analyste': 2, 'observateur': 1 };
          const highestRole = userRoleEntries.reduce((highest, current) => {
            return (roleHierarchy[current.role as keyof typeof roleHierarchy] || 0) > 
                   (roleHierarchy[highest.role as keyof typeof roleHierarchy] || 0) ? current : highest;
          });
          finalRole = highestRole.role;
        }
        
        // Trouver les sessions de l'utilisateur
        const userSessionsList = userSessions?.filter(s => s.user_id === profile.id) || [];
        const activeSession = userSessionsList.find(s => s.is_active);
        const lastSession = userSessionsList[0]; // La plus récente
        
        // Trouver les informations d'authentification pour cet utilisateur
        const authUser = authUsers.find(u => u.id === profile.id);
        
        // Déterminer le statut basé sur plusieurs critères
        let status: 'active' | 'inactive' = 'inactive';
        let emailConfirmed = false;
        let emailConfirmedAt: string | null = null;
        let lastLogin: string | undefined = undefined;
        
        if (authUser) {
          // Si on a les données auth, les utiliser
          emailConfirmed = authUser.email_confirmed_at !== null;
          emailConfirmedAt = authUser.email_confirmed_at;
          lastLogin = authUser.last_sign_in_at || undefined;
          
          // Utilisateur actif si email confirmé ET (session active OU connexion récente)
          const hasRecentActivity = activeSession || 
            (lastLogin && new Date(lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // 30 jours
          
          status = emailConfirmed && hasRecentActivity ? 'active' : 'inactive';
        } else {
          // Fallback sans données auth : utiliser les sessions et une heuristique
          // Considérer comme confirmé si l'utilisateur a des sessions (il a pu se connecter)
          emailConfirmed = userSessionsList.length > 0;
          emailConfirmedAt = userSessionsList.length > 0 ? (lastSession?.session_start || null) : null;
          lastLogin = lastSession?.session_start;
          
          // Utilisateur actif s'il a une session active ou récente
          const hasActiveSession = activeSession;
          const hasRecentSession = lastSession && 
            new Date(lastSession.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 jours
          
          status = hasActiveSession || hasRecentSession ? 'active' : 'inactive';
        }
        
        console.log(`📧 Utilisateur ${profile.email}: email confirmé = ${emailConfirmed}, status = ${status}`);
        
        return {
          id: profile.id,
          name: profile.name || 'Utilisateur sans nom',
          email: profile.email,
          role: finalRole,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          status,
          last_login: lastLogin,
          email_confirmed: emailConfirmed,
          email_confirmed_at: emailConfirmedAt
        };
      });

      console.log('✅ Utilisateurs finaux avec statut email:', usersWithStatus.length);
      console.log('📊 Répartition des statuts:', {
        actifs: usersWithStatus.filter(u => u.status === 'active').length,
        inactifs: usersWithStatus.filter(u => u.status === 'inactive').length,
        emailsConfirmes: usersWithStatus.filter(u => u.email_confirmed).length,
        emailsNonConfirmes: usersWithStatus.filter(u => !u.email_confirmed).length
      });
      
      return usersWithStatus;
    } catch (error) {
      console.error('💥 Erreur générale dans fetchUsers:', error);
      throw error;
    }
  }
};
