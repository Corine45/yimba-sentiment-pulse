
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, BarChart3, RefreshCw } from "lucide-react";
import { useInfluencerData } from "@/hooks/useInfluencerData";

export const DynamicInfluencerAnalysis = () => {
  const { influencers, loading, refetch } = useInfluencerData();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Analyse des influenceurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Analyse des influenceurs
          </CardTitle>
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Actualiser
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {influencers.length === 0 ? (
          <div className="text-center p-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune donnée d'influenceur disponible.</p>
            <p className="text-sm text-gray-500 mt-2">
              Les données seront générées automatiquement lors de vos prochaines recherches.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {influencers.slice(0, 10).map((influencer) => (
              <div key={influencer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="font-medium">{influencer.name}</div>
                    <Badge variant="outline" className="text-xs">
                      {influencer.platform}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{influencer.followers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{influencer.engagement_rate.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BarChart3 className="w-3 h-3" />
                      <span>Score: {influencer.influence_score}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, influencer.influence_score)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
