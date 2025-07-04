
import { RealSearchPanel } from "./RealSearchPanel";

interface SearchResultsProps {
  userRole: string;
  permissions: {
    canExportData: boolean;
  };
  isSearching: boolean;
  searchTerm?: string;
}

export const SearchResults = ({ userRole, permissions }: SearchResultsProps) => {
  return <RealSearchPanel />;
};
