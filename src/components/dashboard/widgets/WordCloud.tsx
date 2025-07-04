
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, TrendingUp } from "lucide-react";
import { useMemo } from "react";

interface WordCloudProps {
  mentions?: Array<{
    content: string;
    platform: string;
    engagement: {
      likes: number;
      comments: number;
      shares: number;
    };
  }>;
}

export const WordCloud = ({ mentions = [] }: WordCloudProps) => {
  const wordFrequency = useMemo(() => {
    if (!mentions.length) {
      // Données par défaut si aucune mention
      return [
        { text: "éducation", size: 48, frequency: 234, color: "#3B82F6" },
        { text: "politique", size: 36, frequency: 189, color: "#10B981" },
        { text: "économie", size: 32, frequency: 156, color: "#F59E0B" },
        { text: "santé", size: 28, frequency: 134, color: "#EF4444" },
        { text: "jeunesse", size: 24, frequency: 98, color: "#8B5CF6" },
        { text: "développement", size: 20, frequency: 87, color: "#06B6D4" },
        { text: "emploi", size: 18, frequency: 76, color: "#84CC16" },
        { text: "formation", size: 16, frequency: 65, color: "#F97316" },
        { text: "infrastructure", size: 14, frequency: 54, color: "#EC4899" },
        { text: "innovation", size: 12, frequency: 43, color: "#6366F1" },
      ];
    }

    // Traitement des mentions réelles
    const wordCount: { [key: string]: number } = {};
    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16", "#F97316", "#EC4899", "#6366F1"];
    
    mentions.forEach(mention => {
      const content = mention.content.toLowerCase();
      const words = content.split(/\s+/)
        .filter(word => word.length > 3)
        .filter(word => !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'may', 'she', 'use', 'your', 'dans', 'avec', 'pour', 'sont', 'mais', 'plus', 'tout', 'bien', 'cette', 'cette', 'leur', 'très', 'aussi'].includes(word))
        .map(word => word.replace(/[^\w]/g, ''));

      words.forEach(word => {
        if (word) {
          wordCount[word] = (wordCount[word] || 0) + 1;
        }
      });
    });

    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15)
      .map(([word, count], index) => ({
        text: word,
        frequency: count,
        size: Math.max(12, Math.min(48, count * 4)),
        color: colors[index % colors.length]
      }));
  }, [mentions]);

  const totalMentions = mentions.length;
  const avgEngagement = mentions.length > 0 
    ? mentions.reduce((sum, m) => sum + m.engagement.likes + m.engagement.comments + m.engagement.shares, 0) / mentions.length 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-blue-600" />
            <span>Nuage de mots - Analyse sémantique</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span>{totalMentions} mentions</span>
            </div>
            <div className="text-gray-600">
              Engagement moy: {Math.round(avgEngagement)}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-8 min-h-[300px] flex flex-wrap items-center justify-center gap-4">
          {wordFrequency.map((word, index) => (
            <span
              key={index}
              className="font-bold cursor-pointer hover:opacity-80 transition-all duration-200 hover:scale-110"
              style={{
                fontSize: `${word.size}px`,
                color: word.color,
                lineHeight: 1.2,
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              }}
              title={`${word.frequency} mentions`}
            >
              {word.text}
            </span>
          ))}
        </div>
        
        {/* Frequency Legend */}
        <div className="mt-6 space-y-2">
          <h4 className="font-medium text-sm flex items-center space-x-2">
            <span>Fréquence des mots-clés</span>
            {mentions.length > 0 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Basé sur {totalMentions} mentions réelles
              </span>
            )}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {wordFrequency.slice(0, 6).map((word, index) => (
              <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                <span className="font-medium" style={{ color: word.color }}>
                  {word.text}
                </span>
                <span className="text-gray-600">{word.frequency}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plateformes les plus mentionnées */}
        {mentions.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h5 className="text-sm font-medium text-blue-800 mb-2">Répartition par plateforme</h5>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(mentions.map(m => m.platform))).map(platform => {
                const count = mentions.filter(m => m.platform === platform).length;
                const percentage = ((count / mentions.length) * 100).toFixed(1);
                return (
                  <div key={platform} className="bg-white px-2 py-1 rounded text-xs">
                    <span className="font-medium">{platform}</span>
                    <span className="text-gray-600 ml-1">({count} - {percentage}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
