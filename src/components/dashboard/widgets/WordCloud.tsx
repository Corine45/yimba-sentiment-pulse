
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MentionResult } from "@/services/api/types";
import { Cloud, TrendingUp, Palette, BarChart3 } from "lucide-react";

interface WordCloudProps {
  mentions: MentionResult[];
}

export const WordCloud = ({ mentions }: WordCloudProps) => {
  const extractWordFrequency = (mentions: MentionResult[]) => {
    const wordMap = new Map<string, { count: number, sentiment: string, emoji: string, platforms: Set<string> }>();
    const stopWords = new Set([
      'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'ou', 'mais', 'donc', 'or', 'ni', 'car',
      'ce', 'ces', 'cette', 'cet', 'se', 'me', 'te', 'nous', 'vous', 'ils', 'elles', 'on', 'je', 'tu', 'il', 'elle',
      'dans', 'sur', 'avec', 'pour', 'par', 'sans', 'sous', 'vers', 'chez', 'entre', 'jusqu', 'depuis',
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'over', 'after',
      'a', 'an', 'as', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'these', 'those', 'is', 'not', 'no', 'yes'
    ]);

    console.log(`🌈 ANALYSE NUAGE BRAND24 STYLE sur ${mentions.length} mentions`);

    mentions.forEach((mention, index) => {
      const content = mention.content.toLowerCase();
      const mentionSentiment = mention.sentiment || 'neutral';
      
      const words = content.match(/[a-zA-ZÀ-ÿ0-9#@🔥💯⭐️❤️👍😍🎉🌈🏳️‍🌈]+/g) || [];
      
      words.forEach(word => {
        const cleanWord = word.replace(/[🔥💯⭐️❤️👍😍🎉🌈🏳️‍🌈]/g, '');
        if (cleanWord.length >= 2 && !stopWords.has(cleanWord)) {
          let weight = 1;
          let emoji = '';
          let sentiment = mentionSentiment;
          
          // Termes LGBT+ spéciaux
          if (['gay', 'lgbt', 'lgbtq', 'pride', 'fierté', 'homosexuel', 'lesbienne', 'trans', 'transgender'].includes(cleanWord)) {
            weight = 4;
            emoji = '🏳️‍🌈';
            sentiment = 'positive'; // Représentation = positif
          } else if (word.startsWith('#')) {
            weight = 3;
            emoji = '🔥';
          } else if (word.startsWith('@')) {
            weight = 2;
            emoji = '👤';
          } else if (/[🔥💯⭐️❤️👍😍🎉🌈]/.test(word)) {
            weight = 4;
            emoji = word.match(/[🔥💯⭐️❤️👍😍🎉🌈]/)?.[0] || '✨';
            sentiment = 'positive';
          } else {
            if (mentionSentiment === 'positive') emoji = '💚';
            else if (mentionSentiment === 'negative') emoji = '💔';
            else emoji = '⚪';
          }
          
          const existing = wordMap.get(cleanWord);
          if (existing) {
            existing.count += weight;
            existing.platforms.add(mention.platform);
          } else {
            wordMap.set(cleanWord, { 
              count: weight, 
              sentiment, 
              emoji,
              platforms: new Set([mention.platform])
            });
          }
        }
      });
    });

    const wordArray = Array.from(wordMap.entries())
      .map(([word, data]) => ({ 
        word, 
        ...data, 
        platforms: Array.from(data.platforms) 
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);

    console.log('Top mots trouvés:', wordArray.slice(0, 10));
    return wordArray;
  };

  const wordFrequency = extractWordFrequency(mentions);
  const maxFreq = Math.max(...wordFrequency.map(item => item.count), 1);

  const getBrand24Color = (word: string, sentiment: string, intensity: number) => {
    const baseIntensity = 0.7 + (intensity * 0.3);
    
    switch (sentiment) {
      case 'positive':
        return `linear-gradient(135deg, rgba(16, 185, 129, ${baseIntensity}), rgba(5, 150, 105, ${baseIntensity + 0.2}))`;
      case 'negative':
        return `linear-gradient(135deg, rgba(239, 68, 68, ${baseIntensity}), rgba(220, 38, 127, ${baseIntensity + 0.2}))`;
      default:
        return `linear-gradient(135deg, rgba(99, 102, 241, ${baseIntensity}), rgba(79, 70, 229, ${baseIntensity + 0.2}))`;
    }
  };

  const getFontSize = (count: number) => {
    const ratio = count / maxFreq;
    return Math.max(16, Math.min(44, 16 + ratio * 28));
  };

  if (wordFrequency.length === 0) {
    return (
      <Card className="border-2 border-gray-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center space-x-2">
            <Cloud className="w-5 h-5 text-blue-600" />
            <span>Nuage de mots Style Brand24</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">☁️</div>
            <p className="text-lg">Aucune donnée pour générer le nuage</p>
            <p className="text-sm mt-2">Effectuez une recherche pour voir les mots-clés tendance</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sentimentCounts = {
    positive: wordFrequency.filter(w => w.sentiment === 'positive').length,
    neutral: wordFrequency.filter(w => w.sentiment === 'neutral').length,
    negative: wordFrequency.filter(w => w.sentiment === 'negative').length
  };

  return (
    <Card className="border-2 border-blue-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6" />
            <span className="text-xl font-bold">Analyse Mots-Clés | Style Brand24</span>
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>{wordFrequency.length} termes</span>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full">
              {mentions.length} mentions analysées
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm mt-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>{sentimentCounts.positive} Positifs</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span>{sentimentCounts.negative} Négatifs</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
            <span>{sentimentCounts.neutral} Neutres</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div 
          className="relative min-h-[500px] bg-white overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            position: 'relative'
          }}
        >
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-16 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-16 w-48 h-48 bg-indigo-500 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-purple-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative p-8 flex flex-wrap items-center justify-center gap-4">
            {wordFrequency.map((item, index) => {
              const intensity = item.count / maxFreq;
              const fontSize = getFontSize(item.count);
              
              return (
                <div
                  key={`${item.word}-${index}`}
                  className="inline-flex items-center px-6 py-3 rounded-xl font-bold cursor-pointer transform transition-all duration-300 hover:scale-110 hover:rotate-1 hover:shadow-2xl border-2 border-white/40 backdrop-blur-sm"
                  style={{
                    fontSize: `${fontSize}px`,
                    background: getBrand24Color(item.word, item.sentiment, intensity),
                    color: 'white',
                    textShadow: '2px 2px 6px rgba(0,0,0,0.5)',
                    boxShadow: `0 8px 25px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.4)`,
                    animationDelay: `${index * 0.1}s`,
                    minWidth: '80px',
                    textAlign: 'center'
                  }}
                  title={`"${item.word}" • ${item.count} mentions • Sentiment: ${item.sentiment} • Plateformes: ${item.platforms.join(', ')}`}
                >
                  <span className="mr-2 text-xl">{item.emoji}</span>
                  <div className="flex flex-col items-center">
                    <span className="font-black tracking-wide text-shadow-lg">{item.word}</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-black/30 px-2 py-1 rounded-full font-bold">
                        {item.count}
                      </span>
                      <div className="flex space-x-1">
                        {item.platforms.slice(0, 3).map((platform, idx) => (
                          <span key={idx} className="text-xs bg-white/20 px-1 py-0.5 rounded text-[10px]">
                            {platform.charAt(0)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t-2 border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{sentimentCounts.positive}</div>
              <div className="text-sm text-gray-600 font-medium">Mots Positifs</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(sentimentCounts.positive / wordFrequency.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{sentimentCounts.negative}</div>
              <div className="text-sm text-gray-600 font-medium">Mots Négatifs</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(sentimentCounts.negative / wordFrequency.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{sentimentCounts.neutral}</div>
              <div className="text-sm text-gray-600 font-medium">Mots Neutres</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(sentimentCounts.neutral / wordFrequency.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <p className="font-medium">💡 Les tailles reflètent la fréquence • Les couleurs indiquent le sentiment</p>
            <p className="text-xs mt-1">Analyse basée sur {mentions.length} mentions de vos APIs Yimba Pulse</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
