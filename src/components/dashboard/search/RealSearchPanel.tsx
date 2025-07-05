
import { useState } from 'react';
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
import { KeywordMonitor } from "./KeywordMonitor";
import { OptionalAdvancedFilters } from "./OptionalAdvancedFilters";
import { useRealSearch } from "@/hooks/useRealSearch";
import { SearchFilters } from "@/services/api/types";

export const RealSearchPanel = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
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
    clearCache 
  } = useRealSearch();

  const handleSearch = () => {
    setCurrentPage(1);
    console.log('🚀 LANCEMENT RECHERCHE OPTIMISÉE AVEC TOUTES LES APIs:', {
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
    if (filters.importance && filters.importance !== 'all') count++;
    if (filters.visited && filters.visited !== 'all') count++;
    if (filters.minInfluenceScore && filters.minInfluenceScore > 0) count++;
    if (filters.sentiment) count++;
    if (filters.sortBy) count++;
    if (filters.period) count++;
    if (filters.tags?.length) count++;
    if (filters.dateFrom || filters.dateTo) count++;
    return count;
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    console.log('🔧 MISE À JOUR FILTRES OPTIONNELS:', newFilters);
    setFilters(newFilters);
  };

  const handleKeywordMonitorSelect = (monitorKeywords: string[], monitorPlatforms: string[]) => {
    setKeywords(monitorKeywords);
    setSelectedPlatforms(monitorPlatforms);
    handleSearch();
  };

  const totalPages = Math.ceil(mentions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMentions = mentions.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="search">🔍 Recherche</TabsTrigger>
          <TabsTrigger value="monitor">🎯 Surveillance</TabsTrigger>
          <TabsTrigger value="apis">🔗 Mes APIs</TabsTrigger>
          <TabsTrigger value="history">📚 Historique</TabsTrigger>
          <TabsTrigger value="settings">⚙️ Paramètres</TabsTrigger>
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
                  <span className="text-blue-600 font-semibold">🚀 API Backend Optimisé:</span>
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
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={handleSearch} 
                  disabled={isLoading || keywords.length === 0 || selectedPlatforms.length === 0}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-3 text-lg"
                  size="lg"
                >
                  <Search className="w-5 h-5 mr-2" />
                  {isLoading ? "🔄 Recherche via 30+ APIs..." : "🚀 Rechercher via toutes mes APIs"}
                </Button>
              </div>
              
              {/* Debug des API */}
              {isLoading && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    🔍 Recherche optimisée en cours sur vos 30+ APIs harmonisées...
                  </p>
                  <div className="text-xs text-yellow-600 mt-1">
                    Plateformes: {selectedPlatforms.join(', ')} | Mots-clés: {keywords.join(', ')}
                  </div>
                  <div className="text-xs text-yellow-600 mt-1">
                    Filtres: {getActiveFiltersCount() > 0 ? `${getActiveFiltersCount()} filtres actifs` : 'Aucun filtre (données brutes)'}
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
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalMentions}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </TabsContent>

        <TabsContent value="monitor">
          <KeywordMonitor onKeywordSelect={handleKeywordMonitorSelect} />
        </TabsContent>

        <TabsContent value="apis">
          <ApiEndpointsList />
        </TabsContent>

        <TabsContent value="history">
          <SavedMentionsHistory />
        </TabsContent>

        <TabsContent value="settings">
          <div className="text-center py-8">
            <p className="text-gray-500">Les paramètres avancés seront disponibles dans le panneau principal des paramètres.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
