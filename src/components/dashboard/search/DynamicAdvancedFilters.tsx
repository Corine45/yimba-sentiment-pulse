
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Filter } from "lucide-react";
import { DynamicPlatformSelector } from "./DynamicPlatformSelector";

interface AdvancedFilters {
  language: string;
  period: string;
  customStartDate?: string;
  customEndDate?: string;
  platforms: string[];
  contentType: string;
  minEngagement?: number;
  maxEngagement?: number;
  includeInfluencers: boolean;
  includeVerified: boolean;
  sentiment?: string;
  geographic?: string[];
}

interface DynamicAdvancedFiltersProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  userRole: string;
}

export const DynamicAdvancedFilters = ({ filters, onFiltersChange, userRole }: DynamicAdvancedFiltersProps) => {
  const updateFilter = (key: keyof AdvancedFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const canUseAdvancedFilters = userRole === 'admin' || userRole === 'analyste';

  if (!canUseAdvancedFilters) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-amber-600">
            <Filter className="w-5 h-5 mr-2" />
            Filtres avancés (Accès limité)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Les filtres avancés sont réservés aux analystes et administrateurs.
            Votre rôle actuel ({userRole}) vous permet uniquement d'utiliser les filtres de base.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filtres avancés
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plateformes dynamiques */}
        <DynamicPlatformSelector 
          selectedPlatforms={filters.platforms}
          onPlatformChange={(platforms) => updateFilter('platforms', platforms)}
        />

        {/* Filtres temporels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Période</Label>
            <Select value={filters.period} onValueChange={(value) => updateFilter('period', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 heure</SelectItem>
                <SelectItem value="6h">6 heures</SelectItem>
                <SelectItem value="24h">24 heures</SelectItem>
                <SelectItem value="7d">7 jours</SelectItem>
                <SelectItem value="30d">30 jours</SelectItem>
                <SelectItem value="90d">3 mois</SelectItem>
                <SelectItem value="custom">Période personnalisée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Langue</Label>
            <Select value={filters.language} onValueChange={(value) => updateFilter('language', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">Anglais</SelectItem>
                <SelectItem value="es">Espagnol</SelectItem>
                <SelectItem value="de">Allemand</SelectItem>
                <SelectItem value="all">Toutes langues</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Période personnalisée */}
        {filters.period === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.customStartDate || ''}
                onChange={(e) => updateFilter('customStartDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.customEndDate || ''}
                onChange={(e) => updateFilter('customEndDate', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Filtres de contenu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Type de contenu</Label>
            <Select value={filters.contentType} onValueChange={(value) => updateFilter('contentType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous contenus</SelectItem>
                <SelectItem value="text">Texte uniquement</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Vidéos</SelectItem>
                <SelectItem value="link">Liens</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sentiment</Label>
            <Select value={filters.sentiment || 'all'} onValueChange={(value) => updateFilter('sentiment', value === 'all' ? undefined : value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous sentiments</SelectItem>
                <SelectItem value="positive">Positif</SelectItem>
                <SelectItem value="negative">Négatif</SelectItem>
                <SelectItem value="neutral">Neutre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtres d'engagement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minEngagement">Engagement minimum</Label>
            <Input
              id="minEngagement"
              type="number"
              placeholder="Ex: 100"
              value={filters.minEngagement || ''}
              onChange={(e) => updateFilter('minEngagement', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxEngagement">Engagement maximum</Label>
            <Input
              id="maxEngagement"
              type="number"
              placeholder="Ex: 10000"
              value={filters.maxEngagement || ''}
              onChange={(e) => updateFilter('maxEngagement', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
        </div>

        {/* Options spéciales */}
        <div className="space-y-3">
          <Label>Options spéciales</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeInfluencers"
                checked={filters.includeInfluencers}
                onCheckedChange={(checked) => updateFilter('includeInfluencers', !!checked)}
              />
              <Label htmlFor="includeInfluencers" className="text-sm">
                Inclure les influenceurs
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeVerified"
                checked={filters.includeVerified}
                onCheckedChange={(checked) => updateFilter('includeVerified', !!checked)}
              />
              <Label htmlFor="includeVerified" className="text-sm">
                Comptes vérifiés uniquement
              </Label>
            </div>
          </div>
        </div>

        {/* Note pour l'intégration API */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Intégration API :</strong> Ces filtres seront transmis aux APIs Apify lors de l'exécution des recherches.
            Configurez les acteurs Apify dans les paramètres des plateformes pour une intégration complète.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
