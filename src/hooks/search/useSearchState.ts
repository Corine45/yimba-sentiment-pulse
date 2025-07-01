
import { useState } from 'react';

export interface AdvancedFilters {
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

export const useSearchState = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram', 'Twitter', 'Facebook']);
  const [language, setLanguage] = useState('fr');
  const [period, setPeriod] = useState('7d');
  const [isSearching, setIsSearching] = useState(false);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [apifyToken, setApifyToken] = useState('');

  return {
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
  };
};
