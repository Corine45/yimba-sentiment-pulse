
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, BarChart3 } from "lucide-react";
import { useSearchResults } from "@/hooks/useSearchResults";

export const SentimentCharts = () => {
  const { searchResults, loading } = useSearchResults();

  // Transformer les données de recherche en données de sentiment
  const sentimentData = searchResults.map(result => ({
    name: result.search_term,
    positive: result.positive_sentiment || 0,
    negative: result.negative_sentiment || 0,
    neutral: result.neutral_sentiment || 0,
    total: result.total_mentions || 0
  }));

  const pieData = sentimentData.length > 0 ? [
    { name: 'Positif', value: sentimentData.reduce((sum, item) => sum + item.positive, 0), color: '#10B981' },
    { name: 'Négatif', value: sentimentData.reduce((sum, item) => sum + item.negative, 0), color: '#EF4444' },
    { name: 'Neutre', value: sentimentData.reduce((sum, item) => sum + item.neutral, 0), color: '#6B7280' }
  ] : [
    { name: 'Positif', value: 65, color: '#10B981' },
    { name: 'Négatif', value: 20, color: '#EF4444' },
    { name: 'Neutre', value: 15, color: '#6B7280' }
  ];

  const timeSeriesData = searchResults.slice(-7).map((result, index) => ({
    date: new Date(result.created_at).toLocaleDateString('fr-FR'),
    sentiment: ((result.positive_sentiment || 0) - (result.negative_sentiment || 0)) / (result.total_mentions || 1),
    mentions: result.total_mentions || 0
  }));

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Graphique en barres des sentiments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Analyse des sentiments par recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sentimentData.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-600">Aucune donnée de sentiment disponible.</p>
              <p className="text-sm text-gray-500 mt-2">
                Effectuez des recherches pour voir l'analyse des sentiments.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="positive" fill="#10B981" name="Positif" />
                <Bar dataKey="negative" fill="#EF4444" name="Négatif" />
                <Bar dataKey="neutral" fill="#6B7280" name="Neutre" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Graphique en secteurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Répartition globale des sentiments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
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

      {/* Évolution temporelle du sentiment */}
      {timeSeriesData.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Évolution du sentiment dans le temps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sentiment" stroke="#8B5CF6" strokeWidth={2} name="Score de sentiment" />
                <Line type="monotone" dataKey="mentions" stroke="#3B82F6" strokeWidth={2} name="Mentions" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
