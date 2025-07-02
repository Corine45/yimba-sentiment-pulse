
export const ApiIntegrationNote = () => {
  return (
    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
      <p className="text-sm text-green-800 mb-2">
        <strong>✅ APIs Intégrées et Fonctionnelles:</strong>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-green-700">
        <div>• 🎵 TikTok: clockworks/tiktok-scraper</div>
        <div>• 📸 Instagram: apify/instagram-api-scraper</div>
        <div>• 📘 Facebook: easyapi/facebook-posts-search-scraper</div>
        <div>• 🐦 Twitter: apidojo/twitter-scraper-lite</div>
        <div>• 📺 YouTube: streamers/youtube-scraper</div>
      </div>
      <p className="text-xs text-green-600 mt-2">
        Toutes les recherches utilisent maintenant les données réelles des APIs Apify configurées.
      </p>
    </div>
  );
};
