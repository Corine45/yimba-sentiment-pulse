
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Search, Filter, Eye, CheckCircle, XCircle, Edit, Plus, BarChart3 } from "lucide-react";
import { HealthRole, HealthPermissions } from "../utils/healthPermissions";
import { ComparativeTable } from "./ComparativeTable";

interface HealthAlertsProps {
  healthRole: HealthRole;
  healthPermissions: HealthPermissions;
}

export const HealthAlerts = ({ healthRole, healthPermissions }: HealthAlertsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Données simulées d'alertes détaillées
  const alerts = [
    {
      id: "HS001",
      disease: "COVID-19",
      location: "Abidjan, Cocody",
      severity: "modéré",
      status: "en_cours",
      timestamp: "2024-01-15 14:30",
      source: "Twitter",
      description: "Plusieurs mentions de symptômes respiratoires dans le quartier de Riviera",
      verified: true,
      assignedTo: "Dr. Kouassi",
      rawText: "Beaucoup de cas de toux et fièvre dans notre quartier. Les pharmacies manquent de médicaments #COVID #Abidjan"
    },
    {
      id: "HS002",
      disease: "Paludisme", 
      location: "Bouaké",
      severity: "critique",
      status: "nouveau",
      timestamp: "2024-01-15 13:45",
      source: "Facebook",
      description: "Signalement d'une augmentation des cas de paludisme dans plusieurs quartiers",
      verified: false,
      assignedTo: null,
      rawText: "Le dispensaire de Bouaké est saturé, trop de cas de palu cette semaine"
    },
    {
      id: "HS003",
      disease: "Dengue",
      location: "San Pedro",
      severity: "faible",
      status: "resolu",
      timestamp: "2024-01-15 10:20",
      source: "WhatsApp",
      description: "Cas isolés de dengue signalés, situation sous contrôle",
      verified: true,
      assignedTo: "Dr. Traore",
      rawText: "Quelques cas de dengue dans le port mais rien d'alarmant selon les autorités"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critique': return 'bg-red-100 text-red-800 border-red-200';
      case 'modéré': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'faible': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nouveau': return 'bg-blue-100 text-blue-800';
      case 'en_cours': return 'bg-orange-100 text-orange-800';
      case 'resolu': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'nouveau': return 'Nouveau';
      case 'en_cours': return 'En cours';
      case 'resolu': return 'Résolu';
      default: return status;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    
    // Filtrer selon le rôle - les observateurs ne voient que les alertes vérifiées
    const matchesRole = healthRole !== "observateur_partenaire" || alert.verified;
    
    return matchesSearch && matchesSeverity && matchesStatus && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des alertes sanitaires</h2>
          <p className="text-gray-600">
            {healthPermissions.canEditAlerts ? "Gérez et suivez les alertes" : "Consultez les alertes en cours"}
            {healthRole === "observateur_partenaire" && " - Alertes vérifiées uniquement"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {healthPermissions.canCreateAlerts && (
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle alerte
            </Button>
          )}
          <Badge variant="outline" className="text-xs">
            {filteredAlerts.length} alertes
          </Badge>
        </div>
      </div>

      {/* Onglets pour séparer les alertes et l'analyse comparative */}
      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="alerts" className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Alertes en cours</span>
          </TabsTrigger>
          <TabsTrigger value="comparative" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analyse comparative</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filtres de recherche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recherche</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Maladie, localisation..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gravité</label>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les gravités" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les gravités</SelectItem>
                      <SelectItem value="critique">Critique</SelectItem>
                      <SelectItem value="modéré">Modéré</SelectItem>
                      <SelectItem value="faible">Faible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Statut</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="nouveau">Nouveau</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="resolu">Résolu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des alertes */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header de l'alerte */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {alert.disease} - {alert.location}
                          </h3>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {getStatusLabel(alert.status)}
                          </Badge>
                          {alert.verified && (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Vérifié
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600">{alert.description}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>ID: {alert.id}</p>
                        <p>{alert.timestamp}</p>
                      </div>
                    </div>

                    {/* Détails */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm"><strong>Source:</strong> {alert.source}</p>
                        <p className="text-sm"><strong>Assigné à:</strong> {alert.assignedTo || "Non assigné"}</p>
                      </div>
                      <div>
                        <p className="text-sm"><strong>Message original:</strong></p>
                        <p className="text-sm italic text-gray-600 mt-1">"{alert.rawText}"</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Détails
                        </Button>
                        {healthPermissions.canEditAlerts && (
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </Button>
                        )}
                        {healthPermissions.canValidateAlerts && !alert.verified && (
                          <Button size="sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Valider
                          </Button>
                        )}
                        {healthPermissions.canEditAlerts && alert.status === 'en_cours' && (
                          <Button size="sm" variant="outline">
                            <XCircle className="w-4 h-4 mr-2" />
                            Marquer résolu
                          </Button>
                        )}
                      </div>
                      
                      {healthPermissions.canExportData && (
                        <Button variant="ghost" size="sm">
                          Exporter
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAlerts.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune alerte trouvée</h3>
                <p className="text-gray-600">Aucune alerte ne correspond aux critères de recherche.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comparative" className="space-y-6">
          <ComparativeTable canExport={healthPermissions.canExportData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
