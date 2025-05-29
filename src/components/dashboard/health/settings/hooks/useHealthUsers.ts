
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { HealthUser, NewUserForm } from "../types/healthUser";

export const useHealthUsers = () => {
  const { toast } = useToast();
  
  const [users, setUsers] = useState<HealthUser[]>([
    {
      id: "1",
      name: "Dr. Marie Dubois",
      email: "marie.dubois@sante.gouv.fr",
      role: "admin_sante",
      lastLogin: "2024-01-15 14:30",
      status: "active",
      createdAt: "2024-01-01"
    },
    {
      id: "2",
      name: "Jean Martin",
      email: "jean.martin@sante.gouv.fr",
      role: "analyste_sanitaire",
      lastLogin: "2024-01-15 09:15",
      status: "active",
      createdAt: "2024-01-05"
    },
    {
      id: "3",
      name: "Sophie Laurent",
      email: "sophie.laurent@chu-lyon.fr",
      role: "analyste_sanitaire",
      lastLogin: "2024-01-14 16:45",
      status: "active",
      createdAt: "2024-01-08"
    },
    {
      id: "4",
      name: "Pierre Moreau",
      email: "pierre.moreau@pasteur.fr",
      role: "observateur_partenaire",
      lastLogin: "2024-01-12 11:20",
      status: "active",
      createdAt: "2024-01-10"
    },
    {
      id: "5",
      name: "Dr. Claire Rousseau",
      email: "claire.rousseau@formation-sante.fr",
      role: "formateur_accompagnateur",
      lastLogin: "2024-01-13 08:30",
      status: "active",
      createdAt: "2024-01-12"
    }
  ]);

  const addUser = (newUser: NewUserForm) => {
    if (!newUser.name || !newUser.email) return false;
    
    const user: HealthUser = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "pending",
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setUsers(prev => [...prev, user]);
    
    toast({
      title: "Utilisateur ajouté",
      description: "L'invitation a été envoyée à l'utilisateur.",
    });
    
    return true;
  };

  const updateUser = (updatedUser: HealthUser) => {
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    
    toast({
      title: "Utilisateur mis à jour",
      description: "Les informations ont été sauvegardées.",
    });
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    toast({
      title: "Utilisateur supprimé",
      description: "L'accès au module a été révoqué.",
    });
  };

  return {
    users,
    addUser,
    updateUser,
    deleteUser
  };
};
