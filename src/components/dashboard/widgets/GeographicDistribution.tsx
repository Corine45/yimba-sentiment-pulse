
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, TrendingUp } from "lucide-react";

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
  const geographicData: GeographicData[] = [
    {
      country: "Côte d'Ivoire",
      countryCode: "CI",
      posts: 4563,
      engagement: 234000,
      percentage: 63.2,
      sentiment: "positive",
      topCities: [
        { city: "Abidjan", posts: 2890 },
        { city: "Bouaké", posts: 567 },
        { city: "Yamoussoukro", posts: 445 },
        { city: "San Pedro", posts: 234 }
      ],
      flag: "🇨🇮"
    },
    {
      country: "France",
      countryCode: "FR", 
      posts: 1234,
      engagement: 89000,
      percentage: 17.1,
      sentiment: "neutral",
      topCities: [
        { city: "Paris", posts: 678 },
        { city: "Lyon", posts: 234 },
        { city: "Marseille", posts: 189 },
        { city: "Toulouse", posts: 133 }
      ],
      flag: "🇫🇷"
    },
    {
      country: "Sénégal",
      countryCode: "SN",
      posts: 567,
      engagement: 45000,
      percentage: 7.9,
      sentiment: "positive",
      topCities: [
        { city: "Dakar", posts: 345 },
        { city: "Thiès", posts: 123 },
        { city: "Saint-Louis", posts: 99 }
      ],
      flag: "🇸🇳"
    },
    {
      country: "Burkina Faso",
      countryCode: "BF",
      posts: 345,
      engagement: 23000,
      percentage: 4.8,
      sentiment: "neutral",
      topCities: [
        { city: "Ouagadougou", posts: 234 },
        { city: "Bobo-Dioulasso", posts: 111 }
      ],
      flag: "🇧🇫"
    },
    {
      country: "Mali",
      countryCode: "ML",
      posts: 289,
      engagement: 18000,
      percentage: 4.0,
      sentiment: "positive",
      topCities: [
        { city: "Bamako", posts: 189 },
        { city: "Sikasso", posts: 100 }
      ],
      flag: "🇲🇱"
    },
    {
      country: "Autres",
      countryCode: "XX",
      posts: 216,
      engagement: 12000,
      percentage: 3.0,
      sentiment: "neutral",
      topCities: [
        { city: "Non localisé", posts: 216 }
      ],
      flag: "🌍"
    }
  ];

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

  const totalPosts = geographicData.reduce((sum, item) => sum + item.posts, 0);
  const totalEngagement = geographicData.reduce((sum, item) => sum + item.engagement, 0);

  return (
    <div className="space-y-6">
      {/* Carte conceptuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-600" />
            Répartition géographique globale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Métriques principales */}
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatNumber(totalPosts)}</div>
                <div className="text-sm text-blue-700">Publications géolocalisées</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{geographicData.length}</div>
                <div className="text-sm text-green-700">Pays identifiés</div>
              </div>
            </div>

            {/* Zone géographique principale */}
            <div className="space-y-3">
              <h4 className="font-medium">Zone d'influence principale</h4>
              <div className="p-4 border-2 border-orange-200 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">🇨🇮</span>
                  <div>
                    <h5 className="font-medium">Côte d'Ivoire</h5>
                    <p className="text-sm text-gray-600">Pays dominant</p>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  <div>• {geographicData[0].percentage}% des publications</div>
                  <div>• {formatNumber(geographicData[0].engagement)} interactions</div>
                  <div>• Sentiment globalement positif</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Détail par pays */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-green-600" />
            Détail par pays et villes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {geographicData.map((country, index) => (
              <div key={country.countryCode} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <h4 className="font-medium">{country.country}</h4>
                      <p className="text-sm text-gray-600">
                        {country.percentage}% du total • {formatNumber(country.posts)} publications
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
                      <div>Part du trafic: {country.percentage}%</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm mb-2">Principales villes</h5>
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

                {/* Barre de progression */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${country.percentage}%` }}
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
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Forte concentration ivoirienne (63% des publications)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Abidjan représente 40% du trafic national</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Présence diaspora française notable (17%)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>Écho régional en Afrique de l'Ouest</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Opportunités</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">→</span>
                  <span>Renforcer la présence en régions ivoiriennes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">→</span>
                  <span>Développer l'audience diaspora</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-600 font-bold">→</span>
                  <span>Étendre l'influence sous-régionale</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
