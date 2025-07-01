
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

      // Récupération des informations d'authentification avec service_role
      let authUsers: AuthUser[] = [];
      
      try {
        const { data: authResponse, error: authError } = await supabase.auth.admin.listUsers();
        if (authError) {
          console.error('❌ Erreur lors de la récupération des données auth:', authError);
          throw new Error('Impossible de récupérer les données auth: ' + authError.message);
        } else {
          authUsers = authResponse?.users || [];
          console.log('🔐 Utilisateurs auth récupérés:', authUsers.length);
        }
      } catch (authError) {
        console.error('❌ Erreur lors de la récupération des données auth:', authError);
        throw new Error('Impossible de récupérer les données auth: ' + authError);
      }

      // Combiner les données des profils avec les informations d'authentification
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
        
        // Déterminer le statut basé sur les données auth réelles
        let status: 'active' | 'inactive' = 'inactive';
        let emailConfirmed = false;
        let emailConfirmedAt: string | null = null;
        let lastLogin: string | undefined = undefined;
        
        if (authUser) {
          // Utiliser les vraies données d'authentification
          emailConfirmed = authUser.email_confirmed_at !== null && authUser.email_confirmed_at !== undefined;
          emailConfirmedAt = authUser.email_confirmed_at;
          lastLogin = authUser.last_sign_in_at || undefined;
          
          // Utilisateur actif si email confirmé ET (session active OU connexion récente)
          const hasRecentActivity = activeSession || 
            (lastLogin && new Date(lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // 30 jours
          
          status = emailConfirmed && hasRecentActivity ? 'active' : 'inactive';
        } else {
          // Si on ne trouve pas l'utilisateur dans les données auth, utiliser les sessions
          emailConfirmed = false;
          emailConfirmedAt = null;
          lastLogin = lastSession?.session_start;
          status = 'inactive';
          
          console.warn(`⚠️ Utilisateur ${profile.email}: Non trouvé dans les données auth`);
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
