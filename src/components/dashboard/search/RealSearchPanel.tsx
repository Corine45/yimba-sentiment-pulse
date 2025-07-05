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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);
  
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
                <span>Recherche enrichie - API Backend Harmonisée</span>
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
                  ✨ APIs harmonisées: Facebook Posts Ideal, Instagram Profile, Google Search, YouTube Channel, Web Cheerio
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

              {/* Filtres avancés toujours visibles */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Filtres avancés complets</h3>
                    {getActiveFiltersCount() > 0 && (
                      <Badge variant="default" className="bg-blue-600">
                        {getActiveFiltersCount()} actifs
                      </Badge>
                    )}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    {showAdvancedFilters ? 'Masquer' : 'Afficher'}
                  </Button>
                </div>

                {showAdvancedFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg">
                    {/* Période */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">📅 Période</label>
                      <select 
                        value={filters.period || '7d'}
                        onChange={(e) => setFilters({...filters, period: e.target.value as any})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="1d">Dernières 24h</option>
                        <option value="7d">7 derniers jours</option>
                        <option value="30d">30 derniers jours</option>
                        <option value="3m">3 derniers mois</option>
                        <option value="6m">6 derniers mois</option>
                        <option value="12m">1 an</option>
                      </select>
                    </div>

                    {/* Tri */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">🔄 Tri par</label>
                      <select 
                        value={filters.sortBy || 'recent'}
                        onChange={(e) => setFilters({...filters, sortBy: e.target.value as any})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="recent">Plus récent</option>
                        <option value="popular">Popularité</option>
                        <option value="engagement">Engagement</option>
                        <option value="influence">Score d'influence</option>
                      </select>
                    </div>

                    {/* Langue */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">🌍 Langue</label>
                      <select 
                        value={filters.language || 'fr'}
                        onChange={(e) => setFilters({...filters, language: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Toutes langues</option>
                        <option value="fr">Français</option>
                        <option value="en">Anglais</option>
                        <option value="es">Espagnol</option>
                        <option value="ar">Arabe</option>
                      </select>
                    </div>

                    {/* Sentiment */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">😊 Sentiment</label>
                      <select 
                        value={filters.sentiment || ''}
                        onChange={(e) => setFilters({...filters, sentiment: e.target.value as any})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Tous sentiments</option>
                        <option value="positive">😊 Positif</option>
                        <option value="neutral">😐 Neutre</option>
                        <option value="negative">😔 Négatif</option>
                      </select>
                    </div>

                    {/* Score d'influence */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">⭐ Score d'influence min</label>
                      <input 
                        type="number"
                        min="1"
                        max="10"
                        value={filters.minInfluenceScore || ''}
                        onChange={(e) => setFilters({...filters, minInfluenceScore: parseInt(e.target.value) || undefined})}
                        placeholder="1-10"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    {/* Pays */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">🌍 Pays</label>
                      <input 
                        type="text"
                        value={filters.country || ''}
                        onChange={(e) => setFilters({...filters, country: e.target.value})}
                        placeholder="ex: France, Côte d'Ivoire"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    {/* Auteur */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">👤 Auteur</label>
                      <input 
                        type="text"
                        value={filters.author || ''}
                        onChange={(e) => setFilters({...filters, author: e.target.value})}
                        placeholder="Nom d'utilisateur"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    {/* Domaine */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">🌐 Domaine</label>
                      <input 
                        type="text"
                        value={filters.domain || ''}
                        onChange={(e) => setFilters({...filters, domain: e.target.value})}
                        placeholder="ex: facebook.com"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    {/* Importance */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">🔥 Importance</label>
                      <select 
                        value={filters.importance || 'all'}
                        onChange={(e) => setFilters({...filters, importance: e.target.value as any})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="all">Toute importance</option>
                        <option value="high">🔥 Élevée</option>
                        <option value="medium">⚡ Moyenne</option>
                        <option value="low">💫 Faible</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">                
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={clearAllFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Effacer filtres
                  </Button>
                  <Button variant="outline" onClick={handleSaveFilters}>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder filtres
                  </Button>
                </div>
                
                <Button 
                  onClick={handleSearch} 
                  disabled={isLoading || keywords.length === 0 || selectedPlatforms.length === 0}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-6 py-2"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isLoading ? "Recherche enrichie..." : "🚀 Lancer la recherche"}
                </Button>
              </div>
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

        <TabsContent value="history">
          <SavedMentionsHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};
