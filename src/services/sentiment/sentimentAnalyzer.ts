
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
    
    // Anglais - Contexte LGBT+ négatif
    'discrimination', 'homophobia', 'transphobia', 'rejection', 'hatred', 'intolerance',
    'prejudice', 'stigma', 'exclusion', 'violence', 'aggression', 'insult', 'contempt',
    'condemnation', 'repression', 'prohibition', 'censorship', 'persecution',
    
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
    
    // Comptage avec pondération renforcée pour LGBT+
    this.positiveKeywords.forEach(keyword => {
      const matches = (lowerContent.match(new RegExp(keyword, 'gi')) || []).length;
      if (matches > 0) {
        let weight = keyword.length > 5 ? 3 : 2;
        // Poids supplémentaire pour les termes LGBT+ spécifiques
        if (['pride', 'fierté', 'tolérance', 'acceptance', '🏳️‍🌈', '🌈'].includes(keyword)) {
          weight = 5;
        }
        positiveScore += matches * weight;
      }
    });
    
    this.negativeKeywords.forEach(keyword => {
      const matches = (lowerContent.match(new RegExp(keyword, 'gi')) || []).length;
      if (matches > 0) {
        let weight = keyword.length > 5 ? 3 : 2;
        // Poids supplémentaire pour les termes LGBT+ négatifs
        if (['homophobie', 'transphobie', 'discrimination', 'haine'].includes(keyword)) {
          weight = 5;
        }
        negativeScore += matches * weight;
      }
    });

    // Analyse contextuelle pour "gay" - souvent neutre ou positif selon contexte
    if (lowerContent.includes('gay')) {
      const gayContext = lowerContent.match(/.{0,20}gay.{0,20}/gi);
      if (gayContext) {
        gayContext.forEach(context => {
          if (/marriage|mariage|couple|amour|love|pride|fierté|célébr|heureux|happy/.test(context)) {
            positiveScore += 3;
          } else if (/contre|against|interdit|ban|problème|problem/.test(context)) {
            negativeScore += 3;
          } else {
            // Contexte neutre mais légèrement positif (représentation)
            positiveScore += 1;
          }
        });
      }
    }

    // Analyse de l'engagement - engagement élevé souvent positif
    if (engagement) {
      const totalEngagement = (engagement.likes || 0) + (engagement.comments || 0) + (engagement.shares || 0);
      const views = engagement.views || 0;
      const engagementRate = views > 0 ? (totalEngagement / views) * 100 : 0;

      if (engagementRate > 8 || totalEngagement > 200) {
        positiveScore += 2;
      } else if (engagementRate > 4 || totalEngagement > 50) {
        positiveScore += 1;
      } else if (engagementRate < 1 && totalEngagement < 5) {
        negativeScore += 1;
      }
    }

    const sentimentDifference = positiveScore - negativeScore;
    const confidenceThreshold = 1; // Seuil plus bas pour plus de sensibilité
    
    console.log(`Analyse sentiment: "${content.substring(0, 50)}..." - Positif: ${positiveScore}, Négatif: ${negativeScore}, Différence: ${sentimentDifference}`);
    
    if (sentimentDifference > confidenceThreshold) return 'positive';
    if (sentimentDifference < -confidenceThreshold) return 'negative';
    return 'neutral';
  }
}
