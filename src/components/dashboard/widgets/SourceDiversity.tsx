
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Globe, Users } from "lucide-react";
import { useSearchResults } from "@/hooks/useSearchResults";
import { useSocialMediaData } from "@/hooks/useSocialMediaData";

export const SourceDiversity = () => {
  const { searchResults, loading } = useSearchResults();
  const { posts } = useSocialMediaData();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-600" />
            Diversité des sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculer la distribution des plateformes basée sur les résultats de recherche
  const platformCounts = searchResults.reduce((acc, result) => {
    const platform = result.platform || 'Autre';
    acc[platform] = (acc[platform] || 0) + (result.total_mentions || 0);
    return acc;
  }, {} as Record<string, number>);

  // Ajouter les données des posts de médias sociaux
  posts.forEach(post => {
    const platform = post.platform || 'Autre';
    platformCounts[platform] = (platformCounts[platform] || 0) + 1;
  });

  const pieData = Object.entries(platformCounts).map(([platform, count]) => ({
    name: platform,
    value: count,
    color: getPlatformColor(platform)
  }));

  const totalSources = Object.values(platformCounts).reduce((sum, count) => sum + count, 0);
  const uniquePlatforms = Object.keys(platformCounts).length;

  // Calculer les auteurs uniques
  const uniqueAuthors = new Set(posts.map(post => post.author)).size;

  function getPlatformColor(platform: string) {
    const colors: Record<string, string> = {
      'Instagram': '#E4405F',
      'Twitter': '#1DA1F2',
      'Facebook': '#1877F2',
      'TikTok': '#000000',
      'YouTube': '#FF0000',
      'LinkedIn': '#0A66C2',
      'Autre': '#6B7280'
    };
    return colors[platform] || '#6B7280';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="w-5 h-5 mr-2 text-blue-600" />
          Diversité des sources
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalSources === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune source détectée</p>
            <p className="text-sm">Effectuez des recherches pour voir la diversité des sources</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Métriques principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{uniquePlatforms}</div>
                <div className="text-sm text-blue-700">Plateformes</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{totalSources}</div>
                <div className="text-sm text-green-700">Sources totales</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{uniqueAuthors}</div>
                <div className="text-sm text-purple-700">Auteurs uniques</div>
              </div>
            </div>

            {/* Graphique en secteurs */}
            <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="w-full lg:w-1/2">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} mentions`, 'Mentions']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Légende détaillée */}
              <div className="w-full lg:w-1/2 space-y-2">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="font-medium">{entry.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{entry.value}</div>
                      <div className="text-xs text-gray-500">
                        {((entry.value / totalSources) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Insights sur la diversité
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• {uniquePlatforms} plateformes différentes analysées</li>
                <li>• {uniqueAuthors} auteurs uniques identifiés</li>
                <li>• Couverture diversifiée des sources d'information</li>
                {pieData.length > 0 && (
                  <li>• {pieData[0].name} est la source principale avec {((pieData[0].value / totalSources) * 100).toFixed(1)}% des mentions</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
