
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Heart, MessageSquare, Share, Eye, Download, ExternalLink, FileText, FileImage } from "lucide-react";
import jsPDF from 'jspdf';

interface TikTokPost {
  likes: number;
  comments: number;
  shares: number;
  views?: number;
  platform: string;
  postId: string;
  author: string;
  content: string;
  url: string;
  timestamp: string;
}

interface TikTokDetailedResultsProps {
  tikTokResults: Array<{
    search_term: string;
    platform: string;
    total_mentions: number;
    results_data: TikTokPost[];
  }>;
  canExportData: boolean;
}

export const TikTokDetailedResults = ({ tikTokResults, canExportData }: TikTokDetailedResultsProps) => {
  // Récupérer toutes les vidéos TikTok RÉELLES uniquement
  const allTikTokPosts = tikTokResults.flatMap(result => {
    console.log('📱 Traitement résultat TikTok RÉEL:', {
      searchTerm: result.search_term,
      totalMentions: result.total_mentions,
      dataLength: result.results_data?.length || 0
    });
    
    // Retourner uniquement les données réelles - pas de simulation
    return result.results_data || [];
  });

  console.log('📊 Posts TikTok RÉELS à afficher:', allTikTokPosts.length);

  const exportToJSON = () => {
    const dataStr = JSON.stringify(allTikTokPosts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tiktok_results_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text('Résultats TikTok - Données Réelles', 20, 20);
    
    let yPosition = 40;
    
    allTikTokPosts.forEach((post, index) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(12);
      pdf.text(`Vidéo ${index + 1}:`, 20, yPosition);
      pdf.setFontSize(10);
      pdf.text(`Auteur: @${post.author}`, 20, yPosition + 10);
      pdf.text(`Likes: ${post.likes.toLocaleString()}`, 20, yPosition + 20);
      pdf.text(`Commentaires: ${post.comments.toLocaleString()}`, 20, yPosition + 30);
      pdf.text(`Partages: ${post.shares.toLocaleString()}`, 20, yPosition + 40);
      if (post.views) {
        pdf.text(`Vues: ${post.views.toLocaleString()}`, 20, yPosition + 50);
      }
      
      yPosition += 70;
    });
    
    pdf.save(`tiktok_results_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToCSV = () => {
    const headers = ['Auteur', 'Contenu', 'Likes', 'Commentaires', 'Partages', 'Vues', 'URL', 'Date'];
    const csvContent = [
      headers.join(','),
      ...allTikTokPosts.map(post => [
        `"${post.author}"`,
        `"${post.content.replace(/"/g, '""')}"`,
        post.likes,
        post.comments,
        post.shares,
        post.views || 0,
        `"${post.url}"`,
        `"${new Date(post.timestamp).toLocaleDateString('fr-FR')}"`
      ].join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tiktok_results_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (allTikTokPosts.length === 0) {
    const totalMentions = tikTokResults.reduce((sum, result) => sum + result.total_mentions, 0);
    
    return (
      <Card className="border-pink-200 bg-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-pink-600" />
            <span>Résultats TikTok détaillés</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-gray-600 mb-2">
              {totalMentions > 0 
                ? `${totalMentions} mentions TikTok détectées mais aucune donnée détaillée disponible via l'API.`
                : 'Aucune vidéo TikTok trouvée pour cette recherche via l\'API.'
              }
            </p>
            <p className="text-sm text-gray-500">
              Vérifiez votre configuration API ou essayez d'autres mots-clés.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-pink-200 bg-pink-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-pink-600" />
            <span>🎵 Résultats TikTok détaillés - Données Réelles ({allTikTokPosts.length} vidéos)</span>
          </CardTitle>
          {canExportData && (
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
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {allTikTokPosts.map((post, index) => (
            <div key={`${post.postId}-${index}`} className="border border-pink-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-pink-500 text-white">
                    TikTok Réel
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {post.timestamp ? new Date(post.timestamp).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Date inconnue'}
                  </span>
                </div>
                {post.url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={post.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Voir sur TikTok
                    </a>
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-gray-900">@{post.author || 'Auteur inconnu'}</span>
              </div>

              <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                {post.content || 'Contenu non disponible'}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-red-600">
                    <Heart className="w-4 h-4" />
                    <span className="font-medium">{(post.likes || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-600">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">{(post.comments || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600">
                    <Share className="w-4 h-4" />
                    <span className="font-medium">{(post.shares || 0).toLocaleString()}</span>
                  </div>
                  {post.views && (
                    <div className="flex items-center space-x-1 text-purple-600">
                      <Eye className="w-4 h-4" />
                      <span className="font-medium">{post.views.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
