
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, User, MapPin, Calendar } from "lucide-react";
import { HealthRole, HealthPermissions } from "../utils/healthPermissions";

interface HealthCaseTrackingProps {
  healthRole: HealthRole;
  healthPermissions: HealthPermissions;
}

export const HealthCaseTracking = ({ healthRole, healthPermissions }: HealthCaseTrackingProps) => {
  // Données simulées de cas suivis
  const trackedCases = [
    {
      id: "CASE001",
      alertId: "HS001",
      disease: "COVID-19",
      location: "Abidjan, Cocody",
      status: "en_cours",
      assignedTo: "Dr. Kouassi",
      createdAt: "2024-01-15",
      priority: "haute",
      actions: 3
    },
    {
      id: "CASE002",
      alertId: "HS002",
      disease: "Paludisme",
      location: "Bouaké",
      status: "nouveau",
      assignedTo: null,
      createdAt: "2024-01-15",
      priority: "critique",
      actions: 0
    }
  ];

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
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau cas
            </Button>
          )}
          <Badge variant="outline" className="text-xs">
            {trackedCases.length} cas actifs
          </Badge>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">2</div>
            <div className="text-sm text-blue-800">Cas actifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">1</div>
            <div className="text-sm text-orange-800">En intervention</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">5</div>
            <div className="text-sm text-green-800">Résolus ce mois</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">1</div>
            <div className="text-sm text-red-800">Priorité critique</div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des cas */}
      <div className="space-y-4">
        {trackedCases.map((caseItem) => (
          <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
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
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">
                      Basé sur l'alerte: <strong>{caseItem.alertId}</strong>
                    </span>
                    <span className="text-gray-600">
                      Actions enregistrées: <strong>{caseItem.actions}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Fiche détaillée
                  </Button>
                  {healthPermissions.canCreateCaseFiles && (
                    <Button variant="outline" size="sm">
                      Ajouter action
                    </Button>
                  )}
                  {healthPermissions.canAssignCases && !caseItem.assignedTo && (
                    <Button size="sm">
                      Assigner
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message si aucun cas */}
      {trackedCases.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun cas en cours</h3>
            <p className="text-gray-600">Aucun cas n'est actuellement suivi dans le système.</p>
            {healthPermissions.canCreateCaseFiles && (
              <Button className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Créer le premier cas
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
