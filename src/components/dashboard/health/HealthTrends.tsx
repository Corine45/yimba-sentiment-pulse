
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export const HealthTrends = () => {
  // Données simulées pour les tendances
  const weeklyData = [
    { day: "Lun", covid: 12, paludisme: 8, dengue: 3, rougeole: 2 },
    { day: "Mar", covid: 15, paludisme: 12, dengue: 5, rougeole: 1 },
    { day: "Mer", covid: 8, paludisme: 15, dengue: 4, rougeole: 3 },
    { day: "Jeu", covid: 18, paludisme: 10, dengue: 7, rougeole: 2 },
    { day: "Ven", covid: 22, paludisme: 18, dengue: 6, rougeole: 4 },
    { day: "Sam", covid: 16, paludisme: 14, dengue: 8, rougeole: 1 },
    { day: "Dim", covid: 11, paludisme: 9, dengue: 5, rougeole: 2 }
  ];

  const diseaseData = [
    { name: "COVID-19", alerts: 102, severity: "Modéré" },
    { name: "Paludisme", alerts: 86, severity: "Critique" },
    { name: "Dengue", alerts: 38, severity: "Faible" },
    { name: "Rougeole", alerts: 15, severity: "Modéré" },
    { name: "VIH", alerts: 12, severity: "Faible" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Évolution hebdomadaire */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Évolution des signaux (7 derniers jours)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="covid" stroke="#dc2626" strokeWidth={2} name="COVID-19" />
            <Line type="monotone" dataKey="paludisme" stroke="#16a34a" strokeWidth={2} name="Paludisme" />
            <Line type="monotone" dataKey="dengue" stroke="#d97706" strokeWidth={2} name="Dengue" />
            <Line type="monotone" dataKey="rougeole" stroke="#7c3aed" strokeWidth={2} name="Rougeole" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Répartition par maladie */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Alertes par pathologie (30 jours)</h3>
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
      </div>
    </div>
  );
};
