
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Search } from "lucide-react";

export const KeywordFrequency = () => {
  const frequencyData = [
    { keyword: "éducation", frequency: 234, trend: "+15%" },
    { keyword: "politique", frequency: 189, trend: "-8%" },
    { keyword: "économie", frequency: 156, trend: "+3%" },
    { keyword: "santé", frequency: 134, trend: "+22%" },
    { keyword: "emploi", frequency: 98, trend: "-5%" },
    { keyword: "jeunesse", frequency: 87, trend: "+12%" },
    { keyword: "formation", frequency: 76, trend: "+18%" },
    { keyword: "développement", frequency: 65, trend: "+7%" },
  ];

  const timelineData = [
    { time: "00:00", mentions: 12 },
    { time: "04:00", mentions: 8 },
    { time: "08:00", mentions: 45 },
    { time: "12:00", mentions: 78 },
    { time: "16:00", mentions: 65 },
    { time: "20:00", mentions: 89 },
    { time: "24:00", mentions: 34 },
  ];

  return (
    <div className="space-y-6">
      {/* Keyword Frequency Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-blue-600" />
            <span>Fréquence des mots-clés</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {frequencyData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium capitalize">{item.keyword}</div>
                  <div className="text-sm text-gray-600">{item.frequency} mentions</div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium ${
                    item.trend.startsWith("+") ? "text-green-600" : "text-red-600"
                  }`}>
                    {item.trend}
                  </span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(item.frequency / 234) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Frequency Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Graphique de fréquence</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={frequencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="frequency" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution temporelle des mentions</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="mentions" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
