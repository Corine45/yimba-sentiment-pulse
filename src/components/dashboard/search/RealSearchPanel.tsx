import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { X, Plus, Search, Save, Trash2, Database, Download, TrendingUp, Heart, MessageCircle, Share, Eye, Filter, MapPin, Languages, Calendar, Settings } from "lucide-react";
import { Brand24StyleResults } from "./Brand24StyleResults";
import { SearchPagination } from "./SearchPagination";
import { SavedMentionsHistory } from "./SavedMentionsHistory";
import { WordCloud } from "../widgets/WordCloud";
import { useRealSearch } from "@/hooks/useRealSearch";
import { SearchFilters } from "@/services/realApiService";

const AVAILABLE_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', description: 'Posts, Pages & URLs' },
  { id: 'instagram', name: 'Instagram', description: 'Posts, Reels & Hashtags' },
  { id: 'twitter', name: 'X (Twitter)', description: 'Tweets & Réponses' },
  { id: 'tiktok', name: 'TikTok', description: 'Hashtags & Géolocalisation' },
  { id: 'youtube', name: 'YouTube', description: 'Vidéos & Commentaires' },
  { id: 'videos', name: 'Videos', description: 'Contenu vidéo' },
  { id: 'podcasts', name: 'Podcasts', description: 'Audio & Podcasts' },
  { id: 'blogs', name: 'Blogs', description: 'Articles de blog' },
  { id: 'news', name: 'News', description: 'Articles de presse' },
  { id: 'web', name: 'Web', description: 'Sites web généraux' },
  { id: 'other_socials', name: 'Other Socials', description: 'Autres réseaux' }
];

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

export const RealSearchPanel = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [savedFilters, setSavedFilters] = useState<SearchFilters[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [activeTab, setActiveTab] = useState('search');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Nouveaux états pour les filtres détaillés
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [excludedLanguages, setExcludedLanguages] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [excludedCountries, setExcludedCountries] = useState<string[]>([]);
  const [authorFilter, setAuthorFilter] = useState<string>('');
  const [domainFilter, setDomainFilter] = useState<string>('');
  const [importanceLevel, setImportanceLevel] = useState<string>('all');
  const [visitedFilter, setVisitedFilter] = useState<string>('all');
  const [influenceScore, setInfluenceScore] = useState<number[]>([0]);
  const [sentimentFilter, setSentimentFilter] = useState<string[]>([]);
  
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
    const advancedFilters: SearchFilters = {
      ...filters,
      language: selectedLanguage,
      excludedLanguages,
      country: selectedCountry,
      excludedCountries,
      author: authorFilter,
      domain: domainFilter,
      importance: importanceLevel,
      visited: visitedFilter,
      influenceScore: influenceScore[0],
      sentiment: sentimentFilter.length > 0 ? sentimentFilter : undefined
    };
    executeSearch(keywords, selectedPlatforms, advancedFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addKeyword();
    }
  };

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

  const handleSentimentToggle = (sentiment: string) => {
    setSentimentFilter(prev =>
      prev.includes(sentiment)
        ? prev.filter(s => s !== sentiment)
        : [sentiment] // Only one sentiment at a time
    );
  };

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

  const handleSaveMentions = async (format: 'json' | 'pdf' | 'csv' = 'json') => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const mentionsToSave = mentions.slice(startIndex, endIndex);
    
    const filtersToSave: SearchFilters = {
      ...filters,
      language: selectedLanguage,
      excludedLanguages,
      country: selectedCountry,
      excludedCountries,
      author: authorFilter,
      domain: domainFilter,
      importance: importanceLevel,
      visited: visitedFilter,
      influenceScore: influenceScore[0],
      sentiment: sentimentFilter
    };
    
    await saveMentions(mentionsToSave, keywords, selectedPlatforms, filtersToSave, format);
  };

  const clearAllFilters = () => {
    setSelectedLanguage('');
    setExcludedLanguages([]);
    setSelectedCountry('');
    setExcludedCountries([]);
    setAuthorFilter('');
    setDomainFilter('');
    setImportanceLevel('all');
    setVisitedFilter('all');
    setInfluenceScore([0]);
    setSentimentFilter([]);
    setFilters({});
  };

  const totalPages = Math.ceil(mentions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMentions = mentions.slice(startIndex, endIndex);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedLanguage) count++;
    if (excludedLanguages.length > 0) count++;
    if (selectedCountry) count++;
    if (excludedCountries.length > 0) count++;
    if (authorFilter) count++;
    if (domainFilter) count++;
    if (importanceLevel !== 'all') count++;
    if (visitedFilter !== 'all') count++;
    if (influenceScore[0] > 0) count++;
    if (sentimentFilter.length > 0) count++;
    return count;
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

              {/* Sources/Plateformes */}
              <div className="space-y-3">
                <Label className="flex items-center space-x-2">
                  <span>Sources</span>
                  <Badge variant="outline">{selectedPlatforms.length} connectées</Badge>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {AVAILABLE_PLATFORMS.map((platform) => (
                    <div key={platform.id} className="flex items-start space-x-2 p-2 border rounded hover:bg-gray-50">
                      <Checkbox
                        id={platform.id}
                        checked={selectedPlatforms.includes(platform.id)}
                        onCheckedChange={() => togglePlatform(platform.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={platform.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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

              {/* Sentiment */}
              <div className="space-y-3">
                <Label>Sentiment</Label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: 'negative', label: 'Negative', color: 'bg-red-100 text-red-800 border-red-200' },
                    { value: 'neutral', label: 'Neutral', color: 'bg-gray-100 text-gray-800 border-gray-200' },
                    { value: 'positive', label: 'Positive', color: 'bg-green-100 text-green-800 border-green-200' }
                  ].map((sentiment) => (
                    <div key={sentiment.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`sentiment-${sentiment.value}`}
                        checked={sentimentFilter.includes(sentiment.value)}
                        onCheckedChange={() => handleSentimentToggle(sentiment.value)}
                      />
                      <Label 
                        htmlFor={`sentiment-${sentiment.value}`}
                        className={`px-3 py-1 rounded text-sm cursor-pointer ${sentiment.color}`}
                      >
                        {sentiment.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Score d'influence */}
              <div className="space-y-3">
                <Label className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Influence score</span>
                </Label>
                <div className="px-3">
                  <Slider
                    value={influenceScore}
                    onValueChange={setInfluenceScore}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0</span>
                    <span className="font-medium">{influenceScore[0]}</span>
                    <span>10</span>
                  </div>
                </div>
              </div>

              {/* Bouton pour afficher/masquer les filtres avancés */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtres avancés</span>
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
                    {isLoading ? "Recherche en cours..." : "Lancer la recherche"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filtres avancés détaillés */}
          {showAdvancedFilters && (
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
                      { value: 'all', label: 'All Mentions' },
                      { value: 'important', label: 'Important Mentions' }
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
                      { value: 'all', label: 'All Mentions' },
                      { value: 'visited', label: 'Only visited' },
                      { value: 'not-visited', label: 'Only not visited' }
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
                      const currentFilters = {
                        language: selectedLanguage,
                        excludedLanguages,
                        country: selectedCountry,
                        excludedCountries,
                        author: authorFilter,
                        domain: domainFilter,
                        importance: importanceLevel,
                        visited: visitedFilter,
                        influenceScore: influenceScore[0],
                        sentiment: sentimentFilter
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
          )}

          {totalMentions > 0 && <WordCloud mentions={mentions} />}

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
