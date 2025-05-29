
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useHealthUsers } from "./hooks/useHealthUsers";
import { UserRoleStats } from "./components/UserRoleStats";
import { AddUserDialog } from "./components/AddUserDialog";
import { EditUserDialog } from "./components/EditUserDialog";
import { UsersList } from "./components/UsersList";
import { HealthUser } from "./types/healthUser";

export const HealthUserManagement = () => {
  const { users, addUser, updateUser, deleteUser } = useHealthUsers();
  const [selectedUser, setSelectedUser] = useState<HealthUser | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);

  const handleEditUser = (user: HealthUser) => {
    setSelectedUser(user);
    setIsEditingUser(true);
  };

  const handleCloseEdit = () => {
    setIsEditingUser(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = (user: HealthUser) => {
    updateUser(user);
    handleCloseEdit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-600" />
            Gestion des utilisateurs du module
          </span>
          <AddUserDialog onAddUser={addUser} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <UserRoleStats users={users} />
        <UsersList 
          users={users} 
          onEditUser={handleEditUser} 
          onDeleteUser={deleteUser} 
        />
        <EditUserDialog
          user={selectedUser}
          isOpen={isEditingUser}
          onClose={handleCloseEdit}
          onUpdateUser={handleUpdateUser}
          onUserChange={setSelectedUser}
        />
      </CardContent>
    </Card>
  );
};
