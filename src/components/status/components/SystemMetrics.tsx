
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Cpu, HardDrive, Users, Database } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SystemMetricsProps {
  userRole: string;
  permissions: any;
}

export const SystemMetrics = ({ userRole, permissions }: SystemMetricsProps) => {
  const performanceData = [
    { name: 'Lun', requests: 2400, response_time: 120 },
    { name: 'Mar', requests: 1398, response_time: 110 },
    { name: 'Mer', requests: 9800, response_time: 200 },
    { name: 'Jeu', requests: 3908, response_time: 150 },
    { name: 'Ven', requests: 4800, response_time: 140 },
    { name: 'Sam', requests: 3800, response_time: 100 },
    { name: 'Dim', requests: 4300, response_time: 130 },
  ];

  return (
    <div className="space-y-6">
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
                <span>45%</span>
              </div>
              <Progress value={45} className="h-2" />
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
                <span>2.1 GB / 10 GB</span>
              </div>
              <Progress value={21} className="h-2" />
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
                <span>15 / 100</span>
              </div>
              <Progress value={15} className="h-2" />
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
              <span className="text-2xl font-bold text-blue-600">24</span>
              <p className="text-xs text-gray-500">Dernières 24h</p>
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
