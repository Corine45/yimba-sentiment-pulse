
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
      console.log('📧 Emails dans profiles:', profiles?.map(p => p.email) || []);
      console.log('❌ Erreur profiles:', profilesError);

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
      console.log('🔑 Détails des rôles:', userRoles);
      
      if (rolesError) {
        console.error('Erreur lors de la récupération des rôles:', rolesError);
      }

      // Récupérer les informations d'authentification pour le statut de vérification d'email
      const { data: authResponse, error: authError } = await supabase.auth.admin.listUsers();
      const authUsers: AuthUser[] = authResponse?.users || [];
      
      console.log('🔐 Utilisateurs auth récupérés:', authUsers.length);
      if (authError) {
        console.error('Erreur lors de la récupération des utilisateurs auth:', authError);
      }

      // Combiner les données des profils avec les informations d'authentification
      const usersWithEmailStatus = profiles.map(profile => {
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
        
        // Trouver les informations d'authentification pour cet utilisateur
        const authUser = authUsers.find(u => u.id === profile.id);
        const emailConfirmed = authUser?.email_confirmed_at !== null;
        
        console.log(`📧 Utilisateur ${profile.email}: email confirmé = ${emailConfirmed}`);
        
        return {
          id: profile.id,
          name: profile.name || 'Utilisateur sans nom',
          email: profile.email,
          role: finalRole,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          status: emailConfirmed ? 'active' as const : 'inactive' as const,
          last_login: authUser?.last_sign_in_at || undefined,
          email_confirmed: emailConfirmed,
          email_confirmed_at: authUser?.email_confirmed_at || null
        };
      });

      console.log('✅ Utilisateurs finaux avec statut email:', usersWithEmailStatus.length);
      console.log('📊 Utilisateurs détaillés:', usersWithEmailStatus);
      
      return usersWithEmailStatus;
    } catch (error) {
      console.error('💥 Erreur générale dans fetchUsers:', error);
      throw error;
    }
  }
};
