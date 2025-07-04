
export const ApiIntegrationNote = () => {
  return (
    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
      <p className="text-sm text-green-800 mb-2">
        <strong>✅ API Backend Connecté:</strong>
      </p>
      <div className="text-xs text-green-700 space-y-1">
        <p>• Serveur API: <code>https://yimbapulseapi.a-car.ci</code></p>
        <p>• Endpoints utilisés: /api/scrape/tiktok, /api/scrape/facebook, /api/scrape/twitter, /api/scrape/youtube, /api/scrape/instagram</p>
        <p>• Toutes les données proviennent exclusivement de vos APIs</p>
        <p>• Aucune donnée statique ou factice générée</p>
        <p>• Filtrage strict selon les plateformes sélectionnées</p>
      </div>
      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
        <strong>🔍 Mode API Pure:</strong> Seules les données retournées par vos endpoints sont affichées - Zéro génération artificielle
      </div>
    </div>
  );
};
