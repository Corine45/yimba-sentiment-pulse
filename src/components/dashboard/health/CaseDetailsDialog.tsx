
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
  FileText, MapPin, Calendar, User, Clock, Edit, 
  CheckCircle, XCircle, Plus, Activity, AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { HealthPermissions } from "../utils/healthPermissions";

interface CaseAction {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  performer: string;
  outcome?: string;
}

interface CaseDetailsDialogProps {
  caseData: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  healthPermissions: HealthPermissions;
  onUpdateCase: (updatedCase: any) => void;
}

export const CaseDetailsDialog = ({ 
  caseData, 
  open, 
  onOpenChange, 
  healthPermissions,
  onUpdateCase 
}: CaseDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [actions, setActions] = useState<CaseAction[]>([
    {
      id: "ACT001",
      type: "Investigation",
      description: "Visite sur le terrain pour évaluation initiale",
      timestamp: "2024-01-15 15:30",
      performer: "Dr. Kouassi",
      outcome: "Confirmation de 3 cas suspects"
    },
    {
      id: "ACT002",
      type: "Échantillonnage",
      description: "Prélèvement d'échantillons pour analyse",
      timestamp: "2024-01-15 16:45",
      performer: "Équipe mobile",
      outcome: "5 échantillons prélevés"
    }
  ]);
  const { toast } = useToast();

  if (!caseData) return null;

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

  const handleEdit = () => {
    setEditData({...caseData});
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editData) {
      onUpdateCase(editData);
      setIsEditing(false);
      toast({
        title: "Cas mis à jour",
        description: `Le cas ${caseData.id} a été modifié avec succès`,
      });
    }
  };

  const handleStatusChange = (newStatus: string) => {
    const updatedCase = {...caseData, status: newStatus};
    onUpdateCase(updatedCase);
    toast({
      title: "Statut mis à jour",
      description: `Le cas ${caseData.id} est maintenant "${newStatus}"`,
    });
  };

  const handleAddAction = () => {
    // Cette fonction serait normalement liée à un dialogue d'ajout d'action
    toast({
      title: "Fonctionnalité à venir",
      description: "L'ajout d'actions sera disponible prochainement",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Fiche détaillée - Cas {caseData.id}
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getPriorityColor(caseData.priority)}>
                Priorité {caseData.priority}
              </Badge>
              <Badge className={getStatusColor(caseData.status)}>
                {caseData.status === 'nouveau' ? 'Nouveau' : 
                 caseData.status === 'en_cours' ? 'En cours' : 'Résolu'}
              </Badge>
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
                  <p className="text-lg font-semibold">{caseData.disease}</p>
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
                    <p>{caseData.location}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <Label className="text-sm font-medium text-gray-600">Date de création</Label>
                  <p>{caseData.createdAt}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Assigné à</Label>
                <p>{caseData.assignedTo || "Non assigné"}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Statut</Label>
                {healthPermissions.canEditAlerts ? (
                  <Select value={caseData.status} onValueChange={handleStatusChange}>
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
                  <Badge className={getStatusColor(caseData.status)}>
                    {caseData.status}
                  </Badge>
                )}
              </div>

              {caseData.alertId && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Alerte source</Label>
                  <p className="font-medium text-blue-600">{caseData.alertId}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <Label className="text-sm font-medium text-gray-600">Description du cas</Label>
            {isEditing ? (
              <Textarea
                value={editData?.description || ""}
                onChange={(e) => setEditData(prev => prev ? {...prev, description: e.target.value} : null)}
                rows={3}
              />
            ) : (
              <p className="mt-2 p-3 bg-gray-50 rounded-lg">{caseData.description}</p>
            )}
          </div>

          <Separator />

          {/* Historique des actions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                Historique des interventions ({actions.length})
              </h3>
              {healthPermissions.canCreateCaseFiles && (
                <Button onClick={handleAddAction} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter action
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {actions.map((action) => (
                <div key={action.id} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {action.type}
                        </Badge>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {action.timestamp}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {action.performer}
                        </span>
                      </div>
                      <p className="text-gray-900 mb-2">{action.description}</p>
                      {action.outcome && (
                        <p className="text-sm text-green-700 bg-green-50 p-2 rounded">
                          <strong>Résultat:</strong> {action.outcome}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {actions.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>Aucune action enregistrée pour ce cas</p>
                  {healthPermissions.canCreateCaseFiles && (
                    <Button onClick={handleAddAction} className="mt-4" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter la première action
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

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

              {healthPermissions.canEditAlerts && caseData.status === 'en_cours' && (
                <Button variant="outline" onClick={() => handleStatusChange('resolu')}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marquer résolu
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
