
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface Alert {
  id: string;
  disease: string;
  location: string;
  severity: string;
  status: string;
  timestamp: string;
  source: string;
  description: string;
  verified: boolean;
  assignedTo: string | null;
  rawText: string;
  reporterName?: string;
  reporterContact?: string;
  createdAt?: string;
}

interface AlertsMetricsProps {
  alerts: Alert[];
}

export const AlertsMetrics = ({ alerts }: AlertsMetricsProps) => {
  // Calculer les métriques
  const totalAlerts = alerts.length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critique').length;
  const verifiedAlerts = alerts.filter(a => a.verified).length;
  const resolvedAlerts = alerts.filter(a => a.status === 'resolu').length;

  // Données pour les graphiques
  const severityData = [
    { name: 'Critique', value: alerts.filter(a => a.severity === 'critique').length, color: '#ef4444' },
    { name: 'Modéré', value: alerts.filter(a => a.severity === 'modéré').length, color: '#f59e0b' },
    { name: 'Faible', value: alerts.filter(a => a.severity === 'faible').length, color: '#10b981' },
  ];

  const diseaseData = alerts.reduce((acc, alert) => {
    const existing = acc.find(item => item.name === alert.disease);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: alert.disease, value: 1 });
    }
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  const statusData = [
    { name: 'Nouveau', value: alerts.filter(a => a.status === 'nouveau').length },
    { name: 'En cours', value: alerts.filter(a => a.status === 'en_cours').length },
    { name: 'Résolu', value: alerts.filter(a => a.status === 'resolu').length },
  ];

  return (
    <div className="space-y-6">
      {/* Cartes de métriques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Total alertes</p>
                <p className="text-2xl font-bold">{totalAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Critiques</p>
                <p className="text-2xl font-bold text-red-600">{criticalAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Vérifiées</p>
                <p className="text-2xl font-bold text-green-600">{verifiedAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Résolues</p>
                <p className="text-2xl font-bold text-blue-600">{resolvedAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par gravité */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par gravité</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alertes par maladie */}
        <Card>
          <CardHeader>
            <CardTitle>Alertes par maladie</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={diseaseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Statut des alertes */}
        <Card>
          <CardHeader>
            <CardTitle>Statut des alertes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tendances (simulées) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Tendances hebdomadaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cette semaine</span>
                <span className="font-semibold">{totalAlerts} alertes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Semaine dernière</span>
                <span className="font-semibold">{Math.max(0, totalAlerts - 3)} alertes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Évolution</span>
                <span className="font-semibold text-green-600">+3 alertes</span>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Insight:</strong> Augmentation légère des signalements cette semaine, 
                  principalement dans la région d'Abidjan.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
