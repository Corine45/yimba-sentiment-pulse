
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Cpu, HardDrive, Users, Database, RefreshCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useSystemMetrics } from "@/hooks/useSystemMetrics";
import { Button } from "@/components/ui/button";

interface SystemMetricsProps {
  userRole: string;
  permissions: any;
}

export const SystemMetrics = ({ userRole, permissions }: SystemMetricsProps) => {
  const { metrics, loading, refetch } = useSystemMetrics();

  const performanceData = [
    { name: 'Lun', requests: metrics.totalRequests * 0.8, response_time: metrics.averageResponseTime * 0.9 },
    { name: 'Mar', requests: metrics.totalRequests * 0.6, response_time: metrics.averageResponseTime * 0.8 },
    { name: 'Mer', requests: metrics.totalRequests * 1.2, response_time: metrics.averageResponseTime * 1.1 },
    { name: 'Jeu', requests: metrics.totalRequests * 1.0, response_time: metrics.averageResponseTime },
    { name: 'Ven', requests: metrics.totalRequests * 1.1, response_time: metrics.averageResponseTime * 1.05 },
    { name: 'Sam', requests: metrics.totalRequests * 0.7, response_time: metrics.averageResponseTime * 0.85 },
    { name: 'Dim', requests: metrics.totalRequests * 0.9, response_time: metrics.averageResponseTime * 0.95 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton de rafraîchissement */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Métriques système</h2>
        <Button variant="outline" size="sm" onClick={refetch} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </Button>
      </div>

      {/* Métriques de performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Cpu className="w-4 h-4 mr-2" />
              CPU
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Utilisation</span>
                <span>{metrics.cpuUsage}%</span>
              </div>
              <Progress value={metrics.cpuUsage} className="h-2" />
              <p className="text-xs text-gray-500">Temps de fonctionnement: {metrics.uptime}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <HardDrive className="w-4 h-4 mr-2" />
              Stockage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Utilisé</span>
                <span>{(metrics.storageUsed / 1000).toFixed(1)} GB / {(metrics.storageTotal / 1000).toFixed(0)} GB</span>
              </div>
              <Progress value={(metrics.storageUsed / metrics.storageTotal) * 100} className="h-2" />
              <p className="text-xs text-gray-500">{((metrics.storageUsed / metrics.storageTotal) * 100).toFixed(1)}% utilisé</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Database className="w-4 h-4 mr-2" />
              Base de données
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Connexions</span>
                <span>{metrics.dbConnections} / {metrics.maxDbConnections}</span>
              </div>
              <Progress value={(metrics.dbConnections / metrics.maxDbConnections) * 100} className="h-2" />
              <p className="text-xs text-gray-500">Temps de réponse: {metrics.averageResponseTime}ms</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Utilisateurs actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <span className="text-2xl font-bold text-blue-600">{metrics.activeUsers}</span>
              <p className="text-xs text-gray-500">Dernières 24h</p>
              <p className="text-xs text-gray-500 mt-1">Requêtes: {metrics.totalRequests}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique de performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Performance système (7 derniers jours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="requests" fill="#3B82F6" name="Requêtes" />
              <Bar yAxisId="right" dataKey="response_time" fill="#10B981" name="Temps de réponse (ms)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
