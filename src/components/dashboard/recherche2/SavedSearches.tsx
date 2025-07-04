
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Trash2, Clock } from "lucide-react";

interface SavedSearchesProps {
  searches: any[];
  onLoad: (search: any) => void;
  onDelete: (searchId: string) => void;
  userRole: string;
}

export const SavedSearches = ({ searches, onLoad, onDelete, userRole }: SavedSearchesProps) => {
  if (searches.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune recherche sauvegardée</h3>
          <p className="text-gray-600">
            Lancez une recherche et sauvegardez-la pour la retrouver ici.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {searches.map((search, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{search.name}</h4>
                  <Badge variant="outline">
                    {search.platforms?.length || 0} plateformes
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Mots-clés: {search.keywords?.join(', ') || 'Aucun'}
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Créée le {new Date(search.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {search.last_executed_at && (
                    <div>
                      Dernière exécution: {new Date(search.last_executed_at).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onLoad(search)}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Exécuter
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onDelete(search.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
