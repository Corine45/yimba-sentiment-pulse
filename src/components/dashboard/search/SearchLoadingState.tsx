
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SearchLoadingStateProps {
  searchTerm: string;
}

export const SearchLoadingState = ({ searchTerm }: SearchLoadingStateProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recherche en cours...</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">
            Analyse des réseaux sociaux pour "{searchTerm}"...
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
