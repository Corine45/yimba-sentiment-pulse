
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MentionResult } from "@/services/api/types";
import { Cloud, TrendingUp } from "lucide-react";

interface WordCloudProps {
  mentions: MentionResult[];
}

export const WordCloud = ({ mentions }: WordCloudProps) => {
  // Fonction améliorée pour extraire et analyser les mots
  const extractWordFrequency = (mentions: MentionResult[]) => {
    const wordMap = new Map<string, number>();
    const stopWords = new Set([
      'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'ou', 'mais', 'donc', 'or', 'ni', 'car',
      'ce', 'ces', 'cette', 'cet', 'se', 'me', 'te', 'nous', 'vous', 'ils', 'elles', 'on', 'je', 'tu', 'il', 'elle',
      'dans', 'sur', 'avec', 'pour', 'par', 'sans', 'sous', 'vers', 'chez', 'entre', 'jusqu', 'depuis',
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'over', 'after',
      'a', 'an', 'as', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'these', 'those', 'is', 'not', 'no', 'yes'
    ]);

    console.log(`🔤 ANALYSE DU NUAGE DE MOTS sur ${mentions.length} mentions`);

    mentions.forEach((mention, index) => {
      const content = mention.content.toLowerCase();
      console.log(`📝 Mention ${index + 1}: "${content.substring(0, 100)}..."`);
      
      // Extraire les mots (lettres, chiffres, accents)
      const words = content.match(/[a-zA-ZÀ-ÿ0-9#@]+/g) || [];
      
      words.forEach(word => {
        if (word.length >= 3 && !stopWords.has(word)) {
          // Bonus pour les hashtags et mentions
          const weight = word.startsWith('#') || word.startsWith('@') ? 2 : 1;
          wordMap.set(word, (wordMap.get(word) || 0) + weight);
        }
      });

      // Extraire aussi les expressions importantes (2-3 mots)
      const phrases = content.match(/[a-zA-ZÀ-ÿ\s]{6,30}/g) || [];
      phrases.forEach(phrase => {
        const cleanPhrase = phrase.trim();
        if (cleanPhrase.length > 6 && cleanPhrase.split(' ').length >= 2 && cleanPhrase.split(' ').length <= 3) {
          const words = cleanPhrase.split(' ');
          const hasStopWord = words.some(w => stopWords.has(w));
          if (!hasStopWord) {
            wordMap.set(cleanPhrase, (wordMap.get(cleanPhrase) || 0) + 1);
          }
        }
      });
    });

    // Convertir en array et trier par fréquence
    const wordArray = Array.from(wordMap.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 50); // Top 50 mots

    console.log(`💎 Top 10 mots extraits:`, wordArray.slice(0, 10));
    return wordArray;
  };

  const wordFrequency = extractWordFrequency(mentions);
  const maxFreq = Math.max(...wordFrequency.map(([,freq]) => freq), 1);

  // Calculer des couleurs dynamiques basées sur le sentiment
  const getWordColor = (word: string, freq: number) => {
    const intensity = freq / maxFreq;
    
    // Mots positifs en vert
    const positiveWords = ['bon', 'bien', 'excellent', 'super', 'génial', 'parfait', 'love', 'amazing', 'great', 'good'];
    if (positiveWords.some(pw => word.includes(pw))) {
      return `rgba(34, 197, 94, ${0.4 + intensity * 0.6})`;
    }
    
    // Mots négatifs en rouge
    const negativeWords = ['mauvais', 'nul', 'horrible', 'problème', 'erreur', 'bad', 'awful', 'terrible', 'hate'];
    if (negativeWords.some(nw => word.includes(nw))) {
      return `rgba(239, 68, 68, ${0.4 + intensity * 0.6})`;
    }
    
    // Hashtags en bleu
    if (word.startsWith('#')) {
      return `rgba(59, 130, 246, ${0.4 + intensity * 0.6})`;
    }
    
    // Mentions en violet
    if (word.startsWith('@')) {
      return `rgba(147, 51, 234, ${0.4 + intensity * 0.6})`;
    }
    
    // Autres mots en gris avec intensité
    return `rgba(107, 114, 128, ${0.3 + intensity * 0.7})`;
  };

  const getFontSize = (freq: number) => {
    const ratio = freq / maxFreq;
    return Math.max(12, Math.min(32, 12 + ratio * 20));
  };

  if (wordFrequency.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cloud className="w-5 h-5 text-blue-600" />
            <span>Nuage de mots</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Cloud className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucune donnée pour générer le nuage de mots</p>
            <p className="text-sm mt-2">Effectuez une recherche pour voir les mots-clés tendance</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cloud className="w-5 h-5 text-blue-600" />
            <span>Nuage de mots enrichi</span>
          </div>
          <TrendingUp className="w-4 h-4 text-green-600" />
        </CardTitle>
        <div className="text-sm text-gray-600">
          Analysé sur {mentions.length} mentions • {wordFrequency.length} termes uniques
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative min-h-64 flex flex-wrap items-center justify-center gap-2 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
          {wordFrequency.map(([word, freq], index) => (
            <span
              key={`${word}-${index}`}
              className="inline-block px-2 py-1 rounded-md font-medium cursor-pointer hover:scale-110 transition-transform duration-200 shadow-sm"
              style={{
                fontSize: `${getFontSize(freq)}px`,
                backgroundColor: getWordColor(word, freq),
                color: 'white',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}
              title={`"${word}" apparaît ${freq} fois`}
            >
              {word}
              <span className="ml-1 text-xs opacity-75">({freq})</span>
            </span>
          ))}
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Mots positifs</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Mots négatifs</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Hashtags</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
