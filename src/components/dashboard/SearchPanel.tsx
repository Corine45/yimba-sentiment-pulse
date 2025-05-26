
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { KeywordManager } from "./search/KeywordManager";
import { SearchFilters } from "./search/SearchFilters";
import { PlatformSelector } from "./search/PlatformSelector";
import { SearchResults } from "./search/SearchResults";

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
          <KeywordManager
            keywords={keywords}
            onAddKeyword={addKeyword}
            onRemoveKeyword={removeKeyword}
            onUpdateKeyword={updateKeyword}
          />

          <SearchFilters />

          <PlatformSelector />

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

      <SearchResults searchResults={searchResults} />
    </div>
  );
};
