
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { MentionResult, SearchFilters } from '@/services/realApiService';
import jsPDF from 'jspdf';

interface SavedMention {
  id: string;
  user_id: string;
  search_keywords: string[];
  platforms: string[];
  total_mentions: number;
  positive_mentions: number;
  neutral_mentions: number;
  negative_mentions: number;
  total_engagement: number;
  mentions_data: MentionResult[];
  filters_applied: SearchFilters;
  export_format: 'json' | 'pdf' | 'csv';
  file_name: string;
  created_at: string;
  updated_at: string;
}

export const useSavedMentions = () => {
  const [savedMentions, setSavedMentions] = useState<SavedMention[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchSavedMentions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mention_saves')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        ...item,
        mentions_data: Array.isArray(item.mentions_data) ? item.mentions_data as MentionResult[] : [],
        filters_applied: (item.filters_applied as SearchFilters) || {}
      }));
      
      setSavedMentions(transformedData);
    } catch (error) {
      console.error('Error fetching saved mentions:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMentions = async (
    mentions: MentionResult[],
    keywords: string[],
    platforms: string[],
    filters: SearchFilters,
    format: 'json' | 'pdf' | 'csv' = 'json'
  ) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // Calculer les statistiques
      const positiveCount = mentions.filter(m => m.sentiment === 'positive').length;
      const negativeCount = mentions.filter(m => m.sentiment === 'negative').length;
      const neutralCount = mentions.filter(m => m.sentiment === 'neutral').length;
      const totalEngagement = mentions.reduce((sum, m) => 
        sum + m.engagement.likes + m.engagement.comments + m.engagement.shares, 0
      );

      const fileName = `mentions_${keywords.join('_')}_${new Date().toISOString().split('T')[0]}`;

      // Sauvegarder en base avec les bonnes propriétés
      const { data, error } = await supabase
        .from('mention_saves')
        .insert([{
          user_id: user.id,
          search_keywords: keywords,
          platforms: platforms,
          total_mentions: mentions.length,
          positive_mentions: positiveCount,
          neutral_mentions: neutralCount,
          negative_mentions: negativeCount,
          total_engagement: totalEngagement,
          mentions_data: mentions as any, // Cast to any pour éviter l'erreur de type
          filters_applied: filters as any, // Cast to any pour éviter l'erreur de type
          export_format: format,
          file_name: fileName
        }])
        .select()
        .single();

      if (error) throw error;

      // Générer le fichier selon le format
      await generateFile(mentions, keywords, platforms, format, fileName, {
        total: mentions.length,
        positive: positiveCount,
        neutral: neutralCount,
        negative: negativeCount,
        engagement: totalEngagement
      });

      // Rafraîchir la liste
      await fetchSavedMentions();

      return { success: true, data };
    } catch (error) {
      console.error('Error saving mentions:', error);
      return { success: false, error };
    }
  };

  const generateFile = async (
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
  ) => {
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
        downloadJson(jsonData, `${fileName}.json`);
        break;

      case 'pdf':
        await generatePDF(mentions, keywords, platforms, stats, `${fileName}.pdf`);
        break;

      case 'csv':
        generateCSV(mentions, `${fileName}.csv`);
        break;
    }
  };

  const downloadJson = (data: any, filename: string) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generatePDF = async (
    mentions: MentionResult[],
    keywords: string[],
    platforms: string[],
    stats: any,
    filename: string
  ) => {
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
  };

  const generateCSV = (mentions: MentionResult[], filename: string) => {
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
  };

  const deleteSavedMention = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mention_saves')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSavedMentions(prev => prev.filter(m => m.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting saved mention:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchSavedMentions();
    }
  }, [user]);

  return {
    savedMentions,
    loading,
    saveMentions,
    deleteSavedMention,
    fetchSavedMentions
  };
};
