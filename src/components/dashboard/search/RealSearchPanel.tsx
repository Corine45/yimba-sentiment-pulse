
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Search, Save, Trash2, Database, Filter } from "lucide-react";
import { Brand24StyleResults } from "./Brand24StyleResults";
import { SearchPagination } from "./SearchPagination";
import { SavedMentionsHistory } from "./SavedMentionsHistory";
import { WordCloud } from "../widgets/WordCloud";
import { KeywordInput } from "./KeywordInput";
import { PlatformSelector } from "./PlatformSelector";
import { SentimentFilter } from "./SentimentFilter";
import { InfluenceScoreFilter } from "./InfluenceScoreFilter";
import { SearchStats } from "./SearchStats";
import { DynamicAdvancedFilters } from "./DynamicAdvancedFilters";
import { useRealSearch } from "@/hooks/useRealSearch";
import { SearchFilters } from "@/services/api/types";

export const RealSearchPanel = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [savedFilters, setSavedFilters] = useState<SearchFilters[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [activeTab, setActiveTab] = useState('search');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
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
    console.log('🔍 LANCEMENT RECHERCHE AVEC FILTRES AVANCÉS:', filters);
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
    console.log('🔧 MISE À JOUR FILTRES:', newFilters);
    setFilters(newFilters);
  };

  const handleSaveFilters = () => {
    setSavedFilters([...savedFilters, filters]);
    console.log('💾 Filtres sauvegardés:', filters);
  };

  const handleApplyFilters = () => {
    console.log('✅ APPLICATION DES FILTRES AVANCÉS:', filters);
    handleSearch();
  };

  const totalPages = Math.ceil(mentions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMentions = mentions.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Recherche & Résultats</TabsTrigger>
          <TabsTrigger value="history">Historique des sauvegardes</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          {/* Configuration de recherche */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recherche en temps réel - API Backend Enrichie</span>
                <div className="flex items-center space-x-2">
                  {fromCache && (
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Database className="w-3 h-3" />
                      <span>Cache 10min</span>
                    </Badge>
                  )}
                  <Button variant="outline" size="sm" onClick={clearCache}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Vider cache
                  </Button>
                </div>
              </CardTitle>
              <div className="text-sm text-gray-600">
                Données scrapées depuis: <code>https://yimbapulseapi.a-car.ci</code>
                <br />
                <span className="text-green-600 font-medium">
                  APIs enrichies: Facebook Posts Ideal, Instagram Profile, Google Search, YouTube Channel, Web Cheerio
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <KeywordInput keywords={keywords} onKeywordsChange={setKeywords} />
              <PlatformSelector 
                selectedPlatforms={selectedPlatforms} 
                onPlatformsChange={setSelectedPlatforms}
                platformCounts={platformCounts}
              />

              {/* Bouton pour afficher/masquer les filtres avancés */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtres avancés complets</span>
                  {getActiveFiltersCount() > 0 && (
                    <Badge variant="secondary">{getActiveFiltersCount()}</Badge>
                  )}
                </Button>
                
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={clearAllFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Effacer filtres
                  </Button>
                  <Button 
                    onClick={handleSearch} 
                    disabled={isLoading || keywords.length === 0 || selectedPlatforms.length === 0}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {isLoading ? "Recherche enrichie en cours..." : "Lancer la recherche enrichie"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filtres avancés avec toutes les options */}
          {showAdvancedFilters && (
            <DynamicAdvancedFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onSaveFilters={handleSaveFilters}
              onApplyFilters={handleApplyFilters}
            />
          )}

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

        <TabsContent value="history">
          <SavedMentionsHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};
