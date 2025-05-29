
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { CreateCaseDialog } from "./CreateCaseDialog";
import { HealthPermissions } from "../utils/healthPermissions";

interface CaseEmptyStateProps {
  hasFilters: boolean;
  healthPermissions: HealthPermissions;
  onCreateCase: (newCase: any) => void;
}

export const CaseEmptyState = ({ hasFilters, healthPermissions, onCreateCase }: CaseEmptyStateProps) => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {hasFilters ? "Aucun cas trouvé" : "Aucun cas en cours"}
        </h3>
        <p className="text-gray-600">
          {hasFilters
            ? "Essayez de modifier vos filtres de recherche."
            : "Aucun cas n'est actuellement suivi dans le système."
          }
        </p>
        {healthPermissions.canCreateCaseFiles && !hasFilters && (
          <CreateCaseDialog onCreateCase={onCreateCase} />
        )}
      </CardContent>
    </Card>
  );
};
