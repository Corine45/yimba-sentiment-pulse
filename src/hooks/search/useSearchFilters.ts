
import { useState } from 'react';
import { AdvancedFilters } from './useSearchState';

export const useSearchFilters = () => {
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    language: 'fr',
    period: '7d',
    platforms: ['Instagram', 'Twitter', 'Facebook'],
    contentType: 'all',
    includeInfluencers: false,
    includeVerified: false,
  });

  return {
    advancedFilters,
    setAdvancedFilters,
  };
};
