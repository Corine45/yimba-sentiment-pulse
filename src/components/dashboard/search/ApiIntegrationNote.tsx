
export const ApiIntegrationNote = () => {
  return (
    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
      <p className="text-sm text-amber-800 mb-2">
        <strong>⚠️ Informations Techniques:</strong>
      </p>
      <div className="text-xs text-amber-700 space-y-1">
        <p>• Les APIs Apify sont configurées mais bloquées par les restrictions CORS du navigateur</p>
        <p>• Les données affichées sont des simulations réalistes basées sur vos critères de recherche</p>
        <p>• En production, ces appels passeraient par un serveur backend pour contourner CORS</p>
      </div>
      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
        <strong>✅ Fonctionnalités actives:</strong> Filtres de plateformes, langues, périodes - Calculs de métriques réalistes
      </div>
    </div>
  );
};
