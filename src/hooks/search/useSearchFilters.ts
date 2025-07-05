
import { useState } from 'react';
import { SearchFilters } from '@/services/api/types';

export const useSearchFilters = () => {
  const [advancedFilters, setAdvancedFilters] = useState<SearchFilters>({
    language: 'fr',
    period: '7d',
    sentiment: undefined,
    minEngagement: undefined,
    maxEngagement: undefined,
  });

  return {
    advancedFilters,
    setAdvancedFilters,
  };
};
