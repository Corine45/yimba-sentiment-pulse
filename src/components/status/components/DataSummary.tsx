
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Database, Search, Users, Activity, BarChart3, RefreshCw } from "lucide-react";
import { useStorageMetrics } from "@/hooks/useStorageMetrics";

interface DataSummaryProps {
  userRole: string;
  permissions: any;
}

export const DataSummary = ({ userRole, permissions }: DataSummaryProps) => {
  const { storageMetrics, loading, refetch } = useStorageMetrics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getIconForCategory = (category: string) => {
    if (category.includes('recherche')) return Search;
    if (category.includes('IA')) return Activity;
    if (category.includes('géographiques')) return BarChart3;
    if (category.includes('utilisateurs')) return Users;
    return Database;
  };

  const getColorForCategory = (category: string) => {
    if (category.includes('recherche')) return 'text-blue-600';
    if (category.includes('IA')) return 'text-purple-600';
    if (category.includes('géographiques')) return 'text-green-600';
    if (category.includes('utilisateurs')) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header avec bouton de rafraîchissement */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Résumé des données</h2>
        <Button variant="outline" size="sm" onClick={refetch} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </Button>
      </div>

      {/* Métriques de données */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {storageMetrics.categories.map((category, index) => {
          const IconComponent = getIconForCategory(category.category);
          const colorClass = getColorForCategory(category.category);
          
          return (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <IconComponent className={`w-4 h-4 mr-2 ${colorClass}`} />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <span className={`text-2xl font-bold ${colorClass}`}>
                    {category.count}
                  </span>
                  <p className="text-xs text-gray-500">Enregistrements</p>
                  <p className="text-xs text-gray-500 mt-1">{category.used} MB utilisés</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Activité récente des données
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {storageMetrics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{activity.type}</h4>
                  <p className="text-sm text-gray-600">{activity.lastUpdate}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-blue-600">{activity.count}</span>
                  <p className="text-xs text-gray-500">nouveaux</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
            {storageMetrics.categories.map((storage, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">{storage.category}</h4>
                    <p className="text-sm text-gray-600">{storage.description}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {storage.used} MB
                  </span>
                </div>
                <Progress value={(storage.used / storageMetrics.totalAvailable) * 100} className="h-2" />
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Stockage total utilisé</h4>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-blue-700">
                {(storageMetrics.totalUsed / 1000).toFixed(2)} GB / {(storageMetrics.totalAvailable / 1000).toFixed(0)} GB
              </span>
              <span className="text-sm font-medium text-blue-900">
                {storageMetrics.usagePercentage}%
              </span>
            </div>
            <Progress value={storageMetrics.usagePercentage} className="h-3" />
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
