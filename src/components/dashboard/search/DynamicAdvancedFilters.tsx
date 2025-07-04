
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, Filter, Settings, Search } from "lucide-react";
import { SearchFilters } from "@/services/api/types";

interface DynamicAdvancedFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSaveFilters: () => void;
  onApplyFilters: () => void;
}

const SOURCES = [
  { id: 'facebook', name: 'Facebook', connected: true },
  { id: 'instagram', name: 'Instagram', connected: true },
  { id: 'twitter', name: 'X (Twitter)', connected: false },
  { id: 'tiktok', name: 'TikTok', connected: true },
  { id: 'youtube', name: 'YouTube', connected: false },
  { id: 'videos', name: 'Videos', connected: false },
  { id: 'podcasts', name: 'Podcasts', connected: false },
  { id: 'blogs', name: 'Blogs', connected: false },
  { id: 'news', name: 'News', connected: false },
  { id: 'web', name: 'Web', connected: false },
  { id: 'other_socials', name: 'Other Socials', connected: false }
];

const PERIODS = [
  { value: '1d', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 3 months' },
  { value: '180d', label: 'Last 6 months' },
  { value: '365d', label: 'Last year' }
];

const LANGUAGES = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ar', name: 'العربية' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' }
];

const COUNTRIES = [
  { code: 'CI', name: 'Côte d\'Ivoire' },
  { code: 'FR', name: 'France' },
  { code: 'SN', name: 'Sénégal' },
  { code: 'GH', name: 'Ghana' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'ML', name: 'Mali' },
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' }
];

export const DynamicAdvancedFilters = ({ 
  filters, 
  onFiltersChange, 
  onSaveFilters,
  onApplyFilters 
}: DynamicAdvancedFiltersProps) => {
  const [selectedSources, setSelectedSources] = useState<string[]>(
    filters.platforms || ['facebook', 'instagram', 'tiktok']
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [excludedLanguages, setExcludedLanguages] = useState<string[]>([]);
  const [excludedCountries, setExcludedCountries] = useState<string[]>([]);
  const [influenceScore, setInfluenceScore] = useState<number[]>([filters.minInfluenceScore || 0]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const handleSourceToggle = (sourceId: string, checked: boolean) => {
    const newSources = checked 
      ? [...selectedSources, sourceId]
      : selectedSources.filter(s => s !== sourceId);
    
    setSelectedSources(newSources);
    updateFilter('platforms', newSources);
  };

  const addLanguage = (langCode: string) => {
    if (!selectedLanguages.includes(langCode)) {
      const newLanguages = [...selectedLanguages, langCode];
      setSelectedLanguages(newLanguages);
      updateFilter('languages', newLanguages);
    }
  };

  const removeLanguage = (langCode: string) => {
    const newLanguages = selectedLanguages.filter(l => l !== langCode);
    setSelectedLanguages(newLanguages);
    updateFilter('languages', newLanguages);
  };

  const addExcludedLanguage = (langCode: string) => {
    if (!excludedLanguages.includes(langCode)) {
      const newExcluded = [...excludedLanguages, langCode];
      setExcludedLanguages(newExcluded);
      updateFilter('excludedLanguages', newExcluded);
    }
  };

  const removeExcludedLanguage = (langCode: string) => {
    const newExcluded = excludedLanguages.filter(l => l !== langCode);
    setExcludedLanguages(newExcluded);
    updateFilter('excludedLanguages', newExcluded);
  };

  const addExcludedCountry = (countryCode: string) => {
    if (!excludedCountries.includes(countryCode)) {
      const newExcluded = [...excludedCountries, countryCode];
      setExcludedCountries(newExcluded);
      updateFilter('excludedCountries', newExcluded);
    }
  };

  const removeExcludedCountry = (countryCode: string) => {
    const newExcluded = excludedCountries.filter(c => c !== countryCode);
    setExcludedCountries(newExcluded);
    updateFilter('excludedCountries', newExcluded);
  };

  const clearAllFilters = () => {
    setSelectedSources(['facebook', 'instagram', 'tiktok']);
    setSelectedLanguages([]);
    setExcludedLanguages([]);
    setExcludedCountries([]);
    setInfluenceScore([0]);
    onFiltersChange({});
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtres avancés</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <X className="w-4 h-4 mr-1" />
              Effacer
            </Button>
            <Button variant="outline" size="sm" onClick={onSaveFilters}>
              <Settings className="w-4 h-4 mr-1" />
              Sauvegarder
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Période */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Période</Label>
          <Select value={filters.period || '30d'} onValueChange={(value) => updateFilter('period', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              {PERIODS.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sources */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Sources</Label>
            <span className="text-sm text-gray-500">Afficher tout</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SOURCES.map((source) => (
              <div key={source.id} className="flex items-center space-x-3 p-2 border rounded">
                <Checkbox
                  id={source.id}
                  checked={selectedSources.includes(source.id)}
                  onCheckedChange={(checked) => handleSourceToggle(source.id, checked as boolean)}
                />
                <div className="flex items-center space-x-2 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    source.id === 'facebook' ? 'bg-blue-600' :
                    source.id === 'instagram' ? 'bg-pink-500' :
                    source.id === 'twitter' ? 'bg-black' :
                    source.id === 'tiktok' ? 'bg-black' :
                    source.id === 'youtube' ? 'bg-red-600' :
                    'bg-gray-400'
                  }`}>
                    {source.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={source.id} className="text-sm font-medium">
                      {source.name}
                    </Label>
                    <div className="flex items-center space-x-1">
                      {source.connected ? (
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                          CONNECT
                        </Badge>
                      ) : (
                        <span className="text-xs text-gray-400">(0)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Sentiment</Label>
          <div className="flex space-x-4">
            {[
              { value: 'negative', label: 'Negative', color: 'text-red-600' },
              { value: 'neutral', label: 'Neutral', color: 'text-yellow-600' },
              { value: 'positive', label: 'Positive', color: 'text-green-600' }
            ].map((sentiment) => (
              <div key={sentiment.value} className="flex items-center space-x-2">
                <Checkbox
                  id={sentiment.value}
                  checked={filters.sentiment === sentiment.value}
                  onCheckedChange={(checked) => updateFilter('sentiment', checked ? sentiment.value : '')}
                />
                <Label htmlFor={sentiment.value} className={`text-sm ${sentiment.color}`}>
                  {sentiment.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Score d'influence */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Score d'influence</Label>
          <div className="px-3">
            <Slider
              value={influenceScore}
              onValueChange={(value) => {
                setInfluenceScore(value);
                updateFilter('minInfluenceScore', value[0]);
              }}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
              <span>9</span>
              <span>10</span>
            </div>
          </div>
        </div>

        {/* Géolocalisation */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Géolocalisation</Label>
          <div className="space-y-3">
            <Select value={filters.geography?.country || ''} onValueChange={(value) => {
              const geography = filters.geography || {};
              updateFilter('geography', { ...geography, country: value });
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir des pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les pays</SelectItem>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <Label className="text-sm">Exclure pays</Label>
              <Select onValueChange={addExcludedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Ajouter pays à exclure" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.filter(c => !excludedCountries.includes(c.code)).map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {excludedCountries.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {excludedCountries.map((countryCode) => {
                    const country = COUNTRIES.find(c => c.code === countryCode);
                    return (
                      <Badge key={countryCode} variant="destructive" className="text-xs">
                        {country?.name}
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer" 
                          onClick={() => removeExcludedCountry(countryCode)}
                        />
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Langue */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Langue</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Langues à inclure</Label>
              <Select onValueChange={addLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir des langues" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.filter(lang => !selectedLanguages.includes(lang.code)).map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedLanguages.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedLanguages.map((langCode) => {
                    const lang = LANGUAGES.find(l => l.code === langCode);
                    return (
                      <Badge key={langCode} variant="secondary" className="text-xs">
                        {lang?.name}
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer" 
                          onClick={() => removeLanguage(langCode)}
                        />
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Exclure langues</Label>
              <Select onValueChange={addExcludedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Ajouter langue à exclure" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.filter(lang => !excludedLanguages.includes(lang.code)).map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {excludedLanguages.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {excludedLanguages.map((langCode) => {
                    const lang = LANGUAGES.find(l => l.code === langCode);
                    return (
                      <Badge key={langCode} variant="destructive" className="text-xs">
                        {lang?.name}
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer" 
                          onClick={() => removeExcludedLanguage(langCode)}
                        />
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Auteur */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Auteur</Label>
          <div className="relative">
            <Input
              placeholder="e.g. (NOT)John Doe"
              value={filters.author || ''}
              onChange={(e) => updateFilter('author', e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Importance */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Importance</Label>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="all-mentions"
                checked={!filters.importanceFilter || filters.importanceFilter === 'all'}
                onCheckedChange={(checked) => updateFilter('importanceFilter', checked ? 'all' : '')}
              />
              <Label htmlFor="all-mentions" className="text-sm">
                All Mentions
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="important-mentions"
                checked={filters.importanceFilter === 'important'}
                onCheckedChange={(checked) => updateFilter('importanceFilter', checked ? 'important' : 'all')}
              />
              <Label htmlFor="important-mentions" className="text-sm">
                Important Mentions
              </Label>
            </div>
          </div>
        </div>

        {/* Visité */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Visité</Label>
          <div className="flex space-x-4">
            {[
              { value: 'all', label: 'All Mentions' },
              { value: 'visited', label: 'Only visited' },
              { value: 'not-visited', label: 'Only not visited' }
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={filters.visitedFilter === option.value || (!filters.visitedFilter && option.value === 'all')}
                  onCheckedChange={(checked) => updateFilter('visitedFilter', checked ? option.value : 'all')}
                />
                <Label htmlFor={option.value} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Domaine */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Domaine</Label>
          <div className="relative">
            <Input
              placeholder="e.g. medium.com(OR)quora.com"
              value={filters.domain || ''}
              onChange={(e) => updateFilter('domain', e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Tags</Label>
            <Settings className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline" className="text-xs">Untagged</Badge>
            <Badge variant="outline" className="text-xs">pdf mentions</Badge>
          </div>
        </div>

        {/* Filtres sauvegardés */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Filtres sauvegardés</Label>
          <div className="text-center text-sm text-blue-600 cursor-pointer">
            Select filters and then save them here.
          </div>
        </div>

        {/* Actions finales */}
        <div className="flex space-x-3 pt-4 border-t">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={clearAllFilters}
          >
            Réinitialiser filtres
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={onApplyFilters}
          >
            <Search className="w-4 h-4 mr-2" />
            Sauvegarder filtres
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
