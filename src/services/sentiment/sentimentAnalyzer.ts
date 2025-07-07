export class SentimentAnalyzer {
  private static positiveKeywords = [
    // Français - Contexte LGBT+ positif
    'acceptation', 'tolérance', 'respect', 'fierté', 'pride', 'soutien', 'amour', 'liberté',
    'égalité', 'diversité', 'inclusion', 'célébration', 'communauté', 'droits', 'reconnaissance',
    'mariage', 'union', 'famille', 'bonheur', 'joie', 'victoire', 'progrès', 'avancée',
    
    // Anglais - Contexte LGBT+ positif
    'acceptance', 'tolerance', 'respect', 'pride', 'support', 'love', 'freedom', 'equality',
    'diversity', 'inclusion', 'celebration', 'community', 'rights', 'recognition', 'marriage',
    'union', 'family', 'happiness', 'joy', 'victory', 'progress', 'advancement',
    
    // Général positif
    'excellent', 'super', 'génial', 'parfait', 'merveilleux', 'fantastique', 'formidable',
    'bravo', 'félicitations', 'merci', 'magnifique', 'extraordinaire', 'remarquable',
    'incroyable', 'splendide', 'fabuleux', 'sensationnel', 'admirable', 'exceptionnel',
    'réussi', 'brillant', 'impressionnant', 'satisfait', 'heureux', 'content', 'ravi',
    'enchanté', 'top', 'cool', 'bien', 'bon', 'beau', 'belle',
    
    // Anglais général
    'amazing', 'awesome', 'great', 'wonderful', 'fantastic', 'excellent', 'perfect',
    'outstanding', 'brilliant', 'superb', 'magnificent', 'marvelous', 'incredible',
    'spectacular', 'remarkable', 'exceptional', 'impressive', 'thanks', 'grateful',
    'happy', 'blessed', 'satisfied', 'pleased', 'delighted', 'thrilled', 'excited',
    'best', 'good', 'nice', 'beautiful',
    
    // Emojis positifs
    '😍', '😊', '😃', '😄', '😁', '🤩', '🥰', '😘', '👍', '👏', '🙌', '💪',
    '❤️', '💕', '💖', '💯', '🔥', '⭐', '🌟', '✨', '🎉', '🎊', '🥳', '👌',
    '🏳️‍🌈', '🌈'
  ];

  private static negativeKeywords = [
    // Français - Contexte LGBT+ négatif
    'discrimination', 'homophobie', 'transphobie', 'rejet', 'haine', 'intolérance',
    'préjugé', 'stigmate', 'exclusion', 'violence', 'agression', 'insulte', 'mépris',
    'condamnation', 'répression', 'interdiction', 'censure', 'persécution',
    
    // Ajout de termes négatifs spécifiques manqués
    'dégoûtant', 'sale', 'pervers', 'anormal', 'malade', 'contre-nature', 'péché',
    'immoral', 'dégénéré', 'abomination', 'pourri', 'infecter', 'contaminer',
    
    // Anglais - Contexte LGBT+ négatif
    'discrimination', 'homophobia', 'transphobia', 'rejection', 'hatred', 'intolerance',
    'prejudice', 'stigma', 'exclusion', 'violence', 'aggression', 'insult', 'contempt',
    'condemnation', 'repression', 'prohibition', 'censorship', 'persecution',
    
    'disgusting', 'sick', 'perverted', 'abnormal', 'unnatural', 'sin', 'immoral',
    'degenerate', 'abomination', 'rotten', 'infect', 'contaminate',
    
    // Général négatif
    'horrible', 'nul', 'mauvais', 'décevant', 'terrible', 'affreux', 'catastrophe',
    'problème', 'erreur', 'bug', 'panne', 'échec', 'raté', 'moche', 'laid',
    'dégoûtant', 'insupportable', 'inacceptable', 'scandaleux', 'honteux',
    'irritant', 'agaçant', 'ennuyeux', 'triste', 'déçu', 'mécontent', 'fâché',
    'colère', 'furieux', 'énervé', 'frustré', 'inquiet', 'stressé', 'peur',
    
    // Anglais général
    'hate', 'awful', 'terrible', 'horrible', 'disgusting', 'worst', 'bad', 'poor',
    'disappointing', 'frustrating', 'annoying', 'irritating', 'unacceptable',
    'pathetic', 'useless', 'broken', 'failed', 'disaster', 'sorry', 'problem',
    'issue', 'error', 'wrong', 'fail', 'sad', 'angry', 'mad', 'upset',
    'disappointed', 'worried', 'scared', 'afraid',
    
    // Emojis négatifs
    '😢', '😭', '😠', '😡', '🤬', '😤', '😞', '😔', '😟', '😕', '🙁', '☹️',
    '👎', '💔', '😰', '😨', '😱', '🤮', '🤢', '😵', '💀', '👿', '😈'
  ];

  static analyzeSentiment(content: string, engagement?: any): 'positive' | 'negative' | 'neutral' {
    const lowerContent = content.toLowerCase();
    
    let positiveScore = 0;
    let negativeScore = 0;
    
    // 🔧 AMÉLIORATION: Algorithme plus équilibré pour LGBT+
    this.positiveKeywords.forEach(keyword => {
      const matches = (lowerContent.match(new RegExp(keyword, 'gi')) || []).length;
      if (matches > 0) {
        let weight = keyword.length > 5 ? 2 : 1;
        // Poids LGBT+ spécifiques
        if (['pride', 'fierté', 'tolérance', 'acceptance', '🏳️‍🌈', '🌈'].includes(keyword)) {
          weight = 3;
        }
        positiveScore += matches * weight;
      }
    });
    
    this.negativeKeywords.forEach(keyword => {
      const matches = (lowerContent.match(new RegExp(keyword, 'gi')) || []).length;
      if (matches > 0) {
        let weight = keyword.length > 5 ? 3 : 2; // Poids plus élevé pour négatif
        // Poids supplémentaire pour termes LGBT+ très négatifs
        if (['homophobie', 'transphobie', 'discrimination', 'haine', 'dégoûtant', 'anormal', 'contre-nature'].includes(keyword)) {
          weight = 5;
        }
        negativeScore += matches * weight;
      }
    });

    // 🔧 CORRECTION: Analyse contextuelle améliorée pour "gay" et "woubi"
    if (lowerContent.includes('gay') || lowerContent.includes('woubi')) {
      const contextPatterns = [
        // Contextes positifs
        { pattern: /(gay|woubi).*(marriage|mariage|couple|amour|love|pride|fierté|célébr|heureux|happy|droit|égalité)/i, score: 2 },
        { pattern: /(marriage|mariage|couple|amour|love|pride|fierté|célébr|heureux|happy|droit|égalité).*(gay|woubi)/i, score: 2 },
        
        // Contextes négatifs
        { pattern: /(gay|woubi).*(contre|against|interdit|ban|problème|problem|sale|dégoûtant|anormal|malade)/i, score: -4 },
        { pattern: /(contre|against|interdit|ban|problème|problem|sale|dégoûtant|anormal|malade).*(gay|woubi)/i, score: -4 },
        
        // Contextes très négatifs
        { pattern: /(gay|woubi).*(haine|hate|mort|kill|tuer|éliminer|exterminer)/i, score: -6 },
        { pattern: /(haine|hate|mort|kill|tuer|éliminer|exterminer).*(gay|woubi)/i, score: -6 }
      ];
      
      contextPatterns.forEach(({ pattern, score }) => {
        if (pattern.test(lowerContent)) {
          if (score > 0) {
            positiveScore += score;
          } else {
            negativeScore += Math.abs(score);
          }
        }
      });
      
      // Si aucun contexte spécifique, léger positif (représentation)
      if (!contextPatterns.some(({ pattern }) => pattern.test(lowerContent))) {
        positiveScore += 0.5;
      }
    }

    // Analyse de l'engagement
    if (engagement) {
      const totalEngagement = (engagement.likes || 0) + (engagement.comments || 0) + (engagement.shares || 0);
      const views = engagement.views || 0;
      const engagementRate = views > 0 ? (totalEngagement / views) * 100 : 0;

      if (engagementRate > 8 || totalEngagement > 200) {
        positiveScore += 1;
      } else if (engagementRate > 4 || totalEngagement > 50) {
        positiveScore += 0.5;
      } else if (engagementRate < 1 && totalEngagement < 5) {
        negativeScore += 0.5;
      }
    }

    const sentimentDifference = positiveScore - negativeScore;
    const confidenceThreshold = 1;
    
    console.log(`🔍 SENTIMENT AMÉLIORÉ: "${content.substring(0, 50)}..." - Positif: ${positiveScore}, Négatif: ${negativeScore}, Différence: ${sentimentDifference}`);
    
    if (sentimentDifference > confidenceThreshold) return 'positive';
    if (sentimentDifference < -confidenceThreshold) return 'negative';
    return 'neutral';
  }
}
