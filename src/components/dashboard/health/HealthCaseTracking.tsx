
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BarChart3 } from "lucide-react";
import { HealthRole, HealthPermissions } from "../utils/healthPermissions";
import { CreateCaseDialog } from "./CreateCaseDialog";
import { CaseDetailsDialog } from "./CaseDetailsDialog";
import { CaseMetrics } from "./CaseMetrics";
import { CaseStatistics } from "./CaseStatistics";
import { CaseFilters } from "./CaseFilters";
import { CaseListItem } from "./CaseListItem";
import { CaseEmptyState } from "./CaseEmptyState";
import { useCaseManagement } from "./useCaseManagement";

interface HealthCaseTrackingProps {
  healthRole: HealthRole;
  healthPermissions: HealthPermissions;
}

export const HealthCaseTracking = ({ healthRole, healthPermissions }: HealthCaseTrackingProps) => {
  const {
    cases,
    filteredCases,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    assigneeFilter,
    setAssigneeFilter,
    selectedCase,
    detailsOpen,
    setDetailsOpen,
    handleCreateCase,
    handleUpdateCase,
    handleViewDetails,
    handleAssignCase
  } = useCaseManagement();

  const hasFilters = searchTerm || statusFilter !== "all" || priorityFilter !== "all" || assigneeFilter !== "all";

  if (!healthPermissions.canTrackCases && !healthPermissions.canCreateCaseFiles) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Accès non autorisé</h3>
          <p className="text-gray-600">Vous n'avez pas les permissions pour accéder au suivi des cas.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Suivi des cas et interventions</h2>
          <p className="text-gray-600">
            {healthPermissions.canCreateCaseFiles ? "Gestion complète des fiches de cas" : "Consultation des cas assignés"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {healthPermissions.canCreateCaseFiles && (
            <CreateCaseDialog onCreateCase={handleCreateCase} />
          )}
          <Badge variant="outline" className="text-xs">
            {filteredCases.length} cas
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="cases" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cases" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Gestion des cas</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Métriques et statistiques</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="space-y-6">
          {/* Statistiques rapides */}
          <CaseStatistics cases={cases} />

          {/* Filtres */}
          <CaseFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            assigneeFilter={assigneeFilter}
            setAssigneeFilter={setAssigneeFilter}
          />

          {/* Liste des cas */}
          <div className="space-y-4">
            {filteredCases.map((caseItem) => (
              <CaseListItem
                key={caseItem.id}
                caseItem={caseItem}
                healthPermissions={healthPermissions}
                onViewDetails={handleViewDetails}
                onAssignCase={handleAssignCase}
              />
            ))}
          </div>

          {/* Message si aucun cas */}
          {filteredCases.length === 0 && (
            <CaseEmptyState
              hasFilters={hasFilters}
              healthPermissions={healthPermissions}
              onCreateCase={handleCreateCase}
            />
          )}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <CaseMetrics cases={cases} />
        </TabsContent>
      </Tabs>

      {/* Dialogue des détails */}
      <CaseDetailsDialog
        caseData={selectedCase}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        healthPermissions={healthPermissions}
        onUpdateCase={handleUpdateCase}
      />
    </div>
  );
};
