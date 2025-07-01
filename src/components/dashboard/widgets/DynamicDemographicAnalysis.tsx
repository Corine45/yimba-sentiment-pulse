
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, RefreshCw, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDynamicReportsData } from "@/hooks/useDynamicReportsData";

export const DynamicDemographicAnalysis = () => {
  const { demographicData, loading, refetch } = useDynamicReportsData();

  const ageColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-8">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton refresh */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Database className="w-6 h-6 text-blue-600" />
          Analyse démographique - Données Supabase réelles
        </h2>
        <Button variant="outline" onClick={refetch} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </Button>
      </div>

      {/* Age Distribution - Données réelles uniquement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Répartition par âge - Table age_demographics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {demographicData.ageGroups.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={demographicData.ageGroups}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value, mentions }) => `${name}: ${value}% (${mentions} mentions)`}
                >
                  {demographicData.ageGroups.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ageColors[index % ageColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="font-medium text-red-600">Aucune donnée d'âge réelle dans la table age_demographics</p>
              <p className="text-sm mt-2">Les données apparaîtront ici après avoir inséré des informations démographiques réelles.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gender Analysis - Données réelles uniquement */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse par genre - Table gender_demographics</CardTitle>
        </CardHeader>
        <CardContent>
          {demographicData.genders.length > 0 ? (
            <div className="space-y-4">
              {demographicData.genders.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">{item.mentions} mentions réelles</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 ml-4">{item.value}%</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="font-medium text-red-600">Aucune donnée de genre réelle dans la table gender_demographics</p>
              <p className="text-sm mt-2">Les données apparaîtront ici après avoir inséré des informations démographiques réelles.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location Analysis - Données réelles uniquement */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition géographique - Table geographic_data</CardTitle>
        </CardHeader>
        <CardContent>
          {demographicData.locations.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demographicData.locations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'mentions' ? `${value} mentions réelles` : `Score: ${value}`,
                    name === 'mentions' ? 'Mentions' : 'Sentiment'
                  ]}
                />
                <Bar dataKey="mentions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="font-medium text-red-600">Aucune donnée géographique réelle dans la table geographic_data</p>
              <p className="text-sm mt-2">Les données géographiques seront générées automatiquement lors des recherches.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
