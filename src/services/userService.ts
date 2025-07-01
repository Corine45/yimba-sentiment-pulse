
import { supabase } from '@/integrations/supabase/client';
import type { User, NewUser } from '@/types/user';

// Type pour les utilisateurs d'authentification Supabase
interface AuthUser {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
  last_sign_in_at?: string | null;
  user_metadata?: any;
  app_metadata?: any;
}

export const userService = {
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
  },

  async addUser(newUser: NewUser): Promise<boolean> {
    console.log('Adding new user:', newUser);
    
    // Créer un utilisateur via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: newUser.email,
      password: 'TempPassword123!', // Password temporaire
      email_confirm: true, // Confirmer l'email automatiquement
      user_metadata: {
        name: newUser.name
      }
    });

    console.log('Auth creation result:', authData, authError);

    if (authError) {
      throw authError;
    }

    if (authData.user) {
      // Créer le profil utilisateur
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ 
          id: authData.user.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        });

      console.log('Profile creation error:', profileError);

      if (profileError) {
        throw profileError;
      }

      // Créer le rôle utilisateur
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: authData.user.id,
          role: newUser.role 
        });

      console.log('Role creation error:', roleError);
      if (roleError) {
        console.error('Error creating user role:', roleError);
      }

      return true;
    }
    
    return false;
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    console.log('Updating user:', userId, updates);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        name: updates.name,
        email: updates.email,
        role: updates.role,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    console.log('Profile update error:', error);

    if (error) {
      throw error;
    }

    // Mettre à jour aussi les rôles utilisateur si le rôle a changé
    if (updates.role) {
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId,
          role: updates.role 
        });

      console.log('Role update error:', roleError);
      if (roleError) {
        console.error('Error updating user role:', roleError);
      }
    }
  },

  async deleteUser(userId: string): Promise<void> {
    console.log('Deleting user:', userId);
    
    // Supprimer d'abord les données liées
    await supabase.from('user_roles').delete().eq('user_id', userId);
    await supabase.from('user_sessions').delete().eq('user_id', userId);
    
    // Puis supprimer le profil
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    console.log('Profile delete error:', error);

    if (error) {
      throw error;
    }

    // Optionnel : supprimer aussi de auth.users (nécessite permissions admin)
    try {
      await supabase.auth.admin.deleteUser(userId);
    } catch (authError) {
      console.warn('Could not delete from auth.users:', authError);
    }
  },

  async activateUser(userId: string): Promise<void> {
    // Créer une session active pour l'utilisateur
    const { error } = await supabase
      .from('user_sessions')
      .upsert({
        user_id: userId,
        session_start: new Date().toISOString(),
        is_active: true
      });

    if (error) {
      throw error;
    }
  },

  async confirmUserEmail(userId: string): Promise<void> {
    console.log('✅ Confirmation de l\'email pour l\'utilisateur:', userId);
    
    try {
      // Utiliser l'API Admin pour confirmer l'email
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        email_confirm: true
      });

      if (error) {
        throw error;
      }
      
      console.log('✅ Email confirmé avec succès pour:', userId);
    } catch (error) {
      console.error('❌ Erreur lors de la confirmation d\'email:', error);
      throw error;
    }
  },

  async resendConfirmationEmail(email: string): Promise<void> {
    console.log('📧 Renvoi de l\'email de confirmation pour:', email);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        throw error;
      }
      
      console.log('📧 Email de confirmation renvoyé avec succès pour:', email);
    } catch (error) {
      console.error('❌ Erreur lors du renvoi de l\'email:', error);
      throw error;
    }
  }
};
