
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddActionDialogProps {
  caseId: string;
  onAddAction: (action: any) => void;
}

export const AddActionDialog = ({ caseId, onAddAction }: AddActionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    performer: "",
    outcome: ""
  });
  const { toast } = useToast();

  const actionTypes = [
    "Investigation",
    "Échantillonnage",
    "Désinfection",
    "Sensibilisation",
    "Distribution médicaments",
    "Consultation médicale",
    "Suivi épidémiologique",
    "Coordination équipes",
    "Rapport autorités",
    "Autre"
  ];

  const performers = [
    "Dr. Kouassi",
    "Dr. Traore", 
    "Dr. Diabaté",
    "Équipe mobile",
    "Infirmier chef",
    "Agent communautaire",
    "Épidémiologiste"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAction = {
      id: `ACT${String(Date.now()).slice(-3)}`,
      ...formData,
      timestamp: new Date().toLocaleString('fr-FR'),
      caseId
    };

    onAddAction(newAction);
    
    toast({
      title: "Action ajoutée",
      description: `L'action "${formData.type}" a été enregistrée pour le cas ${caseId}`,
    });

    setFormData({
      type: "",
      description: "",
      performer: "",
      outcome: ""
    });
    setOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter action
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-500" />
            Ajouter une intervention - Cas {caseId}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type d'intervention *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="performer">Réalisé par *</Label>
              <Select value={formData.performer} onValueChange={(value) => handleInputChange("performer", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'intervenant" />
                </SelectTrigger>
                <SelectContent>
                  {performers.map((performer) => (
                    <SelectItem key={performer} value={performer}>{performer}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description de l'intervention *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Décrivez en détail l'intervention réalisée..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="outcome">Résultat/Observations (optionnel)</Label>
            <Textarea
              id="outcome"
              value={formData.outcome}
              onChange={(e) => handleInputChange("outcome", e.target.value)}
              placeholder="Résultats obtenus, observations importantes, recommandations..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer l'action
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
