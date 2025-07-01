
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchConfiguration } from "./SearchConfiguration";
import { DynamicAdvancedFilters } from "./DynamicAdvancedFilters";
import { SavedSearchesManager } from "./SavedSearchesManager";

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

interface SearchTabsProps {
  keywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
  selectedPlatforms: string[];
  onPlatformChange: (platforms: string[]) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  period: string;
  onPeriodChange: (period: string) => void;
  advancedFilters: AdvancedFilters;
  onAdvancedFiltersChange: (filters: AdvancedFilters) => void;
  onExecuteSavedSearch: (searchId: string) => void;
  userRole: string;
  searchLevel: string;
  children: React.ReactNode;
}

export const SearchTabs = ({
  keywords,
  onKeywordsChange,
  selectedPlatforms,
  onPlatformChange,
  language,
  onLanguageChange,
  period,
  onPeriodChange,
  advancedFilters,
  onAdvancedFiltersChange,
  onExecuteSavedSearch,
  userRole,
  searchLevel,
  children
}: SearchTabsProps) => {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Recherche simple</TabsTrigger>
        <TabsTrigger value="advanced" disabled={searchLevel === "basic"}>
          Recherche avancée
        </TabsTrigger>
        <TabsTrigger value="saved">Recherches sauvegardées</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-6">
        <SearchConfiguration
          keywords={keywords}
          onKeywordsChange={onKeywordsChange}
          selectedPlatforms={selectedPlatforms}
          onPlatformChange={onPlatformChange}
          language={language}
          onLanguageChange={onLanguageChange}
          period={period}
          onPeriodChange={onPeriodChange}
        />
        {children}
      </TabsContent>

      <TabsContent value="advanced" className="space-y-6">
        <DynamicAdvancedFilters
          filters={advancedFilters}
          onFiltersChange={onAdvancedFiltersChange}
          userRole={userRole}
        />
      </TabsContent>

      <TabsContent value="saved" className="space-y-6">
        <SavedSearchesManager onExecuteSearch={onExecuteSavedSearch} />
      </TabsContent>
    </Tabs>
  );
};
