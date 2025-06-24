
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

interface SourceData {
  totalPosts: number;
  uniqueAuthors: number;
  diversityRatio: number;
  concentration: {
    top1Percent: number;
    top5Percent: number;
    top10Percent: number;
  };
  authorDistribution: {
    range: string;
    authors: number;
    posts: number;
    percentage: number;
  }[];
  riskLevel: 'low' | 'medium' | 'high';
}

export const SourceDiversity = () => {
  const sourceData: SourceData = {
    totalPosts: 7214,
    uniqueAuthors: 3456,
    diversityRatio: 0.48, // posts/authors ratio
    concentration: {
      top1Percent: 25.3,  // % des posts par le top 1% des auteurs
      top5Percent: 52.1,  // % des posts par le top 5% des auteurs
      top10Percent: 71.8  // % des posts par le top 10% des auteurs
    },
    authorDistribution: [
      { range: "1 publication", authors: 2134, posts: 2134, percentage: 61.8 },
      { range: "2-5 publications", authors: 876, posts: 2456, percentage: 25.3 },
      { range: "6-10 publications", authors: 234, posts: 1678, percentage: 6.8 },
      { range: "11-20 publications", authors: 134, posts: 1789, percentage: 3.9 },
      { range: "21+ publications", authors: 78, posts: 2157, percentage: 2.3 }
    ],
    riskLevel: 'medium'
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getRiskText = (level: string) => {
    switch (level) {
      case 'low': return 'Diversité saine';
      case 'medium': return 'Concentration modérée';
      case 'high': return 'Forte concentration';
      default: return 'À analyser';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Diversité des sources
          </div>
          <Badge className={getRiskColor(sourceData.riskLevel)}>
            {getRiskIcon(sourceData.riskLevel)}
            <span className="ml-1">{getRiskText(sourceData.riskLevel)}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{formatNumber(sourceData.totalPosts)}</div>
            <div className="text-sm text-blue-700">Publications totales</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{formatNumber(sourceData.uniqueAuthors)}</div>
            <div className="text-sm text-green-700">Auteurs uniques</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{sourceData.diversityRatio.toFixed(2)}</div>
            <div className="text-sm text-purple-700">Ratio diversité</div>
            <div className="text-xs text-purple-600 mt-1">
              (publications/auteurs)
            </div>
          </div>
        </div>

        {/* Analyse de concentration */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Concentration des sources
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Top 1% des auteurs</span>
              <div className="flex items-center space-x-2">
                <Progress value={sourceData.concentration.top1Percent} className="w-32" />
                <span className="text-sm font-medium w-12">{sourceData.concentration.top1Percent}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Top 5% des auteurs</span>
              <div className="flex items-center space-x-2">
                <Progress value={sourceData.concentration.top5Percent} className="w-32" />
                <span className="text-sm font-medium w-12">{sourceData.concentration.top5Percent}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Top 10% des auteurs</span>
              <div className="flex items-center space-x-2">
                <Progress value={sourceData.concentration.top10Percent} className="w-32" />
                <span className="text-sm font-medium w-12">{sourceData.concentration.top10Percent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Distribution des auteurs */}
        <div className="space-y-4">
          <h4 className="font-medium">Répartition par activité</h4>
          <div className="space-y-3">
            {sourceData.authorDistribution.map((item, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{item.range}</span>
                  <Badge variant="outline">{item.percentage}%</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">{formatNumber(item.authors)}</span> auteurs
                  </div>
                  <div>
                    <span className="font-medium">{formatNumber(item.posts)}</span> publications
                  </div>
                </div>
                <Progress value={item.percentage} className="mt-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Insights et recommandations */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">💡 Analyse et recommandations</h4>
          <div className="space-y-2 text-sm text-gray-700">
            {sourceData.riskLevel === 'medium' && (
              <>
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>Concentration modérée : 25% des publications proviennent de seulement 1% des auteurs</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Bonne base de diversité : 62% des auteurs ne publient qu'une seule fois</span>
                </div>
                <div className="flex items-start space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Recommandation : Surveiller les auteurs très actifs pour détecter d'éventuelles campagnes organisées</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Indicateurs de qualité */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-3 border rounded-lg">
            <div className="text-lg font-bold text-gray-900">Authentique</div>
            <div className="text-sm text-gray-600">Signal de conversation naturelle détecté</div>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-lg font-bold text-gray-900">À surveiller</div>
            <div className="text-sm text-gray-600">Quelques auteurs très actifs identifiés</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
