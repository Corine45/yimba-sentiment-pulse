
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Database, Search, Users, Activity, BarChart3 } from "lucide-react";

interface DataSummaryProps {
  userRole: string;
  permissions: any;
}

export const DataSummary = ({ userRole, permissions }: DataSummaryProps) => {
  const dataMetrics = [
    {
      name: "Recherches sauvegardées",
      count: 25,
      icon: Search,
      color: "text-blue-600",
      visible: permissions.canSearch
    },
    {
      name: "Contextes IA générés", 
      count: 8,
      icon: Activity,
      color: "text-purple-600",
      visible: permissions.canAnalyze
    },
    {
      name: "Données géographiques",
      count: 156,
      icon: BarChart3,
      color: "text-green-600",
      visible: permissions.canAnalyze
    },
    {
      name: "Profils utilisateurs",
      count: 8,
      icon: Users,
      color: "text-orange-600",
      visible: permissions.canManageUsers
    }
  ];

  const storageInfo = [
    {
      category: "Résultats de recherche",
      used: 45,
      description: "Données de recherche et mentions",
      visible: permissions.canSearch
    },
    {
      category: "Contextes IA",
      used: 15,
      description: "Analyses générées par l'IA",
      visible: permissions.canAnalyze
    },
    {
      category: "Données géographiques", 
      used: 25,
      description: "Informations de localisation",
      visible: permissions.canAnalyze
    },
    {
      category: "Métadonnées utilisateurs",
      used: 10,
      description: "Profils et préférences",
      visible: true
    }
  ];

  const visibleMetrics = dataMetrics.filter(metric => metric.visible);
  const visibleStorage = storageInfo.filter(storage => storage.visible);

  return (
    <div className="space-y-6">
      {/* Métriques de données */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <metric.icon className={`w-4 h-4 mr-2 ${metric.color}`} />
                {metric.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <span className={`text-2xl font-bold ${metric.color}`}>
                  {metric.count}
                </span>
                <p className="text-xs text-gray-500">Enregistrements</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Utilisation du stockage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-600" />
            Utilisation du stockage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {visibleStorage.map((storage, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">{storage.category}</h4>
                    <p className="text-sm text-gray-600">{storage.description}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {storage.used}%
                  </span>
                </div>
                <Progress value={storage.used} className="h-2" />
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Stockage total utilisé</h4>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-blue-700">2.1 GB / 10 GB</span>
              <span className="text-sm font-medium text-blue-900">21%</span>
            </div>
            <Progress value={21} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {userRole === "observateur" && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note :</strong> Certaines métriques de données peuvent ne pas être visibles 
                selon vos permissions d'accès.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
