
import { SearchResults } from "./search/SearchResults";
import { SearchTabs } from "./search/SearchTabs";
import { SaveSearchDialog } from "./search/SaveSearchDialog";
import { SearchPanelConfig } from "./search/SearchPanelConfig";
import { useSearchPanel } from "@/hooks/useSearchPanel";

interface SearchPanelProps {
  userRole: string;
  permissions: {
    canSearch: boolean;
    canExportData: boolean;
    searchLevel: string;
  };
}

export const SearchPanel = ({ userRole, permissions }: SearchPanelProps) => {
  const {
    keywords,
    selectedPlatforms,
    language,
    period,
    isSearching,
    currentSearchTerm,
    saveDialogOpen,
    searchName,
    apifyToken,
    advancedFilters,
    setKeywords,
    setSelectedPlatforms,
    setLanguage,
    setPeriod,
    setSaveDialogOpen,
    setSearchName,
    setApifyToken,
    setAdvancedFilters,
    handleSearch,
    handleSaveSearch,
    handleExecuteSavedSearch,
  } = useSearchPanel();

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
        <SearchPanelConfig
          onSearch={handleSearch}
          onSaveSearch={() => setSaveDialogOpen(true)}
          isSearching={isSearching}
          hasKeywords={keywords.length > 0}
          userRole={userRole}
          permissions={permissions}
          apifyToken={apifyToken}
          onApifyTokenChange={setApifyToken}
        />
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
