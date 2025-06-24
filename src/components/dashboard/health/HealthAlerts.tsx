import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, BarChart3, TrendingUp } from "lucide-react";
import { HealthRole, HealthPermissions } from "../utils/healthPermissions";
import { ComparativeTable } from "./ComparativeTable";
import { AlertsHeader } from "./AlertsHeader";
import { AlertsFilters } from "./AlertsFilters";
import { AlertsList } from "./AlertsList";
import { CreateAlertDialog } from "./CreateAlertDialog";
import { AlertDetailsDialog } from "./AlertDetailsDialog";
import { AlertsMetrics } from "./AlertsMetrics";

interface Alert {
  id: string;
  disease: string;
  location: string;
  severity: string;
  status: string;
  timestamp: string;
  source: string;
  description: string;
  verified: boolean;
  assignedTo: string | null;
  rawText: string;
  reporterName?: string;
  reporterContact?: string;
  createdAt?: string;
}

interface HealthAlertsProps {
  healthRole: HealthRole;
  healthPermissions: HealthPermissions;
}

export const HealthAlerts = ({ healthRole, healthPermissions }: HealthAlertsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // État des alertes - simulé avec possibilité d'ajout/modification
  const [alerts, setAlerts] = useState<Alert[]>([
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
      rawText: "Beaucoup de cas de toux et fièvre dans notre quartier. Les pharmacies manquent de médicaments #COVID #Abidjan",
      reporterName: "Jean Kouame",
      reporterContact: "+225 07 12 34 56",
      createdAt: "2024-01-15T14:30:00Z"
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
      rawText: "Le dispensaire de Bouaké est saturé, trop de cas de palu cette semaine",
      reporterName: "Marie Diabaté",
      reporterContact: "marie.diabate@email.com",
      createdAt: "2024-01-15T13:45:00Z"
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
      rawText: "Quelques cas de dengue dans le port mais rien d'alarmant selon les autorités",
      reporterName: "Infirmière Chef",
      reporterContact: "+225 05 98 76 54",
      createdAt: "2024-01-15T10:20:00Z"
    },
    {
      id: "HS004",
      disease: "Rougeole",
      location: "Korhogo",
      severity: "modéré",
      status: "en_cours",
      timestamp: "2024-01-14 16:15",
      source: "Centre de santé",
      description: "Plusieurs enfants présentent des symptômes de rougeole dans l'école primaire",
      verified: true,
      assignedTo: "Dr. Diabaté",
      rawText: "Éruption cutanée et fièvre chez 8 enfants de l'école primaire de Korhogo centre",
      reporterName: "Dr. Soro",
      reporterContact: "dr.soro@santekorhogo.ci",
      createdAt: "2024-01-14T16:15:00Z"
    }
  ]);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    
    // Filtrer selon le rôle - les observateurs ne voient que les alertes vérifiées
    const matchesRole = healthRole !== "observateur_partenaire" || alert.verified;
    
    return matchesSearch && matchesSeverity && matchesStatus && matchesRole;
  });

  const handleCreateAlert = (newAlert: Alert) => {
    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleUpdateAlert = (updatedAlert: Alert) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === updatedAlert.id ? updatedAlert : alert
    ));
  };

  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <AlertsHeader
        healthRole={healthRole}
        healthPermissions={healthPermissions}
        alertsCount={filteredAlerts.length}
        CreateAlertComponent={() => (
          healthPermissions.canCreateAlerts ? (
            <CreateAlertDialog onCreateAlert={handleCreateAlert} />
          ) : null
        )}
      />

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts" className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Alertes en cours</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Métriques</span>
          </TabsTrigger>
          <TabsTrigger value="comparative" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analyse comparative</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          <AlertsFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            severityFilter={severityFilter}
            setSeverityFilter={setSeverityFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <AlertsList 
            alerts={filteredAlerts} 
            healthPermissions={healthPermissions}
            onViewDetails={handleViewDetails}
            onUpdateAlert={handleUpdateAlert}
          />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <AlertsMetrics alerts={alerts} />
        </TabsContent>

        <TabsContent value="comparative" className="space-y-6">
          <ComparativeTable canExport={healthPermissions.canExportData} />
        </TabsContent>
      </Tabs>

      {/* Dialog pour les détails de l'alerte */}
      <AlertDetailsDialog
        alert={selectedAlert}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        healthPermissions={healthPermissions}
        onUpdateAlert={handleUpdateAlert}
      />
    </div>
  );
};
