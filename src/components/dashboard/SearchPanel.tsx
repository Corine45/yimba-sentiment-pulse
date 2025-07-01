
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { SearchResults } from "./search/SearchResults";
import { SearchTabs } from "./search/SearchTabs";
import { SearchActions } from "./search/SearchActions";
import { SaveSearchDialog } from "./search/SaveSearchDialog";
import { ApiIntegrationNote } from "./search/ApiIntegrationNote";
import { useSavedSearches } from "@/hooks/useSavedSearches";
import { useSearchResults } from "@/hooks/useSearchResults";
import { useToast } from "@/hooks/use-toast";

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
  
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    language: 'fr',
    period: '7d',
    platforms: ['Instagram', 'Twitter', 'Facebook'],
    contentType: 'all',
    includeInfluencers: false,
    includeVerified: false,
  });

  const { createSavedSearch } = useSavedSearches();
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      for (const platform of selectedPlatforms) {
        await createSearchResult({
          search_id: null,
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

    const result = await createSavedSearch({
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
    toast({
      title: "Recherche lancée",
      description: "La recherche sauvegardée a été exécutée.",
    });
  };

  return (
    <div className="space-y-6">
      <SearchTabs
        keywords={keywords}
        onKeywordsChange={setKeywords}
        selectedPlatforms={selectedPlatforms}
        onPlatformChange={setSelectedPlatforms}
        language={language}
        onLanguageChange={setLanguage}
        period={period}
        onPeriodChange={setPeriod}
        advancedFilters={advancedFilters}
        onAdvancedFiltersChange={setAdvancedFilters}
        onExecuteSavedSearch={handleExecuteSavedSearch}
        userRole={userRole}
        searchLevel={permissions.searchLevel}
      >
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
            <SearchActions
              onSearch={handleSearch}
              onSaveSearch={() => setSaveDialogOpen(true)}
              isSearching={isSearching}
              canSave={true}
              canExport={permissions.canExportData}
              hasKeywords={keywords.length > 0}
              userRole={userRole}
            />
            <ApiIntegrationNote />
          </CardContent>
        </Card>
      </SearchTabs>

      <SaveSearchDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        searchName={searchName}
        onSearchNameChange={setSearchName}
        onSave={handleSaveSearch}
        keywords={keywords}
        selectedPlatforms={selectedPlatforms}
      />

      <SearchResults 
        userRole={userRole} 
        permissions={permissions}
        isSearching={isSearching}
        searchTerm={currentSearchTerm}
      />
    </div>
  );
};
