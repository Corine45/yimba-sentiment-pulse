
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Search, Save, Trash2, Database } from "lucide-react";
import { Brand24StyleResults } from "./Brand24StyleResults";
import { AdvancedSearchFilters } from "./AdvancedSearchFilters";
import { SearchPagination } from "./SearchPagination";
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
  
  const { 
    mentions, 
    isLoading, 
    platformCounts, 
    totalMentions, 
    fromCache,
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

  const handleSaveMentions = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const mentionsToSave = mentions.slice(startIndex, endIndex);
    saveMentions(mentionsToSave);
  };

  // Pagination des résultats
  const totalPages = Math.ceil(mentions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMentions = mentions.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Configuration de recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recherche en temps réel - API Backend</span>
            <div className="flex items-center space-x-2">
              {fromCache && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Database className="w-3 h-3" />
                  <span>Cache</span>
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

      {/* Statistiques */}
      {totalMentions > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalMentions}</div>
                <div className="text-sm text-gray-600">Total mentions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Object.keys(platformCounts).length}</div>
                <div className="text-sm text-gray-600">Plateformes actives</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{keywords.length}</div>
                <div className="text-sm text-gray-600">Mots-clés</div>
              </div>
              <div className="text-center">
                <Button variant="outline" size="sm" onClick={handleSaveMentions}>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </div>
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
    </div>
  );
};
