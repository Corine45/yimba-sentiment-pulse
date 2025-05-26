
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export const SearchFilters = () => {
  return (
    <div className="space-y-6">
      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Langue</Label>
          <Select defaultValue="fr">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">Anglais</SelectItem>
              <SelectItem value="all">Toutes langues</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Pays</Label>
          <Select defaultValue="ci">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ci">Côte d'Ivoire</SelectItem>
              <SelectItem value="fr">France</SelectItem>
              <SelectItem value="all">Tous pays</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Période</Label>
          <Select defaultValue="7d">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">24 heures</SelectItem>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Analyse par genre</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous genres</SelectItem>
              <SelectItem value="male">Masculin</SelectItem>
              <SelectItem value="female">Féminin</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Type de contenu</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous contenus</SelectItem>
              <SelectItem value="text">Texte uniquement</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Vidéos</SelectItem>
              <SelectItem value="mixed">Contenu mixte</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Type Filters */}
      <div className="space-y-3">
        <Label>Filtres de contenu avancés</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { id: "visual", label: "Analyse visuelle" },
            { id: "video", label: "Analyse vidéo" },
            { id: "audio", label: "Contenu audio" },
            { id: "influencer", label: "Influenceurs" },
            { id: "viral", label: "Contenu viral" },
            { id: "trending", label: "Tendances" }
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
    </div>
  );
};
