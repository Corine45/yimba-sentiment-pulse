
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Search, Save, Settings, MapPin, Languages } from "lucide-react";
import { SearchFilters } from "@/services/api/types";

const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

const COUNTRIES = [
  { code: 'CI', name: 'Côte d\'Ivoire' },
  { code: 'FR', name: 'France' },
  { code: 'SN', name: 'Sénégal' },
  { code: 'GH', name: 'Ghana' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'US', name: 'États-Unis' },
  { code: 'UK', name: 'Royaume-Uni' }
];

interface AdvancedFiltersPanelProps {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  excludedLanguages: string[];
  setExcludedLanguages: (langs: string[]) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  excludedCountries: string[];
  setExcludedCountries: (countries: string[]) => void;
  authorFilter: string;
  setAuthorFilter: (author: string) => void;
  domainFilter: string;
  setDomainFilter: (domain: string) => void;
  importanceLevel: 'all' | 'high' | 'medium' | 'low';
  setImportanceLevel: (level: 'all' | 'high' | 'medium' | 'low') => void;
  visitedFilter: 'all' | 'visited' | 'unvisited';
  setVisitedFilter: (filter: 'all' | 'visited' | 'unvisited') => void;
  savedFilters: SearchFilters[];
  setSavedFilters: (filters: SearchFilters[]) => void;
  getActiveFiltersCount: () => number;
  clearAllFilters: () => void;
}

export const AdvancedFiltersPanel = ({
  selectedLanguage,
  setSelectedLanguage,
  excludedLanguages,
  setExcludedLanguages,
  selectedCountry,
  setSelectedCountry,
  excludedCountries,
  setExcludedCountries,
  authorFilter,
  setAuthorFilter,
  domainFilter,
  setDomainFilter,
  importanceLevel,
  setImportanceLevel,
  visitedFilter,
  setVisitedFilter,
  savedFilters,
  setSavedFilters,
  getActiveFiltersCount,
  clearAllFilters
}: AdvancedFiltersPanelProps) => {
  const addExcludedLanguage = (lang: string) => {
    if (!excludedLanguages.includes(lang)) {
      setExcludedLanguages([...excludedLanguages, lang]);
    }
  };

  const removeExcludedLanguage = (lang: string) => {
    setExcludedLanguages(excludedLanguages.filter(l => l !== lang));
  };

  const addExcludedCountry = (country: string) => {
    if (!excludedCountries.includes(country)) {
      setExcludedCountries([...excludedCountries, country]);
    }
  };

  const removeExcludedCountry = (country: string) => {
    setExcludedCountries(excludedCountries.filter(c => c !== country));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Filtres avancés détaillés</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Géolocalisation */}
        <div className="space-y-4">
          <Label className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Géolocalisation</span>
          </Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Choisir pays</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose countries" />
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
              <Label className="text-sm">Exclure pays</Label>
              <div className="flex flex-wrap gap-1 min-h-[32px] p-2 border rounded">
                {excludedCountries.map(countryCode => {
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
                <Select onValueChange={addExcludedCountry}>
                  <SelectTrigger className="w-auto h-6 text-xs border-0 bg-transparent">
                    <SelectValue placeholder="+" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.filter(c => !excludedCountries.includes(c.code)).map(country => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Langue */}
        <div className="space-y-4">
          <Label className="flex items-center space-x-2">
            <Languages className="w-4 h-4" />
            <span>Langue</span>
          </Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Choisir langues</Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes langues</SelectItem>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Exclure langues</Label>
              <div className="flex flex-wrap gap-1 min-h-[32px] p-2 border rounded">
                {excludedLanguages.map(langCode => {
                  const lang = LANGUAGES.find(l => l.code === langCode);
                  return (
                    <Badge key={langCode} variant="destructive" className="text-xs">
                      {lang?.flag} {lang?.name}
                      <X 
                        className="w-3 h-3 ml-1 cursor-pointer" 
                        onClick={() => removeExcludedLanguage(langCode)}
                      />
                    </Badge>
                  );
                })}
                <Select onValueChange={addExcludedLanguage}>
                  <SelectTrigger className="w-auto h-6 text-xs border-0 bg-transparent">
                    <SelectValue placeholder="+" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.filter(l => !excludedLanguages.includes(l.code)).map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Auteur */}
        <div className="space-y-2">
          <Label>Auteur</Label>
          <div className="flex space-x-2">
            <Input
              placeholder="e.g. (NOT)John Doe"
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
            />
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Importance */}
        <div className="space-y-3">
          <Label>Importance</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'all' as const, label: 'All Mentions' },
              { value: 'high' as const, label: 'Important Mentions' }
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`importance-${option.value}`}
                  checked={importanceLevel === option.value}
                  onCheckedChange={() => setImportanceLevel(option.value)}
                />
                <Label htmlFor={`importance-${option.value}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Visité */}
        <div className="space-y-3">
          <Label>Visited</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'all' as const, label: 'All Mentions' },
              { value: 'visited' as const, label: 'Only visited' },
              { value: 'unvisited' as const, label: 'Only not visited' }
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`visited-${option.value}`}
                  checked={visitedFilter === option.value}
                  onCheckedChange={() => setVisitedFilter(option.value)}
                />
                <Label htmlFor={`visited-${option.value}`} className="cursor-pointer text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Domaine */}
        <div className="space-y-2">
          <Label>Domaine</Label>
          <div className="flex space-x-2">
            <Input
              placeholder="e.g. medium.com (OR) quora.com"
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
            />
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Actions des filtres */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            {getActiveFiltersCount()} filtre(s) actif(s)
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={clearAllFilters}>
              Effacer tout
            </Button>
            <Button onClick={() => {
              // Sauvegarder les filtres actuels
              const currentFilters: SearchFilters = {
                language: selectedLanguage,
                excludedLanguages,
                country: selectedCountry,
                excludedCountries,
                author: authorFilter,
                domain: domainFilter,
                importance: importanceLevel,
                visited: visitedFilter
              };
              setSavedFilters([...savedFilters, currentFilters]);
            }}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder filtres
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
