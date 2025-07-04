
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Search, Save, Trash2, Database, Download, TrendingUp, Heart, MessageCircle, Share, Eye } from "lucide-react";
import { Brand24StyleResults } from "./Brand24StyleResults";
import { AdvancedSearchFilters } from "./AdvancedSearchFilters";
import { SearchPagination } from "./SearchPagination";
import { SavedMentionsHistory } from "./SavedMentionsHistory";
import { useRealSearch } from "@/hooks/useRealSearch";
import { SearchFilters } from "@/services/realApiService";

const AVAILABLE_PLATFORMS = [
  { id: 'tiktok', name: 'TikTok', description: 'Hashtags & Géolocalisation' },
  { id: 'facebook', name: 'Facebook', description: 'Posts, Pages & URLs' },
  { id: 'twitter', name: 'Twitter', description: 'Tweets & Réponses' },
  { id: 'youtube', name: 'YouTube', description: 'Vidéos & Commentaires' },
  { id: 'instagram', name: 'Instagram', description: 'Posts, Reels & Hashtags' }
];

export const RealSearchPanel = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [savedFilters, setSavedFilters] = useState<SearchFilters[]>([]);
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

  const addKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSearch = () => {
    setCurrentPage(1);
    executeSearch(keywords, selectedPlatforms, filters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addKeyword();
    }
  };

  const handleSaveFilters = () => {
    setSavedFilters([...savedFilters, filters]);
  };

  const handleLoadFilters = (loadedFilters: SearchFilters) => {
    setFilters(loadedFilters);
  };

  const handleSaveMentions = async (format: 'json' | 'pdf' | 'csv' = 'json') => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const mentionsToSave = mentions.slice(startIndex, endIndex);
    await saveMentions(mentionsToSave, keywords, selectedPlatforms, filters, format);
  };

  // Pagination des résultats
  const totalPages = Math.ceil(mentions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMentions = mentions.slice(startIndex, endIndex);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

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
                <span>Recherche en temps réel - API Backend</span>
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
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mots-clés */}
              <div className="space-y-3">
                <Label>Mots-clés à surveiller</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ajouter un mot-clé..."
                    value={currentKeyword}
                    onChange={(e) => setCurrentKeyword(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button onClick={addKeyword} disabled={!currentKeyword.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="flex items-center space-x-1">
                      <span>{keyword}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeKeyword(keyword)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Plateformes */}
              <div className="space-y-3">
                <Label>Plateformes à analyser</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {AVAILABLE_PLATFORMS.map((platform) => (
                    <div key={platform.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={platform.id}
                        checked={selectedPlatforms.includes(platform.id)}
                        onCheckedChange={() => togglePlatform(platform.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={platform.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {platform.name}
                          {platformCounts[platform.name] && (
                            <Badge variant="outline" className="ml-2">
                              {platformCounts[platform.name]}
                            </Badge>
                          )}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {platform.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bouton de recherche */}
              <Button 
                onClick={handleSearch} 
                disabled={isLoading || keywords.length === 0 || selectedPlatforms.length === 0}
                className="w-full"
              >
                <Search className="w-4 h-4 mr-2" />
                {isLoading ? "Recherche en cours..." : "Lancer la recherche"}
              </Button>
            </CardContent>
          </Card>

          {/* Filtres avancés */}
          <AdvancedSearchFilters
            filters={filters}
            onFiltersChange={setFilters}
            onSaveFilters={handleSaveFilters}
            savedFilters={savedFilters}
            onLoadFilters={handleLoadFilters}
          />

          {/* Statistiques détaillées */}
          {totalMentions > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{totalMentions}</div>
                    <div className="text-sm text-gray-600">Total mentions</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{sentimentStats.positive}</div>
                    <div className="text-sm text-gray-600">Positives</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{sentimentStats.neutral}</div>
                    <div className="text-sm text-gray-600">Neutres</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{sentimentStats.negative}</div>
                    <div className="text-sm text-gray-600">Négatives</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{formatNumber(totalEngagement)}</div>
                    <div className="text-sm text-gray-600">Engagement total</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSaveMentions('json')}
                        className="text-blue-600"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        JSON
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSaveMentions('pdf')}
                        className="text-red-600"
                      >
                        PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSaveMentions('csv')}
                        className="text-green-600"
                      >
                        CSV
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Engagement détaillé */}
                {totalEngagement > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-3">Engagement détaillé</div>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="font-medium">
                          {formatNumber(mentions.reduce((sum, m) => sum + m.engagement.likes, 0))}
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">
                          {formatNumber(mentions.reduce((sum, m) => sum + m.engagement.comments, 0))}
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <Share className="w-4 h-4 text-green-500" />
                        <span className="font-medium">
                          {formatNumber(mentions.reduce((sum, m) => sum + m.engagement.shares, 0))}
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <Eye className="w-4 h-4 text-purple-500" />
                        <span className="font-medium">
                          {formatNumber(mentions.reduce((sum, m) => sum + (m.engagement.views || 0), 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Résultats */}
          <Brand24StyleResults mentions={paginatedMentions} isLoading={isLoading} />

          {/* Pagination */}
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
