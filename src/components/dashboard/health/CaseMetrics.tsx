
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, Activity, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface CaseMetricsProps {
  cases: any[];
}

export const CaseMetrics = ({ cases }: CaseMetricsProps) => {
  // Calculs des métriques
  const totalCases = cases.length;
  const activeCases = cases.filter(c => c.status !== 'resolu').length;
  const resolvedCases = cases.filter(c => c.status === 'resolu').length;
  const criticalCases = cases.filter(c => c.priority === 'critique').length;

  // Données pour les graphiques
  const statusData = [
    { name: 'Nouveau', value: cases.filter(c => c.status === 'nouveau').length, color: '#3B82F6' },
    { name: 'En cours', value: cases.filter(c => c.status === 'en_cours').length, color: '#F59E0B' },
    { name: 'Résolu', value: cases.filter(c => c.status === 'resolu').length, color: '#10B981' }
  ];

  const priorityData = [
    { name: 'Faible', value: cases.filter(c => c.priority === 'faible').length },
    { name: 'Normale', value: cases.filter(c => c.priority === 'normale').length },
    { name: 'Haute', value: cases.filter(c => c.priority === 'haute').length },
    { name: 'Critique', value: cases.filter(c => c.priority === 'critique').length }
  ];

  const diseaseData = Object.entries(
    cases.reduce((acc, caseItem) => {
      acc[caseItem.disease] = (acc[caseItem.disease] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([disease, count]) => ({ disease, count }));

  const locationData = Object.entries(
    cases.reduce((acc, caseItem) => {
      acc[caseItem.location] = (acc[caseItem.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([location, count]) => ({ location, count }));

  const weeklyData = [
    { week: 'S1', nouveaux: 3, resolus: 2 },
    { week: 'S2', nouveaux: 5, resolus: 4 },
    { week: 'S3', nouveaux: 2, resolus: 6 },
    { week: 'S4', nouveaux: 4, resolus: 3 }
  ];

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total des cas</p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">{totalCases}</span>
                  <Badge variant="outline" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12%
                  </Badge>
                </div>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cas actifs</p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-orange-600">{activeCases}</span>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    Suivi
                  </Badge>
                </div>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cas résolus</p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-green-600">{resolvedCases}</span>
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    85%
                  </Badge>
                </div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Priorité critique</p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-red-600">{criticalCases}</span>
                  <Badge variant="outline" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Urgent
                  </Badge>
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par statut */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {statusData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-600">{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Répartition par priorité */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition par priorité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Répartition par maladie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition par maladie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diseaseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="disease" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Évolution hebdomadaire */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Évolution hebdomadaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="nouveaux" stroke="#F59E0B" strokeWidth={2} name="Nouveaux cas" />
                  <Line type="monotone" dataKey="resolus" stroke="#10B981" strokeWidth={2} name="Cas résolus" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
