
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, Trash2 } from "lucide-react";

interface SearchHeaderProps {
  fromCache: boolean;
  onClearCache: () => void;
}

export const SearchHeader = ({ fromCache, onClearCache }: SearchHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <span>Recherche enrichie - API Backend Harmonisée</span>
      <div className="flex items-center space-x-2">
        {fromCache && (
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Database className="w-3 h-3" />
            <span>Cache 10min</span>
          </Badge>
        )}
        <Button variant="outline" size="sm" onClick={onClearCache}>
          <Trash2 className="w-4 h-4 mr-2" />
          Vider cache
        </Button>
      </div>
    </div>
  );
};
