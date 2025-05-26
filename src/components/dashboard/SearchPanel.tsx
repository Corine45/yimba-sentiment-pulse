import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, X } from "lucide-react";

export const SearchPanel = () => {
  const [keywords, setKeywords] = useState([""]);
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const addKeyword = () => {
    setKeywords([...keywords, ""]);
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    // Simulation d'une recherche
    setTimeout(() => {
      setSearchResults({
        totalMentions: 1245,
        platforms: {
          twitter: 456,
          facebook: 334,
          instagram: 298,
          tiktok: 157
        },
        sentiments: {
          positive: 35,
          negative: 25,
          neutral: 40
        }
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-blue-600" />
            <span>Nouvelle Recherche</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Keywords */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Mots-clés à surveiller</Label>
            {keywords.map((keyword, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="Entrez un mot-clé..."
                  value={keyword}
                  onChange={(e) => updateKeyword(index, e.target.value)}
                  className="flex-1"
                />
                {keywords.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeKeyword(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addKeyword}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un mot-clé
            </Button>
          </div>

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

          {/* New Advanced Filters */}
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

          {/* Social Platforms */}
          <div className="space-y-3">
            <Label>Plateformes sociales</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: "twitter", label: "Twitter/X" },
                { id: "facebook", label: "Facebook" },
                { id: "instagram", label: "Instagram" },
                { id: "tiktok", label: "TikTok" }
              ].map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox id={platform.id} defaultChecked />
                  <Label htmlFor={platform.id} className="text-sm">
                    {platform.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleSearch} 
            disabled={isLoading || keywords.every(k => !k.trim())}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Recherche en cours...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Lancer la recherche
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats de recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{searchResults.totalMentions}</div>
                <div className="text-sm text-blue-800">Mentions totales</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{searchResults.sentiments.positive}%</div>
                <div className="text-sm text-green-800">Sentiment positif</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">{searchResults.sentiments.negative}%</div>
                <div className="text-sm text-red-800">Sentiment négatif</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-600">{searchResults.sentiments.neutral}%</div>
                <div className="text-sm text-gray-800">Sentiment neutre</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Répartition par plateforme</h4>
              <div className="space-y-2">
                {Object.entries(searchResults.platforms).map(([platform, count]) => (
                  <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="capitalize font-medium">{platform}</span>
                    <span className="text-blue-600 font-bold">{count as number}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
