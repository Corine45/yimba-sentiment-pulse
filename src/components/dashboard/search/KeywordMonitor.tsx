
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface KeywordMonitorItem {
  id: string;
  keyword: string;
  platforms: string[];
  isActive: boolean;
  createdAt: string;
  lastChecked?: string;
  mentionsCount?: number;
}

interface KeywordMonitorProps {
  onKeywordSelect?: (keywords: string[], platforms: string[]) => void;
}

export const KeywordMonitor = ({ onKeywordSelect }: KeywordMonitorProps) => {
  const [monitoredKeywords, setMonitoredKeywords] = useState<KeywordMonitorItem[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const { toast } = useToast();

  const platforms = [
    { id: 'tiktok', name: 'TikTok', color: 'bg-black' },
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram', color: 'bg-pink-500' },
    { id: 'twitter', name: 'Twitter/X', color: 'bg-black' },
    { id: 'youtube', name: 'YouTube', color: 'bg-red-600' },
    { id: 'google', name: 'Google', color: 'bg-green-600' },
    { id: 'web', name: 'Web', color: 'bg-purple-600' }
  ];

  useEffect(() => {
    loadMonitoredKeywords();
  }, []);

  const loadMonitoredKeywords = () => {
    const saved = localStorage.getItem('monitored_keywords');
    if (saved) {
      setMonitoredKeywords(JSON.parse(saved));
    }
  };

  const saveMonitoredKeywords = (keywords: KeywordMonitorItem[]) => {
    localStorage.setItem('monitored_keywords', JSON.stringify(keywords));
    setMonitoredKeywords(keywords);
  };

  const addKeyword = () => {
    if (!newKeyword.trim() || selectedPlatforms.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un mot-clé et sélectionner au moins une plateforme",
        variant: "destructive"
      });
      return;
    }

    const newMonitorItem: KeywordMonitorItem = {
      id: Date.now().toString(),
      keyword: newKeyword.trim(),
      platforms: [...selectedPlatforms],
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const updated = [...monitoredKeywords, newMonitorItem];
    saveMonitoredKeywords(updated);
    
    setNewKeyword('');
    setSelectedPlatforms([]);
    
    toast({
      title: "Mot-clé ajouté",
      description: `"${newKeyword}" sera surveillé sur ${selectedPlatforms.length} plateforme(s)`
    });
  };

  const removeKeyword = (id: string) => {
    const updated = monitoredKeywords.filter(item => item.id !== id);
    saveMonitoredKeywords(updated);
    
    toast({
      title: "Mot-clé supprimé",
      description: "Le mot-clé a été retiré de la surveillance"
    });
  };

  const toggleKeywordStatus = (id: string) => {
    const updated = monitoredKeywords.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    );
    saveMonitoredKeywords(updated);
  };

  const searchWithKeyword = (item: KeywordMonitorItem) => {
    if (onKeywordSelect) {
      onKeywordSelect([item.keyword], item.platforms);
      toast({
        title: "Recherche lancée",
        description: `Recherche de "${item.keyword}" sur ${item.platforms.length} plateforme(s)`
      });
    }
  };

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🎯 Surveillance des Mots-clés</CardTitle>
        <p className="text-sm text-gray-600">
          Surveillez vos mots-clés importants sur les plateformes sélectionnées
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ajouter un nouveau mot-clé */}
        <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="space-y-2">
            <Label>Nouveau mot-clé à surveiller</Label>
            <Input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Entrez un mot-clé..."
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            />
          </div>

          <div className="space-y-2">
            <Label>Plateformes à surveiller</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {platforms.map(platform => (
                <div
                  key={platform.id}
                  onClick={() => handlePlatformSelect(platform.id)}
                  className={`
                    cursor-pointer p-2 rounded-lg border transition-all text-center text-sm
                    ${selectedPlatforms.includes(platform.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  {platform.name}
                </div>
              ))}
            </div>
          </div>

          <Button onClick={addKeyword} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter à la surveillance
          </Button>
        </div>

        {/* Liste des mots-clés surveillés */}
        <div className="space-y-3">
          <h4 className="font-medium">Mots-clés surveillés ({monitoredKeywords.length})</h4>
          
          {monitoredKeywords.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Aucun mot-clé surveillé pour le moment
            </p>
          ) : (
            <div className="space-y-2">
              {monitoredKeywords.map(item => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant={item.isActive ? "default" : "secondary"}>
                        {item.keyword}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeywordStatus(item.id)}
                      >
                        {item.isActive ? 
                          <Eye className="w-3 h-3 text-green-600" /> : 
                          <EyeOff className="w-3 h-3 text-gray-400" />
                        }
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => searchWithKeyword(item)}
                      >
                        Rechercher
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeKeyword(item.id)}
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.platforms.map(platformId => {
                      const platform = platforms.find(p => p.id === platformId);
                      return platform ? (
                        <Badge key={platformId} variant="outline" className="text-xs">
                          {platform.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Créé le {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                    {item.mentionsCount && (
                      <span className="ml-2">• {item.mentionsCount} mentions trouvées</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
