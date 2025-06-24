
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, TrendingUp, AlertTriangle, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";

interface AIContext {
  summary: string;
  triggers: string[];
  sentiment: {
    overall: string;
    details: string;
  };
  trends: string[];
  keywords: string[];
  recommendations: string[];
  confidence: number;
  generatedAt: string;
}

export const AIContextGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const aiContext: AIContext = {
    summary: "Cette semaine, les discussions se concentrent autour des réformes éducatives en Côte d'Ivoire avec un pic d'activité notable suite à l'annonce gouvernementale du 15 janvier. Les réactions sont majoritairement positives (68%) avec une forte mobilisation des acteurs éducatifs et des parents d'élèves.",
    triggers: [
      "Annonce officielle des réformes éducatives par le Ministère",
      "Publication d'un rapport sur l'état de l'éducation",
      "Témoignages de parents et enseignants sur les réseaux sociaux",
      "Couverture médiatique intensive du sujet"
    ],
    sentiment: {
      overall: "Majoritairement positif",
      details: "68% positif, 22% neutre, 10% négatif. Les critiques portent principalement sur les délais de mise en œuvre."
    },
    trends: [
      "Hausse de 45% des mentions 'éducation' depuis 3 jours",
      "Engagement multiplié par 2.3 sur les publications éducatives",
      "Émergence du hashtag #ÉducationCI (2.1K mentions)",
      "Participation croissante des influenceurs éducatifs"
    ],
    keywords: [
      "#ÉducationCI", "réforme", "écoles", "enseignants", "parents", 
      "programme", "numérique", "formation", "qualité", "avenir"
    ],
    recommendations: [
      "Capitaliser sur l'élan positif avec du contenu éducatif",
      "Répondre aux inquiétudes sur la mise en œuvre",
      "Engager davantage avec les communautés de parents",
      "Surveiller les mentions négatives pour anticipation"
    ],
    confidence: 87,
    generatedAt: new Date().toLocaleString('fr-FR')
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const handleCopy = () => {
    const contextText = `
CONTEXTE IA - ${aiContext.generatedAt}

RÉSUMÉ EXÉCUTIF:
${aiContext.summary}

DÉCLENCHEURS IDENTIFIÉS:
${aiContext.triggers.map(t => `• ${t}`).join('\n')}

ANALYSE DES SENTIMENTS:
${aiContext.sentiment.overall} - ${aiContext.sentiment.details}

TENDANCES OBSERVÉES:
${aiContext.trends.map(t => `• ${t}`).join('\n')}

MOTS-CLÉS DOMINANTS:
${aiContext.keywords.join(', ')}

RECOMMANDATIONS:
${aiContext.recommendations.map(r => `• ${r}`).join('\n')}

Confiance IA: ${aiContext.confidence}%
    `;
    
    navigator.clipboard.writeText(contextText);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            Contexte généré par l'IA
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className="bg-purple-100 text-purple-800">
              <Sparkles className="w-3 h-3 mr-1" />
              Confiance: {aiContext.confidence}%
            </Badge>
            <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isGenerating}>
              <RefreshCw className={`w-4 h-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Génération...' : 'Actualiser'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-1" />
              Copier
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Dernière génération: {aiContext.generatedAt}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Résumé exécutif */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-l-4 border-purple-500">
          <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Résumé exécutif
          </h4>
          <p className="text-purple-800 leading-relaxed">{aiContext.summary}</p>
        </div>

        {/* Section déclencheurs */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center text-gray-900">
            <TrendingUp className="w-4 h-4 mr-2 text-orange-600" />
            Déclencheurs identifiés
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiContext.triggers.map((trigger, index) => (
              <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm text-orange-800 flex-1">{trigger}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analyse des sentiments */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Analyse des sentiments
          </h4>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-green-800">Tendance générale: </span>
              <Badge className="bg-green-200 text-green-800">{aiContext.sentiment.overall}</Badge>
            </div>
            <p className="text-sm text-green-700">{aiContext.sentiment.details}</p>
          </div>
        </div>

        {/* Tendances observées */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center text-gray-900">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
            Tendances observées
          </h4>
          <div className="space-y-2">
            {aiContext.trends.map((trend, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-blue-50 rounded">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm text-blue-800">{trend}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mots-clés dominants */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Mots-clés dominants</h4>
          <div className="flex flex-wrap gap-2">
            {aiContext.keywords.map((keyword, index) => (
              <Badge key={index} variant="outline" className="bg-gray-50">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Recommandations */}
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
            <Brain className="w-4 h-4 mr-2" />
            Recommandations IA
          </h4>
          <div className="space-y-2">
            {aiContext.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-4 h-4 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm text-yellow-800 flex-1">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Note méthodologique */}
        <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded border-l-2 border-gray-300">
          <p><strong>Méthodologie:</strong> Ce contexte est généré automatiquement par analyse des données de veille sur les 7 derniers jours. L'IA combine l'analyse sémantique, la détection d'anomalies et les corrélations temporelles pour fournir un résumé contextualisé.</p>
        </div>
      </CardContent>
    </Card>
  );
};
