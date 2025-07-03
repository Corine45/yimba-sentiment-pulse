
export const ApiIntegrationNote = () => {
  return (
    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
      <p className="text-sm text-green-800 mb-2">
        <strong>✅ Serveur Backend Connecté:</strong>
      </p>
      <div className="text-xs text-green-700 space-y-1">
        <p>• Serveur API: <code>https://yimbapulseapi.a-car.ci</code></p>
        <p>• Toutes les données sont récupérées en temps réel via vos APIs</p>
        <p>• Endpoints actifs: /api/scrape/tiktok, /api/scrape/facebook, /api/scrape/twitter, /api/scrape/youtube, /api/scrape/instagram</p>
        <p>• Aucune donnée factice - Résultats 100% authentiques</p>
      </div>
      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
        <strong>🚀 APIs Actives:</strong> Scraping en temps réel depuis votre serveur - Données authentiques - Métriques précises
      </div>
    </div>
  );
};
