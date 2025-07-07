import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MentionResult } from "@/services/api/types";
import { Cloud, TrendingUp, Palette } from "lucide-react";

interface WordCloudProps {
  mentions: MentionResult[];
}

export const WordCloud = ({ mentions }: WordCloudProps) => {
  const extractWordFrequency = (mentions: MentionResult[]) => {
    const wordMap = new Map<string, { count: number, sentiment: string, emoji: string }>();
    const stopWords = new Set([
      'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'ou', 'mais', 'donc', 'or', 'ni', 'car',
      'ce', 'ces', 'cette', 'cet', 'se', 'me', 'te', 'nous', 'vous', 'ils', 'elles', 'on', 'je', 'tu', 'il', 'elle',
      'dans', 'sur', 'avec', 'pour', 'par', 'sans', 'sous', 'vers', 'chez', 'entre', 'jusqu', 'depuis',
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'over', 'after',
      'a', 'an', 'as', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'these', 'those', 'is', 'not', 'no', 'yes'
    ]);

    console.log(`🌈 ANALYSE NUAGE DE MOTS ENRICHI sur ${mentions.length} mentions`);

    mentions.forEach((mention, index) => {
      const content = mention.content.toLowerCase();
      const mentionSentiment = mention.sentiment || 'neutral';
      
      const words = content.match(/[a-zA-ZÀ-ÿ0-9#@🔥💯⭐️❤️👍😍🎉]+/g) || [];
      
      words.forEach(word => {
        if (word.length >= 2 && !stopWords.has(word.replace(/[🔥💯⭐️❤️👍😍🎉]/g, ''))) {
          let weight = 1;
          let emoji = '';
          let sentiment = mentionSentiment;
          
          if (word.startsWith('#')) {
            weight = 3;
            emoji = '🔥';
            sentiment = 'positive';
          } else if (word.startsWith('@')) {
            weight = 2;
            emoji = '👤';
            sentiment = 'positive';
          } else if (/[🔥💯⭐️❤️👍😍🎉]/.test(word)) {
            weight = 4;
            emoji = word.match(/[🔥💯⭐️❤️👍😍🎉]/)?.[0] || '✨';
            sentiment = 'positive';
          } else {
            if (mentionSentiment === 'positive') emoji = '😊';
            else if (mentionSentiment === 'negative') emoji = '😔';
            else emoji = '⚪';
          }
          
          const existing = wordMap.get(word);
          if (existing) {
            existing.count += weight;
          } else {
            wordMap.set(word, { count: weight, sentiment, emoji });
          }
        }
      });
    });

    const wordArray = Array.from(wordMap.entries())
      .map(([word, data]) => ({ word, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 60);

    return wordArray;
  };

  const wordFrequency = extractWordFrequency(mentions);
  const maxFreq = Math.max(...wordFrequency.map(item => item.count), 1);

  const getVibrантColor = (word: string, sentiment: string, intensity: number) => {
    const baseIntensity = 0.6 + (intensity * 0.4);
    
    switch (sentiment) {
      case 'positive':
        return `linear-gradient(135deg, rgba(34, 197, 94, ${baseIntensity}), rgba(16, 185, 129, ${baseIntensity + 0.2}))`;
      case 'negative':
        return `linear-gradient(135deg, rgba(239, 68, 68, ${baseIntensity}), rgba(220, 38, 127, ${baseIntensity + 0.2}))`;
      default:
        return `linear-gradient(135deg, rgba(107, 114, 128, ${baseIntensity}), rgba(75, 85, 99, ${baseIntensity + 0.2}))`;
    }
  };

  const getFontSize = (count: number) => {
    const ratio = count / maxFreq;
    return Math.max(14, Math.min(40, 14 + ratio * 26));
  };

  if (wordFrequency.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cloud className="w-5 h-5 text-blue-600" />
            <span>Nuage de mots enrichi</span>
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

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-purple-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nuage de mots enrichi & coloré
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-600">{wordFrequency.length} termes</span>
          </div>
        </CardTitle>
        <div className="text-sm text-gray-600 flex items-center space-x-4">
          <span>📊 Analysé sur {mentions.length} mentions</span>
          <span>🎨 Couleurs vives activées</span>
          <span>😍 Émojis intégrés</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          className="relative min-h-96 bg-gradient-to-br from-indigo-50 via-purple-25 to-pink-50 overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #f0f9ff 0%, #fdf4ff 50%, #fef7f0 100%)',
            position: 'relative'
          }}
        >
          {/* Effets de fond décoratifs */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-300 rounded-full blur-3xl"></div>
            <div className="absolute top-20 right-16 w-40 h-40 bg-purple-300 rounded-full blur-3xl"></div>
            <div className="absolute bottom-16 left-20 w-36 h-36 bg-pink-300 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative p-8 flex flex-wrap items-center justify-center gap-3">
            {wordFrequency.map((item, index) => {
              const intensity = item.count / maxFreq;
              const fontSize = getFontSize(item.count);
              
              return (
                <div
                  key={`${item.word}-${index}`}
                  className="inline-flex items-center px-4 py-2 rounded-2xl font-bold cursor-pointer transform transition-all duration-300 hover:scale-110 hover:rotate-1 hover:shadow-xl border border-white/30 backdrop-blur-sm animate-float"
                  style={{
                    fontSize: `${fontSize}px`,
                    background: getVibrантColor(item.word, item.sentiment, intensity),
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                    boxShadow: `0 4px 15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)`,
                    animationDelay: `${index * 0.1}s`
                  }}
                  title={`"${item.word}" apparaît ${item.count} fois • Sentiment: ${item.sentiment}`}
                >
                  <span className="mr-2 text-lg">{item.emoji}</span>
                  <span className="font-extrabold tracking-wide">{item.word}</span>
                  <span className="ml-2 text-xs bg-black/20 px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Légende colorée améliorée */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <span className="font-medium">😊 Positifs</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500"></div>
              <span className="font-medium">😔 Négatifs</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-gray-400 to-gray-600"></div>
              <span className="font-medium">⚪ Neutres</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            100% { transform: translateY(-10px) rotate(2deg); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite alternate;
          }
        `
      }} />
    </Card>
  );
};
