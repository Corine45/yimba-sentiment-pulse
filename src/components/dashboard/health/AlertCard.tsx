
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle, Edit, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { HealthPermissions } from "../utils/healthPermissions";

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

interface AlertCardProps {
  alert: Alert;
  healthPermissions: HealthPermissions;
  onViewDetails: (alert: Alert) => void;
  onUpdateAlert: (alert: Alert) => void;
}

export const AlertCard = ({ 
  alert, 
  healthPermissions, 
  onViewDetails,
  onUpdateAlert 
}: AlertCardProps) => {
  const { toast } = useToast();

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

  const handleValidate = () => {
    const updatedAlert = {...alert, verified: true};
    onUpdateAlert(updatedAlert);
    toast({
      title: "Alerte validée",
      description: `L'alerte ${alert.id} a été validée`,
    });
  };

  const handleResolve = () => {
    const updatedAlert = {...alert, status: 'resolu'};
    onUpdateAlert(updatedAlert);
    toast({
      title: "Alerte résolue",
      description: `L'alerte ${alert.id} a été marquée comme résolue`,
    });
  };

  const handleAssign = (assignee: string) => {
    const updatedAlert = {...alert, assignedTo: assignee};
    onUpdateAlert(updatedAlert);
    toast({
      title: "Alerte assignée",
      description: `L'alerte ${alert.id} a été assignée à ${assignee}`,
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
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
              {alert.reporterName && (
                <p className="text-sm"><strong>Rapporteur:</strong> {alert.reporterName}</p>
              )}
            </div>
            <div>
              <p className="text-sm"><strong>Message original:</strong></p>
              <p className="text-sm italic text-gray-600 mt-1 line-clamp-2">"{alert.rawText}"</p>
            </div>
          </div>

          {/* Assignation rapide */}
          {healthPermissions.canAssignCases && !alert.assignedTo && (
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <UserPlus className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Assigner à:</span>
              <Select onValueChange={handleAssign}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Kouassi">Dr. Kouassi</SelectItem>
                  <SelectItem value="Dr. Traore">Dr. Traore</SelectItem>
                  <SelectItem value="Dr. Diabaté">Dr. Diabaté</SelectItem>
                  <SelectItem value="Équipe mobile">Équipe mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => onViewDetails(alert)}>
                <Eye className="w-4 h-4 mr-2" />
                Détails
              </Button>
              
              {healthPermissions.canValidateAlerts && !alert.verified && (
                <Button size="sm" onClick={handleValidate}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Valider
                </Button>
              )}
              
              {healthPermissions.canEditAlerts && alert.status === 'en_cours' && (
                <Button size="sm" variant="outline" onClick={handleResolve}>
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
  );
};
