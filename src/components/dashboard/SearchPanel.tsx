import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Play, Download, Save, Settings } from "lucide-react";
import { KeywordManager } from "./search/KeywordManager";
import { SearchFilters } from "./search/SearchFilters";
import { PlatformSelector } from "./search/PlatformSelector";
import { SearchResults } from "./search/SearchResults";
import { AdvancedFilters } from "./search/AdvancedFilters";

interface SearchPanelProps {
  userRole: string;
  permissions: {
    canSearch: boolean;
    canExportData: boolean;
    searchLevel: string;
  };
}

export const SearchPanel = ({ userRole, permissions }: SearchPanelProps) => {
  const [keywords, setKeywords] = useState([""]); 
  const [isSearching, setIsSearching] = useState(false);

  const handleAddKeyword = () => {
    setKeywords([...keywords, ""]);
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleUpdateKeyword = (index: number, value: string) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  const handleSearch = () => {
    setIsSearching(true);
    // Simuler une recherche
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
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
          {/* Search Configuration */}
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
              <KeywordManager
                keywords={keywords}
                onAddKeyword={handleAddKeyword}
                onRemoveKeyword={handleRemoveKeyword}
                onUpdateKeyword={handleUpdateKeyword}
              />
              
              <PlatformSelector />
              
              <SearchFilters />

              <div className="flex items-center space-x-3">
                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isSearching ? "Recherche en cours..." : "Lancer la recherche"}
                </Button>
                
                {userRole !== "observateur" && (
                  <Button variant="outline">
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                )}
                
                {permissions.canExportData && (
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <AdvancedFilters />
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Recherches sauvegardées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Veille éducation", keywords: ["éducation", "école"], lastRun: "Il y a 2h" },
                  { name: "Analyse concurrentielle", keywords: ["concurrent", "marché"], lastRun: "Hier" },
                  { name: "Crise PR", keywords: ["problème", "scandale"], lastRun: "Il y a 3 jours" }
                ].map((search, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{search.name}</div>
                      <div className="text-sm text-gray-600">
                        Mots-clés: {search.keywords.join(", ")}
                      </div>
                      <div className="text-xs text-gray-500">
                        Dernière exécution: {search.lastRun}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Play className="w-3 h-3 mr-1" />
                        Exécuter
                      </Button>
                      <Button size="sm" variant="ghost">
                        Modifier
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Search Results */}
      <SearchResults 
        userRole={userRole} 
        permissions={permissions}
        isSearching={isSearching} 
      />
    </div>
  );
};
