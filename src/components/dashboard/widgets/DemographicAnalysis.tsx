
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users } from "lucide-react";

export const DemographicAnalysis = () => {
  const ageData = [
    { name: "18-24", value: 25, color: "#3B82F6" },
    { name: "25-34", value: 35, color: "#10B981" },
    { name: "35-44", value: 20, color: "#F59E0B" },
    { name: "45-54", value: 15, color: "#EF4444" },
    { name: "55+", value: 5, color: "#8B5CF6" },
  ];

  const genderData = [
    { name: "Hommes", value: 45, mentions: 1245 },
    { name: "Femmes", value: 55, mentions: 1523 },
  ];

  const locationData = [
    { name: "Abidjan", mentions: 856 },
    { name: "Bouaké", mentions: 324 },
    { name: "Yamoussoukro", mentions: 234 },
    { name: "San-Pédro", mentions: 189 },
    { name: "Korhogo", mentions: 156 },
  ];

  return (
    <div className="space-y-6">
      {/* Age Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Répartition par âge</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ageData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {ageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gender Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse par genre</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {genderData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">{item.mentions} mentions</div>
                </div>
                <div className="text-2xl font-bold text-blue-600">{item.value}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition géographique</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="mentions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
