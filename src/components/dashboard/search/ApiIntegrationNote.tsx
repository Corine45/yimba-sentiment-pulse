
import { Card, CardContent } from "@/components/ui/card";

export const ApiIntegrationNote = () => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Points d'intégration API Apify</h4>
            <p className="text-sm text-blue-800 mb-2">
              Connectez vos acteurs Apify pour récupérer des données réelles :
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>handleSearch():</strong> Remplacer la simulation par les appels API</li>
              <li>• <strong>Plateformes:</strong> Configurer les acteurs dans la table social_platforms</li>
              <li>• <strong>Résultats:</strong> Parser et sauvegarder les données dans search_results</li>
              <li>• <strong>Temps réel:</strong> Implémenter les webhooks pour les mises à jour</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
