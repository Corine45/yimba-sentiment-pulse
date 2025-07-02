
export const ApiIntegrationNote = () => {
  return (
    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
      <p className="text-sm text-green-800 mb-2">
        <strong>✅ APIs Intégrées et Fonctionnelles:</strong>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-green-700">
        <div>• 🎵 TikTok: clockworks/tiktok-scraper</div>
        <div>• 📸 Instagram: apify/instagram-api-scraper + instagram-post-scraper</div>
        <div>• 📘 Facebook: easyapi/facebook-posts-search-scraper</div>
        <div>• 🐦 Twitter: apidojo/twitter-scraper-lite</div>
        <div>• 📺 YouTube: streamers/youtube-scraper</div>
      </div>
      <p className="text-xs text-green-600 mt-2">
        Toutes les recherches utilisent des données réelles via les APIs Apify. Les clés sont sécurisées et ne s'affichent pas en entier.
      </p>
      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
        <strong>🔍 Diagnostic:</strong> Si vous obtenez 0 résultats, vérifiez les logs de la console pour voir les détails des réponses API.
      </div>
    </div>
  );
};
