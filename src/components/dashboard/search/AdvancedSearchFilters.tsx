import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, Save, Filter, MapPin, Languages, Calendar } from "lucide-react";
import { SearchFilters } from "@/services/api/types";

interface AdvancedSearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSaveFilters: () => void;
  savedFilters: SearchFilters[];
  onLoadFilters: (filters: SearchFilters) => void;
}

const COUNTRIES = [
  { code: 'CI', name: 'Côte d\'Ivoire', regions: ['Abidjan', 'Yamoussoukro', 'Bouaké', 'Daloa', 'San-Pedro'] },
  { code: 'FR', name: 'France', regions: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'] },
  { code: 'SN', name: 'Sénégal', regions: ['Dakar', 'Thiès', 'Kaolack', 'Saint-Louis'] },
  { code: 'GH', name: 'Ghana', regions: ['Accra', 'Kumasi', 'Tamale', 'Cape Coast'] },
  { code: 'BF', name: 'Burkina Faso', regions: ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou'] },
  { code: 'US', name: 'États-Unis', regions: ['New York', 'Los Angeles', 'Chicago', 'Miami'] },
  { code: 'UK', name: 'Royaume-Uni', regions: ['Londres', 'Manchester', 'Birmingham', 'Liverpool'] }
];

const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'Anglais', flag: '🇺🇸' },
  { code: 'es', name: 'Espagnol', flag: '🇪🇸' },
  { code: 'ar', name: 'Arabe', flag: '🇸🇦' },
  { code: 'pt', name: 'Portugais', flag: '🇵🇹' },
  { code: 'de', name: 'Allemand', flag: '🇩🇪' },
  { code: 'it', name: 'Italien', flag: '🇮🇹' },
  { code: 'ru', name: 'Russe', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinois', flag: '🇨🇳' },
  { code: 'ja', name: 'Japonais', flag: '🇯🇵' }
];

const CONTENT_SOURCES = [
  { id: 'facebook', label: 'Facebook', icon: '📘' },
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'twitter', label: 'X (Twitter)', icon: '🐦' },
  { id: 'youtube', label: 'YouTube', icon: '📺' },
  { id: 'videos', label: 'Vidéos', icon: '🎬' },
  { id: 'podcasts', label: 'Podcasts', icon: '🎙️' },
  { id: 'blogs', label: 'Blogs', icon: '📝' },
  { id: 'news', label: 'News', icon: '📰' },
  { id: 'web', label: 'Web', icon: '🌐' },
  { id: 'other_socials', label: 'Autres Réseaux', icon: '💬' }
];

export const AdvancedSearchFilters = ({
  filters,
  onFiltersChange,
  onSaveFilters,
  savedFilters,
  onLoadFilters
}: AdvancedSearchFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(
    filters.platforms || ['facebook', 'instagram', 'twitter']
  );
  const [excludedLanguages, setExcludedLanguages] = useState<string[]>([]);
  const [excludedCountries, setExcludedCountries] = useState<string[]>([]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const updateGeographyFilter = (key: string, value: any) => {
    const geography = filters.geography || {};
    onFiltersChange({ 
      ...filters, 
      geography: { ...geography, [key]: value }
    });
  };

  const handleSourceToggle = (sourceId: string, checked: boolean) => {
    const newSources = checked 
      ? [...selectedSources, sourceId]
      : selectedSources.filter(s => s !== sourceId);
    
    setSelectedSources(newSources);
    onFiltersChange({ ...filters, platforms: newSources });
  };

  const clearFilters = () => {
    onFiltersChange({});
    setSelectedSources(['facebook', 'instagram', 'twitter']);
    setExcludedLanguages([]);
    setExcludedCountries([]);
  };

  const activeFiltersCount = Object.values(filters).filter(v => {
    if (typeof v === 'object' && v !== null) {
      return Object.values(v).some(val => val !== undefined && val !== '');
    }
    return v !== undefined && v !== '';
  }).length;

  const selectedCountry = COUNTRIES.find(c => c.code === filters.geography?.country);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtres avancés</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Réduire' : 'Développer'}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Sources et Plateformes */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label className="text-base font-medium">Sources</Label>
              <Badge variant="outline">{selectedSources.length} sélectionnées</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {CONTENT_SOURCES.map((source) => (
                <div key={source.id} className="flex items-center space-x-2 p-2 border rounded">
                  <Checkbox
                    id={source.id}
                    checked={selectedSources.includes(source.id)}
                    onCheckedChange={(checked) => handleSourceToggle(source.id, checked as boolean)}
                  />
                  <Label htmlFor={source.id} className="text-sm flex items-center space-x-1">
                    <span>{source.icon}</span>
                    <span>{source.label}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Langues */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Languages className="w-4 h-4" />
              <Label className="text-base font-medium">Langue</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Langue principale</Label>
                <Select value={filters.language || ''} onValueChange={(value) => updateFilter('language', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes langues" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes langues</SelectItem>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center space-x-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Exclure langues</Label>
                <Select onValueChange={(value) => {
                  if (!excludedLanguages.includes(value)) {
                    setExcludedLanguages([...excludedLanguages, value]);
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ajouter langue à exclure" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.filter(lang => !excludedLanguages.includes(lang.code)).map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center space-x-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {excludedLanguages.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {excludedLanguages.map(langCode => {
                      const lang = LANGUAGES.find(l => l.code === langCode);
                      return (
                        <Badge key={langCode} variant="destructive" className="text-xs">
                          {lang?.flag} {lang?.name}
                          <X 
                            className="w-3 h-3 ml-1 cursor-pointer" 
                            onClick={() => setExcludedLanguages(excludedLanguages.filter(l => l !== langCode))}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Période et Dates */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <Label className="text-base font-medium">Période</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Période prédéfinie</Label>
                <Select value={filters.period || ''} onValueChange={(value) => updateFilter('period', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes périodes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes périodes</SelectItem>
                    <SelectItem value="1d">Dernières 24h</SelectItem>
                    <SelectItem value="7d">7 derniers jours</SelectItem>
                    <SelectItem value="30d">30 derniers jours</SelectItem>
                    <SelectItem value="3m">3 derniers mois</SelectItem>
                    <SelectItem value="6m">6 derniers mois</SelectItem>
                    <SelectItem value="12m">12 derniers mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Input
                  type="date"
                  value={filters.customStartDate || ''}
                  onChange={(e) => updateFilter('customStartDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Input
                  type="date"
                  value={filters.customEndDate || ''}
                  onChange={(e) => updateFilter('customEndDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Géolocalisation */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <Label className="text-base font-medium">Géolocalisation</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pays</Label>
                <Select 
                  value={filters.geography?.country || ''} 
                  onValueChange={(value) => updateGeographyFilter('country', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les pays</SelectItem>
                    {COUNTRIES.map(country => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Région/Ville</Label>
                <Select 
                  value={filters.geography?.region || ''} 
                  onValueChange={(value) => updateGeographyFilter('region', value)}
                  disabled={!selectedCountry}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une région" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les régions</SelectItem>
                    {selectedCountry?.regions.map(region => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Exclure pays</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {excludedCountries.map(countryCode => {
                  const country = COUNTRIES.find(c => c.code === countryCode);
                  return (
                    <Badge key={countryCode} variant="destructive" className="text-xs">
                      {country?.name}
                      <X 
                        className="w-3 h-3 ml-1 cursor-pointer" 
                        onClick={() => setExcludedCountries(excludedCountries.filter(c => c !== countryCode))}
                      />
                    </Badge>
                  );
                })}
                <Select onValueChange={(value) => {
                  if (!excludedCountries.includes(value)) {
                    setExcludedCountries([...excludedCountries, value]);
                  }
                }}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Ajouter pays à exclure" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.filter(country => !excludedCountries.includes(country.code)).map(country => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Sentiment */}
          <div className="space-y-3">
            <Label>Sentiment</Label>
            <div className="flex space-x-4">
              {[
                { value: '', label: 'Tous', color: 'bg-gray-100' },
                { value: 'positive', label: 'Positif', color: 'bg-green-100 text-green-800' },
                { value: 'neutral', label: 'Neutre', color: 'bg-yellow-100 text-yellow-800' },
                { value: 'negative', label: 'Négatif', color: 'bg-red-100 text-red-800' }
              ].map((sentiment) => (
                <div key={sentiment.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sentiment-${sentiment.value}`}
                    checked={filters.sentiment === sentiment.value}
                    onCheckedChange={(checked) => 
                      updateFilter('sentiment', checked ? sentiment.value : '')
                    }
                  />
                  <Label 
                    htmlFor={`sentiment-${sentiment.value}`}
                    className={`px-2 py-1 rounded text-xs ${sentiment.color}`}
                  >
                    {sentiment.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement et Importance */}
          <div className="space-y-4">
            <Label>Score d'influence</Label>
            <div className="px-3">
              <Slider
                value={[filters.minEngagement || 0]}
                onValueChange={([value]) => updateFilter('minEngagement', value)}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>0</span>
                <span className="font-medium">{filters.minEngagement || 0}</span>
                <span>10</span>
              </div>
            </div>
          </div>

          {/* Type de contenu et filtres avancés */}
          <div className="space-y-4">
            <Label>Filtres de contenu</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { id: "all_mentions", label: "Toutes mentions" },
                { id: "important_mentions", label: "Mentions importantes" },
                { id: "visited", label: "Pages visitées" },
                { id: "not_visited", label: "Pages non visitées" },
                { id: "popular_posts", label: "Posts populaires" },
                { id: "recent_posts", label: "Posts récents" }
              ].map((filter) => (
                <div key={filter.id} className="flex items-center space-x-2">
                  <Checkbox id={filter.id} />
                  <Label htmlFor={filter.id} className="text-sm">
                    {filter.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Auteur et domaine */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Auteur</Label>
              <Input 
                placeholder="ex: @JohnDoe" 
                value={filters.author || ''}
                onChange={(e) => updateFilter('author', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Domaine</Label>
              <Input 
                placeholder="ex: medium.com" 
                value={filters.domain || ''}
                onChange={(e) => updateFilter('domain', e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Effacer tout
              </Button>
              <Button variant="outline" size="sm" onClick={onSaveFilters}>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder filtres
              </Button>
            </div>
            
            {savedFilters.length > 0 && (
              <Select onValueChange={(value) => onLoadFilters(savedFilters[parseInt(value)])}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtres sauvegardés" />
                </SelectTrigger>
                <SelectContent>
                  {savedFilters.map((filter, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      Filtre {index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
