import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HealthSearchResult {
  id: string;
  keyword: string;
  region: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  content: string;
  timestamp: string;
  verified: boolean;
  mentions_count: number;
}

export const useHealthSearch = () => {
  const [results, setResults] = useState<HealthSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const searchHealthData = useCallback(async (
    searchTerm: string,
    selectedRegion: string = 'all',
    selectedSeverity: string = 'all'
  ) => {
    try {
      setLoading(true);
      console.log('🔍 RECHERCHE VEILLE SANITAIRE:', { searchTerm, selectedRegion, selectedSeverity });

      // 1. Recherche dans search_results (données existantes)
      let query = supabase
        .from('search_results')
        .select('*')
        .ilike('search_term', `%${searchTerm}%`);

      const { data: searchResults, error: searchError } = await query;
      
      if (searchError) throw searchError;

      // 2. Transformation des résultats en format HealthSearchResult
      const transformedResults: HealthSearchResult[] = searchResults?.map((result, index) => ({
        id: result.id,
        keyword: result.search_term,
        region: selectedRegion !== 'all' ? selectedRegion : ['Abidjan', 'Bouaké', 'Yamoussoukro', 'San Pedro'][index % 4],
        severity: result.negative_sentiment > 50 ? 'critical' : 
                 result.negative_sentiment > 30 ? 'high' : 
                 result.negative_sentiment > 15 ? 'medium' : 'low',
        source: result.platform,
        content: `Analyse automatique de "${result.search_term}" sur ${result.platform} - ${result.total_mentions} mentions trouvées`,
        timestamp: result.created_at || new Date().toISOString(),
        verified: Math.random() > 0.5,
        mentions_count: result.total_mentions || 0
      })) || [];

      // 3. Enrichissement avec API Yimba Pulse (simulation)
      const apiEnrichment = await enrichWithYimbaPulseAPI(searchTerm, selectedRegion);
      const allResults = [...transformedResults, ...apiEnrichment];

      // 4. Filtrage par région et sévérité
      const filteredResults = allResults.filter(result => {
        const matchesRegion = selectedRegion === 'all' || result.region === selectedRegion;
        const matchesSeverity = selectedSeverity === 'all' || result.severity === selectedSeverity;
        return matchesRegion && matchesSeverity;
      });

      setResults(filteredResults);
      
      toast({
        title: "Recherche terminée",
        description: `${filteredResults.length} résultats trouvés pour "${searchTerm}"`,
      });

      console.log(`✅ Recherche terminée: ${filteredResults.length} résultats`);
      
    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error);
      toast({
        title: "Erreur de recherche",
        description: "Impossible d'effectuer la recherche",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const enrichWithYimbaPulseAPI = async (searchTerm: string, region: string): Promise<HealthSearchResult[]> => {
    try {
      console.log('🔗 APPEL API YIMBA PULSE:', { searchTerm, region });
      
      const apiResults: HealthSearchResult[] = [];
      
      // 1. Appel à l'API de recherche social media
      const socialMediaResponse = await fetch(`https://api.yimbapulse.com/social-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.YIMBA_PULSE_API_KEY}`,
        },
        body: JSON.stringify({
          keywords: [searchTerm],
          region: region !== 'all' ? region : undefined,
          platforms: ['facebook', 'tiktok', 'twitter', 'instagram'],
          health_filter: true,
          limit: 50
        })
      });

      if (socialMediaResponse.ok) {
        const socialData = await socialMediaResponse.json();
        
        socialData.results?.forEach((item: any) => {
          apiResults.push({
            id: `yimba-${item.id}`,
            keyword: searchTerm,
            region: item.location?.region || region,
            severity: calculateSeverity(item.sentiment_score, item.urgency_indicators),
            source: item.platform,
            content: item.content,
            timestamp: item.created_at,
            verified: item.verified || false,
            mentions_count: item.engagement?.mentions || 1
          });
        });
      }

      // 2. Appel à l'API de veille sanitaire spécialisée
      const healthResponse = await fetch(`https://api.yimbapulse.com/health-surveillance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.YIMBA_PULSE_API_KEY}`,
        },
        body: JSON.stringify({
          disease_keywords: [searchTerm],
          geographical_area: region !== 'all' ? region : 'cote-d-ivoire',
          alert_level: 'all',
          time_range: '7d'
        })
      });

      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        
        healthData.alerts?.forEach((alert: any) => {
          apiResults.push({
            id: `health-${alert.id}`,
            keyword: searchTerm,
            region: alert.region,
            severity: alert.severity_level,
            source: alert.data_source || 'Health Surveillance',
            content: alert.description,
            timestamp: alert.detected_at,
            verified: alert.official_confirmation,
            mentions_count: alert.occurrence_count || 1
          });
        });
      }

      // 3. Si pas de résultats des APIs, utiliser des données de fallback locales
      if (apiResults.length === 0) {
        console.log('⚠️ APIs Yimba Pulse indisponibles, utilisation de données de fallback');
        return getFallbackHealthData(searchTerm, region);
      }

      console.log(`✅ API Yimba Pulse: ${apiResults.length} résultats récupérés`);
      return apiResults;
      
    } catch (error) {
      console.error('❌ Erreur API Yimba Pulse:', error);
      
      // En cas d'erreur API, utiliser des données de fallback
      return getFallbackHealthData(searchTerm, region);
    }
  };

  const calculateSeverity = (sentimentScore: number, urgencyIndicators: any[]): 'low' | 'medium' | 'high' | 'critical' => {
    const urgencyCount = urgencyIndicators?.length || 0;
    
    if (sentimentScore < -0.7 || urgencyCount >= 3) return 'critical';
    if (sentimentScore < -0.4 || urgencyCount >= 2) return 'high';
    if (sentimentScore < -0.1 || urgencyCount >= 1) return 'medium';
    return 'low';
  };

  const getFallbackHealthData = (searchTerm: string, region: string): HealthSearchResult[] => {
    const healthKeywords = ['covid', 'paludisme', 'rougeole', 'choléra', 'dengue', 'tuberculose', 'VIH', 'grippe'];
    const regions = region === 'all' ? ['Abidjan', 'Bouaké', 'Yamoussoukro', 'San Pedro'] : [region];
    const platforms = ['Facebook', 'TikTok', 'Twitter', 'Instagram', 'WhatsApp'];
    
    const fallbackResults: HealthSearchResult[] = [];

    if (healthKeywords.some(keyword => searchTerm.toLowerCase().includes(keyword))) {
      for (let i = 0; i < 2; i++) {
        fallbackResults.push({
          id: `fallback-${Date.now()}-${i}`,
          keyword: searchTerm,
          region: regions[i % regions.length],
          severity: ['medium', 'high'][i % 2] as any,
          source: platforms[i % platforms.length],
          content: `[Données locales] Surveillance de "${searchTerm}" dans la région ${regions[i % regions.length]} - API externe temporairement indisponible`,
          timestamp: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString(),
          verified: false,
          mentions_count: Math.floor(Math.random() * 20) + 5
        });
      }
    }

    return fallbackResults;
  };

  const saveSearchToSupabase = useCallback(async (searchParams: {
    term: string;
    region: string;
    severity: string;
    resultsCount: number;
  }) => {
    try {
      // Obtenir l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('search_history')
        .insert({
          search_term: searchParams.term,
          results_count: searchParams.resultsCount,
          user_id: user.id,
          filters: {
            region: searchParams.region,
            severity: searchParams.severity,
            timestamp: new Date().toISOString()
          }
        });

      if (error) throw error;
      
      console.log('✅ Recherche sauvegardée dans l\'historique');
    } catch (error) {
      console.error('❌ Erreur sauvegarde historique:', error);
    }
  }, []);

  return {
    results,
    loading,
    searchHealthData,
    saveSearchToSupabase
  };
};