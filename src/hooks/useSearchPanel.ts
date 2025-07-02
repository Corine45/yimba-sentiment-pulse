
import { useState } from 'react';
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
  } = useSearchState();

  const { advancedFilters, setAdvancedFilters } = useSearchFilters();
  const { executeSearch } = useSearchExecution();
  const { 
    saveDialogOpen, 
    setSaveDialogOpen, 
    searchName, 
    setSearchName, 
    handleSaveSearch: saveSearchFunction,
    handleExecuteSavedSearch 
  } = useSearchSaving();

  const [apifyToken, setApifyToken] = useState('apify_api_JP5bjoQMQYYZ36blKD7yfm2gDRYNng3W7h69');

  const handleSearch = async () => {
    await executeSearch(
      keywords,
      selectedPlatforms,
      apifyToken,
      setIsSearching,
      setCurrentSearchTerm,
      language, // Ajouter la langue
      period    // Ajouter la période
    );
  };

  const handleSaveSearch = async () => {
    await saveSearchFunction(
      keywords,
      selectedPlatforms,
      language,
      period,
      advancedFilters
    );
  };

  return {
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
  };
};
