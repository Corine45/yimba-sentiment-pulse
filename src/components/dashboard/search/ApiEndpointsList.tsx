
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Server, CheckCircle } from "lucide-react";

export const ApiEndpointsList = () => {
  const apiEndpoints = [
    {
      platform: 'TikTok',
      endpoint: '/api/scrape/tiktok-posts',
      description: 'Récupération des posts TikTok par hashtag',
      icon: '🎵',
      status: 'active',
      maxResults: 100
    },
    {
      platform: 'Facebook',
      endpoint: '/api/scrape/facebook-posts-ideal',
      description: 'Récupération des posts Facebook par recherche',
      icon: '📘',
      status: 'active',
      maxResults: 100
    },
    {
      platform: 'Instagram',
      endpoint: '/api/scrape/instagram-profile',
      description: 'Récupération des posts Instagram par profil',
      icon: '📸',
      status: 'active',
      maxResults: 50
    },
    {
      platform: 'Twitter/X',
      endpoint: '/api/scrape/x-twitter',
      description: 'Récupération des tweets par recherche',
      icon: '🐦',
      status: 'active',
      maxResults: 80
    },
    {
      platform: 'YouTube',
      endpoint: '/api/scrape/youtube-channel-video',
      description: 'Récupération des vidéos YouTube par recherche',
      icon: '📺',
      status: 'active',
      maxResults: 50
    },
    {
      platform: 'Google',
      endpoint: '/api/scrape/google-search',
      description: 'Résultats de recherche Google',
      icon: '🔍',
      status: 'active',
      maxResults: 30
    },
    {
      platform: 'Web',
      endpoint: '/api/scrape/cheerio',
      description: 'Scraping web multi-sources',
      icon: '🌐',
      status: 'active',
      maxResults: 'variable'
    }
  ];

  const testEndpoint = async (endpoint: string, platform: string) => {
    try {
      console.log(`🧪 Test de l'endpoint ${platform}: ${endpoint}`);
      // Ici on pourrait faire un test réel de l'endpoint
      alert(`Test de l'API ${platform} - Endpoint: ${endpoint}`);
    } catch (error) {
      console.error(`❌ Erreur test ${platform}:`, error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Server className="w-5 h-5" />
          <span>APIs Backend Disponibles</span>
          <Badge className="bg-green-100 text-green-800">
            {apiEndpoints.length} Actives
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Base URL: <code className="bg-gray-100 px-2 py-1 rounded">https://yimbapulseapi.a-car.ci</code>
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {apiEndpoints.map((api) => (
            <div key={api.platform} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{api.icon}</span>
                    <h4 className="font-medium">{api.platform}</h4>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {api.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{api.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <code className="bg-gray-100 px-2 py-1 rounded">{api.endpoint}</code>
                    <span>Max: {api.maxResults} résultats</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => testEndpoint(api.endpoint, api.platform)}
                  >
                    Test
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <a 
                      href={`https://yimbapulseapi.a-car.ci${api.endpoint}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-800 mb-2">ℹ️ Informations importantes</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Toutes les APIs sont optimisées pour des recherches en temps réel</li>
            <li>• Cache de 10 minutes pour éviter les requêtes répétitives</li>
            <li>• Filtres avancés appliqués après récupération des données</li>
            <li>• Transformation automatique des données vers un format uniforme</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
