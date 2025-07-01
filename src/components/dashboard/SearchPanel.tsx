
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Play, Download, Save, Settings } from "lucide-react";
import { SearchResults } from "./search/SearchResults";
import { DynamicKeywordManager } from "./search/DynamicKeywordManager";
import { DynamicPlatformSelector } from "./search/DynamicPlatformSelector";
import { DynamicAdvancedFilters } from "./search/DynamicAdvancedFilters";
import { SavedSearchesManager } from "./search/SavedSearchesManager";
import { useSavedSearches } from "@/hooks/useSavedSearches";
import { useSearchResults } from "@/hooks/useSearchResults";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SearchPanelProps {
  userRole: string;
  permissions: {
    canSearch: boolean;
    canExportData: boolean;
    searchLevel: string;
  };
}

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

export const SearchPanel = ({ userRole, permissions }: SearchPanelProps) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram', 'Twitter', 'Facebook']);
  const [language, setLanguage] = useState('fr');
  const [period, setPeriod] = useState('7d');
  const [isSearching, setIsSearching] = useState(false);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  
  // Advanced filters state
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    language: 'fr',
    period: '7d',
    platforms: ['Instagram', 'Twitter', 'Facebook'],
    contentType: 'all',
    includeInfluencers: false,
    includeVerified: false,
  });

  const { saveSearch } = useSavedSearches();
  const { createSearchResult, fetchSearchResults } = useSearchResults();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (keywords.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins un mot-clé.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins une plateforme.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    const searchTerm = keywords.join(', ');
    setCurrentSearchTerm(searchTerm);

    try {
      // Simuler la recherche - ici vous intégreriez les APIs Apify
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Créer des résultats simulés pour chaque plateforme
      for (const platform of selectedPlatforms) {
        await createSearchResult({
          search_term: searchTerm,
          platform: platform,
          total_mentions: Math.floor(Math.random() * 1000) + 100,
          positive_sentiment: Math.floor(Math.random() * 50) + 30,
          negative_sentiment: Math.floor(Math.random() * 30) + 10,
          neutral_sentiment: Math.floor(Math.random() * 40) + 20,
          total_reach: Math.floor(Math.random() * 100000) + 10000,
          total_engagement: Math.floor(Math.random() * 5000) + 500,
          results_data: []
        });
      }

      // Récupérer les résultats
      await fetchSearchResults(searchTerm);
      
      toast({
        title: "Recherche terminée",
        description: `Recherche effectuée pour "${searchTerm}" sur ${selectedPlatforms.length} plateformes.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue pendant la recherche.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveSearch = async () => {
    if (!searchName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez donner un nom à votre recherche.",
        variant: "destructive",
      });
      return;
    }

    const result = await saveSearch({
      name: searchName,
      keywords,
      platforms: selectedPlatforms,
      language,
      period,
      filters: advancedFilters,
      is_active: true
    });

    if (result.success) {
      toast({
        title: "Recherche sauvegardée",
        description: `"${searchName}" a été sauvegardée avec succès.`,
      });
      setSaveDialogOpen(false);
      setSearchName('');
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la recherche.",
        variant: "destructive",
      });
    }
  };

  const handleExecuteSavedSearch = (searchId: string) => {
    // Lancer la recherche depuis une recherche sauvegardée
    toast({
      title: "Recherche lancée",
      description: "La recherche sauvegardée a été exécutée.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Recherche simple</TabsTrigger>
          <TabsTrigger value="advanced" disabled={permissions.searchLevel === "basic"}>
            Recherche avancée
          </TabsTrigger>
          <TabsTrigger value="saved">Recherches sauvegardées</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-blue-600" />
                  <span>Configuration de recherche</span>
                </CardTitle>
                {userRole === "observateur" && (
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Mode consultation
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <DynamicKeywordManager
                keywords={keywords}
                onKeywordsChange={setKeywords}
              />
              
              <DynamicPlatformSelector
                selectedPlatforms={selectedPlatforms}
                onPlatformChange={setSelectedPlatforms}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
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

                <div className="space-y-2">
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
              </div>

              <div className="flex items-center space-x-3">
                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching || keywords.length === 0}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isSearching ? "Recherche en cours..." : "Lancer la recherche"}
                </Button>
                
                {userRole !== "observateur" && (
                  <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" disabled={keywords.length === 0}>
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Sauvegarder la recherche</DialogTitle>
                        <DialogDescription>
                          Donnez un nom à cette recherche pour la retrouver facilement.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="searchName">Nom de la recherche</Label>
                          <Input
                            id="searchName"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            placeholder="Ex: Veille concurrence"
                          />
                        </div>
                        <div className="text-sm text-gray-600">
                          <p><strong>Mots-clés:</strong> {keywords.join(', ')}</p>
                          <p><strong>Plateformes:</strong> {selectedPlatforms.join(', ')}</p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button onClick={handleSaveSearch}>
                          Sauvegarder
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                
                {permissions.canExportData && (
                  <Button variant="outline" disabled>
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                )}
              </div>

              {/* Note pour l'intégration API */}
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Point d'intégration API:</strong> Connectez vos acteurs Apify dans la fonction 
                  <code className="mx-1 px-1 bg-yellow-200 rounded">handleSearch()</code> 
                  pour récupérer des données réelles des réseaux sociaux.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <DynamicAdvancedFilters
            filters={advancedFilters}
            onFiltersChange={setAdvancedFilters}
            userRole={userRole}
          />
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <SavedSearchesManager onExecuteSearch={handleExecuteSavedSearch} />
        </TabsContent>
      </Tabs>

      <SearchResults 
        userRole={userRole} 
        permissions={permissions}
        isSearching={isSearching}
        searchTerm={currentSearchTerm}
      />
    </div>
  );
};
