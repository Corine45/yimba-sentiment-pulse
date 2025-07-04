
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";

interface SimpleSearchFormProps {
  onSearch: (params: any) => void;
  isSearching: boolean;
  permissions: any;
}

export const SimpleSearchForm = ({ onSearch, isSearching, permissions }: SimpleSearchFormProps) => {
  const [keyword, setKeyword] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['TikTok', 'Facebook']);

  const platforms = [
    { id: 'TikTok', name: 'TikTok', icon: '🎵' },
    { id: 'Facebook', name: 'Facebook', icon: '📘' },
    { id: 'Twitter', name: 'Twitter', icon: '🐦' },
    { id: 'YouTube', name: 'YouTube', icon: '📺' },
    { id: 'Instagram', name: 'Instagram', icon: '📸' }
  ];

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    if (checked) {
      setSelectedPlatforms(prev => [...prev, platformId]);
    } else {
      setSelectedPlatforms(prev => prev.filter(p => p !== platformId));
    }
  };

  const handleSearch = () => {
    if (!keyword.trim() || selectedPlatforms.length === 0) return;
    
    onSearch({
      keyword: keyword.trim(),
      platforms: selectedPlatforms,
      type: 'simple'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recherche Simple - API Backend</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="keyword">Mot-clé à surveiller</Label>
          <Input
            id="keyword"
            placeholder="Entrez un mot-clé (ex: woubi, marque, produit...)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <div>
          <Label>Plateformes à analyser</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {platforms.map((platform) => (
              <div key={platform.id} className="flex items-center space-x-2">
                <Checkbox
                  id={platform.id}
                  checked={selectedPlatforms.includes(platform.id)}
                  onCheckedChange={(checked) => handlePlatformChange(platform.id, !!checked)}
                />
                <Label htmlFor={platform.id} className="flex items-center space-x-2 text-sm">
                  <span>{platform.icon}</span>
                  <span>{platform.name}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-gray-600">
            API: https://yimbapulseapi.a-car.ci
          </div>
          <Button 
            onClick={handleSearch}
            disabled={!keyword.trim() || selectedPlatforms.length === 0 || isSearching}
            className="flex items-center space-x-2"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>{isSearching ? 'Recherche...' : 'Lancer la recherche'}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
