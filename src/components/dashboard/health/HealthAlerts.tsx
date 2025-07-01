
import React, { useState } from "react";
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
import { useHealthSurveillanceData } from "@/hooks/useHealthSurveillanceData";

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

  // Utiliser les vraies données de Supabase
  const { alerts: realAlerts, loading } = useHealthSurveillanceData();

  // Convertir les données réelles au format attendu
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Mettre à jour les alertes quand les données réelles arrivent
  React.useEffect(() => {
    if (realAlerts.length > 0) {
      const formattedAlerts: Alert[] = realAlerts.map(alert => ({
        id: alert.id,
        disease: alert.disease,
        location: alert.location,
        severity: alert.severity,
        status: alert.status,
        timestamp: alert.timestamp,
        source: alert.source,
        description: alert.description,
        verified: alert.verified,
        assignedTo: alert.assignedTo,
        rawText: alert.rawText,
        reporterName: alert.reporterName,
        reporterContact: alert.reporterContact,
        createdAt: alert.createdAt
      }));
      setAlerts(formattedAlerts);
    }
  }, [realAlerts]);

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
