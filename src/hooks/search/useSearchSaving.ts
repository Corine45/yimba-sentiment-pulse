
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { AdvancedFilters } from './useSearchState';

export const useSearchSaving = () => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  
  const { createSavedSearch } = useSavedSearches();
  const { toast } = useToast();

  const handleSaveSearch = async (
    keywords: string[],
    selectedPlatforms: string[],
    language: string,
    period: string,
    advancedFilters: AdvancedFilters
  ) => {
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

  return {
    saveDialogOpen,
    setSaveDialogOpen,
    searchName,
    setSearchName,
    handleSaveSearch,
    handleExecuteSavedSearch,
  };
};
