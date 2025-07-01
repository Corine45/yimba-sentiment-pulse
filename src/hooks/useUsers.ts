
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/services/userService';
import { calculateUserStats } from '@/utils/userUtils';
import type { User, NewUser, UserStats } from '@/types/user';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await userService.fetchUsers();
      setUsers(fetchedUsers);
    } catch (error: any) {
      console.error('💥 Erreur générale dans fetchUsers:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les utilisateurs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (newUser: NewUser) => {
    try {
      const success = await userService.addUser(newUser);
      if (success) {
        toast({
          title: "Utilisateur ajouté",
          description: `${newUser.name} a été ajouté avec succès`,
        });
        await fetchUsers(); // Rafraîchir la liste
      }
      return success;
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
      await userService.updateUser(userId, updates);
      toast({
        title: "Utilisateur mis à jour",
        description: "Les informations ont été sauvegardées",
      });
      await fetchUsers(); // Rafraîchir la liste
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
      await userService.deleteUser(userId);
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès",
      });
      await fetchUsers(); // Rafraîchir la liste
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'utilisateur",
        variant: "destructive"
      });
    }
  };

  const activateUser = async (userId: string) => {
    try {
      await userService.activateUser(userId);
      toast({
        title: "Utilisateur activé",
        description: "L'utilisateur a été activé avec succès",
      });
      await fetchUsers();
    } catch (error: any) {
      console.error('Error activating user:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'activer l'utilisateur",
        variant: "destructive"
      });
    }
  };

  const getStats = (): UserStats => calculateUserStats(users);

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
    activateUser,
    getStats,
    refetch: fetchUsers
  };
};

// Re-export types for convenience
export type { User, NewUser, UserStats };
