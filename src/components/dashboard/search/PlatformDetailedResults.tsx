
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share, Eye, Download, ExternalLink, FileText, FileImage } from "lucide-react";
import jsPDF from 'jspdf';

interface PlatformPost {
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

interface PlatformDetailedResultsProps {
  platformResults: Array<{
    search_term: string;
    platform: string;
    total_mentions: number;
    results_data: PlatformPost[];
  }>;
  platformName: string;
  canExportData: boolean;
}

export const PlatformDetailedResults = ({ platformResults, platformName, canExportData }: PlatformDetailedResultsProps) => {
  // Récupérer tous les posts de la plateforme
  const allPlatformPosts = platformResults.flatMap(result => {
    console.log(`📱 Traitement résultat ${platformName} RÉEL:`, {
      searchTerm: result.search_term,
      totalMentions: result.total_mentions,
      dataLength: result.results_data?.length || 0,
      platform: result.platform
    });
    
    if (result.platform.toLowerCase() === platformName.toLowerCase() && result.results_data && Array.isArray(result.results_data)) {
      console.log(`✅ Données ${platformName} RÉELLES trouvées:`, result.results_data.length);
      return result.results_data;
    }
    
    return [];
  });

  console.log(`📊 Posts ${platformName} RÉELS à afficher:`, allPlatformPosts.length);

  const exportToJSON = () => {
    const dataStr = JSON.stringify(allPlatformPosts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${platformName.toLowerCase()}_results_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text(`Résultats ${platformName} - Données Réelles`, 20, 20);
    
    let yPosition = 40;
    
    allPlatformPosts.forEach((post, index) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(12);
      pdf.text(`Post ${index + 1}:`, 20, yPosition);
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
    
    pdf.save(`${platformName.toLowerCase()}_results_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToCSV = () => {
    const headers = ['Auteur', 'Contenu', 'Likes', 'Commentaires', 'Partages', 'Vues', 'URL', 'Date'];
    const csvContent = [
      headers.join(','),
      ...allPlatformPosts.map(post => [
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
    link.download = `${platformName.toLowerCase()}_results_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getPlatformIcon = () => {
    switch (platformName.toLowerCase()) {
      case 'tiktok': return '🎵';
      case 'instagram': return '📸';
      case 'facebook': return '📘';
      case 'twitter': return '🐦';
      case 'youtube': return '📺';
      default: return '📱';
    }
  };

  const getPlatformColor = () => {
    switch (platformName.toLowerCase()) {
      case 'tiktok': return 'border-pink-200 bg-pink-50';
      case 'instagram': return 'border-purple-200 bg-purple-50';
      case 'facebook': return 'border-blue-200 bg-blue-50';
      case 'twitter': return 'border-cyan-200 bg-cyan-50';
      case 'youtube': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const totalMentions = platformResults.reduce((sum, result) => 
    result.platform.toLowerCase() === platformName.toLowerCase() ? sum + result.total_mentions : sum, 0);

  if (allPlatformPosts.length === 0) {
    return (
      <Card className={getPlatformColor()}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>{getPlatformIcon()}</span>
            <span>Résultats {platformName} détaillés</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-gray-600 mb-2">
              {totalMentions > 0 
                ? `${totalMentions} mentions ${platformName} détectées mais données détaillées en cours de récupération via l'API.`
                : `Aucun contenu ${platformName} trouvé pour cette recherche via l'API ${platformName}.`
              }
            </p>
            <p className="text-sm text-gray-500">
              Vérifiez votre configuration API {platformName} ou essayez d'autres mots-clés.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={getPlatformColor()}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>{getPlatformIcon()}</span>
            <span>Résultats {platformName} détaillés - Données Réelles API ({allPlatformPosts.length} posts)</span>
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
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✅ Données récupérées en temps réel via l'API {platformName}
          </p>
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {allPlatformPosts.map((post, index) => (
            <div key={`${post.postId}-${index}`} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge className={`bg-${platformName.toLowerCase() === 'tiktok' ? 'pink' : platformName.toLowerCase() === 'instagram' ? 'purple' : platformName.toLowerCase() === 'facebook' ? 'blue' : platformName.toLowerCase() === 'twitter' ? 'cyan' : 'red'}-500 text-white`}>
                    {platformName} API
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
                      Voir sur {platformName}
                    </a>
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-gray-900">@{post.author}</span>
              </div>

              <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                {post.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-red-600">
                    <Heart className="w-4 h-4" />
                    <span className="font-medium">{post.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-600">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">{post.comments.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600">
                    <Share className="w-4 h-4" />
                    <span className="font-medium">{post.shares.toLocaleString()}</span>
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
