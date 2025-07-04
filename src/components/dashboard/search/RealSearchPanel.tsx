
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Search } from "lucide-react";
import { Brand24StyleResults } from "./Brand24StyleResults";
import { useRealSearch } from "@/hooks/useRealSearch";

const AVAILABLE_PLATFORMS = [
  { id: 'tiktok', name: 'TikTok', description: 'Hashtags' },
  { id: 'facebook', name: 'Facebook', description: 'Requête texte' },
  { id: 'twitter', name: 'Twitter', description: 'Requête texte' },
  { id: 'youtube', name: 'YouTube', description: 'Mots-clés' },
  { id: 'instagram', name: 'Instagram', description: 'Usernames' }
];

export const RealSearchPanel = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  
  const { mentions, isLoading, executeSearch } = useRealSearch();

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

  const handleSearch = () => {
    executeSearch(keywords, selectedPlatforms);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addKeyword();
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration de recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche en temps réel - API Backend</CardTitle>
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

          {/* Plateformes */}
          <div className="space-y-3">
            <Label>Plateformes à analyser</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {AVAILABLE_PLATFORMS.map((platform) => (
                <div key={platform.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={platform.id}
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={() => togglePlatform(platform.id)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={platform.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {platform.name}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {platform.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formats de payload API */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Formats de payload API :</h4>
            <div className="text-xs text-blue-800 space-y-1">
              <div><strong>TikTok:</strong> <code>{JSON.stringify({ hashtags: ["abidjan", "civbuzz"] })}</code></div>
              <div><strong>Facebook:</strong> <code>{JSON.stringify({ query: "abidjan élections" })}</code></div>
              <div><strong>Twitter:</strong> <code>{JSON.stringify({ query: "abidjan civbuzz" })}</code></div>
              <div><strong>YouTube:</strong> <code>{JSON.stringify({ searchKeywords: "abidjan côte d'ivoire" })}</code></div>
              <div><strong>Instagram:</strong> <code>{JSON.stringify({ usernames: ["aymeric", "kouassi_off"] })}</code></div>
            </div>
          </div>

          {/* Bouton de recherche */}
          <Button 
            onClick={handleSearch} 
            disabled={isLoading || keywords.length === 0 || selectedPlatforms.length === 0}
            className="w-full"
          >
            <Search className="w-4 h-4 mr-2" />
            {isLoading ? "Recherche en cours..." : "Lancer la recherche"}
          </Button>
        </CardContent>
      </Card>

      {/* Résultats */}
      <Brand24StyleResults mentions={mentions} isLoading={isLoading} />
    </div>
  );
};
