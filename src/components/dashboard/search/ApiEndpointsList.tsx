
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Globe, MessageSquare, Play, Search, Users } from "lucide-react";

export const ApiEndpointsList = () => {
  const apiEndpoints = [
    // TikTok APIs
    {
      name: "TikTok",
      icon: "🎵",
      endpoint: "/api/scrape/tiktok",
      description: "Scraper TikTok par hashtags",
      maxResults: 100,
      active: true,
      category: "Social Media"
    },
    {
      name: "TikTok Free",
      icon: "🎵",
      endpoint: "/api/scrape/tiktok/free",
      description: "Scraper TikTok gratuitement avec clockworks~free-tiktok-scraper",
      maxResults: 50,
      active: true,
      category: "Social Media"
    },
    {
      name: "TikTok Location",
      icon: "📍",
      endpoint: "/api/scrape/tiktok/location",
      description: "Scraper TikTok par géolocalisation",
      maxResults: 50,
      active: true,
      category: "Social Media"
    },

    // Facebook APIs
    {
      name: "Facebook Posts Ideal",
      icon: "📘",
      endpoint: "/api/scrape/facebook-posts-ideal",
      description: "Scraper des publications Facebook via des URLs",
      maxResults: 100,
      active: true,
      category: "Social Media"
    },
    {
      name: "Facebook",
      icon: "📘",
      endpoint: "/api/scrape/facebook",
      description: "Scraper Facebook par mots-clés",
      maxResults: 80,
      active: true,
      category: "Social Media"
    },
    {
      name: "Facebook Posts",
      icon: "📘",
      endpoint: "/api/scrape/facebook-posts",
      description: "Scraper des posts Facebook par mots-clés",
      maxResults: 60,
      active: true,
      category: "Social Media"
    },
    {
      name: "Facebook Reviews",
      icon: "⭐",
      endpoint: "/api/scrape/facebook-reviews",
      description: "Scraper les avis/reviews d'une page Facebook",
      maxResults: 50,
      active: true,
      category: "Social Media"
    },
    {
      name: "Facebook Page Posts",
      icon: "📄",
      endpoint: "/api/scrape/facebook-page-posts",
      description: "Scraper les publications d'une page Facebook",
      maxResults: 80,
      active: true,
      category: "Social Media"
    },
    {
      name: "Facebook Page Search",
      icon: "🔍",
      endpoint: "/api/scrape/facebook/page-search",
      description: "Scraper des pages Facebook par mots-clés",
      maxResults: 40,
      active: true,
      category: "Social Media"
    },
    {
      name: "Facebook Page Likes",
      icon: "👍",
      endpoint: "/api/scrape/facebook-page-likes",
      description: "Scraper les pages aimées par une page Facebook",
      maxResults: 30,
      active: true,
      category: "Social Media"
    },
    {
      name: "Facebook Search Scraper",
      icon: "🔍",
      endpoint: "/api/scrape/facebook/search-scraper",
      description: "Scraper des résultats Facebook avec apify~facebook-search-scraper",
      maxResults: 100,
      active: true,
      category: "Social Media"
    },
    {
      name: "Facebook Posts",
      icon: "📝",
      endpoint: "/api/scrape/facebook",
      description: "Scraper des posts Facebook par mots-clés",
      maxResults: 100,
      active: true,
      category: "Social Media"
    },
    {
      name: "Facebook Page Search",
      icon: "📄",
      endpoint: "/api/scrape/facebook/page-search",
      description: "Scraper des pages Facebook par mots-clés",
      maxResults: 100,
      active: true,
      category: "Social Media"
    },
    {
      name: "Facebook Posts URLs",
      icon: "🔗",
      endpoint: "/api/scrape/facebook-posts-ideal",
      description: "Scraper des publications Facebook via des URLs",
      maxResults: 50,
      active: true,
      category: "Social Media"
    },
    {
      name: "Facebook URL ID",
      icon: "🔗",
      endpoint: "/api/scrape/facebook-url-id",
      description: "Convertir une URL Facebook en ID",
      maxResults: 1,
      active: true,
      category: "Utility"
    },

    // Instagram APIs
    {
      name: "Instagram General",
      icon: "📸",
      endpoint: "/api/scrape/instagram-general",
      description: "Scraper Instagram (profil, hashtags, lieux ou URL directe)",
      maxResults: 80,
      active: true,
      category: "Social Media"
    },
    {
      name: "Instagram",
      icon: "📸",
      endpoint: "/api/scrape/instagram",
      description: "Scraper Instagram par usernames",
      maxResults: 60,
      active: true,
      category: "Social Media"
    },
    {
      name: "Instagram Posts",
      icon: "📸",
      endpoint: "/api/scrape/instagram-posts",
      description: "Scraper les posts d'un compte Instagram",
      maxResults: 60,
      active: true,
      category: "Social Media"
    },
    {
      name: "Instagram Hashtag",
      icon: "#️⃣",
      endpoint: "/api/scrape/instagram/hashtag",
      description: "Scraper les publications Instagram par hashtag",
      maxResults: 60,
      active: true,
      category: "Social Media"
    },
    {
      name: "Instagram API",
      icon: "🔌",
      endpoint: "/api/scrape/instagram/api",
      description: "Scraper via l'API Instagram officielle (profil, publications...)",
      maxResults: 50,
      active: true,
      category: "Social Media"
    },
    {
      name: "Instagram General V2",
      icon: "📱",
      endpoint: "/api/scrape/instagram-general",
      description: "Scraper Instagram (profil, hashtags, lieux ou URL directe)",
      maxResults: 50,
      active: true,
      category: "Social Media"
    },
    {
      name: "Instagram Reels",
      icon: "🎬",
      endpoint: "/api/scrape/instagram/reels",
      description: "Scraper les Reels Instagram d'un utilisateur",
      maxResults: 30,
      active: true,
      category: "Social Media"
    },
    {
      name: "Instagram Location",
      icon: "📍",
      endpoint: "/api/scrape/instagram/location",
      description: "Scraper les posts Instagram par location",
      maxResults: 40,
      active: true,
      category: "Social Media"
    },
    {
      name: "Instagram Comments",
      icon: "💬",
      endpoint: "/api/scrape/instagram/comments",
      description: "Scraper les commentaires d'un post Instagram",
      maxResults: 100,
      active: true,
      category: "Social Media"
    },
    {
      name: "Instagram Profile",
      icon: "👤",
      endpoint: "/api/scrape/instagram-profile",
      description: "Scraper un profil Instagram complet",
      maxResults: 50,
      active: true,
      category: "Social Media"
    },

    // Twitter/X APIs
    {
      name: "Twitter",
      icon: "🐦",
      endpoint: "/api/scrape/twitter",
      description: "Scraper Twitter par mots-clés",
      maxResults: 80,
      active: true,
      category: "Social Media"
    },
    {
      name: "Twitter Tweets",
      icon: "🐦",
      endpoint: "/api/scrape/twitter/tweets",
      description: "Scraper les tweets d'un compte Twitter",
      maxResults: 60,
      active: true,
      category: "Social Media"
    },
    {
      name: "X Post Replies",
      icon: "💬",
      endpoint: "/api/scrape/x-post-replies",
      description: "Scraper les réponses d'un post X (ex-Twitter)",
      maxResults: 50,
      active: true,
      category: "Social Media"
    },

    // YouTube APIs
    {
      name: "YouTube",
      icon: "📺",
      endpoint: "/api/scrape/youtube",
      description: "Scraper YouTube par mots-clés",
      maxResults: 100,
      active: true,
      category: "Video"
    },
    {
      name: "YouTube Comments",
      icon: "💬",
      endpoint: "/api/scrape/youtube-comments",
      description: "Scraper les commentaires YouTube d'une vidéo",
      maxResults: 100,
      active: true,
      category: "Video"
    },
    {
      name: "YouTube Channel Video",
      icon: "📺",
      endpoint: "/api/scrape/youtube-channel-video",
      description: "Scraper les vidéos d'une chaîne YouTube",
      maxResults: 40,
      active: true,
      category: "Video"
    },

    // Web Scraping APIs
    {
      name: "Google Search",
      icon: "🔍",
      endpoint: "/api/scrape/google-search",
      description: "Résultats de recherche Google",
      maxResults: 30,
      active: true,
      category: "Web"
    },
    {
      name: "Website Content",
      icon: "🌐",
      endpoint: "/api/scrape/website-content",
      description: "Scraper le contenu de sites web",
      maxResults: 20,
      active: true,
      category: "Web"
    },
    {
      name: "Blog Content",
      icon: "📝",
      endpoint: "/api/scrape/blog-content",
      description: "Scraper le contenu de blogs",
      maxResults: 25,
      active: true,
      category: "Web"
    },
    {
      name: "Cheerio",
      icon: "🕷️",
      endpoint: "/api/scrape/cheerio",
      description: "Scraping web avec Cheerio",
      maxResults: 50,
      active: true,
      category: "Web"
    },

    // Analytics APIs
    {
      name: "Social Emails",
      icon: "📧",
      endpoint: "/api/scrape/social-emails",
      description: "Scraper des emails sur les réseaux sociaux par mot-clé",
      maxResults: 30,
      active: true,
      category: "Analytics"
    },
    {
      name: "Social Analytics",
      icon: "📊",
      endpoint: "/api/scrape/social/analytics",
      description: "Scraper les statistiques sociales",
      maxResults: 20,
      active: true,
      category: "Analytics"
    }
  ];

  const categories = ["Social Media", "Video", "Web", "Analytics", "Utility"];
  const totalAPIs = apiEndpoints.length;
  const activeAPIs = apiEndpoints.filter(api => api.active).length;

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Mes APIs Backend Fiables</span>
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="bg-green-100 px-3 py-1 rounded-full">
              <span className="text-green-800 font-medium">🚀 Backend: https://yimbapulseapi.a-car.ci</span>
            </div>
            <div className="bg-blue-100 px-3 py-1 rounded-full">
              <span className="text-blue-800 font-medium">{activeAPIs}/{totalAPIs} APIs actives</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* APIs par catégorie */}
      {categories.map(category => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apiEndpoints
                .filter(api => api.category === category)
                .map((api, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{api.icon}</span>
                        <h4 className="font-medium text-sm">{api.name}</h4>
                      </div>
                      {api.active && (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Actif
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-3">{api.description}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        Max: {api.maxResults} résultats
                      </span>
                      <code className="text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded">
                        {api.endpoint}
                      </code>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Note technique */}
      <Card>
        <CardContent className="p-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">📡 Informations techniques</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Base URL:</strong> https://yimbapulseapi.a-car.ci</li>
              <li>• <strong>Méthode:</strong> POST pour tous les endpoints</li>
              <li>• <strong>Format:</strong> JSON Request/Response</li>
              <li>• <strong>Cache:</strong> 10 minutes par recherche</li>
              <li>• <strong>Traitement:</strong> Séquentiel pour éviter la surcharge</li>
              <li>• <strong>Total endpoints disponibles:</strong> {totalAPIs} APIs harmonisées</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
