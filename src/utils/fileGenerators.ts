
import jsPDF from 'jspdf';
import { MentionResult } from '@/services/api/types';
import { SearchFilters } from '@/services/api/types';

export const generateJSONReport = (
  mentions: MentionResult[],
  keywords: string[],
  platforms: string[],
  filters: SearchFilters
) => {
  const report = {
    metadata: {
      generated_at: new Date().toISOString(),
      report_type: 'YIMBA_Social_Listening_Report',
      version: '2.0',
      keywords: keywords,
      platforms: platforms,
      filters_applied: filters,
      total_mentions: mentions.length
    },
    analytics: {
      sentiment_distribution: {
        positive: mentions.filter(m => m.sentiment === 'positive').length,
        neutral: mentions.filter(m => m.sentiment === 'neutral').length,
        negative: mentions.filter(m => m.sentiment === 'negative').length
      },
      platform_distribution: platforms.reduce((acc, platform) => {
        acc[platform] = mentions.filter(m => m.platform.toLowerCase() === platform.toLowerCase()).length;
        return acc;
      }, {} as Record<string, number>),
      engagement_metrics: {
        total_likes: mentions.reduce((sum, m) => sum + m.engagement.likes, 0),
        total_comments: mentions.reduce((sum, m) => sum + m.engagement.comments, 0),
        total_shares: mentions.reduce((sum, m) => sum + m.engagement.shares, 0),
        average_influence_score: mentions.reduce((sum, m) => sum + (m.influenceScore || 0), 0) / mentions.length
      }
    },
    mentions: mentions.map(mention => ({
      id: mention.id,
      platform: mention.platform,
      content: mention.content,
      author: mention.author,
      url: mention.url,
      timestamp: mention.timestamp,
      sentiment: mention.sentiment,
      influence_score: mention.influenceScore,
      engagement: mention.engagement,
      location: mention.location
    }))
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  return blob;
};

export const generateCSVReport = (
  mentions: MentionResult[],
  keywords: string[],
  platforms: string[],
  filters: SearchFilters
) => {
  const headers = [
    'ID',
    'Plateforme',
    'Contenu',
    'Auteur',
    'URL',
    'Date',
    'Sentiment',
    'Score Influence',
    'Likes',
    'Commentaires',
    'Partages',
    'Vues',
    'Pays',
    'Ville'
  ];

  const rows = mentions.map(mention => [
    mention.id,
    mention.platform,
    `"${mention.content.replace(/"/g, '""')}"`,
    mention.author,
    mention.url,
    new Date(mention.timestamp).toLocaleString('fr-FR'),
    mention.sentiment || 'Neutre',
    mention.influenceScore || 0,
    mention.engagement.likes,
    mention.engagement.comments,
    mention.engagement.shares,
    mention.engagement.views || 0,
    mention.location?.country || '',
    mention.location?.city || ''
  ]);

  const csvContent = [
    `# YIMBA Social Listening Report - ${new Date().toLocaleDateString('fr-FR')}`,
    `# Mots-clés: ${keywords.join(', ')}`,
    `# Plateformes: ${platforms.join(', ')}`,
    `# Total mentions: ${mentions.length}`,
    '',
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  return blob;
};

export const generatePDFReport = (
  mentions: MentionResult[],
  keywords: string[],
  platforms: string[],
  filters: SearchFilters
) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  let yPosition = 20;

  // Style Brand24 - En-tête avec couleurs
  pdf.setFillColor(59, 130, 246); // Bleu Brand24
  pdf.rect(0, 0, pageWidth, 30, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('YIMBA', 20, 20);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Rapport de Veille Sociale', 20, 26);
  
  yPosition = 45;
  pdf.setTextColor(0, 0, 0);

  // Informations du rapport
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Mots-clés: ${keywords.join(', ')}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Plateformes: ${platforms.join(', ')}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Total mentions: ${mentions.length}`, 20, yPosition);
  yPosition += 15;

  // Statistiques du sentiment - Style Brand24
  const sentimentStats = {
    positive: mentions.filter(m => m.sentiment === 'positive').length,
    neutral: mentions.filter(m => m.sentiment === 'neutral').length,
    negative: mentions.filter(m => m.sentiment === 'negative').length
  };

  pdf.setFillColor(248, 250, 252);
  pdf.rect(15, yPosition - 5, pageWidth - 30, 35, 'F');
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 64, 175);
  pdf.text('Analyse du Sentiment', 20, yPosition + 5);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(34, 197, 94);
  pdf.text(`✓ Positif: ${sentimentStats.positive} (${((sentimentStats.positive/mentions.length)*100).toFixed(1)}%)`, 20, yPosition + 15);
  
  pdf.setTextColor(107, 114, 128);
  pdf.text(`○ Neutre: ${sentimentStats.neutral} (${((sentimentStats.neutral/mentions.length)*100).toFixed(1)}%)`, 20, yPosition + 22);
  
  pdf.setTextColor(239, 68, 68);
  pdf.text(`✗ Négatif: ${sentimentStats.negative} (${((sentimentStats.negative/mentions.length)*100).toFixed(1)}%)`, 20, yPosition + 29);
  
  yPosition += 45;

  // Engagement total - Style Brand24
  const totalEngagement = mentions.reduce((sum, m) => sum + m.engagement.likes + m.engagement.comments + m.engagement.shares, 0);
  
  pdf.setFillColor(254, 249, 195);
  pdf.rect(15, yPosition - 5, pageWidth - 30, 25, 'F');
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(180, 83, 9);
  pdf.text('Métriques d\'Engagement', 20, yPosition + 5);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  const totalLikes = mentions.reduce((sum, m) => sum + m.engagement.likes, 0);
  const totalComments = mentions.reduce((sum, m) => sum + m.engagement.comments, 0);
  const totalShares = mentions.reduce((sum, m) => sum + m.engagement.shares, 0);
  
  pdf.text(`❤️ Likes: ${totalLikes.toLocaleString()} | 💬 Commentaires: ${totalComments.toLocaleString()} | 🔄 Partages: ${totalShares.toLocaleString()}`, 20, yPosition + 15);
  
  yPosition += 35;

  // Top mentions - Style Brand24
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 64, 175);
  pdf.text('Top Mentions par Engagement', 20, yPosition);
  yPosition += 10;

  const topMentions = mentions
    .sort((a, b) => (b.engagement.likes + b.engagement.comments + b.engagement.shares) - (a.engagement.likes + a.engagement.comments + a.engagement.shares))
    .slice(0, 5);

  topMentions.forEach((mention, index) => {
    // Vérifier si on a besoin d'une nouvelle page
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }

    // Cadre pour chaque mention - Style Brand24
    pdf.setFillColor(249, 250, 251);
    pdf.rect(15, yPosition - 3, pageWidth - 30, 25, 'F');
    pdf.setDrawColor(229, 231, 235);
    pdf.rect(15, yPosition - 3, pageWidth - 30, 25, 'S');

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${index + 1}. ${mention.platform} - ${mention.author}`, 20, yPosition + 3);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(75, 85, 99);
    const content = mention.content.length > 80 ? mention.content.substring(0, 80) + '...' : mention.content;
    pdf.text(content, 20, yPosition + 9);
    
    // Sentiment coloré
    pdf.setFont('helvetica', 'bold');
    if (mention.sentiment === 'positive') {
      pdf.setTextColor(34, 197, 94);
      pdf.text('● POSITIF', 20, yPosition + 15);
    } else if (mention.sentiment === 'negative') {
      pdf.setTextColor(239, 68, 68);
      pdf.text('● NÉGATIF', 20, yPosition + 15);
    } else {
      pdf.setTextColor(107, 114, 128);
      pdf.text('● NEUTRE', 20, yPosition + 15);
    }
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    const engagement = mention.engagement.likes + mention.engagement.comments + mention.engagement.shares;
    pdf.text(`Engagement: ${engagement} | Score: ${mention.influenceScore || 'N/A'}`, 80, yPosition + 15);
    
    yPosition += 30;
  });

  // Pied de page Brand24
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFillColor(59, 130, 246);
    pdf.rect(0, pdf.internal.pageSize.height - 15, pageWidth, 15, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.text(`YIMBA - Rapport généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, pdf.internal.pageSize.height - 8);
    pdf.text(`Page ${i}/${totalPages}`, pageWidth - 40, pdf.internal.pageSize.height - 8);
  }

  return pdf;
};
