
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Filter, X, Settings } from "lucide-react";
import { SearchFilters } from "@/services/api/types";

interface OptionalAdvancedFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
  getActiveFiltersCount: () => number;
}

export const OptionalAdvancedFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  getActiveFiltersCount 
}: OptionalAdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [useFilters, setUseFilters] = useState(false);

  const activeFiltersCount = getActiveFiltersCount();

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    if (!useFilters) return;
    
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const toggleFilters = (enabled: boolean) => {
    setUseFilters(enabled);
    if (enabled) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
      onClearFilters();
    }
  };

  const removeFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  return (
    <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <span>Filtres Avancés</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {activeFiltersCount} actifs
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="use-filters"
                checked={useFilters}
                onCheckedChange={toggleFilters}
                className="data-[state=checked]:bg-blue-600"
              />
              <Label htmlFor="use-filters" className="text-sm font-medium cursor-pointer">
                {useFilters ? "✅ Activés" : "Activer"}
              </Label>
            </div>
            
            {useFilters && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="hover:bg-blue-50"
              >
                <Settings className="w-4 h-4 mr-1" />
                {isOpen ? 'Masquer' : 'Configurer'}
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            )}
          </div>
        </div>

        {!useFilters ? (
          <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
            <div className="flex items-center space-x-2">
              <span className="text-lg">💡</span>
              <div>
                <strong>Filtres désactivés</strong>
                <p className="text-xs text-amber-600 mt-1">
                  Toutes les données de vos 30+ APIs Yimba Pulse seront affichées sans filtrage
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <span className="text-lg">✅</span>
              <div>
                <strong>Filtres activés</strong>
                <p className="text-xs text-green-600 mt-1">
                  Les données seront filtrées selon vos critères après récupération via vos APIs
                </p>
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      {useFilters && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="animate-in slide-in-from-top-2 duration-200">
            <CardContent className="space-y-6 pt-0 bg-white">
              {activeFiltersCount > 0 && (
                <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-blue-900 flex items-center space-x-1">
                      <Filter className="w-4 h-4" />
                      <span>Filtres actifs ({activeFiltersCount})</span>
                    </h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={onClearFilters}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Tout effacer
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(filters).map(([key, value]) => {
                      if (!value) return null;
                      return (
                        <Badge key={key} variant="outline" className="flex items-center space-x-1 bg-white">
                          <span>{key}: {Array.isArray(value) ? value.join(', ') : String(value)}</span>
                          <button 
                            onClick={() => removeFilter(key as keyof SearchFilters)} 
                            className="hover:bg-red-100 rounded-full p-0.5 ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-6 bg-white p-4 rounded-lg">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    🎯 Filtres de base
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Langue</Label>
                      <Select 
                        value={filters.language || ''}
                        onValueChange={(value) => handleFilterChange('language', value || undefined)}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Toutes les langues" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les langues</SelectItem>
                          <SelectItem value="fr">🇫🇷 Français</SelectItem>
                          <SelectItem value="en">🇺🇸 Anglais</SelectItem>
                          <SelectItem value="es">🇪🇸 Espagnol</SelectItem>
                          <SelectItem value="ar">🇸🇦 Arabe</SelectItem>
                          <SelectItem value="pt">🇵🇹 Portugais</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Période</Label>
                      <Select 
                        value={filters.period || ''}
                        onValueChange={(value) => handleFilterChange('period', value || undefined)}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Toute période" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toute période</SelectItem>
                          <SelectItem value="1d">📅 24 heures</SelectItem>
                          <SelectItem value="7d">📅 7 jours</SelectItem>
                          <SelectItem value="30d">📅 30 jours</SelectItem>
                          <SelectItem value="3m">📅 3 mois</SelectItem>
                          <SelectItem value="6m">📅 6 mois</SelectItem>
                          <SelectItem value="12m">📅 12 mois</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    😊 Sentiment et qualité
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Sentiment</Label>
                      <Select 
                        value={Array.isArray(filters.sentiment) ? filters.sentiment[0] : filters.sentiment || ''}
                        onValueChange={(value) => handleFilterChange('sentiment', value || undefined)}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Tous les sentiments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="positive">😊 Positif</SelectItem>
                          <SelectItem value="neutral">😐 Neutre</SelectItem>
                          <SelectItem value="negative">😞 Négatif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Trier par</Label>
                      <Select 
                        value={filters.sortBy || ''}
                        onValueChange={(value) => handleFilterChange('sortBy', value || undefined)}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Ordre par défaut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Par défaut</SelectItem>
                          <SelectItem value="recent">🕐 Plus récent</SelectItem>
                          <SelectItem value="engagement">❤️ Plus populaire</SelectItem>
                          <SelectItem value="influence">⭐ Plus influent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">⭐ Score d'influence minimum</Label>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">
                      <Slider
                        value={[filters.minInfluenceScore || 0]}
                        onValueChange={(value) => handleFilterChange('minInfluenceScore', value[0])}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>0</span>
                        <span className="font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          Score: {filters.minInfluenceScore || 0}
                        </span>
                        <span>10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg text-sm border border-blue-200">
                <h5 className="font-semibold mb-2 text-blue-900 flex items-center space-x-1">
                  <Filter className="w-4 h-4" />
                  <span>Comment fonctionnent vos filtres Yimba Pulse :</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-blue-700">
                  <div className="space-y-1">
                    <p>• <strong>Désactivés :</strong> Toutes les données brutes de vos 30+ APIs</p>
                    <p>• <strong>Activés :</strong> Filtrage post-récupération selon vos critères</p>
                  </div>
                  <div className="space-y-1">
                    <p>• Les filtres n'affectent pas les requêtes API</p>
                    <p>• Activation/désactivation en temps réel possible</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      )}
    </Card>
  );
};
