
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyste' | 'observateur';
  created_at: string;
  updated_at: string;
  last_login?: string;
  status: 'active' | 'inactive';
}

export interface NewUser {
  name: string;
  email: string;
  role: 'admin' | 'analyste' | 'observateur';
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Récupérer les profils avec leurs rôles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          role,
          created_at,
          updated_at
        `);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      // Récupérer les sessions utilisateurs pour le statut et dernière connexion
      const { data: sessions, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('user_id, session_start, is_active')
        .order('session_start', { ascending: false });

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
      }

      // Combiner les données
      const usersWithStatus = profiles?.map(profile => {
        const userSessions = sessions?.filter(s => s.user_id === profile.id) || [];
        const latestSession = userSessions[0];
        const hasActiveSession = userSessions.some(s => s.is_active);
        
        return {
          ...profile,
          status: hasActiveSession ? 'active' as const : 'inactive' as const,
          last_login: latestSession?.session_start || undefined
        };
      }) || [];

      setUsers(usersWithStatus);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (newUser: NewUser) => {
    try {
      // Créer un utilisateur via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: 'TempPassword123!', // Password temporaire
        options: {
          data: {
            name: newUser.name
          }
        }
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // Mettre à jour le profil avec le rôle spécifique
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: newUser.role })
          .eq('id', authData.user.id);

        if (profileError) {
          throw profileError;
        }

        // Mettre à jour les rôles utilisateur
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role: newUser.role })
          .eq('user_id', authData.user.id);

        if (roleError) {
          console.error('Error updating user role:', roleError);
        }

        toast({
          title: "Utilisateur ajouté",
          description: `${newUser.name} a été ajouté avec succès`,
        });

        fetchUsers(); // Rafraîchir la liste
        return true;
      }
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter l'utilisateur",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          email: updates.email,
          role: updates.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      // Mettre à jour aussi les rôles utilisateur si le rôle a changé
      if (updates.role) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role: updates.role })
          .eq('user_id', userId);

        if (roleError) {
          console.error('Error updating user role:', roleError);
        }
      }

      toast({
        title: "Utilisateur mis à jour",
        description: "Les informations ont été sauvegardées",
      });

      fetchUsers(); // Rafraîchir la liste
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour l'utilisateur",
        variant: "destructive"
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Supprimer d'abord les données liées
      await supabase.from('user_roles').delete().eq('user_id', userId);
      await supabase.from('user_sessions').delete().eq('user_id', userId);
      
      // Puis supprimer le profil
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        throw error;
      }

      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès",
      });

      fetchUsers(); // Rafraîchir la liste
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'utilisateur",
        variant: "destructive"
      });
    }
  };

  const getStats = () => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const admins = users.filter(u => u.role === 'admin').length;
    const analysts = users.filter(u => u.role === 'analyste').length;

    return { total, active, admins, analysts };
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
    getStats,
    refetch: fetchUsers
  };
};
