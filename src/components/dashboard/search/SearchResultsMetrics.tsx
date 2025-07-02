
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Eye, FileText, FileImage } from "lucide-react";
import jsPDF from 'jspdf';

interface SearchResultsMetricsProps {
  totalMentions: number;
  positivePercentage: number;
  negativePercentage: number;
  neutralPercentage: number;
  totalReach: number;
  totalEngagement: number;
  userRole: string;
  canExportData: boolean;
  searchTerm?: string;
  searchResults?: any[];
}

export const SearchResultsMetrics = ({
  totalMentions,
  positivePercentage,
  negativePercentage,
  neutralPercentage,
  totalReach,
  totalEngagement,
  userRole,
  canExportData,
  searchTerm,
  searchResults = []
}: SearchResultsMetricsProps) => {
  
  const exportToJSON = () => {
    const dataStr = JSON.stringify(searchResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resultats_${searchTerm || 'recherche'}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text(`Rapport de recherche: ${searchTerm || 'Données'}`, 20, 20);
    
    pdf.setFontSize(12);
    pdf.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 40);
    pdf.text(`Total mentions: ${totalMentions.toLocaleString()}`, 20, 60);
    pdf.text(`Sentiment positif: ${positivePercentage}%`, 20, 80);
    pdf.text(`Sentiment négatif: ${negativePercentage}%`, 20, 100);
    pdf.text(`Sentiment neutre: ${neutralPercentage}%`, 20, 120);
    pdf.text(`Portée totale: ${(totalReach / 1000).toFixed(1)}K`, 20, 140);
    pdf.text(`Engagements totaux: ${(totalEngagement / 1000).toFixed(1)}K`, 20, 160);
    
    pdf.save(`rapport_${searchTerm || 'recherche'}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToCSV = () => {
    const headers = ['Plateforme', 'Mentions', 'Sentiment Positif', 'Sentiment Négatif', 'Portée', 'Engagement'];
    const csvContent = [
      headers.join(','),
      ...searchResults.map(result => [
        result.platform,
        result.total_mentions || 0,
        result.positive_sentiment || 0,
        result.negative_sentiment || 0,
        result.total_reach || 0,
        result.total_engagement || 0
      ].join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `donnees_${searchTerm || 'recherche'}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Résultats de recherche {searchTerm && `pour "${searchTerm}"`} - Données Réelles</span>
          </CardTitle>
          {canExportData && searchResults.length > 0 && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={exportToJSON}>
                <Download className="w-4 h-4 mr-2" />
                JSON
              </Button>
              <Button variant="outline" size="sm" onClick={exportToPDF}>
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <FileImage className="w-4 h-4 mr-2" />
                CSV
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalMentions.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Mentions trouvées</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{positivePercentage}%</div>
            <div className="text-sm text-gray-600">Sentiment positif</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{negativePercentage}%</div>
            <div className="text-sm text-gray-600">Sentiment négatif</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{neutralPercentage}%</div>
            <div className="text-sm text-gray-600">Sentiment neutre</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{(totalReach / 1000).toFixed(1)}K</div>
            <div className="text-sm text-gray-600">Portée totale</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{(totalEngagement / 1000).toFixed(1)}K</div>
            <div className="text-sm text-gray-600">Engagements totaux</div>
          </div>
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{searchResults.length}</div>
            <div className="text-sm text-gray-600">Plateformes analysées</div>
          </div>
        </div>
        
        {userRole === "observateur" && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <p className="text-sm text-blue-800">
              <Eye className="w-4 h-4 inline mr-1" />
              Mode consultation - Vous visualisez les résultats en lecture seule
            </p>
          </div>
        )}

        {searchTerm && totalMentions === 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Aucune mention trouvée pour "{searchTerm}" via les APIs. Vérifiez la configuration ou essayez d'autres mots-clés.
            </p>
          </div>
        )}

        {totalMentions > 0 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Données récupérées en temps réel via les APIs configurées
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
