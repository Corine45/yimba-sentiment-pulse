
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Mail } from "lucide-react";
import { getHealthRoleLabel, getHealthRoleBadgeColor } from "../../../utils/healthPermissions";
import { HealthUser } from "../types/healthUser";

interface UsersListProps {
  users: HealthUser[];
  onEditUser: (user: HealthUser) => void;
  onDeleteUser: (id: string) => void;
}

export const UsersList = ({ users, onEditUser, onDeleteUser }: UsersListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Utilisateurs actifs ({users.length})</h4>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-2" />
            Inviter en masse
          </Button>
          <Button variant="outline" size="sm">
            Exporter la liste
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 font-medium text-sm border-b">
          <div>Utilisateur</div>
          <div>Rôle</div>
          <div>Statut</div>
          <div>Dernière connexion</div>
          <div>Membre depuis</div>
          <div>Actions</div>
        </div>
        {users.map((user) => (
          <div key={user.id} className="grid grid-cols-6 gap-4 p-4 border-b items-center">
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-600">{user.email}</div>
            </div>
            <div>
              <Badge className={getHealthRoleBadgeColor(user.role)}>
                {getHealthRoleLabel(user.role)}
              </Badge>
            </div>
            <div>
              <Badge className={getStatusColor(user.status)}>
                {user.status === "active" ? "Actif" : user.status === "pending" ? "En attente" : "Inactif"}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              {user.lastLogin || "Jamais connecté"}
            </div>
            <div className="text-sm text-gray-600">
              {user.createdAt}
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={() => onEditUser(user)}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDeleteUser(user.id)}>
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
