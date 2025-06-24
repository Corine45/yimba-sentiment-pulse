
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export const SentimentCharts = () => {
  const sentimentData = [
    { name: "Lun", positif: 45, negatif: 25, neutre: 30 },
    { name: "Mar", positif: 52, negatif: 28, neutre: 20 },
    { name: "Mer", positif: 38, negatif: 35, neutre: 27 },
    { name: "Jeu", positif: 61, negatif: 22, neutre: 17 },
    { name: "Ven", positif: 49, negatif: 31, neutre: 20 },
    { name: "Sam", positif: 55, negatif: 25, neutre: 20 },
    { name: "Dim", positif: 42, negatif: 33, neutre: 25 },
  ];

  const pieData = [
    { name: "Positif", value: 45, color: "#10B981" },
    { name: "Négatif", value: 28, color: "#EF4444" },
    { name: "Neutre", value: 27, color: "#6B7280" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Évolution des sentiments (7 jours)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="positif" fill="#10B981" radius={[2, 2, 0, 0]} />
              <Bar dataKey="negatif" fill="#EF4444" radius={[2, 2, 0, 0]} />
              <Bar dataKey="neutre" fill="#6B7280" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Répartition globale des sentiments</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
