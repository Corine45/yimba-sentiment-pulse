
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Plus, X } from "lucide-react";

interface AdvancedSearchFormProps {
  onSearch: (params: any) => void;
  isSearching: boolean;
  permissions: any;
}

export const AdvancedSearchForm = ({ onSearch, isSearching, permissions }: AdvancedSearchFormProps) => {
  const [keywords, setKeywords] = useState<string[]>(['']);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['TikTok', 'Facebook']);
  const [language, setLanguage] = useState('fr');
  const [period, setPeriod] = useState('7d');
  const [sentiment, setSentiment] = useState('all');

  const platforms = [
    { id: 'TikTok', name: 'TikTok', icon: '🎵' },
    { id: 'Facebook', name: 'Facebook', icon: '📘' },
    { id: 'Twitter', name: 'Twitter', icon: '🐦' },
    { id: 'YouTube', name: 'YouTube', icon: '📺' },
    { id: 'Instagram', name: 'Instagram', icon: '📸' }
  ];

  const addKeyword = () => {
    setKeywords(prev => [...prev, '']);
  };

  const removeKeyword = (index: number) => {
    setKeywords(prev => prev.filter((_, i) => i !== index));
  };

  const updateKeyword = (index: number, value: string) => {
    setKeywords(prev => prev.map((keyword, i) => i === index ? value : keyword));
  };

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    if (checked) {
      setSelectedPlatforms(prev => [...prev, platformId]);
    } else {
      setSelectedPlatforms(prev => prev.filter(p => p !== platformId));
    }
  };

  const handleSearch = () => {
    const validKeywords = keywords.filter(k => k.trim());
    if (validKeywords.length === 0 || selectedPlatforms.length === 0) return;
    
    onSearch({
      keywords: validKeywords,
      platforms: selectedPlatforms,
      language,
      period,
      sentiment,
      type: 'advanced'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recherche Avancée - API Backend</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Mots-clés à surveiller</Label>
          <div className="space-y-2 mt-2">
            {keywords.map((keyword, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="Entrez un mot-clé..."
                  value={keyword}
                  onChange={(e) => updateKeyword(index, e.target.value)}
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
        </div>

        <div>
          <Label>Plateformes à analyser</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {platforms.map((platform) => (
              <div key={platform.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`adv-${platform.id}`}
                  checked={selectedPlatforms.includes(platform.id)}
                  onCheckedChange={(checked) => handlePlatformChange(platform.id, !!checked)}
                />
                <Label htmlFor={`adv-${platform.id}`} className="flex items-center space-x-2 text-sm">
                  <span>{platform.icon}</span>
                  <span>{platform.name}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Langue</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">Anglais</SelectItem>
                <SelectItem value="es">Espagnol</SelectItem>
                <SelectItem value="all">Toutes langues</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Période</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">24 heures</SelectItem>
                <SelectItem value="7d">7 jours</SelectItem>
                <SelectItem value="30d">30 jours</SelectItem>
                <SelectItem value="3m">3 mois</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Sentiment</Label>
            <Select value={sentiment} onValueChange={setSentiment}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="positive">Positif</SelectItem>
                <SelectItem value="negative">Négatif</SelectItem>
                <SelectItem value="neutral">Neutre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-gray-600">
            API: https://yimbapulseapi.a-car.ci
          </div>
          <Button 
            onClick={handleSearch}
            disabled={keywords.filter(k => k.trim()).length === 0 || selectedPlatforms.length === 0 || isSearching}
            className="flex items-center space-x-2"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>{isSearching ? 'Recherche avancée...' : 'Lancer la recherche'}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
