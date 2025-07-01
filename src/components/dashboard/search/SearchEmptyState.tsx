
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export const SearchEmptyState = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span>Résultats de recherche</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-gray-500">
            Aucune recherche effectuée. Lancez votre première recherche pour voir les résultats ici.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
