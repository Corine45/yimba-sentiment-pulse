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
import { useRealSearch } from "@/hooks/useRealSearch";
import { SearchFilters } from "@/services/api/types";

export const RealSearchPanel = () => {
  // 🔥 ÉTAT LOCAL POUR LA CONFIGURATION DE RECHERCHE
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [activeTab, setActiveTab] = useState('search');
  
  // 🎯 DONNÉES EXCLUSIVEMENT DE VOS APIs - ZERO DONNÉES STATIQUES
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
    clearCache 
  } = useRealSearch();

  console.log('🔍 RealSearchPanel - DONNÉES PURES API YIMBA PULSE:', {
    totalMentions,
    mentionsCount: mentions.length,
    isLoading,
    platforms: Object.keys(platformCounts),
    sentiment: sentimentStats
  });

  const handleSearch = () => {
    setCurrentPage(1);
    console.log('🚀 RECHERCHE EXCLUSIVEMENT VOS APIs:', {
      keywords,
      platforms: selectedPlatforms,
      filters,
      api: 'https://yimbapulseapi.a-car.ci'
    });
    executeSearch(keywords, selectedPlatforms, filters);
  };

  const handleSaveMentions = async () => {
    if (paginatedMentions.length === 0) return;
    await saveMentions(paginatedMentions, keywords, selectedPlatforms, filters);
  };

  const clearAllFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => {
      const value = filters[key as keyof SearchFilters];
      return value !== undefined && value !== null && value !== '';
    }).length;
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // 🔥 DÉDUPLICATION DES MENTIONS API UNIQUEMENT
  const uniqueMentions = useMemo(() => {
    console.log('🔍 Déduplication des mentions API YIMBA PULSE:', mentions.length);
    const seen = new Set();
    const filtered = mentions.filter(mention => {
      const key = `${mention.id}-${mention.platform}-${mention.timestamp}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    console.log('✅ Mentions uniques de VOS APIs:', filtered.length);
    return filtered;
  }, [mentions]);

  // PAGINATION BASÉE EXCLUSIVEMENT SUR VOS APIs
  const totalPages = Math.ceil(uniqueMentions.length / itemsPerPage);
  
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedMentions = uniqueMentions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log('📊 DONNÉES FINALES AFFICHÉES (VOS APIs UNIQUEMENT):', {
    totalMentions,
    uniqueCount: uniqueMentions.length,
    paginatedCount: paginatedMentions.length,
    currentPage,
    totalPages
  });

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">🔍 Recherche</TabsTrigger>
          <TabsTrigger value="apis">🔗 Mes APIs</TabsTrigger>
          <TabsTrigger value="history">📚 Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <SearchHeader fromCache={fromCache} onClearCache={clearCache} />
              </CardTitle>
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600 font-semibold">🚀 API Backend Exclusif:</span>
                  <code className="bg-white px-2 py-1 rounded">https://yimbapulseapi.a-car.ci</code>
                </div>
                <div className="mt-2 text-xs text-green-600">
                  ✨ <strong>VOS APIs HARMONISÉES ACTIVES</strong> - TikTok • Facebook • Instagram • Twitter/X • YouTube • Google • Web
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

              <div className="flex justify-center pt-4">
                <Button 
                  onClick={handleSearch} 
                  disabled={isLoading || keywords.length === 0 || selectedPlatforms.length === 0}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="w-5 h-5 mr-2" />
                  {isLoading ? "Recherche API en cours..." : "🔍 Rechercher dans mes APIs"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* RÉSULTATS EXCLUSIVEMENT DE VOS APIs */}
          {(uniqueMentions.length > 0 || isLoading) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <SearchStats 
                  totalMentions={totalMentions}
                  sentimentStats={sentimentStats}
                  totalEngagement={totalEngagement}
                  mentions={uniqueMentions}
                  onSaveMentions={handleSaveMentions}
                />
                
                <Brand24StyleResults 
                  mentions={paginatedMentions}
                  isLoading={isLoading}
                />
                
                {uniqueMentions.length > 0 && (
                  <SearchPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={uniqueMentions.length}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                  />
                )}
              </div>
              
              <div className="space-y-6">
                <WordCloud mentions={uniqueMentions} />
              </div>
            </div>
          )}

          {!isLoading && uniqueMentions.length === 0 && keywords.length > 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">
                  Aucune mention trouvée dans vos APIs pour ces critères.
                </p>
              </CardContent>
            </Card>
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