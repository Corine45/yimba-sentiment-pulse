
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  popularity: number;
}

interface LanguageDetectionResult {
  language: string;
  confidence: number;
  alternatives: Array<{
    language: string;
    confidence: number;
  }>;
}

export const useLanguageAPI = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [popularLanguages, setPopularLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const supportedLanguages: Language[] = [
    { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷', popularity: 95 },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', popularity: 100 },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', popularity: 85 },
    { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇪🇸', popularity: 90 },
    { code: 'pt', name: 'Português', nativeName: 'Português', flag: '🇵🇹', popularity: 75 },
    { code: 'de', name: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪', popularity: 70 },
    { code: 'it', name: 'Italiano', nativeName: 'Italiano', flag: '🇮🇹', popularity: 65 },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', popularity: 80 },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', popularity: 95 },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', popularity: 60 },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', popularity: 55 },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', popularity: 85 },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', popularity: 45 },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', popularity: 30 },
    { code: 'yo', name: 'Yoruba', nativeName: 'Èdè Yorùbá', flag: '🇳🇬', popularity: 25 },
    { code: 'ha', name: 'Hausa', nativeName: 'Harshen Hausa', flag: '🇳🇬', popularity: 35 },
  ];

  const detectLanguage = async (text: string): Promise<LanguageDetectionResult | null> => {
    setLoading(true);
    try {
      // Simulation de détection de langue
      // En production, utiliser une vraie API comme Google Translate API ou Azure Cognitive Services
      
      const languagePatterns = {
        'fr': /\b(le|la|les|de|du|des|et|est|une?|avec|pour|dans|sur|par|être|avoir)\b/gi,
        'en': /\b(the|and|is|of|to|in|that|have|for|not|with|you|this|but|his|from|they|she|her|been|than|its|who|oil)\b/gi,
        'ar': /[\u0600-\u06FF]/g,
        'es': /\b(el|la|de|que|y|en|un|es|se|no|te|lo|le|da|su|por|son|con|para|una|del|los|las|pero|sus|ese|fue|está|todo|más|puede|muy|ser|han)\b/gi,
        'pt': /\b(o|a|de|que|e|do|da|em|um|para|é|com|não|uma|os|no|se|na|por|mais|as|dos|como|mas|foi|ao|ele|das|tem|à|seu|sua|ou|ser|quando|muito|há|nos|já|está|eu|também|só|pelo|pela|até|isso|ela|entre|era|depois|sem|mesmo|aos|ter|seus|quem|nas|tão|nem|seus|minha|têm|numa|pelos|pelas|esse|eles|essa|num|até|suas|meu|às|minha|numa|dela|deles|delas|desta|deste|nessa|nesse|numa|nuns|numas|àquele|àquela|àqueles|àquelas)\b/gi,
        'de': /\b(der|die|und|in|den|von|zu|das|mit|sich|des|auf|für|ist|im|dem|nicht|ein|eine|als|auch|es|an|werden|aus|er|hat|dass|sie|nach|wird|bei|einer|um|am|sind|noch|wie|einem|über|einen|so|zum|war|haben|nur|oder|aber|vor|zur|bis|unter|andere|kann|seine|gegen|vom|durch|wenn|ohne)\b/gi,
      };

      let bestMatch = { language: 'en', confidence: 0.1 };
      
      for (const [langCode, pattern] of Object.entries(languagePatterns)) {
        const matches = text.match(pattern);
        const confidence = matches ? (matches.length / text.split(/\s+/).length) : 0;
        
        if (confidence > bestMatch.confidence) {
          bestMatch = { language: langCode, confidence };
        }
      }

      const result: LanguageDetectionResult = {
        language: bestMatch.language,
        confidence: Math.min(bestMatch.confidence * 100, 95),
        alternatives: [
          { language: 'en', confidence: 15 },
          { language: 'fr', confidence: 10 },
        ].filter(alt => alt.language !== bestMatch.language)
      };

      console.log('Langue détectée:', result);
      return result;
      
    } catch (error) {
      console.error('Erreur lors de la détection de langue:', error);
      toast({
        title: "Erreur",
        description: "Impossible de détecter la langue",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getLanguageInfo = (code: string): Language | undefined => {
    return supportedLanguages.find(lang => lang.code === code);
  };

  const getPopularLanguagesForRegion = (region: string): Language[] => {
    // Retourner les langues populaires selon la région
    const regionLanguages = {
      'africa': supportedLanguages.filter(lang => 
        ['fr', 'en', 'ar', 'sw', 'am', 'yo', 'ha'].includes(lang.code)
      ),
      'europe': supportedLanguages.filter(lang => 
        ['fr', 'en', 'de', 'es', 'it', 'pt', 'ru'].includes(lang.code)
      ),
      'asia': supportedLanguages.filter(lang => 
        ['en', 'zh', 'ja', 'ko', 'hi', 'ar'].includes(lang.code)
      ),
      'americas': supportedLanguages.filter(lang => 
        ['en', 'es', 'pt', 'fr'].includes(lang.code)
      ),
    };

    return regionLanguages[region.toLowerCase() as keyof typeof regionLanguages] || 
           supportedLanguages.slice(0, 6);
  };

  useEffect(() => {
    setLanguages(supportedLanguages);
    setPopularLanguages(
      supportedLanguages
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 10)
    );
  }, []);

  return {
    languages,
    popularLanguages,
    loading,
    detectLanguage,
    getLanguageInfo,
    getPopularLanguagesForRegion,
  };
};
