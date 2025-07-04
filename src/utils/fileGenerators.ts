
import jsPDF from 'jspdf';
import { MentionResult } from '@/services/realApiService';
import { MentionStats } from '@/types/savedMentions';

export class FileGenerators {
  static downloadJson(data: any, filename: string) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  static async generatePDF(
    mentions: MentionResult[],
    keywords: string[],
    platforms: string[],
    stats: MentionStats,
    filename: string
  ) {
    const pdf = new jsPDF('p', 'mm', 'a4');
    let yPosition = 20;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.width;

    // Configuration des polices pour supporter l'UTF-8
    pdf.setFont('helvetica');

    // En-tête du rapport avec encodage correct
    pdf.setFontSize(20);
    pdf.setTextColor(51, 51, 51);
    pdf.text('Rapport d\'Analyse des Mentions', margin, yPosition, { align: 'left' });
    yPosition += 15;

    // Ligne de séparation
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    // Informations générales
    pdf.setFontSize(14);
    pdf.setTextColor(68, 68, 68);
    pdf.text('Informations Generales', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setTextColor(85, 85, 85);
    
    // Utilisation d'une fonction pour encoder correctement le texte
    const safeText = (text: string) => {
      return text.replace(/[^\x00-\x7F]/g, '?'); // Remplace les caractères non-ASCII
    };

    pdf.text(`Mots-cles: ${safeText(keywords.join(', '))}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Plateformes: ${safeText(platforms.join(', '))}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Date de generation: ${new Date().toLocaleDateString('fr-FR')}`, margin, yPosition);
    yPosition += 15;

    // Statistiques principales avec encodage sécurisé
    pdf.setFontSize(14);
    pdf.setTextColor(68, 68, 68);
    pdf.text('Statistiques Principales', margin, yPosition);
    yPosition += 10;

    // Boîtes colorées pour les stats
    pdf.setFontSize(11);
    
    // Total mentions
    pdf.setFillColor(59, 130, 246);
    pdf.roundedRect(margin, yPosition, 40, 12, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text(`${stats.total}`, margin + 20, yPosition + 8, { align: 'center' });
    pdf.setTextColor(85, 85, 85);
    pdf.text('Total Mentions', margin + 45, yPosition + 8);
    yPosition += 20;

    // Sentiment distribution
    const sentimentY = yPosition;
    
    // Positif
    pdf.setFillColor(34, 197, 94);
    pdf.roundedRect(margin, sentimentY, 25, 10, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text(`${stats.positive}`, margin + 12, sentimentY + 7, { align: 'center' });
    pdf.setTextColor(85, 85, 85);
    pdf.text('Positif', margin + 30, sentimentY + 7);

    // Neutre
    pdf.setFillColor(251, 191, 36);
    pdf.roundedRect(margin + 70, sentimentY, 25, 10, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text(`${stats.neutral}`, margin + 82, sentimentY + 7, { align: 'center' });
    pdf.setTextColor(85, 85, 85);
    pdf.text('Neutre', margin + 100, sentimentY + 7);

    // Négatif
    pdf.setFillColor(239, 68, 68);
    pdf.roundedRect(margin + 140, sentimentY, 25, 10, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text(`${stats.negative}`, margin + 152, sentimentY + 7, { align: 'center' });
    pdf.setTextColor(85, 85, 85);
    pdf.text('Negatif', margin + 170, sentimentY + 7);

    yPosition += 25;

    // Engagement total
    pdf.setFillColor(251, 146, 60);
    pdf.roundedRect(margin, yPosition, 50, 12, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text(`${stats.engagement.toLocaleString()}`, margin + 25, yPosition + 8, { align: 'center' });
    pdf.setTextColor(85, 85, 85);
    pdf.text('Engagement Total', margin + 55, yPosition + 8);
    yPosition += 25;

    // Mentions détaillées
    pdf.setFontSize(14);
    pdf.setTextColor(68, 68, 68);
    pdf.text('Mentions Detaillees', margin, yPosition);
    yPosition += 15;

    pdf.setFontSize(9);
    const mentionsToShow = mentions.slice(0, 50);

    mentionsToShow.forEach((mention, index) => {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
      }

      // Numéro et plateforme
      pdf.setTextColor(59, 130, 246);
      pdf.setFontSize(10);
      pdf.text(`${index + 1}. ${safeText(mention.platform)}`, margin, yPosition);
      
      // Auteur avec encodage sécurisé
      pdf.setTextColor(107, 114, 128);
      pdf.text(`par @${safeText(mention.author)}`, margin + 60, yPosition);
      
      // Date
      const date = new Date(mention.timestamp).toLocaleDateString('fr-FR');
      pdf.text(date, 150, yPosition);
      yPosition += 8;

      // Contenu avec encodage sécurisé
      pdf.setTextColor(51, 51, 51);
      pdf.setFontSize(9);
      const content = safeText(mention.content.length > 100 
        ? mention.content.substring(0, 100) + '...' 
        : mention.content);
      
      const lines = pdf.splitTextToSize(content, 160);
      pdf.text(lines.slice(0, 2), margin + 5, yPosition);
      yPosition += lines.length > 1 ? 12 : 6;

      // Métriques d'engagement
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      const engagement = `Likes: ${mention.engagement.likes} | Commentaires: ${mention.engagement.comments} | Partages: ${mention.engagement.shares}`;
      const sentiment = mention.sentiment ? `| Sentiment: ${safeText(mention.sentiment)}` : '';
      pdf.text(`${engagement} ${sentiment}`, margin + 5, yPosition);
      yPosition += 10;

      // Ligne de séparation
      pdf.setDrawColor(230, 230, 230);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
    });

    if (mentions.length > 50) {
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`... et ${mentions.length - 50} autres mentions`, margin, yPosition);
    }

    // Pied de page
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`Page ${i}/${totalPages} - Genere par YimbaPulse`, margin, pageHeight - 10);
    }

    pdf.save(filename);
  }

  static generateCSV(mentions: MentionResult[], filename: string) {
    const headers = [
      'ID',
      'Plateforme',
      'Auteur',
      'Contenu',
      'URL',
      'Date',
      'Heure',
      'Likes',
      'Commentaires',
      'Partages',
      'Vues',
      'Engagement Total',
      'Sentiment',
      'Score d\'influence',
      'Lieu (Ville)',
      'Lieu (Pays)',
      'Coordonnees'
    ];

    // Fonction pour nettoyer le texte et éviter les problèmes d'encodage
    const cleanText = (text: string): string => {
      return text
        .replace(/[^\x00-\x7F]/g, '?') // Remplace les caractères non-ASCII
        .replace(/"/g, '""') // Échapper les guillemets
        .replace(/\r?\n/g, ' ') // Remplacer les retours à la ligne
        .trim();
    };

    const csvContent = [
      headers.join(','),
      ...mentions.map((mention, index) => {
        const date = new Date(mention.timestamp);
        const totalEngagement = mention.engagement.likes + mention.engagement.comments + mention.engagement.shares;
        const location = mention.location;
        
        return [
          `"${mention.id || `mention_${index + 1}`}"`,
          `"${cleanText(mention.platform)}"`,
          `"${cleanText(mention.author)}"`,
          `"${cleanText(mention.content.substring(0, 200))}"`,
          `"${mention.url}"`,
          `"${date.toLocaleDateString('fr-FR')}"`,
          `"${date.toLocaleTimeString('fr-FR')}"`,
          mention.engagement.likes,
          mention.engagement.comments,
          mention.engagement.shares,
          mention.engagement.views || 0,
          totalEngagement,
          `"${cleanText(mention.sentiment || 'N/A')}"`,
          mention.influenceScore || 0,
          `"${cleanText(location?.city || 'N/A')}"`,
          `"${cleanText(location?.country || 'N/A')}"`,
          location?.latitude && location?.longitude ? 
            `"${location.latitude}, ${location.longitude}"` : '"N/A"'
        ].join(',');
      })
    ].join('\n');

    // Ajouter BOM UTF-8 pour assurer la compatibilité avec Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  static async generateFile(
    mentions: MentionResult[],
    keywords: string[],
    platforms: string[],
    format: 'json' | 'pdf' | 'csv',
    fileName: string,
    stats: MentionStats
  ) {
    const timestamp = new Date().toISOString().split('T')[0];
    const baseFileName = `${fileName}_${timestamp}`;

    switch (format) {
      case 'json':
        const jsonData = {
          metadata: {
            title: 'Rapport YimbaPulse - Analyse des Mentions',
            keywords,
            platforms,
            generated_at: new Date().toISOString(),
            generated_by: 'YimbaPulse Analytics',
            stats,
            filters_applied: {},
            total_mentions: mentions.length
          },
          summary: {
            sentiment_distribution: {
              positive: stats.positive,
              neutral: stats.neutral,
              negative: stats.negative
            },
            engagement_metrics: {
              total: stats.engagement,
              average: Math.round(stats.engagement / mentions.length),
              top_performers: mentions
                .sort((a, b) => (b.engagement.likes + b.engagement.comments + b.engagement.shares) - 
                               (a.engagement.likes + a.engagement.comments + a.engagement.shares))
                .slice(0, 5)
                .map(m => ({
                  platform: m.platform,
                  author: m.author,
                  engagement: m.engagement.likes + m.engagement.comments + m.engagement.shares
                }))
            },
            platform_breakdown: platforms.reduce((acc, platform) => {
              acc[platform] = mentions.filter(m => m.platform.toLowerCase() === platform.toLowerCase()).length;
              return acc;
            }, {} as Record<string, number>)
          },
          mentions: mentions.map(mention => ({
            ...mention,
            extracted_at: new Date().toISOString(),
            analysis: {
              engagement_score: mention.engagement.likes + mention.engagement.comments + mention.engagement.shares,
              reach_estimate: mention.engagement.views || mention.engagement.likes * 10,
              virality_index: mention.influenceScore || 1
            }
          }))
        };
        this.downloadJson(jsonData, `${baseFileName}.json`);
        break;

      case 'pdf':
        await this.generatePDF(mentions, keywords, platforms, stats, `${baseFileName}.pdf`);
        break;

      case 'csv':
        this.generateCSV(mentions, `${baseFileName}.csv`);
        break;
    }
  }
}
