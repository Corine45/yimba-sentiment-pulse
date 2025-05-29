
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Edit2, Trash2, UserCheck, Mail, Calendar, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { HealthRole, getHealthRoleLabel, getHealthRoleBadgeColor } from "../../utils/healthPermissions";

interface HealthUser {
  id: string;
  name: string;
  email: string;
  role: HealthRole;
  lastLogin?: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
}

export const HealthUserManagement = () => {
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

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "observateur_partenaire" as HealthRole
  });
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<HealthUser | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    
    const user: HealthUser = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "pending",
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setUsers(prev => [...prev, user]);
    setNewUser({ name: "", email: "", role: "observateur_partenaire" });
    setIsAddingUser(false);
    
    toast({
      title: "Utilisateur ajouté",
      description: "L'invitation a été envoyée à l'utilisateur.",
    });
  };

  const handleEditUser = (user: HealthUser) => {
    setSelectedUser(user);
    setIsEditingUser(true);
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;
    
    setUsers(prev => prev.map(user => 
      user.id === selectedUser.id ? selectedUser : user
    ));
    setIsEditingUser(false);
    setSelectedUser(null);
    
    toast({
      title: "Utilisateur mis à jour",
      description: "Les informations ont été sauvegardées.",
    });
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    toast({
      title: "Utilisateur supprimé",
      description: "L'accès au module a été révoqué.",
    });
  };

  const getRoleStats = () => {
    const stats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<HealthRole, number>);
    
    return [
      { role: "admin_sante", count: stats.admin_sante || 0, color: "bg-red-50 text-red-600" },
      { role: "analyste_sanitaire", count: stats.analyste_sanitaire || 0, color: "bg-blue-50 text-blue-600" },
      { role: "observateur_partenaire", count: stats.observateur_partenaire || 0, color: "bg-green-50 text-green-600" },
      { role: "formateur_accompagnateur", count: stats.formateur_accompagnateur || 0, color: "bg-purple-50 text-purple-600" }
    ];
  };

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-600" />
            Gestion des utilisateurs du module
          </span>
          <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un utilisateur au module</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="userName">Nom complet</Label>
                  <Input
                    id="userName"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Dr. Jean Dupont"
                  />
                </div>
                <div>
                  <Label htmlFor="userEmail">Email professionnel</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Ex: jean.dupont@sante.gouv.fr"
                  />
                </div>
                <div>
                  <Label htmlFor="userRole">Rôle dans le module</Label>
                  <Select value={newUser.role} onValueChange={(value: HealthRole) => setNewUser(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin_sante">Admin Santé</SelectItem>
                      <SelectItem value="analyste_sanitaire">Analyste Sanitaire</SelectItem>
                      <SelectItem value="observateur_partenaire">Observateur/Partenaire</SelectItem>
                      <SelectItem value="formateur_accompagnateur">Formateur/Accompagnateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingUser(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddUser}>
                    Envoyer l'invitation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Statistiques des rôles */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {getRoleStats().map((stat) => (
            <div key={stat.role} className={`text-center p-3 rounded-lg ${stat.color}`}>
              <div className="text-xl font-bold">{stat.count}</div>
              <div className="text-sm">{getHealthRoleLabel(stat.role)}</div>
            </div>
          ))}
        </div>

        {/* Liste des utilisateurs */}
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
                  <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dialog d'édition */}
        <Dialog open={isEditingUser} onOpenChange={setIsEditingUser}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier l'utilisateur</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editName">Nom complet</Label>
                  <Input
                    id="editName"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="editEmail">Email</Label>
                  <Input
                    id="editEmail"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="editRole">Rôle</Label>
                  <Select value={selectedUser.role} onValueChange={(value: HealthRole) => setSelectedUser(prev => prev ? { ...prev, role: value } : null)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin_sante">Admin Santé</SelectItem>
                      <SelectItem value="analyste_sanitaire">Analyste Sanitaire</SelectItem>
                      <SelectItem value="observateur_partenaire">Observateur/Partenaire</SelectItem>
                      <SelectItem value="formateur_accompagnateur">Formateur/Accompagnateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditingUser(false)}>
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
      </CardContent>
    </Card>
  );
};
