
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface DemographicData {
  ageGroups: Array<{
    name: string;
    value: number;
    mentions: number;
  }>;
  genders: Array<{
    name: string;
    value: number;
    mentions: number;
  }>;
  locations: Array<{
    name: string;
    mentions: number;
    sentiment_score: number;
  }>;
}

interface ReportData {
  id: string;
  title: string;
  type: string;
  status: 'generated' | 'generating' | 'failed';
  created_at: string;
  total_mentions: number;
  platforms: string[];
  sentiment_summary: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export const useDynamicReportsData = () => {
  const [demographicData, setDemographicData] = useState<DemographicData>({
    ageGroups: [],
    genders: [],
    locations: []
  });
  const [reportsData, setReportsData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchDemographicData = async () => {
    if (!user) return;

    try {
      // Récupérer les données géographiques
      const { data: geoData } = await supabase
        .from('geographic_data')
        .select('*')
        .eq('user_id', user.id)
        .order('mentions', { ascending: false })
        .limit(10);

      // Simuler des données démographiques basées sur les résultats de recherche
      const { data: searchResults } = await supabase
        .from('search_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (searchResults) {
        // Générer des données d'âge basées sur les volumes de mentions
        const totalMentions = searchResults.reduce((sum, result) => sum + (result.total_mentions || 0), 0);
        const ageGroups = [
          { name: "18-24", value: 25, mentions: Math.floor(totalMentions * 0.25) },
          { name: "25-34", value: 35, mentions: Math.floor(totalMentions * 0.35) },
          { name: "35-44", value: 20, mentions: Math.floor(totalMentions * 0.20) },
          { name: "45-54", value: 15, mentions: Math.floor(totalMentions * 0.15) },
          { name: "55+", value: 5, mentions: Math.floor(totalMentions * 0.05) },
        ];

        // Générer des données de genre
        const genders = [
          { name: "Hommes", value: 45, mentions: Math.floor(totalMentions * 0.45) },
          { name: "Femmes", value: 55, mentions: Math.floor(totalMentions * 0.55) },
        ];

        setDemographicData({
          ageGroups,
          genders,
          locations: geoData?.map(geo => ({
            name: geo.region,
            mentions: geo.mentions,
            sentiment_score: Number(geo.sentiment_score)
          })) || [
            { name: "Abidjan", mentions: Math.floor(totalMentions * 0.4), sentiment_score: 0.6 },
            { name: "Bouaké", mentions: Math.floor(totalMentions * 0.2), sentiment_score: 0.4 },
            { name: "Yamoussoukro", mentions: Math.floor(totalMentions * 0.15), sentiment_score: 0.5 },
            { name: "San-Pédro", mentions: Math.floor(totalMentions * 0.15), sentiment_score: 0.3 },
            { name: "Korhogo", mentions: Math.floor(totalMentions * 0.1), sentiment_score: 0.7 },
          ]
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données démographiques:', error);
    }
  };

  const fetchReportsData = async () => {
    if (!user) return;

    try {
      // Récupérer les contextes IA comme rapports générés
      const { data: aiContexts } = await supabase
        .from('ai_contexts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Récupérer les recherches sauvegardées comme rapports potentiels
      const { data: savedSearches } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const reports: ReportData[] = [];

      // Transformer les contextes IA en rapports
      aiContexts?.forEach(context => {
        reports.push({
          id: context.id,
          title: `Rapport d'analyse - ${new Date(context.created_at).toLocaleDateString('fr-FR')}`,
          type: 'ai_analysis',
          status: 'generated',
          created_at: context.created_at,
          total_mentions: 0,
          platforms: [],
          sentiment_summary: {
            positive: 60,
            negative: 25,
            neutral: 15
          }
        });
      });

      // Ajouter des rapports basés sur les recherches sauvegardées
      savedSearches?.forEach(search => {
        reports.push({
          id: `search-${search.id}`,
          title: `Rapport - ${search.name}`,
          type: 'search_report',
          status: search.last_executed_at ? 'generated' : 'generating',
          created_at: search.created_at || new Date().toISOString(),
          total_mentions: 0,
          platforms: search.platforms,
          sentiment_summary: {
            positive: 45,
            negative: 30,
            neutral: 25
          }
        });
      });

      setReportsData(reports);
    } catch (error) {
      console.error('Erreur lors de la récupération des données de rapports:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchDemographicData(), fetchReportsData()]);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  return {
    demographicData,
    reportsData,
    loading,
    refetch: () => {
      fetchDemographicData();
      fetchReportsData();
    }
  };
};
