
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, FileText, AlertTriangle } from "lucide-react";

const AnalystWorkspace = () => {
  return (
    <ProtectedRoute requiredRole="analyste">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Espace Analyste</h1>
            <p className="text-gray-600">Outils d'analyse avancés et génération de rapports</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Analyses avancées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Outils d'analyse des sentiments et tendances des réseaux sociaux.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Génération de rapports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Création et export de rapports détaillés et personnalisés.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Gestion des alertes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Configuration et suivi des alertes critiques.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AnalystWorkspace;
