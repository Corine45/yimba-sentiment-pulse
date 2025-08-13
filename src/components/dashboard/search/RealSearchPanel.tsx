
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Brand24StyleResults } from "./Brand24StyleResults";
import { SearchPagination } from "./SearchPagination";
import { SavedMentionsHistory } from "./SavedMentionsHistory";
import { WordCloud } from "../widgets/WordCloud";
import { KeywordInput } from "./KeywordInput";
import { PlatformSelector } from "./PlatformSelector";
import { SearchStats } from "./SearchStats";
import { SearchHeader } from "./SearchHeader";
import { ApiEndpointsList } from "./ApiEndpointsList";
import { OptionalAdvancedFilters } from "./OptionalAdvancedFilters";
import { useRealSearchOptimized as useRealSearch } from "@/hooks/useRealSearchOptimized";
import { SearchFilters } from "@/services/api/types";

export const RealSearchPanel = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50); // Augmenté à 50 pour voir plus de mentions
  const [activeTab, setActiveTab] = useState('search');
  
  const { 
    mentions, 
    isLoading, 
    platformCounts, 
    totalMentions, 
    fromCache,
    sentimentStats,
    totalEngagement,
    executeSearch, 
    saveMentions, 
    clearCache,
    realtimeEnabled,
    toggleRealtimeSearch
  } = useRealSearch();

  const handleSearch = () => {
    setCurrentPage(1);
    console.log('🚀 RECHERCHE FIABLE AVEC TOUTES LES APIs:', {
      keywords,
      platforms: selectedPlatforms,
      filters,
      api: 'https://yimbapulseapi.a-car.ci',
      totalApis: 'Plus de 30 endpoints disponibles'
    });
    executeSearch(keywords, selectedPlatforms, filters);
  };

  const handleSaveMentions = async (format: 'json' | 'pdf' | 'csv' = 'json') => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const mentionsToSave = mentions.slice(startIndex, endIndex);
    
    await saveMentions(mentionsToSave, keywords, selectedPlatforms, filters, format);
  };

  const clearAllFilters = () => {
    setFilters({});
    console.log('🗑️ Tous les filtres effacés');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.language) count++;
    if (filters.excludedLanguages?.length) count++;
    if (filters.geography?.country) count++;
    if (filters.excludedCountries?.length) count++;
    if (filters.author) count++;
    if (filters.domain) count++;
    if (filters.country) count++;
    if (filters.importance && filters.importance !== 'all') count++;
    if (filters.visited && filters.visited !== 'all') count++;
    if (filters.minInfluenceScore && filters.minInfluenceScore > 0) count++;
    if (filters.sentiment) count++;
    if (filters.sortBy) count++;
    if (filters.period) count++;
    if (filters.tags?.length) count++;
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.minEngagement) count++;
    return count;
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    console.log('🔧 MISE À JOUR FILTRES OPTIONNELS:', newFilters);
    setFilters(newFilters);
  };

  // 🔧 FIX PAGINATION: S'assurer que currentPage est valide et éviter les doublons
  const totalPages = Math.ceil(mentions.length / itemsPerPage);
  
  // Créer un Set d'IDs uniques pour éviter les doublons
  const uniqueMentions = useMemo(() => {
    const seen = new Set();
    return mentions.filter(mention => {
      const uniqueId = `${mention.id}-${mention.platform}-${mention.timestamp}`;
      if (seen.has(uniqueId)) {
        return false;
      }
      seen.add(uniqueId);
      return true;
    });
  }, [mentions]);

  // Recalculer les pages avec les mentions uniques
  const correctedTotalPages = Math.ceil(uniqueMentions.length / itemsPerPage);
  
  // Réinitialiser à la page 1 si la page actuelle est invalide
  const validCurrentPage = currentPage > correctedTotalPages ? 1 : currentPage;
  
  useEffect(() => {
    if (validCurrentPage !== currentPage && uniqueMentions.length > 0) {
      setCurrentPage(validCurrentPage);
    }
  }, [validCurrentPage, currentPage, uniqueMentions.length]);
  
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMentions = uniqueMentions.slice(startIndex, endIndex);
  
  console.log(`📄 PAGINATION DEBUG: Page ${validCurrentPage}/${correctedTotalPages}, Items ${startIndex+1}-${Math.min(endIndex, uniqueMentions.length)} sur ${uniqueMentions.length} (mentions uniques)`);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">🔍 Recherche</TabsTrigger>
          <TabsTrigger value="apis">🔗 Mes APIs</TabsTrigger>
          <TabsTrigger value="history">📚 Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          {/* Configuration de recherche */}
          <Card>
            <CardHeader>
              <CardTitle>
                <SearchHeader fromCache={fromCache} onClearCache={clearCache} />
              </CardTitle>
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600 font-semibold">🚀 API Backend Fiable:</span>
                  <code className="bg-white px-2 py-1 rounded">https://yimbapulseapi.a-car.ci</code>
                </div>
                <div className="mt-2 text-xs text-green-600">
                  ✨ <strong>30+ APIs harmonisées actives</strong> - TikTok • Facebook • Instagram • Twitter/X • YouTube • Google • Web + toutes les variantes spécialisées
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <KeywordInput keywords={keywords} onKeywordsChange={setKeywords} />
              <PlatformSelector 
                selectedPlatforms={selectedPlatforms} 
                onPlatformsChange={setSelectedPlatforms}
                platformCounts={platformCounts}
              />

              <OptionalAdvancedFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={clearAllFilters}
                getActiveFiltersCount={getActiveFiltersCount}
              />

              {/* Bouton de recherche principal */}
              <div className="flex justify-center pt-4 space-x-4">
                <Button 
                  onClick={handleSearch} 
                  disabled={isLoading || keywords.length === 0 || selectedPlatforms.length === 0}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-3 text-lg"
                  size="lg"
                >
                  <Search className="w-5 h-5 mr-2" />
                  {isLoading ? "🔄 Recherche via toutes vos APIs..." : "🚀 Rechercher via toutes mes APIs"}
                </Button>
                
                {totalMentions > 0 && (
                  <Button 
                    onClick={toggleRealtimeSearch}
                    variant={realtimeEnabled ? "destructive" : "outline"}
                    size="lg"
                  >
                    {realtimeEnabled ? "🔴 Arrêter Temps Réel" : "🟢 Temps Réel"}
                  </Button>
                )}
              </div>
              
              {/* Debug des API et Statut Temps Réel */}
              {isLoading && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    🔍 Recherche en cours sur vos APIs https://yimbapulseapi.a-car.ci...
                  </p>
                  <div className="text-xs text-yellow-600 mt-1">
                    Plateformes: {selectedPlatforms.join(', ')} | Mots-clés: {keywords.join(', ')}
                  </div>
                  <div className="text-xs text-yellow-600 mt-1">
                    Filtres: {getActiveFiltersCount() > 0 ? `${getActiveFiltersCount()} filtres actifs` : 'Aucun filtre (données brutes)'}
                  </div>
                </div>
              )}
              
              {realtimeEnabled && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    🔴 TEMPS RÉEL ACTIF - Surveillance automatique des nouvelles mentions
                  </p>
                  <div className="text-xs text-green-600 mt-1">
                    Les nouvelles mentions s'ajoutent automatiquement sans recharger la page
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Widgets et résultats */}
          {totalMentions > 0 && <WordCloud mentions={mentions} />}

          {totalMentions > 0 && (
            <SearchStats
              totalMentions={totalMentions}
              sentimentStats={sentimentStats}
              totalEngagement={totalEngagement}
              mentions={mentions}
              onSaveMentions={handleSaveMentions}
            />
          )}

          <Brand24StyleResults mentions={paginatedMentions} isLoading={isLoading} />

          {totalMentions > 0 && (
            <SearchPagination
              currentPage={validCurrentPage}
              totalPages={correctedTotalPages}
              totalItems={uniqueMentions.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => {
                console.log(`📄 CHANGEMENT PAGE: ${page}`);
                setCurrentPage(page);
              }}
              onItemsPerPageChange={(newItemsPerPage) => {
                console.log(`📄 CHANGEMENT ITEMS/PAGE: ${newItemsPerPage}`);
                setItemsPerPage(newItemsPerPage);
                setCurrentPage(1); // Reset à la page 1 quand on change le nombre d'items
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="apis">
          <ApiEndpointsList />
        </TabsContent>

        <TabsContent value="history">
          <SavedMentionsHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};
