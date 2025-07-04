
import jsPDF from 'jspdf';
import { MentionResult } from '@/services/realApiService';
import { MentionStats } from '@/types/savedMentions';

export class FileGenerators {
  static downloadJson(data: any, filename: string) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
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
    const pdf = new jsPDF();
    let yPosition = 20;

    // Titre
    pdf.setFontSize(18);
    pdf.text('Rapport d\'analyse des mentions', 20, yPosition);
    yPosition += 20;

    // Statistiques générales
    pdf.setFontSize(12);
    pdf.text(`Mots-clés: ${keywords.join(', ')}`, 20, yPosition);
    yPosition += 10;
    pdf.text(`Plateformes: ${platforms.join(', ')}`, 20, yPosition);
    yPosition += 10;
    pdf.text(`Total mentions: ${stats.total}`, 20, yPosition);
    yPosition += 10;
    pdf.text(`Positives: ${stats.positive} | Neutres: ${stats.neutral} | Négatives: ${stats.negative}`, 20, yPosition);
    yPosition += 10;
    pdf.text(`Engagement total: ${stats.engagement.toLocaleString()}`, 20, yPosition);
    yPosition += 20;

    // Mentions détaillées
    pdf.setFontSize(14);
    pdf.text('Mentions détaillées:', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(10);
    mentions.slice(0, 20).forEach((mention, index) => {
      if (yPosition > 280) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.text(`${index + 1}. ${mention.platform} - ${mention.author}`, 20, yPosition);
      yPosition += 7;
      
      const content = mention.content.length > 80 
        ? mention.content.substring(0, 80) + '...' 
        : mention.content;
      pdf.text(content, 25, yPosition);
      yPosition += 7;
      
      pdf.text(`Engagement: ${mention.engagement.likes + mention.engagement.comments + mention.engagement.shares} | Sentiment: ${mention.sentiment}`, 25, yPosition);
      yPosition += 10;
    });

    if (mentions.length > 20) {
      pdf.text(`... et ${mentions.length - 20} autres mentions`, 20, yPosition);
    }

    pdf.save(filename);
  }

  static generateCSV(mentions: MentionResult[], filename: string) {
    const headers = [
      'Plateforme',
      'Auteur',
      'Contenu',
      'URL',
      'Date',
      'Likes',
      'Commentaires',
      'Partages',
      'Vues',
      'Sentiment',
      'Score d\'influence'
    ];

    const csvContent = [
      headers.join(','),
      ...mentions.map(mention => [
        mention.platform,
        `"${mention.author.replace(/"/g, '""')}"`,
        `"${mention.content.replace(/"/g, '""').substring(0, 100)}"`,
        mention.url,
        new Date(mention.timestamp).toLocaleDateString('fr-FR'),
        mention.engagement.likes,
        mention.engagement.comments,
        mention.engagement.shares,
        mention.engagement.views || 0,
        mention.sentiment,
        mention.influenceScore
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
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
    switch (format) {
      case 'json':
        const jsonData = {
          metadata: {
            keywords,
            platforms,
            generated_at: new Date().toISOString(),
            stats
          },
          mentions
        };
        this.downloadJson(jsonData, `${fileName}.json`);
        break;

      case 'pdf':
        await this.generatePDF(mentions, keywords, platforms, stats, `${fileName}.pdf`);
        break;

      case 'csv':
        this.generateCSV(mentions, `${fileName}.csv`);
        break;
    }
  }
}
