
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimpleSearchForm } from "./SimpleSearchForm";
import { AdvancedSearchForm } from "./AdvancedSearchForm";
import { Brand24Results } from "./Brand24Results";
import { SavedSearches } from "./SavedSearches";
import { useRecherche2 } from "@/hooks/useRecherche2";

interface Recherche2PanelProps {
  userRole: string;
  permissions: {
    canSearch: boolean;
    canExportData: boolean;
    searchLevel: string;
  };
}

export const Recherche2Panel = ({ userRole, permissions }: Recherche2PanelProps) => {
  const [activeTab, setActiveTab] = useState("simple");
  
  const {
    searchResults,
    isSearching,
    searchTerm,
    savedSearches,
    executeSimpleSearch,
    executeAdvancedSearch,
    saveCurrentSearch,
    deleteSavedSearch,
    loadSavedSearch
  } = useRecherche2();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🔍</span>
            <span>Recherche API Backend</span>
            <div className="ml-auto text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
              API: https://yimbapulseapi.a-car.ci
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="simple">Recherche Simple</TabsTrigger>
              <TabsTrigger value="advanced">Recherche Avancée</TabsTrigger>
              <TabsTrigger value="results">Résultats ({searchResults.length})</TabsTrigger>
              <TabsTrigger value="saved">Sauvegardées ({savedSearches.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="simple" className="mt-6">
              <SimpleSearchForm 
                onSearch={executeSimpleSearch}
                isSearching={isSearching}
                permissions={permissions}
              />
            </TabsContent>

            <TabsContent value="advanced" className="mt-6">
              <AdvancedSearchForm 
                onSearch={executeAdvancedSearch}
                isSearching={isSearching}
                permissions={permissions}
              />
            </TabsContent>

            <TabsContent value="results" className="mt-6">
              <Brand24Results 
                results={searchResults}
                isLoading={isSearching}
                searchTerm={searchTerm}
                onSaveSearch={saveCurrentSearch}
                canExport={permissions.canExportData}
              />
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              <SavedSearches 
                searches={savedSearches}
                onLoad={loadSavedSearch}
                onDelete={deleteSavedSearch}
                userRole={userRole}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
