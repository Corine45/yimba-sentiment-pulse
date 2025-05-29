
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, BarChart3 } from "lucide-react";
import { HealthRole, HealthPermissions } from "../utils/healthPermissions";
import { ComparativeTable } from "./ComparativeTable";
import { AlertsHeader } from "./AlertsHeader";
import { AlertsFilters } from "./AlertsFilters";
import { AlertsList } from "./AlertsList";

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
      <AlertsHeader
        healthRole={healthRole}
        healthPermissions={healthPermissions}
        alertsCount={filteredAlerts.length}
      />

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
          <AlertsFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            severityFilter={severityFilter}
            setSeverityFilter={setSeverityFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <AlertsList alerts={filteredAlerts} healthPermissions={healthPermissions} />
        </TabsContent>

        <TabsContent value="comparative" className="space-y-6">
          <ComparativeTable canExport={healthPermissions.canExportData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
