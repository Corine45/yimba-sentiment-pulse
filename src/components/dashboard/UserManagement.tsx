
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Edit, Trash2, Search } from "lucide-react";

export const UserManagement = () => {
  const [users] = useState([
    {
      id: 1,
      name: "Marie Dupont",
      email: "marie.dupont@example.com",
      role: "admin",
      status: "active",
      lastLogin: "Il y a 2 heures",
      createdAt: "15 Mars 2024"
    },
    {
      id: 2,
      name: "Jean Martin",
      email: "jean.martin@example.com",
      role: "analyste",
      status: "active",
      lastLogin: "Il y a 1 jour",
      createdAt: "10 Mars 2024"
    },
    {
      id: 3,
      name: "Sophie Laurent",
      email: "sophie.laurent@example.com",
      role: "observateur",
      status: "inactive",
      lastLogin: "Il y a 1 semaine",
      createdAt: "5 Mars 2024"
    },
    {
      id: 4,
      name: "Paul Durand",
      email: "paul.durand@example.com",
      role: "analyste",
      status: "active",
      lastLogin: "Il y a 3 heures",
      createdAt: "1 Mars 2024"
    }
  ]);

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
    <div className="space-y-6">
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">4</div>
            <div className="text-sm text-blue-800">Utilisateurs totaux</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-green-800">Actifs</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">1</div>
            <div className="text-sm text-red-800">Admin</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">2</div>
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
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouvel utilisateur
            </Button>
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
              />
            </div>
            <div className="flex space-x-2">
              <Select defaultValue="all">
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
              <Select defaultValue="all">
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
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-medium">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">Créé le {user.createdAt}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex space-x-2 mb-1">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>
                    <p className="text-xs text-gray-500">Dernière connexion: {user.lastLogin}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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
