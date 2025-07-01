
import { useSearchState } from './search/useSearchState';
import { useSearchFilters } from './search/useSearchFilters';
import { useSearchExecution } from './search/useSearchExecution';
import { useSearchSaving } from './search/useSearchSaving';

export const useSearchPanel = () => {
  const {
    keywords,
    setKeywords,
    selectedPlatforms,
    setSelectedPlatforms,
    language,
    setLanguage,
    period,
    setPeriod,
    isSearching,
    setIsSearching,
    currentSearchTerm,
    setCurrentSearchTerm,
    apifyToken,
    setApifyToken,
  } = useSearchState();

  const { advancedFilters, setAdvancedFilters } = useSearchFilters();
  const { executeSearch } = useSearchExecution();
  const {
    saveDialogOpen,
    setSaveDialogOpen,
    searchName,
    setSearchName,
    handleSaveSearch,
    handleExecuteSavedSearch,
  } = useSearchSaving();

  const handleSearch = () => {
    executeSearch(
      keywords,
      selectedPlatforms,
      apifyToken,
      setIsSearching,
      setCurrentSearchTerm
    );
  };

  const handleSave = () => {
    handleSaveSearch(
      keywords,
      selectedPlatforms,
      language,
      period,
      advancedFilters
    );
  };

  return {
    // State
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
    
    // State setters
    setKeywords,
    setSelectedPlatforms,
    setLanguage,
    setPeriod,
    setSaveDialogOpen,
    setSearchName,
    setApifyToken,
    setAdvancedFilters,
    
    // Handlers
    handleSearch,
    handleSaveSearch: handleSave,
    handleExecuteSavedSearch,
  };
};
