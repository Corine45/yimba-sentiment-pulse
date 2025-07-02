
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
  const { saveSearch } = useSearchSaving();

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [apifyToken, setApifyToken] = useState('apify_api_JP5bjoQMQYYZ36blKD7yfm2gDRYNng3W7h69');

  const handleSearch = async () => {
    await executeSearch(
      keywords,
      selectedPlatforms,
      apifyToken,
      setIsSearching,
      setCurrentSearchTerm
    );
  };

  const handleSaveSearch = async () => {
    const success = await saveSearch({
      name: searchName,
      keywords,
      selectedPlatforms,
      language,
      period,
      advancedFilters
    });

    if (success) {
      setSaveDialogOpen(false);
      setSearchName('');
    }
  };

  const handleExecuteSavedSearch = async (searchId: string) => {
    console.log('Exécution de la recherche sauvegardée:', searchId);
    // TODO: Implémenter l'exécution des recherches sauvegardées
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
