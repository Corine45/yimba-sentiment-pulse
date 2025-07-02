
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { SearchActions } from "./SearchActions";
import { ApiIntegrationNote } from "./ApiIntegrationNote";
import { ApifyTokenConfig } from "./ApifyTokenConfig";

interface SearchPanelConfigProps {
  onSearch: () => void;
  onSaveSearch: () => void;
  isSearching: boolean;
  hasKeywords: boolean;
  userRole: string;
  permissions: {
    canExportData: boolean;
  };
  apifyToken: string;
  onApifyTokenChange: (token: string) => void;
}

export const SearchPanelConfig = ({
  onSearch,
  onSaveSearch,
  isSearching,
  hasKeywords,
  userRole,
  permissions,
  apifyToken,
  onApifyTokenChange,
}: SearchPanelConfigProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-blue-600" />
              <span>Configuration de recherche</span>
            </CardTitle>
            {userRole === "observateur" && (
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Mode consultation
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <ApifyTokenConfig
            apifyToken={apifyToken}
            onTokenChange={onApifyTokenChange}
            userRole={userRole}
          />

          <SearchActions
            onSearch={onSearch}
            onSaveSearch={onSaveSearch}
            isSearching={isSearching}
            canSave={true}
            canExport={permissions.canExportData}
            hasKeywords={hasKeywords}
            userRole={userRole}
          />
          
          {userRole !== "observateur" && <ApiIntegrationNote />}
        </CardContent>
      </Card>
    </div>
  );
};
