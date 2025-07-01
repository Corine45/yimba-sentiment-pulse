import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Trash2, Save, Clock } from "lucide-react";
import { useSavedSearches } from "@/hooks/useSavedSearches";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface SavedSearchesManagerProps {
  onExecuteSearch: (searchId: string) => void;
}

export const SavedSearchesManager = ({ onExecuteSearch }: SavedSearchesManagerProps) => {
  const { savedSearches, loading, executeSavedSearch, deleteSavedSearch } = useSavedSearches();
  const { toast } = useToast();
  const [executingId, setExecutingId] = useState<string | null>(null);

  const handleExecute = async (searchId: string) => {
    setExecutingId(searchId);
    try {
      const result = await executeSavedSearch(searchId);
      if (result.success) {
        onExecuteSearch(searchId);
        toast({
          title: "Recherche exécutée",
          description: "La recherche sauvegardée a été lancée avec succès.",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'exécuter la recherche.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'exécution.",
        variant: "destructive",
      });
    } finally {
      setExecutingId(null);
    }
  };

  const handleDelete = async (searchId: string, searchName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${searchName}" ?`)) {
      return;
    }

    const result = await deleteSavedSearch(searchId);
    if (result.success) {
      toast({
        title: "Recherche supprimée",
        description: `"${searchName}" a été supprimée avec succès.`,
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la recherche.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Save className="w-5 h-5 text-blue-600" />
            <span>Recherches sauvegardées</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Chargement des recherches...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Save className="w-5 h-5 text-blue-600" />
          <span>Recherches sauvegardées</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {savedSearches.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Aucune recherche sauvegardée. Créez votre première recherche dans l'onglet "Recherche simple".
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedSearches.map((search) => (
              <div key={search.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{search.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{search.language.toUpperCase()}</Badge>
                      <Badge variant="outline">{search.period}</Badge>
                      {search.last_executed_at && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          Dernière exécution: {new Date(search.last_executed_at).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleExecute(search.id)}
                      disabled={executingId === search.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      {executingId === search.id ? "Exécution..." : "Exécuter"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(search.id, search.name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Mots-clés:</strong> {search.keywords.join(', ')}</p>
                  <p><strong>Plateformes:</strong> {search.platforms.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
