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
    // Simulation d'enrichissement avec vos APIs Yimba Pulse
    // À remplacer par de vrais appels API quand prêts
    
    const mockAPIResults: HealthSearchResult[] = [];
    
    // Mots-clés de santé spécifiques
    const healthKeywords = ['covid', 'paludisme', 'rougeole', 'choléra', 'dengue', 'tuberculose', 'VIH', 'grippe'];
    const regions = region === 'all' ? ['Abidjan', 'Bouaké', 'Yamoussoukro', 'San Pedro'] : [region];
    const platforms = ['Facebook', 'TikTok', 'Twitter', 'Instagram', 'WhatsApp'];

    if (healthKeywords.some(keyword => searchTerm.toLowerCase().includes(keyword))) {
      // Générer des résultats d'API simulés pour les termes de santé
      for (let i = 0; i < 3; i++) {
        mockAPIResults.push({
          id: `api-${Date.now()}-${i}`,
          keyword: searchTerm,
          region: regions[i % regions.length],
          severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
          source: platforms[i % platforms.length],
          content: `Données API Yimba Pulse: Mentions de "${searchTerm}" détectées dans la région ${regions[i % regions.length]}`,
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          verified: Math.random() > 0.3,
          mentions_count: Math.floor(Math.random() * 100) + 5
        });
      }
    }

    return mockAPIResults;
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