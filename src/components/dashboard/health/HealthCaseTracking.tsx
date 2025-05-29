
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, User, MapPin, Calendar, Search, Filter, BarChart3, TrendingUp } from "lucide-react";
import { HealthRole, HealthPermissions } from "../utils/healthPermissions";
import { CreateCaseDialog } from "./CreateCaseDialog";
import { CaseDetailsDialog } from "./CaseDetailsDialog";
import { AddActionDialog } from "./AddActionDialog";
import { CaseMetrics } from "./CaseMetrics";

interface HealthCaseTrackingProps {
  healthRole: HealthRole;
  healthPermissions: HealthPermissions;
}

export const HealthCaseTracking = ({ healthRole, healthPermissions }: HealthCaseTrackingProps) => {
  // État des cas suivis
  const [cases, setCases] = useState([
    {
      id: "CASE001",
      alertId: "HS001",
      disease: "COVID-19",
      location: "Abidjan, Cocody",
      status: "en_cours",
      assignedTo: "Dr. Kouassi",
      createdAt: "2024-01-15",
      priority: "haute",
      actions: 3,
      description: "Signalement de plusieurs cas de symptômes respiratoires dans le quartier de Riviera. Investigation en cours."
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
      actions: 0,
      description: "Augmentation significative des cas de paludisme dans plusieurs quartiers de Bouaké."
    },
    {
      id: "CASE003",
      alertId: "",
      disease: "Rougeole",
      location: "Korhogo",
      status: "resolu",
      assignedTo: "Dr. Diabaté",
      createdAt: "2024-01-10",
      priority: "normale",
      actions: 8,
      description: "Épidémie de rougeole dans une école primaire. Campagne de vaccination réalisée."
    }
  ]);

  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  // Dialogues
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Filtrage des cas
  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || caseItem.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || caseItem.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === "all" || 
                           (assigneeFilter === "unassigned" && !caseItem.assignedTo) ||
                           caseItem.assignedTo === assigneeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

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

  const handleCreateCase = (newCase: any) => {
    setCases(prev => [newCase, ...prev]);
  };

  const handleUpdateCase = (updatedCase: any) => {
    setCases(prev => prev.map(caseItem => 
      caseItem.id === updatedCase.id ? updatedCase : caseItem
    ));
  };

  const handleViewDetails = (caseItem: any) => {
    setSelectedCase(caseItem);
    setDetailsOpen(true);
  };

  const handleAssignCase = (caseId: string, assignee: string) => {
    setCases(prev => prev.map(caseItem => 
      caseItem.id === caseId 
        ? { ...caseItem, assignedTo: assignee === "unassigned" ? null : assignee, status: assignee !== "unassigned" ? "en_cours" : caseItem.status }
        : caseItem
    ));
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{cases.filter(c => c.status !== 'resolu').length}</div>
                <div className="text-sm text-blue-800">Cas actifs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{cases.filter(c => c.status === 'en_cours').length}</div>
                <div className="text-sm text-orange-800">En intervention</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{cases.filter(c => c.status === 'resolu').length}</div>
                <div className="text-sm text-green-800">Résolus</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{cases.filter(c => c.priority === 'critique').length}</div>
                <div className="text-sm text-red-800">Priorité critique</div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher par maladie, lieu, ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="nouveau">Nouveau</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="resolu">Résolu</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes priorités</SelectItem>
                    <SelectItem value="faible">Faible</SelectItem>
                    <SelectItem value="normale">Normale</SelectItem>
                    <SelectItem value="haute">Haute</SelectItem>
                    <SelectItem value="critique">Critique</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assigné à" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="unassigned">Non assigné</SelectItem>
                    <SelectItem value="Dr. Kouassi">Dr. Kouassi</SelectItem>
                    <SelectItem value="Dr. Traore">Dr. Traore</SelectItem>
                    <SelectItem value="Dr. Diabaté">Dr. Diabaté</SelectItem>
                    <SelectItem value="Équipe mobile">Équipe mobile</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Liste des cas */}
          <div className="space-y-4">
            {filteredCases.map((caseItem) => (
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
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(caseItem)}>
                        <FileText className="w-4 h-4 mr-2" />
                        Fiche détaillée
                      </Button>
                      {healthPermissions.canCreateCaseFiles && (
                        <AddActionDialog caseId={caseItem.id} onAddAction={() => {}} />
                      )}
                      {healthPermissions.canAssignCases && !caseItem.assignedTo && (
                        <Select onValueChange={(value) => handleAssignCase(caseItem.id, value)}>
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
            ))}
          </div>

          {/* Message si aucun cas */}
          {filteredCases.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || assigneeFilter !== "all"
                    ? "Aucun cas trouvé"
                    : "Aucun cas en cours"
                  }
                </h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || assigneeFilter !== "all"
                    ? "Essayez de modifier vos filtres de recherche."
                    : "Aucun cas n'est actuellement suivi dans le système."
                  }
                </p>
                {healthPermissions.canCreateCaseFiles && !searchTerm && statusFilter === "all" && (
                  <CreateCaseDialog onCreateCase={handleCreateCase} />
                )}
              </CardContent>
            </Card>
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
