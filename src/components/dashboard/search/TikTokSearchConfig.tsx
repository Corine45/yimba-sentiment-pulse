
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, CheckCircle } from "lucide-react";

interface TikTokSearchConfigProps {
  isConfigured: boolean;
}

export const TikTokSearchConfig = ({ isConfigured }: TikTokSearchConfigProps) => {
  return (
    <Card className="border-pink-200 bg-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Video className="w-5 h-5 text-pink-600" />
          <span>Configuration TikTok</span>
          {isConfigured && <CheckCircle className="w-5 h-5 text-green-600" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Acteur Apify :</span>
          <Badge variant="outline" className="bg-white">
            clockworks/tiktok-scraper
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">API Token :</span>
          <Badge variant={isConfigured ? "default" : "secondary"}>
            {isConfigured ? "Configuré" : "Non configuré"}
          </Badge>
        </div>

        <div className="text-xs text-gray-600 bg-white p-2 rounded border">
          <strong>Fonctionnalités :</strong>
          <ul className="mt-1 space-y-1">
            <li>• Recherche par hashtags et mots-clés</li>
            <li>• Récupération des métriques d'engagement</li>
            <li>• Analyse des tendances TikTok</li>
            <li>• Scraping synchrone pour des résultats rapides</li>
          </ul>
        </div>

        {isConfigured && (
          <div className="text-xs text-green-700 bg-green-100 p-2 rounded">
            ✅ Prêt pour surveiller TikTok avec l'API Apify
          </div>
        )}
      </CardContent>
    </Card>
  );
};
