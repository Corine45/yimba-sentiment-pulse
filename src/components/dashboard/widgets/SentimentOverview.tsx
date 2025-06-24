
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

export const SentimentOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-green-700 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Sentiment Positif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">45%</div>
          <p className="text-sm text-green-700 mt-1">+5% par rapport à la semaine dernière</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-red-700 flex items-center">
            <TrendingDown className="w-4 h-4 mr-2" />
            Sentiment Négatif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">28%</div>
          <p className="text-sm text-red-700 mt-1">-2% par rapport à la semaine dernière</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-yellow-700 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Alertes Actives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-600">12</div>
          <p className="text-sm text-yellow-700 mt-1">Mots-clés sensibles détectés</p>
        </CardContent>
      </Card>
    </div>
  );
};
