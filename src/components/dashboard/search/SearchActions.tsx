
import { Button } from "@/components/ui/button";
import { Play, Save, Download } from "lucide-react";

interface SearchActionsProps {
  onSearch: () => void;
  onSaveSearch: () => void;
  isSearching: boolean;
  canSave: boolean;
  canExport: boolean;
  hasKeywords: boolean;
  userRole: string;
}

export const SearchActions = ({
  onSearch,
  onSaveSearch,
  isSearching,
  canSave,
  canExport,
  hasKeywords,
  userRole
}: SearchActionsProps) => {
  return (
    <div className="flex items-center space-x-3">
      <Button 
        onClick={onSearch} 
        disabled={isSearching || !hasKeywords}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
      >
        <Play className="w-4 h-4 mr-2" />
        {isSearching ? "Recherche en cours..." : "Lancer la recherche"}
      </Button>
      
      {canSave && userRole !== "observateur" && (
        <Button variant="outline" disabled={!hasKeywords} onClick={onSaveSearch}>
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder
        </Button>
      )}
      
      {canExport && (
        <Button variant="outline" disabled>
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      )}
    </div>
  );
};
