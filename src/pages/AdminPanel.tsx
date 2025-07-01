
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Settings, Shield } from "lucide-react";

const AdminPanel = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Panneau d'administration</h1>
            <p className="text-gray-600">Gestion exclusive pour les administrateurs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Gestion des utilisateurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Créer, modifier et gérer les comptes utilisateurs et leurs rôles.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Configuration système
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Paramètres avancés de la plateforme et intégrations.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Sécurité et permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Gestion des droits d'accès et politiques de sécurité.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminPanel;
