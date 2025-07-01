
import { Users } from "lucide-react";
import { UserListItem } from "./UserListItem";
import type { User } from "@/types/user";

interface UsersListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onActivate: (userId: string) => void;
}

export const UsersList = ({ users, onEdit, onDelete, onActivate }: UsersListProps) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">
          Aucun utilisateur ne correspond aux filtres
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserListItem
          key={user.id}
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
          onActivate={onActivate}
        />
      ))}
    </div>
  );
};
