
export class SentimentAnalyzer {
  private static positiveKeywords = [
    // Français
    'excellent', 'super', 'génial', 'parfait', 'merveilleux', 'fantastique', 'formidable',
    'bravo', 'félicitations', 'merci', 'magnifique', 'extraordinaire', 'remarquable',
    'incroyable', 'splendide', 'fabuleux', 'sensationnel', 'admirable', 'exceptionnel',
    'réussi', 'brillant', 'impressionnant', 'satisfait', 'heureux', 'joie', 'bonheur',
    'content', 'ravi', 'enchanté', 'top', 'cool', 'bien', 'bon', 'beau', 'belle',
    
    // Anglais
    'love', 'amazing', 'awesome', 'great', 'wonderful', 'fantastic', 'excellent',
    'perfect', 'outstanding', 'brilliant', 'superb', 'magnificent', 'marvelous',
    'incredible', 'spectacular', 'remarkable', 'exceptional', 'impressive',
    'thanks', 'grateful', 'happy', 'joy', 'blessed', 'satisfied', 'pleased',
    'delighted', 'thrilled', 'excited', 'best', 'good', 'nice', 'beautiful',
    
    // Emojis positifs
    '😍', '😊', '😃', '😄', '😁', '🤩', '🥰', '😘', '👍', '👏', '🙌', '💪',
    '❤️', '💕', '💖', '💯', '🔥', '⭐', '🌟', '✨', '🎉', '🎊', '🥳', '👌'
  ];

  private static negativeKeywords = [
    // Français
    'horrible', 'nul', 'mauvais', 'décevant', 'terrible', 'affreux', 'catastrophe',
    'problème', 'erreur', 'bug', 'panne', 'échec', 'raté', 'moche', 'laid',
    'dégoûtant', 'insupportable', 'inacceptable', 'scandaleux', 'honteux',
    'irritant', 'agaçant', 'ennuyeux', 'triste', 'déçu', 'mécontent', 'fâché',
    'colère', 'furieux', 'énervé', 'frustré', 'inquiet', 'stressé', 'peur',
    
    // Anglais
    'hate', 'awful', 'terrible', 'horrible', 'disgusting', 'worst', 'bad', 'poor',
    'disappointing', 'disappointing', 'frustrating', 'annoying', 'irritating',
    'unacceptable', 'pathetic', 'useless', 'broken', 'failed', 'disaster',
    'sorry', 'problem', 'issue', 'error', 'bug', 'wrong', 'fail', 'sad',
    'angry', 'mad', 'upset', 'disappointed', 'worried', 'scared', 'afraid',
    
    // Emojis négatifs
    '😢', '😭', '😠', '😡', '🤬', '😤', '😞', '😔', '😟', '😕', '🙁', '☹️',
    '👎', '💔', '😰', '😨', '😱', '🤮', '🤢', '😵', '💀', '👿', '😈'
  ];

  static analyzeSentiment(content: string, engagement?: any): 'positive' | 'negative' | 'neutral' {
    const lowerContent = content.toLowerCase();
    
    let positiveScore = 0;
    let negativeScore = 0;
    
    // Comptage avec pondération
    this.positiveKeywords.forEach(keyword => {
      const matches = (lowerContent.match(new RegExp(keyword, 'gi')) || []).length;
      if (matches > 0) {
        positiveScore += matches * (keyword.length > 5 ? 2 : 1);
      }
    });
    
    this.negativeKeywords.forEach(keyword => {
      const matches = (lowerContent.match(new RegExp(keyword, 'gi')) || []).length;
      if (matches > 0) {
        negativeScore += matches * (keyword.length > 5 ? 2 : 1);
      }
    });

    // Analyse de l'engagement
    if (engagement) {
      const totalEngagement = (engagement.likes || 0) + (engagement.comments || 0) + (engagement.shares || 0);
      const views = engagement.views || 0;
      const engagementRate = views > 0 ? (totalEngagement / views) * 100 : 0;

      if (engagementRate > 5 || totalEngagement > 100) {
        positiveScore += 1;
      } else if (engagementRate < 1 && totalEngagement < 10) {
        negativeScore += 1;
      }
    }

    const sentimentDifference = positiveScore - negativeScore;
    const confidenceThreshold = 2;
    
    if (sentimentDifference > confidenceThreshold) return 'positive';
    if (sentimentDifference < -confidenceThreshold) return 'negative';
    return 'neutral';
  }
}
