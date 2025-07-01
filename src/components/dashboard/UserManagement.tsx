
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, RefreshCw, Loader2 } from "lucide-react";
import { useUsers, type User } from "@/hooks/useUsers";
import { UserStats } from "./user-management/UserStats";
import { UserDebugInfo } from "./user-management/UserDebugInfo";
import { UserFilters } from "./user-management/UserFilters";
import { AddUserDialog } from "./user-management/AddUserDialog";
import { EditUserDialog } from "./user-management/EditUserDialog";
import { UsersList } from "./user-management/UsersList";
import { RolePermissions } from "./user-management/RolePermissions";

export const UserManagement = () => {
  const { users, loading, addUser, updateUser, deleteUser, activateUser, getStats, refetch } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const stats = getStats();

  // Debug effect détaillé
  useEffect(() => {
    console.log('🔍 [UserManagement] Données des utilisateurs:', {
      count: users.length,
      users: users.map(u => ({ email: u.email, role: u.role, status: u.status })),
      stats
    });
  }, [users, stats]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUpdateUser = async (user: User) => {
    await updateUser(user.id, user);
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      await deleteUser(userId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement des utilisateurs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserDebugInfo users={users} stats={stats} />
      <UserStats stats={stats} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Gestion des utilisateurs</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={refetch}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <AddUserDialog onAddUser={addUser} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <UserFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          <UsersList
            users={filteredUsers}
            onEdit={setEditingUser}
            onDelete={handleDeleteUser}
            onActivate={activateUser}
          />
        </CardContent>
      </Card>

      <EditUserDialog
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onUpdate={handleUpdateUser}
        onUserChange={setEditingUser}
      />

      <RolePermissions />
    </div>
  );
};
