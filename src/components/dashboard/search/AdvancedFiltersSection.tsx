
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter, Save } from "lucide-react";
import { SearchFilters } from "@/services/api/types";

interface AdvancedFiltersSectionProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSaveFilters: () => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
  getActiveFiltersCount: () => number;
}

export const AdvancedFiltersSection = ({
  filters,
  onFiltersChange,
  onSaveFilters,
  onClearFilters,
  onApplyFilters,
  getActiveFiltersCount
}: AdvancedFiltersSectionProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);

  return (
    <div className="border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtres avancés complets</h3>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="default" className="bg-blue-600">
              {getActiveFiltersCount()} actifs
            </Badge>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          {showAdvancedFilters ? 'Masquer' : 'Afficher'}
        </Button>
      </div>

      {showAdvancedFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg">
          {/* Période */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">📅 Période</label>
            <select 
              value={filters.period || '7d'}
              onChange={(e) => onFiltersChange({...filters, period: e.target.value as any})}
              className="w-full p-2 border rounded-md"
            >
              <option value="1d">Dernières 24h</option>
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="3m">3 derniers mois</option>
              <option value="6m">6 derniers mois</option>
              <option value="12m">1 an</option>
            </select>
          </div>

          {/* Tri */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">🔄 Tri par</label>
            <select 
              value={filters.sortBy || 'recent'}
              onChange={(e) => onFiltersChange({...filters, sortBy: e.target.value as any})}
              className="w-full p-2 border rounded-md"
            >
              <option value="recent">Plus récent</option>
              <option value="popular">Popularité</option>
              <option value="engagement">Engagement</option>
              <option value="influence">Score d'influence</option>
            </select>
          </div>

          {/* Langue */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">🌍 Langue</label>
            <select 
              value={filters.language || 'fr'}
              onChange={(e) => onFiltersChange({...filters, language: e.target.value})}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Toutes langues</option>
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
              <option value="es">Espagnol</option>
              <option value="ar">Arabe</option>
            </select>
          </div>

          {/* Sentiment */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">😊 Sentiment</label>
            <select 
              value={filters.sentiment || ''}
              onChange={(e) => onFiltersChange({...filters, sentiment: e.target.value as any})}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Tous sentiments</option>
              <option value="positive">😊 Positif</option>
              <option value="neutral">😐 Neutre</option>
              <option value="negative">😔 Négatif</option>
            </select>
          </div>

          {/* Score d'influence */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">⭐ Score d'influence min</label>
            <input 
              type="number"
              min="1"
              max="10"
              value={filters.minInfluenceScore || ''}
              onChange={(e) => onFiltersChange({...filters, minInfluenceScore: parseInt(e.target.value) || undefined})}
              placeholder="1-10"
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Pays */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">🌍 Pays</label>
            <input 
              type="text"
              value={filters.country || ''}
              onChange={(e) => onFiltersChange({...filters, country: e.target.value})}
              placeholder="ex: France, Côte d'Ivoire"
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Auteur */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">👤 Auteur</label>
            <input 
              type="text"
              value={filters.author || ''}
              onChange={(e) => onFiltersChange({...filters, author: e.target.value})}
              placeholder="Nom d'utilisateur"
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Domaine */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">🌐 Domaine</label>
            <input 
              type="text"
              value={filters.domain || ''}
              onChange={(e) => onFiltersChange({...filters, domain: e.target.value})}
              placeholder="ex: facebook.com"
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Importance */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">🔥 Importance</label>
            <select 
              value={filters.importance || 'all'}
              onChange={(e) => onFiltersChange({...filters, importance: e.target.value as any})}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">Toute importance</option>
              <option value="high">🔥 Élevée</option>
              <option value="medium">⚡ Moyenne</option>
              <option value="low">💫 Faible</option>
            </select>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">                
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onClearFilters}>
            <X className="w-4 h-4 mr-2" />
            Effacer filtres
          </Button>
          <Button variant="outline" onClick={onSaveFilters}>
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder filtres
          </Button>
        </div>
        
        <Button 
          onClick={onApplyFilters}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-6 py-2"
        >
          <Filter className="w-4 h-4 mr-2" />
          Appliquer filtres
        </Button>
      </div>
    </div>
  );
};
