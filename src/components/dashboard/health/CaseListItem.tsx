
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, User, MapPin, Calendar, TrendingUp } from "lucide-react";
import { HealthPermissions } from "../utils/healthPermissions";
import { AddActionDialog } from "./AddActionDialog";

interface CaseListItemProps {
  caseItem: any;
  healthPermissions: HealthPermissions;
  onViewDetails: (caseItem: any) => void;
  onAssignCase: (caseId: string, assignee: string) => void;
}

export const CaseListItem = ({ 
  caseItem, 
  healthPermissions, 
  onViewDetails, 
  onAssignCase 
}: CaseListItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nouveau': return 'bg-blue-100 text-blue-800';
      case 'en_cours': return 'bg-orange-100 text-orange-800';
      case 'resolu': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critique': return 'bg-red-100 text-red-800';
      case 'haute': return 'bg-orange-100 text-orange-800';
      case 'normale': return 'bg-yellow-100 text-yellow-800';
      case 'faible': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {caseItem.disease} - {caseItem.location}
              </h3>
              <Badge className={getStatusColor(caseItem.status)}>
                {caseItem.status === 'nouveau' ? 'Nouveau' : 
                 caseItem.status === 'en_cours' ? 'En cours' : 'Résolu'}
              </Badge>
              <Badge className={getPriorityColor(caseItem.priority)}>
                Priorité {caseItem.priority}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>ID: {caseItem.id}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Assigné: {caseItem.assignedTo || "Non assigné"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Créé: {caseItem.createdAt}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Actions: {caseItem.actions}</span>
              </div>
            </div>

            <p className="text-sm text-gray-700">{caseItem.description}</p>

            {caseItem.alertId && (
              <div className="text-sm">
                <span className="text-gray-600">Basé sur l'alerte: </span>
                <strong className="text-blue-600">{caseItem.alertId}</strong>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2 ml-4">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(caseItem)}>
              <FileText className="w-4 h-4 mr-2" />
              Fiche détaillée
            </Button>
            {healthPermissions.canCreateCaseFiles && (
              <AddActionDialog caseId={caseItem.id} onAddAction={() => {}} />
            )}
            {healthPermissions.canAssignCases && !caseItem.assignedTo && (
              <Select onValueChange={(value) => onAssignCase(caseItem.id, value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Assigner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Kouassi">Dr. Kouassi</SelectItem>
                  <SelectItem value="Dr. Traore">Dr. Traore</SelectItem>
                  <SelectItem value="Dr. Diabaté">Dr. Diabaté</SelectItem>
                  <SelectItem value="Équipe mobile">Équipe mobile</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
