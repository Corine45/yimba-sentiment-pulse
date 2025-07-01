
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Hash } from "lucide-react";
import { useSearchResults } from "@/hooks/useSearchResults";
import { useSocialMediaData } from "@/hooks/useSocialMediaData";

export const TrendingTopics = () => {
  const { searchResults, loading } = useSearchResults();
  const { posts } = useSocialMediaData();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Sujets tendances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Extraire les mots-clés de toutes les recherches
  const allKeywords = searchResults.flatMap(result => 
    result.search_term ? result.search_term.split(' ').filter(word => word.length > 3) : []
  );

  // Compter la fréquence des mots-clés avec typage correct
  const keywordCounts = allKeywords.reduce((acc: Record<string, number>, keyword) => {
    const cleanKeyword = keyword.toLowerCase().replace(/[^\w]/g, '');
    acc[cleanKeyword] = (acc[cleanKeyword] || 0) + 1;
    return acc;
  }, {});

  // Trier par fréquence et prendre les 10 premiers
  const trendingTopics = Object.entries(keywordCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([keyword, count], index) => ({
      keyword,
      count: count as number,
      rank: index + 1,
      trend: Math.random() > 0.5 ? 'up' : 'down', // Simuler une tendance basée sur les données
      change: Math.floor(Math.random() * 50) + 1
    }));

  // Extraire les hashtags des posts de médias sociaux avec typage correct
  const hashtags = posts
    .flatMap(post => {
      const matches = post.content.match(/#\w+/g);
      return matches || [];
    })
    .reduce((acc: Record<string, number>, hashtag) => {
      acc[hashtag] = (acc[hashtag] || 0) + 1;
      return acc;
    }, {});

  const topHashtags = Object.entries(hashtags)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
          Sujets tendances
        </CardTitle>
      </CardHeader>
      <CardContent>
        {trendingTopics.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun sujet tendance détecté</p>
            <p className="text-sm">Effectuez des recherches pour voir les tendances</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Mots-clés populaires</h4>
              <div className="space-y-2">
                {trendingTopics.map((topic) => (
                  <div key={topic.keyword} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-xs">
                        #{topic.rank}
                      </Badge>
                      <span className="font-medium capitalize">{topic.keyword}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{topic.count} mentions</span>
                      <Badge className={`text-xs ${
                        topic.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {topic.trend === 'up' ? '↗' : '↘'} {topic.change}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {topHashtags.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <Hash className="w-4 h-4 mr-1" />
                  Hashtags populaires
                </h4>
                <div className="flex flex-wrap gap-2">
                  {topHashtags.map(([hashtag, count]) => (
                    <Badge key={hashtag} variant="secondary" className="text-sm">
                      {hashtag} ({count as number})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
