
import { RealSearchPanel } from "./search/RealSearchPanel";

interface SearchPanelProps {
  userRole: string;
  permissions: {
    canSearch: boolean;
    canExportData: boolean;
    searchLevel: string;
  };
}

export const SearchPanel = ({ userRole, permissions }: SearchPanelProps) => {
  if (!permissions.canSearch) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Vous n'avez pas l'autorisation d'effectuer des recherches.</p>
      </div>
    );
  }

  return <RealSearchPanel />;
};
