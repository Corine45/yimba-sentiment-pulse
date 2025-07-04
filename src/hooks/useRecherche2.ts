
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';

interface SearchResult {
  platform: string;
  mentions: number;
  engagement: number;
  sentiment: string;
  posts: any[];
}

interface SavedSearch {
  id: string;
  name: string;
  keywords: string[];
  platforms: string[];
  language: string;
  period: string;
  sentiment: string;
  created_at: string;
  last_executed_at?: string;
}

export const useRecherche2 = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const API_BASE_URL = 'https://yimbapulseapi.a-car.ci';

  const executeSimpleSearch = async (params: any) => {
    if (!params.keyword || params.platforms.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un mot-clé et sélectionner au moins une plateforme.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchTerm(params.keyword);
    setSearchResults([]);

    try {
      console.log('🔍 RECHERCHE SIMPLE API:', params);
      
      const results: SearchResult[] = [];
      
      for (const platform of params.platforms) {
        try {
          const endpoint = `/api/scrape/${platform.toLowerCase()}`;
          const payload = prepareApiPayload(platform, params.keyword);
          
          console.log(`📡 Appel API ${platform}:`, `${API_BASE_URL}${endpoint}`);
          
          const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            console.error(`❌ Erreur API ${platform}:`, response.status);
            continue;
          }

          const data = await response.json();
          console.log(`✅ Réponse API ${platform}:`, data);
          
          const posts = data?.data?.items || [];
          
          results.push({
            platform,
            mentions: posts.length,
            engagement: calculateEngagement(posts),
            sentiment: calculateSentiment(posts),
            posts: transformPosts(posts, platform)
          });
          
        } catch (error) {
          console.error(`❌ Erreur ${platform}:`, error);
        }
      }
      
      setSearchResults(results);
      
      toast({
        title: "Recherche terminée",
        description: `${results.length} plateformes analysées via API Backend`,
      });
      
    } catch (error) {
      console.error('❌ Erreur générale:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la recherche via l'API Backend.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const executeAdvancedSearch = async (params: any) => {
    if (!params.keywords || params.keywords.length === 0 || params.platforms.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir au moins un mot-clé et sélectionner au moins une plateforme.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchTerm(params.keywords.join(', '));
    setSearchResults([]);

    try {
      console.log('🔍 RECHERCHE AVANCÉE API:', params);
      
      const results: SearchResult[] = [];
      
      for (const platform of params.platforms) {
        try {
          const endpoint = `/api/scrape/${platform.toLowerCase()}`;
          const payload = prepareAdvancedApiPayload(platform, params);
          
          console.log(`📡 Appel API avancé ${platform}:`, `${API_BASE_URL}${endpoint}`);
          
          const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            console.error(`❌ Erreur API ${platform}:`, response.status);
            continue;
          }

          const data = await response.json();
          console.log(`✅ Réponse API ${platform}:`, data);
          
          const posts = data?.data?.items || [];
          
          results.push({
            platform,
            mentions: posts.length,
            engagement: calculateEngagement(posts),
            sentiment: calculateSentiment(posts),
            posts: transformPosts(posts, platform)
          });
          
        } catch (error) {
          console.error(`❌ Erreur ${platform}:`, error);
        }
      }
      
      setSearchResults(results);
      
      toast({
        title: "Recherche avancée terminée",
        description: `${results.length} plateformes analysées via API Backend`,
      });
      
    } catch (error) {
      console.error('❌ Erreur générale:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la recherche avancée via l'API Backend.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const prepareApiPayload = (platform: string, keyword: string) => {
    switch (platform.toLowerCase()) {
      case 'tiktok':
        return { hashtags: [keyword] };
      case 'instagram':
        return { usernames: [keyword] };
      case 'facebook':
      case 'twitter':
      case 'youtube':
      default:
        return { keywords: [keyword] };
    }
  };

  const prepareAdvancedApiPayload = (platform: string, params: any) => {
    switch (platform.toLowerCase()) {
      case 'tiktok':
        return { hashtags: params.keywords };
      case 'instagram':
        return { usernames: params.keywords };
      case 'facebook':
      case 'twitter':
      case 'youtube':
      default:
        return { keywords: params.keywords };
    }
  };

  const transformPosts = (posts: any[], platform: string) => {
    return posts.map((post: any) => ({
      id: post.id || `${platform}_${Date.now()}_${Math.random()}`,
      author: post.username || post.author || post.authorMeta?.name || 'Utilisateur',
      content: post.text || post.content || post.desc || post.biography || '',
      likes: post.diggCount || post.likes || post.likesCount || 0,
      comments: post.commentCount || post.comments || post.commentsCount || 0,
      shares: post.shareCount || post.shares || post.sharesCount || 0,
      views: post.playCount || post.views || post.viewCount || 0,
      url: post.webVideoUrl || post.url || post.permalink_url || `https://${platform.toLowerCase()}.com`,
      timestamp: post.createTime ? new Date(post.createTime * 1000).toISOString() : 
                 post.created_time || post.timestamp || new Date().toISOString(),
      sentiment: 'neutral', // À améliorer avec une analyse de sentiment
      platform
    }));
  };

  const calculateEngagement = (posts: any[]) => {
    return posts.reduce((sum, post) => {
      return sum + (post.diggCount || post.likes || 0) + 
                  (post.commentCount || post.comments || 0) + 
                  (post.shareCount || post.shares || 0);
    }, 0);
  };

  const calculateSentiment = (posts: any[]) => {
    // Logique simple de sentiment - à améliorer
    return posts.length > 5 ? 'positive' : posts.length > 0 ? 'neutral' : 'negative';
  };

  const saveCurrentSearch = () => {
    const searchData: SavedSearch = {
      id: `search_${Date.now()}`,
      name: `Recherche ${searchTerm}`,
      keywords: searchTerm.split(', '),
      platforms: searchResults.map(r => r.platform),
      language: 'fr',
      period: '7d',
      sentiment: 'all',
      created_at: new Date().toISOString()
    };
    
    setSavedSearches(prev => [searchData, ...prev]);
    
    toast({
      title: "Recherche sauvegardée",
      description: `"${searchData.name}" a été sauvegardée.`,
    });
  };

  const deleteSavedSearch = (searchId: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== searchId));
    toast({
      title: "Recherche supprimée",
      description: "La recherche sauvegardée a été supprimée.",
    });
  };

  const loadSavedSearch = (search: SavedSearch) => {
    setSearchTerm(search.keywords.join(', '));
    executeSimpleSearch({
      keyword: search.keywords.join(', '),
      platforms: search.platforms
    });
  };

  return {
    searchResults,
    isSearching,
    searchTerm,
    savedSearches,
    executeSimpleSearch,
    executeAdvancedSearch,
    saveCurrentSearch,
    deleteSavedSearch,
    loadSavedSearch
  };
};
