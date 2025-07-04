
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, Save, Filter } from "lucide-react";
import { SearchFilters } from "@/services/realApiService";

interface AdvancedSearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSaveFilters: () => void;
  savedFilters: SearchFilters[];
  onLoadFilters: (filters: SearchFilters) => void;
}

export const AdvancedSearchFilters = ({
  filters,
  onFiltersChange,
  onSaveFilters,
  savedFilters,
  onLoadFilters
}: AdvancedSearchFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

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
          {/* Filtres principaux */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Langue</Label>
              <Select value={filters.language || ''} onValueChange={(value) => updateFilter('language', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes langues" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes langues</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">Anglais</SelectItem>
                  <SelectItem value="es">Espagnol</SelectItem>
                  <SelectItem value="ar">Arabe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Période</Label>
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
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Trier par</Label>
              <Select value={filters.sortBy || ''} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pertinence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Pertinence</SelectItem>
                  <SelectItem value="recent">Plus récent</SelectItem>
                  <SelectItem value="popular">Plus populaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtres sentiment */}
          <div className="space-y-3">
            <Label>Sentiment</Label>
            <div className="flex space-x-4">
              {[
                { value: '', label: 'Tous' },
                { value: 'positive', label: 'Positif' },
                { value: 'neutral', label: 'neutre' },
                { value: 'negative', label: 'Négatif' }
              ].map((sentiment) => (
                <div key={sentiment.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sentiment-${sentiment.value}`}
                    checked={filters.sentiment === sentiment.value}
                    onCheckedChange={(checked) => 
                      updateFilter('sentiment', checked ? sentiment.value : '')
                    }
                  />
                  <Label htmlFor={`sentiment-${sentiment.value}`}>
                    {sentiment.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Filtres engagement */}
          <div className="space-y-4">
            <Label>Engagement minimum</Label>
            <div className="px-3">
              <Slider
                value={[filters.minEngagement || 0]}
                onValueChange={([value]) => updateFilter('minEngagement', value)}
                max={10000}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>0</span>
                <span>{filters.minEngagement || 0}</span>
                <span>10K+</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Effacer
              </Button>
              <Button variant="outline" size="sm" onClick={onSaveFilters}>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
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
