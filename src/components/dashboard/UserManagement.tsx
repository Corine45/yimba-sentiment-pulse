
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, Plus, Edit, Trash2, Search, Loader2, RefreshCw, AlertTriangle, CheckCircle, UserCheck } from "lucide-react";
import { useUsers, type User, type NewUser } from "@/hooks/useUsers";

export const UserManagement = () => {
  const { users, loading, addUser, updateUser, deleteUser, activateUser, getStats, refetch } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    role: "observateur"
  });

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

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    const success = await addUser(newUser);
    if (success) {
      setNewUser({ name: "", email: "", role: "observateur" });
      setIsAddDialogOpen(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    await updateUser(editingUser.id, editingUser);
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      await deleteUser(userId);
    }
  };

  const handleActivateUser = async (userId: string) => {
    await activateUser(userId);
  };

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
      {/* Debug info détaillé */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <h4 className="font-medium text-yellow-800">Informations de debug</h4>
        </div>
        <div className="text-sm text-yellow-700 space-y-1">
          <p>📊 Utilisateurs chargés depuis Supabase: <strong>{users.length}</strong></p>
          <p>📧 Emails trouvés: <strong>{users.map(u => u.email).join(', ') || 'Aucun'}</strong></p>
          <p>🔑 Rôles: {users.map(u => `${u.email} (${u.role})`).join(', ') || 'Aucun'}</p>
          <p>📈 Stats: Total: {stats.total}, Actifs: {stats.active}, Admin: {stats.admins}, Analystes: {stats.analysts}</p>
          {users.length === 0 && (
            <p className="text-red-600 font-medium">⚠️ Aucun utilisateur trouvé - Vérifiez les tables 'profiles' et 'user_roles' dans Supabase</p>
          )}
          {users.length > 0 && users.length < 5 && (
            <p className="text-orange-600 font-medium">⚠️ Nombre d'utilisateurs faible - Certains utilisateurs pourraient manquer dans la table 'profiles'</p>
          )}
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-800">Utilisateurs totaux</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-green-800">Actifs</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
            <div className="text-sm text-red-800">Admin</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.analysts}</div>
            <div className="text-sm text-blue-800">Analystes</div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
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
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvel utilisateur
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un utilisateur</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Jean Dupont"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Ex: jean.dupont@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Rôle</Label>
                      <Select value={newUser.role} onValueChange={(value: any) => setNewUser(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrateur</SelectItem>
                          <SelectItem value="analyste">Analyste</SelectItem>
                          <SelectItem value="observateur">Observateur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleAddUser}>
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un utilisateur..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="analyste">Analyste</SelectItem>
                  <SelectItem value="observateur">Observateur</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Users Table */}
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {users.length === 0 ? "Aucun utilisateur trouvé dans la base de données" : "Aucun utilisateur ne correspond aux filtres"}
                </p>
                {users.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Vérifiez votre connexion Supabase et les données dans la table 'profiles'
                  </p>
                )}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
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
                          onClick={() => handleActivateUser(user.id)}
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                      )}
                      <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => !open && setEditingUser(null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Modifier l'utilisateur</DialogTitle>
                          </DialogHeader>
                          {editingUser && (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="editName">Nom complet</Label>
                                <Input
                                  id="editName"
                                  value={editingUser.name}
                                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="editEmail">Email</Label>
                                <Input
                                  id="editEmail"
                                  value={editingUser.email}
                                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="editRole">Rôle</Label>
                                <Select value={editingUser.role} onValueChange={(value: any) => setEditingUser({ ...editingUser, role: value })}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="admin">Administrateur</SelectItem>
                                    <SelectItem value="analyste">Analyste</SelectItem>
                                    <SelectItem value="observateur">Observateur</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setEditingUser(null)}>
                                  Annuler
                                </Button>
                                <Button onClick={handleUpdateUser}>
                                  Sauvegarder
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions par rôle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-red-600">Administrateur</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Gestion complète des utilisateurs</li>
                <li>• Accès à tous les rapports</li>
                <li>• Configuration de la plateforme</li>
                <li>• Gestion des alertes critiques</li>
                <li>• Export de données</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-blue-600">Analyste</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Création de recherches avancées</li>
                <li>• Génération de rapports</li>
                <li>• Analyse des sentiments</li>
                <li>• Gestion des alertes</li>
                <li>• Export limité</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-600">Observateur</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Consultation des rapports</li>
                <li>• Vue des tableaux de bord</li>
                <li>• Recherches simples</li>
                <li>• Réception d'alertes</li>
                <li>• Pas d'export</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
