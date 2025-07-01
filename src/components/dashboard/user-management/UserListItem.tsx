
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, UserCheck } from "lucide-react";
import type { User } from "@/types/user";

interface UserListItemProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onActivate: (userId: string) => void;
}

export const UserListItem = ({ user, onEdit, onDelete, onActivate }: UserListItemProps) => {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800">Administrateur</Badge>;
      case "analyste":
        return <Badge className="bg-blue-100 text-blue-800">Analyste</Badge>;
      case "observateur":
        return <Badge className="bg-gray-100 text-gray-800">Observateur</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">Actif</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>
    );
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-medium">
          {user.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h4 className="font-medium">{user.name}</h4>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-xs text-gray-500">
            Créé le {new Date(user.created_at).toLocaleDateString('fr-FR')} - ID: {user.id.slice(0, 8)}...
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="flex space-x-2 mb-1">
            {getRoleBadge(user.role)}
            {getStatusBadge(user.status)}
          </div>
          <p className="text-xs text-gray-500">
            Dernière connexion: {user.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : 'Jamais connecté'}
          </p>
        </div>
        <div className="flex space-x-2">
          {user.status === 'inactive' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-green-600 hover:text-green-700"
              onClick={() => onActivate(user.id)}
            >
              <UserCheck className="w-4 h-4" />
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => onDelete(user.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
