
import jsPDF from 'jspdf';
import { MentionResult } from '@/services/api/types';

export class FileGenerators {
  static async generateFile(
    mentions: MentionResult[],
    keywords: string[],
    platforms: string[],
    format: 'json' | 'pdf' | 'csv',
    fileName: string,
    stats: {
      total: number;
      positive: number;
      neutral: number;
      negative: number;
      engagement: number;
    }
  ) {
    switch (format) {
      case 'json':
        return this.generateJSON(mentions, keywords, platforms, fileName, stats);
      case 'pdf':
        return this.generatePDF(mentions, keywords, platforms, fileName, stats);
      case 'csv':
        return this.generateCSV(mentions, keywords, platforms, fileName, stats);
      default:
        throw new Error(`Format non supporté: ${format}`);
    }
  }

  private static generateJSON(
    mentions: MentionResult[],
    keywords: string[],
    platforms: string[],
    fileName: string,
    stats: any
  ) {
    const report = {
      metadata: {
        generatedAt: new Date().toISOString(),
        fileName,
        keywords,
        platforms,
        stats
      },
      mentions: mentions.map(mention => ({
        id: mention.id,
        platform: mention.platform,
        content: mention.content,
        author: mention.author,
        url: mention.url,
        timestamp: mention.timestamp,
        engagement: mention.engagement,
        sentiment: mention.sentiment,
        influenceScore: mention.influenceScore
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private static generateCSV(
    mentions: MentionResult[],
    keywords: string[],
    platforms: string[],
    fileName: string,
    stats: any
  ) {
    const headers = ['Plateforme', 'Auteur', 'Contenu', 'URL', 'Date', 'Likes', 'Commentaires', 'Partages', 'Sentiment', 'Score Influence'];
    
    const csvContent = [
      headers.join(','),
      ...mentions.map(mention => [
        mention.platform,
        `"${mention.author.replace(/"/g, '""')}"`,
        `"${mention.content.replace(/"/g, '""').substring(0, 100)}..."`,
        mention.url,
        new Date(mention.timestamp).toLocaleDateString('fr-FR'),
        mention.engagement.likes,
        mention.engagement.comments,
        mention.engagement.shares,
        mention.sentiment || 'N/A',
        mention.influenceScore || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private static generatePDF(
    mentions: MentionResult[],
    keywords: string[],
    platforms: string[],
    fileName: string,
    stats: any
  ) {
    const doc = new jsPDF();
    
    // En-tête Brand24 style
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('RAPPORT DE MENTIONS', 20, 15);
    
    // Informations générales
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 35);
    doc.text(`Mots-clés: ${keywords.join(', ')}`, 20, 45);
    doc.text(`Plateformes: ${platforms.join(', ')}`, 20, 55);
    
    // Statistiques
    doc.setFontSize(14);
    doc.text('STATISTIQUES', 20, 70);
    doc.setFontSize(11);
    doc.text(`Total mentions: ${stats.total}`, 25, 80);
    doc.text(`Positives: ${stats.positive} | Neutres: ${stats.neutral} | Négatives: ${stats.negative}`, 25, 90);
    doc.text(`Engagement total: ${stats.engagement.toLocaleString()}`, 25, 100);
    
    // Mentions (première page seulement)
    doc.setFontSize(14);
    doc.text('MENTIONS PRINCIPALES', 20, 115);
    
    let yPosition = 125;
    const maxMentions = Math.min(mentions.length, 8);
    
    for (let i = 0; i < maxMentions; i++) {
      const mention = mentions[i];
      if (yPosition > 250) break;
      
      doc.setFontSize(10);
      doc.setTextColor(37, 99, 235);
      doc.text(`${mention.platform} - @${mention.author}`, 25, yPosition);
      
      doc.setTextColor(0, 0, 0);
      const content = mention.content.substring(0, 80) + (mention.content.length > 80 ? '...' : '');
      doc.text(content, 25, yPosition + 8);
      
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`${new Date(mention.timestamp).toLocaleDateString('fr-FR')} | Likes: ${mention.engagement.likes} | Sentiment: ${mention.sentiment || 'N/A'}`, 25, yPosition + 16);
      
      yPosition += 25;
    }
    
    // Pied de page
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Généré par Yimba Pulse API - ${mentions.length} mentions trouvées`, 20, 285);
    
    doc.save(`${fileName}.pdf`);
  }
}
