
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, TrendingUp } from "lucide-react";
import { useSearchResults } from "@/hooks/useSearchResults";
import { useGeographicData } from "@/hooks/useGeographicData";
import { useSocialMediaData } from "@/hooks/useSocialMediaData";

interface GeographicData {
  country: string;
  countryCode: string;
  posts: number;
  engagement: number;
  percentage: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  topCities: {
    city: string;
    posts: number;
  }[];
  flag: string;
}

export const GeographicDistribution = () => {
  const { searchResults, loading } = useSearchResults();
  const { geographicData, loading: geoLoading } = useGeographicData();
  const { posts } = useSocialMediaData();

  if (loading || geoLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Combiner les données géographiques de Supabase avec les résultats de recherche
  const processedGeographicData: GeographicData[] = [];

  // Traiter les données géographiques de la table geographic_data
  geographicData.forEach(geoItem => {
    const countryData = processedGeographicData.find(item => item.country === geoItem.country);
    if (countryData) {
      countryData.posts += geoItem.mentions;
      countryData.engagement += geoItem.mentions * 10; // Estimation de l'engagement
    } else {
      processedGeographicData.push({
        country: geoItem.country,
        countryCode: geoItem.country.slice(0, 2).toUpperCase(),
        posts: geoItem.mentions,
        engagement: geoItem.mentions * 10,
        percentage: 0, // Sera calculé plus tard
        sentiment: geoItem.sentiment_score > 0.5 ? 'positive' : geoItem.sentiment_score < -0.5 ? 'negative' : 'neutral',
        topCities: [{ city: geoItem.region, posts: geoItem.mentions }],
        flag: getCountryFlag(geoItem.country)
      });
    }
  });

  // Ajouter les données des posts de médias sociaux (estimation géographique basée sur le contenu)
  posts.forEach(post => {
    // Estimation simple basée sur des mots-clés dans le contenu
    const estimatedCountry = extractCountryFromContent(post.content);
    if (estimatedCountry) {
      const countryData = processedGeographicData.find(item => item.country === estimatedCountry);
      if (countryData) {
        countryData.posts += 1;
        countryData.engagement += (post.engagement?.likes || 0) + (post.engagement?.shares || 0);
      } else {
        processedGeographicData.push({
          country: estimatedCountry,
          countryCode: estimatedCountry.slice(0, 2).toUpperCase(),
          posts: 1,
          engagement: (post.engagement?.likes || 0) + (post.engagement?.shares || 0),
          percentage: 0,
          sentiment: post.sentiment === 'positive' ? 'positive' : post.sentiment === 'negative' ? 'negative' : 'neutral',
          topCities: [{ city: 'Non spécifié', posts: 1 }],
          flag: getCountryFlag(estimatedCountry)
        });
      }
    }
  });

  // Calculer les pourcentages
  const totalPosts = processedGeographicData.reduce((sum, item) => sum + item.posts, 0);
  processedGeographicData.forEach(item => {
    item.percentage = totalPosts > 0 ? (item.posts / totalPosts) * 100 : 0;
  });

  // Trier par nombre de posts
  processedGeographicData.sort((a, b) => b.posts - a.posts);

  function getCountryFlag(country: string): string {
    const flags: Record<string, string> = {
      "Côte d'Ivoire": "🇨🇮",
      "France": "🇫🇷",
      "Sénégal": "🇸🇳",
      "Burkina Faso": "🇧🇫",
      "Mali": "🇲🇱",
      "Ghana": "🇬🇭",
      "Nigeria": "🇳🇬",
      "Maroc": "🇲🇦",
      "Cameroun": "🇨🇲",
      "Tunisia": "🇹🇳"
    };
    return flags[country] || "🌍";
  }

  function extractCountryFromContent(content: string): string | null {
    const countryKeywords: Record<string, string[]> = {
      "Côte d'Ivoire": ["abidjan", "yamoussoukro", "bouaké", "côte d'ivoire", "ivoirien"],
      "France": ["paris", "lyon", "marseille", "france", "français"],
      "Sénégal": ["dakar", "thiès", "sénégal", "sénégalais"],
      "Mali": ["bamako", "mali", "malien"],
      "Burkina Faso": ["ouagadougou", "burkina", "burkinabé"],
      "Ghana": ["accra", "ghana", "ghanéen"],
      "Nigeria": ["lagos", "abuja", "nigeria", "nigérian"],
      "Maroc": ["casablanca", "rabat", "maroc", "marocain"],
      "Cameroun": ["yaoundé", "douala", "cameroun", "camerounais"]
    };

    const lowerContent = content.toLowerCase();
    for (const [country, keywords] of Object.entries(countryKeywords)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        return country;
      }
    }
    return null;
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const totalEngagement = processedGeographicData.reduce((sum, item) => sum + item.engagement, 0);

  if (processedGeographicData.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-600" />
              Répartition géographique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Globe className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune donnée géographique disponible</h3>
              <p className="text-gray-600">
                Effectuez des recherches pour voir la répartition géographique de vos mentions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-600" />
            Répartition géographique globale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatNumber(totalPosts)}</div>
                <div className="text-sm text-blue-700">Publications géolocalisées</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{processedGeographicData.length}</div>
                <div className="text-sm text-green-700">Pays identifiés</div>
              </div>
            </div>

            {processedGeographicData.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Zone d'influence principale</h4>
                <div className="p-4 border-2 border-orange-200 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{processedGeographicData[0].flag}</span>
                    <div>
                      <h5 className="font-medium">{processedGeographicData[0].country}</h5>
                      <p className="text-sm text-gray-600">Pays dominant</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    <div>• {processedGeographicData[0].percentage.toFixed(1)}% des publications</div>
                    <div>• {formatNumber(processedGeographicData[0].engagement)} interactions</div>
                    <div>• Sentiment globalement {processedGeographicData[0].sentiment === 'positive' ? 'positif' : processedGeographicData[0].sentiment === 'negative' ? 'négatif' : 'neutre'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Détail par pays */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-green-600" />
            Détail par pays et régions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processedGeographicData.map((country, index) => (
              <div key={country.countryCode} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <h4 className="font-medium">{country.country}</h4>
                      <p className="text-sm text-gray-600">
                        {country.percentage.toFixed(1)}% du total • {formatNumber(country.posts)} publications
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSentimentColor(country.sentiment)}>
                      {country.sentiment === 'positive' ? 'Positif' : 
                       country.sentiment === 'negative' ? 'Négatif' : 'Neutre'}
                    </Badge>
                    <Badge variant="outline">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-sm mb-2">Métriques</h5>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Publications: {formatNumber(country.posts)}</div>
                      <div>Engagement: {formatNumber(country.engagement)}</div>
                      <div>Part du trafic: {country.percentage.toFixed(1)}%</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm mb-2">Principales régions</h5>
                    <div className="space-y-1">
                      {country.topCities.slice(0, 3).map((city, cityIndex) => (
                        <div key={cityIndex} className="flex justify-between text-sm">
                          <span className="text-gray-700">{city.city}</span>
                          <span className="font-medium">{formatNumber(city.posts)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(country.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights géographiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Insights géographiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Observations clés</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {processedGeographicData.length > 0 && (
                  <>
                    <li className="flex items-start space-x-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>Forte concentration en {processedGeographicData[0].country} ({processedGeographicData[0].percentage.toFixed(1)}% des publications)</span>
                    </li>
                    {processedGeographicData.length > 1 && (
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>Présence significative en {processedGeographicData[1].country} ({processedGeographicData[1].percentage.toFixed(1)}%)</span>
                      </li>
                    )}
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Couverture sur {processedGeographicData.length} pays différents</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Opportunités</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">→</span>
                  <span>Renforcer la présence dans les régions principales</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">→</span>
                  <span>Explorer de nouveaux marchés géographiques</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 font-bold">→</span>
                  <span>Adapter le contenu aux spécificités locales</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
