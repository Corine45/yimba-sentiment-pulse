
export const ApiIntegrationNote = () => {
  return (
    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
      <p className="text-sm text-green-800 mb-2">
        <strong>✅ API Backend Connectée:</strong>
      </p>
      <div className="text-xs text-green-700 space-y-1">
        <p>• API Backend: <code>https://yimbapulseapi.a-car.ci</code></p>
        <p>• Données exclusivement récupérées depuis vos endpoints API</p>
        <p>• Endpoints: /api/scrape/tiktok, /api/scrape/facebook, /api/scrape/twitter, /api/scrape/youtube, /api/scrape/instagram</p>
        <p>• Aucune donnée factice - Seules vos données API sont affichées</p>
        <p>• Filtrage par plateformes : seules les plateformes sélectionnées sont interrogées</p>
      </div>
      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
        <strong>🔍 Mode API Pure:</strong> Chaque recherche appelle uniquement vos endpoints selon les filtres sélectionnés - Zéro donnée simulée
      </div>
    </div>
  );
};
