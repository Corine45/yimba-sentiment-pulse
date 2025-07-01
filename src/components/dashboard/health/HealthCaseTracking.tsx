
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
import { useHealthSurveillanceData } from "@/hooks/useHealthSurveillanceData";
import { useState } from "react";

interface HealthCaseTrackingProps {
  healthRole: HealthRole;
  healthPermissions: HealthPermissions;
}

export const HealthCaseTracking = ({ healthRole, healthPermissions }: HealthCaseTrackingProps) => {
  const { cases: realCases, loading } = useHealthSurveillanceData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Utiliser les vraies données au lieu des données simulées
  const cases = realCases;

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || caseItem.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || caseItem.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === "all" || 
                           (assigneeFilter === "unassigned" && !caseItem.assignedTo) ||
                           caseItem.assignedTo === assigneeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const handleCreateCase = (newCase: any) => {
    console.log('Nouveau cas créé:', newCase);
  };

  const handleUpdateCase = (updatedCase: any) => {
    console.log('Cas mis à jour:', updatedCase);
  };

  const handleViewDetails = (caseItem: any) => {
    setSelectedCase(caseItem);
    setDetailsOpen(true);
  };

  const handleAssignCase = (caseItem: any, assignee: string) => {
    console.log('Cas assigné:', caseItem.id, 'à', assignee);
  };

  const hasFilters = Boolean(searchTerm) || statusFilter !== "all" || priorityFilter !== "all" || assigneeFilter !== "all";

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
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
          <CaseStatistics cases={cases} />

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
