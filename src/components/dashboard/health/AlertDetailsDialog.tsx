
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle, MapPin, Calendar, User, Phone, Mail, 
  CheckCircle, XCircle, Edit, MessageSquare, Clock,
  FileText, Eye
} from "lucide-react";
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

interface AlertDetailsDialogProps {
  alert: Alert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  healthPermissions: HealthPermissions;
  onUpdateAlert: (updatedAlert: Alert) => void;
}

export const AlertDetailsDialog = ({ 
  alert, 
  open, 
  onOpenChange, 
  healthPermissions,
  onUpdateAlert 
}: AlertDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Alert | null>(null);
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  if (!alert) return null;

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

  const handleEdit = () => {
    setEditData({...alert});
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editData) {
      onUpdateAlert(editData);
      setIsEditing(false);
      toast({
        title: "Alerte mise à jour",
        description: `L'alerte ${alert.id} a été modifiée avec succès`,
      });
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

  const handleStatusChange = (newStatus: string) => {
    const updatedAlert = {...alert, status: newStatus};
    onUpdateAlert(updatedAlert);
    toast({
      title: "Statut mis à jour",
      description: `L'alerte ${alert.id} est maintenant "${newStatus}"`,
    });
  };

  const handleAssign = (assignee: string) => {
    const updatedAlert = {...alert, assignedTo: assignee === "unassigned" ? null : assignee};
    onUpdateAlert(updatedAlert);
    toast({
      title: "Alerte assignée",
      description: assignee === "unassigned" ? `L'alerte ${alert.id} n'est plus assignée` : `L'alerte ${alert.id} a été assignée à ${assignee}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Détails de l'alerte {alert.id}
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getSeverityColor(alert.severity)}>
                {alert.severity}
              </Badge>
              <Badge className={getStatusColor(alert.status)}>
                {alert.status}
              </Badge>
              {alert.verified && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Vérifié
                </Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Maladie/Condition</Label>
                {isEditing ? (
                  <Input
                    value={editData?.disease || ""}
                    onChange={(e) => setEditData(prev => prev ? {...prev, disease: e.target.value} : null)}
                  />
                ) : (
                  <p className="text-lg font-semibold">{alert.disease}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <Label className="text-sm font-medium text-gray-600">Localisation</Label>
                  {isEditing ? (
                    <Input
                      value={editData?.location || ""}
                      onChange={(e) => setEditData(prev => prev ? {...prev, location: e.target.value} : null)}
                    />
                  ) : (
                    <p>{alert.location}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <Label className="text-sm font-medium text-gray-600">Date de signalement</Label>
                  <p>{alert.timestamp}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Source</Label>
                <p>{alert.source}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Assigné à</Label>
                {healthPermissions.canAssignCases ? (
                  <Select value={alert.assignedTo || "unassigned"} onValueChange={handleAssign}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un assigné" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Non assigné</SelectItem>
                      <SelectItem value="Dr. Kouassi">Dr. Kouassi</SelectItem>
                      <SelectItem value="Dr. Traore">Dr. Traore</SelectItem>
                      <SelectItem value="Dr. Diabaté">Dr. Diabaté</SelectItem>
                      <SelectItem value="Équipe mobile">Équipe mobile</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p>{alert.assignedTo || "Non assigné"}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Statut</Label>
                {healthPermissions.canEditAlerts ? (
                  <Select value={alert.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nouveau">Nouveau</SelectItem>
                      <SelectItem value="en_cours">En cours</SelectItem>
                      <SelectItem value="resolu">Résolu</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={getStatusColor(alert.status)}>
                    {alert.status}
                  </Badge>
                )}
              </div>

              {alert.reporterName && (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Rapporteur</Label>
                    <p>{alert.reporterName}</p>
                    {alert.reporterContact && (
                      <p className="text-sm text-gray-500">{alert.reporterContact}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <Label className="text-sm font-medium text-gray-600">Description</Label>
            {isEditing ? (
              <Textarea
                value={editData?.description || ""}
                onChange={(e) => setEditData(prev => prev ? {...prev, description: e.target.value} : null)}
                rows={3}
              />
            ) : (
              <p className="mt-2 p-3 bg-gray-50 rounded-lg">{alert.description}</p>
            )}
          </div>

          {/* Message original */}
          {alert.rawText && (
            <div>
              <Label className="text-sm font-medium text-gray-600">Message original</Label>
              <div className="mt-2 p-3 bg-blue-50 border-l-4 border-blue-200 rounded">
                <p className="italic text-gray-700">"{alert.rawText}"</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2">
              {healthPermissions.canEditAlerts && (
                <>
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Annuler
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" onClick={handleEdit}>
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                  )}
                </>
              )}

              {healthPermissions.canValidateAlerts && !alert.verified && (
                <Button onClick={handleValidate}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Valider
                </Button>
              )}

              {healthPermissions.canEditAlerts && alert.status === 'en_cours' && (
                <Button variant="outline" onClick={() => handleStatusChange('resolu')}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Marquer résolu
                </Button>
              )}
            </div>

            {healthPermissions.canExportData && (
              <Button variant="ghost">
                <FileText className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
