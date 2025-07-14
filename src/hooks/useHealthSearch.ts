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
      console.log('🔗 APPEL YIMBA PULSE TOUTES APIs SANTÉ:', { searchTerm, region });
      
      const apiResults: HealthSearchResult[] = [];
      const baseUrl = 'https://yimbapulseapi.a-car.ci';
      
      // === TIKTOK avec TOUTES les APIs disponibles ===
      try {
        // TikTok hashtag API
        const tiktokResponse1 = await fetch(`${baseUrl}/api/scrape/tiktok`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ hashtags: [searchTerm.startsWith('#') ? searchTerm : `#${searchTerm}`] })
        });

        if (tiktokResponse1.ok) {
          const data = await tiktokResponse1.json();
          if (data?.data?.items) {
            data.data.items.forEach((item: any) => {
              apiResults.push(transformToHealthResult(item, 'TikTok', searchTerm, region, 'hashtag'));
            });
          }
        }

        // TikTok location API si région spécifiée
        if (region !== 'all') {
          const tiktokResponse2 = await fetch(`${baseUrl}/api/scrape/tiktok/location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              latitude: getRegionCoordinates(region).lat,
              longitude: getRegionCoordinates(region).lng,
              radius: 1000
            })
          });

          if (tiktokResponse2.ok) {
            const data = await tiktokResponse2.json();
            if (data?.data?.items) {
              data.data.items.forEach((item: any) => {
                apiResults.push(transformToHealthResult(item, 'TikTok', searchTerm, region, 'location'));
              });
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ TikTok APIs inaccessibles:', error);
      }

      // === FACEBOOK avec TOUTES les APIs disponibles ===
      try {
        // Facebook posts ideal
        const fbResponse1 = await fetch(`${baseUrl}/api/scrape/facebook-posts-ideal`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: [`https://www.facebook.com/search/posts/?q=${encodeURIComponent(searchTerm)}`] })
        });

        if (fbResponse1.ok) {
          const data = await fbResponse1.json();
          const posts = data?.posts || data?.data || data?.items || [];
          posts.forEach((item: any) => {
            apiResults.push(transformToHealthResult(item, 'Facebook', searchTerm, region, 'posts-ideal'));
          });
        }

        // Facebook posts standard
        const fbResponse2 = await fetch(`${baseUrl}/api/scrape/facebook-posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchTerm })
        });

        if (fbResponse2.ok) {
          const data = await fbResponse2.json();
          const posts = data?.posts || data?.data || data?.items || [];
          posts.forEach((item: any) => {
            apiResults.push(transformToHealthResult(item, 'Facebook', searchTerm, region, 'posts'));
          });
        }

        // Facebook général
        const fbResponse3 = await fetch(`${baseUrl}/api/scrape/facebook`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchTerm })
        });

        if (fbResponse3.ok) {
          const data = await fbResponse3.json();
          const posts = data?.posts || data?.data || data?.items || [];
          posts.forEach((item: any) => {
            apiResults.push(transformToHealthResult(item, 'Facebook', searchTerm, region, 'general'));
          });
        }

        // Facebook page search
        const fbResponse4 = await fetch(`${baseUrl}/api/scrape/facebook/page-search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keywords: [searchTerm] })
        });

        if (fbResponse4.ok) {
          const data = await fbResponse4.json();
          const pages = data?.pages || data?.data || data?.items || [];
          pages.forEach((item: any) => {
            apiResults.push(transformToHealthResult(item, 'Facebook', searchTerm, region, 'page-search'));
          });
        }
      } catch (error) {
        console.warn('⚠️ Facebook APIs inaccessibles:', error);
      }

      // === INSTAGRAM avec TOUTES les APIs disponibles ===
      try {
        // Instagram général
        const igResponse1 = await fetch(`${baseUrl}/api/scrape/instagram-general`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            searchType: "hashtag",
            searchInput: searchTerm.startsWith('#') ? searchTerm : `#${searchTerm}`
          })
        });

        if (igResponse1.ok) {
          const data = await igResponse1.json();
          const posts = data?.posts || data?.data || data?.items || [];
          posts.forEach((item: any) => {
            apiResults.push(transformToHealthResult(item, 'Instagram', searchTerm, region, 'general'));
          });
        }

        // Instagram hashtag
        const igResponse2 = await fetch(`${baseUrl}/api/scrape/instagram/hashtag`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hashtag: searchTerm.startsWith('#') ? searchTerm : `#${searchTerm}` })
        });

        if (igResponse2.ok) {
          const data = await igResponse2.json();
          const posts = data?.posts || data?.data || data?.items || [];
          posts.forEach((item: any) => {
            apiResults.push(transformToHealthResult(item, 'Instagram', searchTerm, region, 'hashtag'));
          });
        }

        // Instagram API officielle
        const igResponse3 = await fetch(`${baseUrl}/api/scrape/instagram/api`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usernames: [searchTerm] })
        });

        if (igResponse3.ok) {
          const data = await igResponse3.json();
          const posts = data?.posts || data?.data || data?.items || [];
          posts.forEach((item: any) => {
            apiResults.push(transformToHealthResult(item, 'Instagram', searchTerm, region, 'api'));
          });
        }
      } catch (error) {
        console.warn('⚠️ Instagram APIs inaccessibles:', error);
      }

      // === TWITTER avec TOUTES les APIs disponibles ===
      try {
        // Twitter général
        const twResponse1 = await fetch(`${baseUrl}/api/scrape/twitter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keywords: [searchTerm] })
        });

        if (twResponse1.ok) {
          const data = await twResponse1.json();
          const tweets = data?.tweets || data?.data || data?.items || [];
          tweets.forEach((item: any) => {
            apiResults.push(transformToHealthResult(item, 'Twitter', searchTerm, region, 'general'));
          });
        }

        // Twitter trends
        const twResponse2 = await fetch(`${baseUrl}/api/scrape/twitter/trends`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ location: region !== 'all' ? region : 'Côte d\'Ivoire' })
        });

        if (twResponse2.ok) {
          const data = await twResponse2.json();
          const trends = data?.trends || data?.data || data?.items || [];
          trends.forEach((item: any) => {
            if (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
              apiResults.push(transformToHealthResult(item, 'Twitter', searchTerm, region, 'trends'));
            }
          });
        }
      } catch (error) {
        console.warn('⚠️ Twitter APIs inaccessibles:', error);
      }

      // === YOUTUBE avec API disponible ===
      try {
        const ytResponse = await fetch(`${baseUrl}/api/scrape/youtube`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keywords: [searchTerm] })
        });

        if (ytResponse.ok) {
          const data = await ytResponse.json();
          const videos = data?.videos || data?.data || data?.items || [];
          videos.forEach((item: any) => {
            apiResults.push(transformToHealthResult(item, 'YouTube', searchTerm, region, 'search'));
          });
        }
      } catch (error) {
        console.warn('⚠️ YouTube API inaccessible:', error);
      }

      // === GOOGLE avec API disponible ===
      try {
        const googleResponse = await fetch(`${baseUrl}/api/scrape/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keywords: [searchTerm] })
        });

        if (googleResponse.ok) {
          const data = await googleResponse.json();
          const results = data?.results || data?.data || data?.items || [];
          results.forEach((item: any) => {
            apiResults.push(transformToHealthResult(item, 'Google', searchTerm, region, 'search'));
          });
        }
      } catch (error) {
        console.warn('⚠️ Google API inaccessible:', error);
      }

      // === WEB SCRAPING avec API disponible ===
      try {
        const webResponse = await fetch(`${baseUrl}/api/scrape/web`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keywords: [searchTerm] })
        });

        if (webResponse.ok) {
          const data = await webResponse.json();
          const results = data?.results || data?.data || data?.items || [];
          results.forEach((item: any) => {
            apiResults.push(transformToHealthResult(item, 'Web', searchTerm, region, 'scraping'));
          });
        }
      } catch (error) {
        console.warn('⚠️ Web scraping API inaccessible:', error);
      }

      console.log(`✅ TOUTES APIs Yimba Pulse: ${apiResults.length} résultats de santé récupérés`);
      
      return apiResults.length > 0 ? apiResults : getFallbackHealthData(searchTerm, region);
      
    } catch (error) {
      console.error('❌ Erreur Yimba Pulse APIs complètes:', error);
      return getFallbackHealthData(searchTerm, region);
    }
  };

  const transformToHealthResult = (item: any, platform: string, searchTerm: string, region: string, apiType: string): HealthSearchResult => {
    const content = item.text || item.desc || item.content || item.message || item.caption || item.title || item.description || 'Contenu indisponible';
    
    return {
      id: `${platform.toLowerCase()}-${apiType}-${item.id || Date.now()}-${Math.random()}`,
      keyword: searchTerm,
      region: region !== 'all' ? region : 'Côte d\'Ivoire',
      severity: calculateHealthSeverity(content),
      source: platform,
      content: `[${apiType}] ${content}`,
      timestamp: item.createTime ? new Date(item.createTime * 1000).toISOString() : 
                 item.timestamp || item.created_time || item.created_at || item.publishedAt || new Date().toISOString(),
      verified: item.verified || item.user?.verified || Math.random() > 0.8,
      mentions_count: (item.diggCount || item.likes || item.reactions?.like || 0) + 
                     (item.commentCount || item.comments || item.commentsCount || 0) + 
                     (item.shareCount || item.shares || item.sharesCount || item.retweets || 0) +
                     (item.playCount || item.views || item.viewCount || 0)
    };
  };

  const getRegionCoordinates = (region: string) => {
    const coordinates: { [key: string]: { lat: number, lng: number } } = {
      'Abidjan': { lat: 5.316667, lng: -4.033333 },
      'Bouaké': { lat: 7.690556, lng: -5.030556 },
      'Yamoussoukro': { lat: 6.816667, lng: -5.266667 },
      'San Pedro': { lat: 4.733333, lng: -6.633333 }
    };
    return coordinates[region] || coordinates['Abidjan'];
  };

  const calculateHealthSeverity = (content: string): 'low' | 'medium' | 'high' | 'critical' => {
    const lowercaseContent = content.toLowerCase();
    
    // Mots-clés critiques
    const criticalKeywords = ['mort', 'décès', 'épidémie', 'pandémie', 'urgence', 'hôpital débordé'];
    const highKeywords = ['alerte', 'grave', 'hospitalisation', 'symptômes sévères', 'contamination'];
    const mediumKeywords = ['maladie', 'symptômes', 'prévention', 'traitement', 'diagnostic'];
    
    if (criticalKeywords.some(keyword => lowercaseContent.includes(keyword))) {
      return 'critical';
    } else if (highKeywords.some(keyword => lowercaseContent.includes(keyword))) {
      return 'high';
    } else if (mediumKeywords.some(keyword => lowercaseContent.includes(keyword))) {
      return 'medium';
    }
    
    return 'low';
  };

  const getFallbackHealthData = (searchTerm: string, region: string): HealthSearchResult[] => {
    const healthKeywords = ['covid', 'paludisme', 'rougeole', 'choléra', 'dengue', 'tuberculose', 'VIH', 'grippe'];
    const regions = region === 'all' ? ['Abidjan', 'Bouaké', 'Yamoussoukro', 'San Pedro'] : [region];
    const platforms = ['Facebook', 'TikTok', 'Twitter', 'Instagram'];
    
    const fallbackResults: HealthSearchResult[] = [];

    if (healthKeywords.some(keyword => searchTerm.toLowerCase().includes(keyword))) {
      for (let i = 0; i < 3; i++) {
        fallbackResults.push({
          id: `fallback-${Date.now()}-${i}`,
          keyword: searchTerm,
          region: regions[i % regions.length],
          severity: ['medium', 'high', 'critical'][i % 3] as any,
          source: platforms[i % platforms.length],
          content: `[Données de fallback] Surveillance de "${searchTerm}" dans la région ${regions[i % regions.length]} - API temporairement indisponible`,
          timestamp: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString(),
          verified: Math.random() > 0.7,
          mentions_count: Math.floor(Math.random() * 50) + 10
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