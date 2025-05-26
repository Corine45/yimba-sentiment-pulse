
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Play, Download, Save } from "lucide-react";
import { KeywordManager } from "./search/KeywordManager";
import { SearchFilters } from "./search/SearchFilters";
import { PlatformSelector } from "./search/PlatformSelector";
import { SearchResults } from "./search/SearchResults";

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
      {/* Search Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-blue-600" />
              <span>
                {permissions.searchLevel === "advanced" ? "Recherche avancée" : "Recherche simple"}
              </span>
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
          
          {permissions.searchLevel === "advanced" && (
            <SearchFilters />
          )}
          
          {permissions.searchLevel === "basic" && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                En tant qu'observateur, vous avez accès aux recherches simples. 
                Contactez un analyste pour des recherches plus avancées.
              </p>
            </div>
          )}

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
                Sauvegarder la recherche
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

      {/* Search Results */}
      <SearchResults 
        userRole={userRole} 
        permissions={permissions}
        isSearching={isSearching} 
      />
    </div>
  );
};
