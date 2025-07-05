
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
import { ChevronDown, Filter, X } from "lucide-react";
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
    setIsOpen(enabled); // Ouvrir automatiquement les filtres quand activés
    if (!enabled) {
      onClearFilters();
    }
  };

  const removeFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtres Avancés (Optionnels)</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} actifs</Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="use-filters"
                checked={useFilters}
                onCheckedChange={toggleFilters}
              />
              <Label htmlFor="use-filters" className="text-sm font-medium">
                {useFilters ? "Filtres activés" : "Activer les filtres"}
              </Label>
            </div>
            
            {useFilters && (
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            )}
          </div>
        </div>

        {!useFilters && (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
            ℹ️ <strong>Filtres désactivés</strong> - Toutes les données de vos 30+ APIs seront affichées sans filtrage
          </div>
        )}

        {useFilters && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
            ✅ <strong>Filtres activés</strong> - Les données seront filtrées selon vos critères après récupération via vos APIs
          </div>
        )}
      </CardHeader>

      {/* Interface des filtres - visible uniquement si activés */}
      {useFilters && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Filtres actifs */}
              {activeFiltersCount > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Filtres actifs ({activeFiltersCount})</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={onClearFilters}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Tout effacer
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {filters.sentiment && (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <span>Sentiment: {Array.isArray(filters.sentiment) ? filters.sentiment.join(', ') : filters.sentiment}</span>
                        <button onClick={() => removeFilter('sentiment')} className="hover:bg-red-100 rounded">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {filters.language && (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <span>Langue: {filters.language}</span>
                        <button onClick={() => removeFilter('language')} className="hover:bg-red-100 rounded">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {filters.period && (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <span>Période: {filters.period}</span>
                        <button onClick={() => removeFilter('period')} className="hover:bg-red-100 rounded">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {filters.minInfluenceScore && (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <span>Influence min: {filters.minInfluenceScore}</span>
                        <button onClick={() => removeFilter('minInfluenceScore')} className="hover:bg-red-100 rounded">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {filters.author && (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <span>Auteur: {filters.author}</span>
                        <button onClick={() => removeFilter('author')} className="hover:bg-red-100 rounded">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {filters.country && (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <span>Pays: {filters.country}</span>
                        <button onClick={() => removeFilter('country')} className="hover:bg-red-100 rounded">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {filters.domain && (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <span>Domaine: {filters.domain}</span>
                        <button onClick={() => removeFilter('domain')} className="hover:bg-red-100 rounded">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {filters.importance && (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <span>Importance: {filters.importance}</span>
                        <button onClick={() => removeFilter('importance')} className="hover:bg-red-100 rounded">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Configuration des filtres */}
              <div className="space-y-6">
                
                {/* Ligne 1: Langue et Période */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Langue</Label>
                    <Select 
                      value={filters.language || ''}
                      onValueChange={(value) => handleFilterChange('language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les langues" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Toutes les langues</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">Anglais</SelectItem>
                        <SelectItem value="es">Espagnol</SelectItem>
                        <SelectItem value="ar">Arabe</SelectItem>
                        <SelectItem value="pt">Portugais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Période</Label>
                    <Select 
                      value={filters.period || ''}
                      onValueChange={(value) => handleFilterChange('period', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Toute période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Toute période</SelectItem>
                        <SelectItem value="1d">24 heures</SelectItem>
                        <SelectItem value="7d">7 jours</SelectItem>
                        <SelectItem value="30d">30 jours</SelectItem>
                        <SelectItem value="3m">3 mois</SelectItem>
                        <SelectItem value="6m">6 mois</SelectItem>
                        <SelectItem value="12m">12 mois</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Ligne 2: Sentiment et Tri */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Sentiment</Label>
                    <Select 
                      value={Array.isArray(filters.sentiment) ? filters.sentiment[0] : filters.sentiment || ''}
                      onValueChange={(value) => handleFilterChange('sentiment', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les sentiments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tous</SelectItem>
                        <SelectItem value="positive">Positif</SelectItem>
                        <SelectItem value="neutral">Neutre</SelectItem>
                        <SelectItem value="negative">Négatif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Trier par</Label>
                    <Select 
                      value={filters.sortBy || ''}
                      onValueChange={(value) => handleFilterChange('sortBy', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Ordre par défaut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Par défaut</SelectItem>
                        <SelectItem value="recent">Plus récent</SelectItem>
                        <SelectItem value="engagement">Plus populaire</SelectItem>
                        <SelectItem value="influence">Plus influent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Score d'influence */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Score d'influence minimum</Label>
                  <div className="px-3">
                    <Slider
                      value={[filters.minInfluenceScore || 0]}
                      onValueChange={(value) => handleFilterChange('minInfluenceScore', value[0])}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span className="font-medium">Score: {filters.minInfluenceScore || 0}</span>
                      <span>10</span>
                    </div>
                  </div>
                </div>

                {/* Ligne 3: Engagement et Auteur */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Engagement minimum</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.minEngagement || ''}
                      onChange={(e) => handleFilterChange('minEngagement', parseInt(e.target.value) || undefined)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Auteur (contient)</Label>
                    <Input
                      placeholder="Nom d'auteur..."
                      value={filters.author || ''}
                      onChange={(e) => handleFilterChange('author', e.target.value)}
                    />
                  </div>
                </div>

                {/* Ligne 4: Pays et Domaine */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Pays</Label>
                    <Select 
                      value={filters.country || ''}
                      onValueChange={(value) => handleFilterChange('country', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les pays" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tous les pays</SelectItem>
                        <SelectItem value="CI">Côte d'Ivoire</SelectItem>
                        <SelectItem value="FR">France</SelectItem>
                        <SelectItem value="US">États-Unis</SelectItem>
                        <SelectItem value="SN">Sénégal</SelectItem>
                        <SelectItem value="ML">Mali</SelectItem>
                        <SelectItem value="BF">Burkina Faso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Domaine (contient)</Label>
                    <Input
                      placeholder="exemple.com"
                      value={filters.domain || ''}
                      onChange={(e) => handleFilterChange('domain', e.target.value)}
                    />
                  </div>
                </div>

                {/* Ligne 5: Dates personnalisées */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Date de début</Label>
                    <Input
                      type="date"
                      value={filters.dateFrom || ''}
                      onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Date de fin</Label>
                    <Input
                      type="date"
                      value={filters.dateTo || ''}
                      onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    />
                  </div>
                </div>

                {/* Ligne 6: Importance et Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Importance</Label>
                    <Select 
                      value={filters.importance || ''}
                      onValueChange={(value) => handleFilterChange('importance', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Toute importance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Toute importance</SelectItem>
                        <SelectItem value="high">Haute</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="low">Faible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Status de visite</Label>
                    <Select 
                      value={filters.visited || ''}
                      onValueChange={(value) => handleFilterChange('visited', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tous" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tous</SelectItem>
                        <SelectItem value="visited">Visités</SelectItem>
                        <SelectItem value="unvisited">Non visités</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

              </div>

              {/* Note explicative */}
              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 border border-blue-200">
                <h5 className="font-medium mb-2">📌 Comment fonctionnent les filtres :</h5>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>Désactivés :</strong> Toutes les données de vos 30+ APIs sont affichées</li>
                  <li>• <strong>Activés :</strong> Les données sont filtrées après récupération via vos APIs</li>
                  <li>• Les filtres n'affectent pas les requêtes API, seulement l'affichage des résultats</li>
                  <li>• Vous pouvez activer/désactiver les filtres à tout moment</li>
                </ul>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      )}
    </Card>
  );
};
