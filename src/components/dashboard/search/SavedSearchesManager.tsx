
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Trash2, Settings } from "lucide-react";
import { useSavedSearches } from "@/hooks/useSavedSearches";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SavedSearchesManagerProps {
  onExecuteSearch: (searchId: string) => void;
}

export const SavedSearchesManager = ({ onExecuteSearch }: SavedSearchesManagerProps) => {
  const { savedSearches, loading, executeSearch, deleteSearch } = useSavedSearches();
  const { toast } = useToast();
  const [executingId, setExecutingId] = useState<string | null>(null);

  const handleExecuteSearch = async (searchId: string) => {
    setExecutingId(searchId);
    const result = await executeSearch(searchId);
    
    if (result.success) {
      toast({
        title: "Recherche lancée",
        description: "La recherche a été mise en file d'attente.",
      });
      onExecuteSearch(searchId);
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'exécuter la recherche.",
        variant: "destructive",
      });
    }
    setExecutingId(null);
  };

  const handleDeleteSearch = async (searchId: string) => {
    const result = await deleteSearch(searchId);
    
    if (result.success) {
      toast({
        title: "Recherche supprimée",
        description: "La recherche sauvegardée a été supprimée.",
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
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Recherches sauvegardées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Recherches sauvegardées ({savedSearches.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {savedSearches.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucune recherche sauvegardée. Créez votre première recherche !
            </p>
          ) : (
            savedSearches.map((search) => (
              <div key={search.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{search.name}</div>
                  <div className="text-sm text-gray-600 mb-2">
                    Mots-clés: {search.keywords.join(", ")}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {search.platforms.map((platform) => (
                      <Badge key={platform} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {search.last_executed_at ? (
                      `Dernière exécution: ${new Date(search.last_executed_at).toLocaleDateString('fr-FR')}`
                    ) : (
                      'Jamais exécutée'
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleExecuteSearch(search.id)}
                    disabled={executingId === search.id}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    {executingId === search.id ? 'Exécution...' : 'Exécuter'}
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer la recherche</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer "{search.name}" ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteSearch(search.id)}>
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
