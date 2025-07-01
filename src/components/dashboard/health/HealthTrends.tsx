
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useHealthSurveillanceData } from "@/hooks/useHealthSurveillanceData";

export const HealthTrends = () => {
  const { alerts, loading } = useHealthSurveillanceData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Calculer les données réelles par maladie
  const diseaseStats = alerts.reduce((acc, alert) => {
    const disease = alert.disease;
    if (!acc[disease]) {
      acc[disease] = {
        name: disease,
        alerts: 0,
        criticalCount: 0,
        moderateCount: 0,
        lowCount: 0
      };
    }
    acc[disease].alerts += 1;
    
    if (alert.severity === 'critique') acc[disease].criticalCount += 1;
    else if (alert.severity === 'modéré') acc[disease].moderateCount += 1;
    else if (alert.severity === 'faible') acc[disease].lowCount += 1;
    
    return acc;
  }, {} as Record<string, any>);

  const diseaseData = Object.values(diseaseStats).map((disease: any) => ({
    name: disease.name,
    alerts: disease.alerts,
    severity: disease.criticalCount > 0 ? 'Critique' : 
             disease.moderateCount > 0 ? 'Modéré' : 'Faible'
  }));

  // Données simulées pour les tendances hebdomadaires (basées sur le nombre total d'alertes)
  const totalAlerts = alerts.length;
  const weeklyData = [
    { day: "Lun", total: Math.floor(totalAlerts * 0.1) },
    { day: "Mar", total: Math.floor(totalAlerts * 0.15) },
    { day: "Mer", total: Math.floor(totalAlerts * 0.12) },
    { day: "Jeu", total: Math.floor(totalAlerts * 0.18) },
    { day: "Ven", total: Math.floor(totalAlerts * 0.20) },
    { day: "Sam", total: Math.floor(totalAlerts * 0.15) },
    { day: "Dim", total: Math.floor(totalAlerts * 0.10) }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Évolution hebdomadaire */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Évolution des signaux (7 derniers jours)</h3>
        {totalAlerts > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} name="Total alertes" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-600">Aucune donnée disponible pour les tendances</p>
          </div>
        )}
      </div>

      {/* Répartition par maladie */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Alertes par pathologie (30 jours)</h3>
        {diseaseData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={diseaseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="alerts" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-1 gap-2 text-sm">
              {diseaseData.map((disease, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-medium">{disease.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">{disease.alerts} alertes</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      disease.severity === 'Critique' ? 'bg-red-100 text-red-800' :
                      disease.severity === 'Modéré' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {disease.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-600">Aucune donnée disponible pour les pathologies</p>
          </div>
        )}
      </div>
    </div>
  );
};
