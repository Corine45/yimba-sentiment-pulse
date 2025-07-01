import { supabase } from '@/integrations/supabase/client';
import type { User, NewUser } from '@/types/user';

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

      // Récupérer les sessions utilisateurs pour déterminer le statut
      const { data: sessions, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('user_id, session_start, session_end, is_active')
        .order('session_start', { ascending: false });

      console.log('🔄 Sessions récupérées:', sessions?.length || 0);
      if (sessionsError) {
        console.error('Erreur lors de la récupération des sessions:', sessionsError);
      }

      // Combiner les données des profils avec les informations de session et rôles
      const usersWithStatus = profiles.map(profile => {
        // Trouver le rôle de l'utilisateur dans user_roles (prendre le plus récent ou le plus élevé)
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
        
        const userSessions = sessions?.filter(s => s.user_id === profile.id) || [];
        const latestSession = userSessions[0];
        const hasActiveSession = userSessions.some(s => s.is_active);
        
        return {
          id: profile.id,
          name: profile.name || 'Utilisateur sans nom',
          email: profile.email,
          role: finalRole,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          status: hasActiveSession ? 'active' as const : 'inactive' as const,
          last_login: latestSession?.session_start || undefined
        };
      });

      console.log('✅ Utilisateurs finaux avec statut:', usersWithStatus.length);
      console.log('📊 Utilisateurs détaillés:', usersWithStatus);
      
      return usersWithStatus;
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
  }
};
