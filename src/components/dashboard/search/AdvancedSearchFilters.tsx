
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, Save, Filter, MapPin } from "lucide-react";
import { SearchFilters } from "@/services/realApiService";

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
  { code: 'BF', name: 'Burkina Faso', regions: ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou'] }
];

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

  const updateGeographyFilter = (key: string, value: any) => {
    const geography = filters.geography || {};
    onFiltersChange({ 
      ...filters, 
      geography: { ...geography, [key]: value }
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
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
                  <SelectItem value="pt">Portugais</SelectItem>
                  <SelectItem value="de">Allemand</SelectItem>
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
                  <SelectItem value="6m">6 derniers mois</SelectItem>
                  <SelectItem value="12m">12 derniers mois</SelectItem>
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

          {/* Filtres géographiques */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <Label className="text-base font-medium">Localisation géographique</Label>
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

            {/* Coordonnées géographiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input
                  type="number"
                  step="0.000001"
                  placeholder="5.316667"
                  value={filters.geography?.latitude || ''}
                  onChange={(e) => updateGeographyFilter('latitude', parseFloat(e.target.value) || undefined)}
                />
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input
                  type="number"
                  step="0.000001"
                  placeholder="-4.033333"
                  value={filters.geography?.longitude || ''}
                  onChange={(e) => updateGeographyFilter('longitude', parseFloat(e.target.value) || undefined)}
                />
              </div>
              <div className="space-y-2">
                <Label>Rayon (km)</Label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={filters.geography?.radius || ''}
                  onChange={(e) => updateGeographyFilter('radius', parseInt(e.target.value) || undefined)}
                />
              </div>
            </div>
          </div>

          {/* Filtres sentiment */}
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
                <span className="font-medium">{filters.minEngagement || 0}</span>
                <span>10K+</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Engagement maximum</Label>
            <div className="px-3">
              <Slider
                value={[filters.maxEngagement || 10000]}
                onValueChange={([value]) => updateFilter('maxEngagement', value)}
                max={10000}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>0</span>
                <span className="font-medium">{filters.maxEngagement || 10000}</span>
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
