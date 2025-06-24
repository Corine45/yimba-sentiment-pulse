
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Eye, TrendingUp, Target, Zap } from "lucide-react";

interface ReachData {
  totalPotentialReach: number;
  actualViews: number;
  reachRate: number;
  platformReach: {
    platform: string;
    potential: number;
    actual: number;
    rate: number;
    color: string;
  }[];
  audienceSegments: {
    segment: string;
    size: number;
    engagement: number;
    percentage: number;
  }[];
  viralityScore: number;
  impactLevel: 'low' | 'medium' | 'high' | 'viral';
}

export const PotentialReach = () => {
  const reachData: ReachData = {
    totalPotentialReach: 2450000,
    actualViews: 892000,
    reachRate: 36.4,
    platformReach: [
      {
        platform: 'Facebook',
        potential: 1200000,
        actual: 456000,
        rate: 38.0,
        color: '#1877F2'
      },
      {
        platform: 'Twitter',
        potential: 580000,
        actual: 234000,
        rate: 40.3,
        color: '#1DA1F2'
      },
      {
        platform: 'Instagram',
        potential: 420000,
        actual: 145000,
        rate: 34.5,
        color: '#E4405F'
      },
      {
        platform: 'YouTube',
        potential: 180000,
        actual: 45000,
        rate: 25.0,
        color: '#FF0000'
      },
      {
        platform: 'TikTok',
        potential: 70000,
        actual: 12000,
        rate: 17.1,
        color: '#000000'
      }
    ],
    audienceSegments: [
      {
        segment: 'Jeunes adultes (18-34)',
        size: 534000,
        engagement: 8.7,
        percentage: 59.9
      },
      {
        segment: 'Adultes (35-54)',
        size: 267000,
        engagement: 6.2,
        percentage: 29.9
      },
      {
        segment: 'Seniors (55+)',
        size: 91000,
        engagement: 4.1,
        percentage: 10.2
      }
    ],
    viralityScore: 73,
    impactLevel: 'high'
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'viral': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactText = (level: string) => {
    switch (level) {
      case 'low': return 'Impact faible';
      case 'medium': return 'Impact modéré';
      case 'high': return 'Impact élevé';
      case 'viral': return 'Potentiel viral';
      default: return 'À analyser';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Eye className="w-5 h-5 mr-2 text-blue-600" />
            Portée potentielle et impact
          </div>
          <Badge className={getImpactColor(reachData.impactLevel)}>
            <Zap className="w-3 h-3 mr-1" />
            {getImpactText(reachData.impactLevel)}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{formatNumber(reachData.totalPotentialReach)}</div>
            <div className="text-sm text-blue-700">Portée potentielle</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Eye className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{formatNumber(reachData.actualViews)}</div>
            <div className="text-sm text-green-700">Vues effectives</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{reachData.reachRate}%</div>
            <div className="text-sm text-purple-700">Taux de portée</div>
          </div>
        </div>

        {/* Score de viralité */}
        <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-orange-900 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Score de viralité
            </h4>
            <Badge className="bg-orange-200 text-orange-800 text-lg font-bold">
              {reachData.viralityScore}/100
            </Badge>
          </div>
          <Progress value={reachData.viralityScore} className="mb-2" />
          <p className="text-sm text-orange-800">
            {reachData.viralityScore >= 80 ? "Très forte probabilité de devenir viral" :
             reachData.viralityScore >= 60 ? "Bon potentiel de diffusion large" :
             reachData.viralityScore >= 40 ? "Diffusion modérée attendue" :
             "Diffusion limitée prévue"}
          </p>
        </div>

        {/* Répartition par plateforme */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Portée par plateforme
          </h4>
          
          {reachData.platformReach.map((platform) => (
            <div key={platform.platform} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium" style={{ color: platform.color }}>
                  {platform.platform}
                </h5>
                <Badge variant="outline">
                  {platform.rate}% de portée
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-gray-600">Potentiel</p>
                  <p className="text-lg font-semibold" style={{ color: platform.color }}>
                    {formatNumber(platform.potential)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Atteint</p>
                  <p className="text-lg font-semibold" style={{ color: platform.color }}>
                    {formatNumber(platform.actual)}
                  </p>
                </div>
              </div>
              
              <Progress value={platform.rate} className="h-2" />
            </div>
          ))}
        </div>

        {/* Segments d'audience */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Segments d'audience touchés
          </h4>
          
          <div className="space-y-3">
            {reachData.audienceSegments.map((segment, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium">{segment.segment}</h5>
                  <Badge variant="outline">{segment.percentage}%</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <p className="text-sm text-gray-600">Taille du segment</p>
                    <p className="font-semibold">{formatNumber(segment.size)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Taux d'engagement</p>
                    <p className="font-semibold">{segment.engagement}%</p>
                  </div>
                </div>
                
                <Progress value={segment.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Insights et projections */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Projections et opportunités
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-sm mb-2">Potentiel de croissance</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• {formatNumber(reachData.totalPotentialReach - reachData.actualViews)} personnes supplémentaires atteignables</li>
                <li>• Optimisation possible de {(100 - reachData.reachRate).toFixed(1)}%</li>
                <li>• Facebook et Twitter montrent le meilleur potentiel</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium text-sm mb-2">Recommandations</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Privilégier les contenus pour les 18-34 ans</li>
                <li>• Renforcer la présence sur Instagram</li>
                <li>• Capitaliser sur le score de viralité élevé</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Indicateurs de performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 border rounded-lg">
            <div className="text-lg font-bold text-green-600">Excellent</div>
            <div className="text-sm text-gray-600">Taux de conversion</div>
          </div>
          
          <div className="text-center p-3 border rounded-lg">
            <div className="text-lg font-bold text-blue-600">Très bon</div>
            <div className="text-sm text-gray-600">Engagement organique</div>
          </div>
          
          <div className="text-center p-3 border rounded-lg">
            <div className="text-lg font-bold text-purple-600">Élevé</div>
            <div className="text-sm text-gray-600">Potentiel viral</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
